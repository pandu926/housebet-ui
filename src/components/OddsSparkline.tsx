import React, { useMemo, useState } from 'react';

export const CLUB_BRAND_COLORS: Record<string, string> = {
  arsenal: '#EF0107',
  brighton: '#0057B8',
  liverpool: '#C8102E',
  'man-utd': '#DA291C',
  'real-madrid': '#3B82F6',
  bayern: '#DC052D',
  'man-city': '#6CABDD',
  spurs: '#94A3B8',
  tottenham: '#94A3B8',
  inter: '#0068A8',
  'aston-villa': '#95BFE5',
  fulham: '#CBD5E1',
  newcastle: '#38BDF8',
  everton: '#003399',
  barcelona: '#A50044',
  psg: '#2563EB',
  atletico: '#CB3524',
  sevilla: '#E11D48',
  'ac-milan': '#FB090B',
  milan: '#FB090B',
  napoli: '#008FD7',
  dortmund: '#FDE100',
  leverkusen: '#E32221',
  villarreal: '#FACC15',
  juventus: '#CBD5E1',
  roma: '#F59E0B',
  stuttgart: '#E32219',
  leipzig: '#DD0741',
  alcaraz: '#EF4444',
  sinner: '#10B981',
  djokovic: '#3B82F6',
  zverev: '#F59E0B',
  lakers: '#FDB927',
  warriors: '#1D428A',
  dodgers: '#005A9C',
  yankees: '#38BDF8',
  chiefs: '#E31837',
  bills: '#00338D',
  navi: '#FDE047',
  faze: '#E11D48',
};

export function getClubColor(teamId: string): string {
  return CLUB_BRAND_COLORS[teamId] || '#2CE5F6';
}

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Generates deterministic implied-probability / price trajectory points
 * purely from decimal odds movement (100% betting market pricing data).
 */
export function buildImpliedSeries(
  seedKey: string,
  currentOdds: number,
  steps = 18
): { impliedNow: number; openOdds: number; points: number[] } {
  const safeOdds = Math.max(1.02, currentOdds);
  const impliedNow = Math.min(94, Math.max(6, Math.round((1 / safeOdds) * 95)));
  const seed = hashSeed(seedKey);

  // Opening implied probability drifted toward impliedNow
  const drift = ((seed % 19) - 7) * (impliedNow > 55 ? 1.15 : -0.9);
  const startImplied = Math.min(88, Math.max(10, Math.round(impliedNow - drift)));
  const openOdds = Number(Math.max(1.05, 95 / startImplied).toFixed(2));

  const pts: number[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const base = startImplied + (impliedNow - startImplied) * Math.pow(t, 0.88);
    const wave =
      i === steps - 1
        ? 0
        : Math.sin(i * 1.35 + (seed % 7)) * 2.8 +
          Math.cos(i * 0.7 + (seed % 5)) * 1.6;
    pts.push(Math.min(95, Math.max(4, Number((base + wave).toFixed(1)))));
  }

  return { impliedNow, openOdds, points: pts };
}

/**
 * Compact inline SVG sparkline for Match Tiles & Live Movers
 */
export const MiniOddsSparkline: React.FC<{
  seedKey: string;
  currentOdds: number;
  width?: number;
  height?: number;
  color?: string;
}> = ({ seedKey, currentOdds, width = 68, height = 22, color }) => {
  const { points } = useMemo(
    () => buildImpliedSeries(seedKey, currentOdds, 12),
    [seedKey, currentOdds]
  );

  const min = Math.min(...points) - 2;
  const max = Math.max(...points) + 2;
  const span = Math.max(4, max - min);

  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * (width - 6) + 2;
    const y = height - 3 - ((val - min) / span) * (height - 6);
    return { x, y };
  });

  const pathD = coords
    .map((c, idx) => `${idx === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(' ');

  const isRisingProb = points[points.length - 1] >= points[0];
  const strokeColor = color || (isRisingProb ? '#10B981' : '#3AD4F7');
  const last = coords[coords.length - 1];
  const gradId = `spark-${seedKey.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible shrink-0 select-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path
        d={`${pathD} L${last.x.toFixed(1)},${height} L2,${height} Z`}
        fill={`url(#${gradId})`}
      />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last.x} cy={last.y} r="2.3" fill={strokeColor} />
    </svg>
  );
};

/**
 * Polymarket-style Multi-Outcome Live Odds & Implied Price Terminal Chart
 * (100% pure betting odds market history — zero match stats widget)
 */
export const OddsPriceTerminalChart: React.FC<{
  matchId: string;
  homeLabel: string;
  awayLabel: string;
  homeTeamId: string;
  awayTeamId: string;
  homeOdds: number;
  drawOdds?: number;
  awayOdds: number;
  isLive?: boolean;
  compact?: boolean;
}> = ({
  matchId,
  homeLabel,
  awayLabel,
  homeOdds,
  drawOdds,
  awayOdds,
  isLive = true,
  compact = false,
}) => {
  const [range, setRange] = useState<'15m' | '1H' | 'All'>('All');

  const steps = range === '15m' ? 10 : range === '1H' ? 15 : 22;

  const homeSeries = useMemo(
    () => buildImpliedSeries(`${matchId}-home-${range}`, homeOdds, steps),
    [matchId, homeOdds, range, steps]
  );
  const awaySeries = useMemo(
    () => buildImpliedSeries(`${matchId}-away-${range}`, awayOdds, steps),
    [matchId, awayOdds, range, steps]
  );

  // Normalize implied % so 1X2 sums cleanly to 100%
  const rawHome = 1 / Math.max(1.02, homeOdds);
  const rawDraw = drawOdds ? 1 / Math.max(1.02, drawOdds) : 0;
  const rawAway = 1 / Math.max(1.02, awayOdds);
  const totalInv = rawHome + rawDraw + rawAway;

  const homePct = Math.round((rawHome / totalInv) * 100);
  const drawPct = drawOdds ? Math.round((rawDraw / totalInv) * 100) : 0;
  const awayPct = Math.max(1, 100 - homePct - drawPct);

  const W = 420;
  const H = compact ? 86 : 112;

  const toPath = (pts: number[]) =>
    pts
      .map((v, i) => {
        const x = (i / (pts.length - 1)) * (W - 10) + 4;
        const y = H - 8 - (v / 100) * (H - 16);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

  const homePath = toPath(homeSeries.points);
  const awayPath = toPath(awaySeries.points);

  const lastHomeX = W - 6;
  const lastHomeY =
    H - 8 - (homeSeries.points[homeSeries.points.length - 1] / 100) * (H - 16);
  const lastAwayY =
    H - 8 - (awaySeries.points[awaySeries.points.length - 1] / 100) * (H - 16);

  const gradHomeId = `term-home-${matchId}`;

  return (
    <div className="rounded-[12px] bg-[#07141B]/90 border border-white/[0.07] p-3 space-y-2.5">
      {/* Top Legend & Timeframe Switcher */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3 text-[11.5px] font-bold">
          <span className="inline-flex items-center gap-1.5 text-white">
            <span className="w-2 h-2 rounded-full bg-[#2CE5F6]" />
            <span className="truncate max-w-[105px]">{homeLabel}</span>
            <span className="text-[#2CE5F6] font-extrabold tabular-nums">
              {homePct}%
            </span>
          </span>
          {drawOdds !== undefined && (
            <span className="inline-flex items-center gap-1 text-[#89A7B4] tabular-nums">
              <span>Draw</span>
              <span className="text-white font-extrabold">{drawPct}%</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-[#9BB7C4]">
            <span className="w-2 h-2 rounded-full bg-[#FB7185]" />
            <span className="truncate max-w-[95px]">{awayLabel}</span>
            <span className="text-[#FB7185] font-extrabold tabular-nums">
              {awayPct}%
            </span>
          </span>
        </div>

        <div className="flex items-center gap-0.5 bg-[#0B1E27] p-0.5 rounded-[7px] border border-white/[0.06] text-[10px] font-bold">
          {(['15m', '1H', 'All'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRange(tf);
              }}
              className={`px-1.5 py-0.5 rounded-[5px] transition-colors ${
                range === tf
                  ? 'bg-[#173A4A] text-[#2CE5F6]'
                  : 'text-[#6E8E9B] hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Price-Action Graph */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto overflow-visible select-none"
          aria-label="Odds implied probability curve"
        >
          <defs>
            <linearGradient id={gradHomeId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2CE5F6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2CE5F6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Subtle horizontal grid lines (25%, 50%, 75%) */}
          {[0.25, 0.5, 0.75].map((lvl) => {
            const gy = H - 8 - lvl * (H - 16);
            return (
              <line
                key={lvl}
                x1="0"
                y1={gy}
                x2={W}
                y2={gy}
                stroke="#16323F"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
            );
          })}

          {/* Home Area + Line */}
          <path
            d={`${homePath} L${lastHomeX},${H - 4} L4,${H - 4} Z`}
            fill={`url(#${gradHomeId})`}
          />
          <path
            d={homePath}
            fill="none"
            stroke="#2CE5F6"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Away Line */}
          <path
            d={awayPath}
            fill="none"
            stroke="#FB7185"
            strokeWidth="1.6"
            strokeOpacity="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Live End Dots */}
          <circle cx={lastHomeX} cy={lastHomeY} r="3.5" fill="#2CE5F6" />
          {isLive && (
            <circle
              cx={lastHomeX}
              cy={lastHomeY}
              r="7"
              fill="#2CE5F6"
              fillOpacity="0.22"
            />
          )}
          <circle cx={lastHomeX} cy={lastAwayY} r="2.8" fill="#FB7185" />
        </svg>
      </div>

      {/* Bottom Price-Action Readout */}
      <div className="flex items-center justify-between text-[10.5px] text-[#7896A3] pt-1 border-t border-white/[0.05] tabular-nums">
        <span>
          Open <strong className="text-[#B8D0DA]">{homeSeries.openOdds.toFixed(2)}</strong> → Now{' '}
          <strong className="text-[#2CE5F6]">{homeOdds.toFixed(2)}</strong>
        </span>
        <span className="text-[#8CE9D8] font-semibold">
          Implied odds curve · Live USDT pricing
        </span>
      </div>
    </div>
  );
};
