import React from 'react';
import { SportId } from '../data/sportsbookData';

export const HousebetsLogo: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className="flex items-center select-none cursor-pointer group">
    <div className="relative flex items-end">
      <span className="text-[20px] md:text-[22px] font-extrabold tracking-[-0.025em] leading-none">
        <span className="text-[#2CE5F6]">House</span>
        <span className="text-white">bets</span>
      </span>
      {/* Crisp Vector Breaking Ocean Wave Crest (Zero Raster Artifacts) */}
      <svg
        viewBox="0 0 76 42"
        className="w-12 h-7 -ml-3.5 -mb-0.5 transition-transform duration-300 group-hover:translate-x-0.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hbWaveMain" x1="8" y1="4" x2="66" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E4FBF7" />
            <stop offset="38%" stopColor="#3AD4F7" />
            <stop offset="78%" stopColor="#0E6D8B" />
            <stop offset="100%" stopColor="#083242" />
          </linearGradient>
          <linearGradient id="hbWaveDeep" x1="18" y1="10" x2="58" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2CE5F6" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#06212C" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <path
          d="M4 37C19 37 35 33 46 23C54 16 56 7 47 4C39 1 28 5 24 13C28 9 35 8 40 11C45 14 42 22 33 28C24 33 12 35 4 37Z"
          fill="url(#hbWaveDeep)"
        />
        <path
          d="M14 38C33 38 53 32 63 20C69 11 64 2 50 2C37 2 25 8 22 17C26 11 35 9 42 11C49 13 48 22 39 29C30 35 20 37 14 38Z"
          fill="url(#hbWaveMain)"
        />
        <path
          d="M22 16C26 7 37 2 50 2C61 2 66 8 64 16"
          stroke="#F0FDFA"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M31 11C36 7 45 6 51 9"
          stroke="#B9F6EC"
          strokeOpacity="0.7"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M2 38.5H72"
          stroke="#2CE5F6"
          strokeOpacity="0.4"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    </div>
    {!compact && <span className="sr-only">Housebets Sportsbook</span>}
  </div>
);

export const GoldTrophyIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={`shrink-0 select-none ${className}`} fill="none">
    <defs>
      <linearGradient id="hbGoldCup" x1="6" y1="3" x2="18" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="45%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    <path
      d="M7 4H17V9.5C17 12.5 14.8 14.8 12 14.8C9.2 14.8 7 12.5 7 9.5V4Z"
      fill="url(#hbGoldCup)"
    />
    <path
      d="M7 6H4.5C3.9 6 3.5 6.4 3.5 7V8.2C3.5 10.1 4.9 11.6 6.8 11.8"
      stroke="#FBBF24"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M17 6H19.5C20.1 6 20.5 6.4 20.5 7V8.2C20.5 10.1 19.1 11.6 17.2 11.8"
      stroke="#FBBF24"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path d="M12 14.8V18.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    <rect x="8" y="18.5" width="8" height="2.3" rx="1" fill="url(#hbGoldCup)" />
    <path d="M9.5 5.8V10.5" stroke="#FEF9C3" strokeOpacity="0.65" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

export const UsdtBadge: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={`inline-block shrink-0 ${className}`} fill="none">
    <circle cx="12" cy="12" r="11" fill="#26A17B" />
    <path
      d="M13.3 10.6V9.1H17V6.8H7V9.1H10.7V10.6C7.7 10.8 5.5 11.4 5.5 12.2C5.5 13 7.7 13.6 10.7 13.8V18H13.3V13.8C16.3 13.6 18.5 13 18.5 12.2C18.5 11.4 16.3 10.8 13.3 10.6ZM12 13.1C8.9 13.1 6.7 12.6 6.7 12.1C6.7 11.6 8.9 11.2 10.7 11.1V12.5C11.1 12.5 11.5 12.5 12 12.5C12.5 12.5 12.9 12.5 13.3 12.5V11.1C15.1 11.2 17.3 11.6 17.3 12.1C17.3 12.6 15.1 13.1 12 13.1Z"
      fill="white"
    />
  </svg>
);

export const TropicalBadge: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title="Housebets VIP & State Simulator"
    className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-[#2CE5F6] via-[#FBBF24] to-[#10B981] shadow-[0_4px_20px_rgba(0,0,0,0.65)] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center overflow-hidden"
  >
    <svg viewBox="0 0 48 48" className="w-full h-full rounded-full">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="55%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill="url(#skyGrad)" />
      <circle cx="33" cy="15" r="6" fill="#FEF08A" opacity="0.9" />
      <path d="M0 34 Q24 30 48 34 L48 48 L0 48 Z" fill="#0284C7" />
      <path d="M4 42 Q22 31 44 43 L48 48 L0 48 Z" fill="#FACC15" />
      <path d="M8 44 Q24 36 42 45 L44 48 L4 48 Z" fill="#84CC16" />
      <path d="M18 39 Q15 27 21 17" stroke="#78350F" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M21 17 Q11 14 8 20 Q15 19 21 17" fill="#15803D" />
      <path d="M21 17 Q14 9 10 12 Q16 14 21 17" fill="#16A34A" />
      <path d="M21 17 Q27 9 32 13 Q26 15 21 17" fill="#22C55E" />
      <path d="M21 17 Q30 16 33 22 Q26 20 21 17" fill="#15803D" />
    </svg>
  </button>
);

const SVG_CREST_TEAMS = new Set([
  'arsenal',
  'brighton',
  'liverpool',
  'man-utd',
  'real-madrid',
  'bayern',
  'man-city',
  'spurs',
  'tottenham',
  'inter',
  'aston-villa',
  'fulham',
  'newcastle',
  'everton',
  'barcelona',
  'psg',
  'atletico',
  'sevilla',
  'ac-milan',
  'milan',
  'dortmund',
  'leverkusen',
  'villarreal',
  'juventus',
  'stuttgart',
  'leipzig',
]);

const PNG_CREST_TEAMS = new Set([
  'napoli',
  'roma',
  'lakers',
  'celtics',
  'warriors',
  'nuggets',
  'yankees',
  'dodgers',
  'chiefs',
  'ravens',
  'bills',
]);

const DARK_SILHOUETTE_CRESTS = new Set(['spurs', 'tottenham', 'juventus']);

export const TeamCrest: React.FC<{
  teamId: string;
  teamName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}> = ({ teamId, teamName, size = 'sm' }) => {
  const sizeClass =
    size === 'xs'
      ? 'w-4 h-4'
      : size === 'sm'
      ? 'w-[20px] h-[20px]'
      : size === 'md'
      ? 'w-7 h-7'
      : 'w-12 h-12';

  const isDarkCrest = DARK_SILHOUETTE_CRESTS.has(teamId);
  const shadowClass = isDarkCrest
    ? 'drop-shadow-[0_0_3px_rgba(255,255,255,0.55)]'
    : 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]';

  if (SVG_CREST_TEAMS.has(teamId)) {
    if (isDarkCrest) {
      return (
        <span
          className={`${sizeClass} rounded-full bg-[#E8F2F6] p-[2.5px] inline-flex items-center justify-center shrink-0 select-none shadow-sm`}
        >
          <img
            src={`/crests/${teamId}.svg`}
            alt={teamName || teamId}
            className="w-full h-full object-contain"
            draggable={false}
          />
        </span>
      );
    }
    return (
      <img
        src={`/crests/${teamId}.svg`}
        alt={teamName || teamId}
        className={`${sizeClass} object-contain shrink-0 select-none ${shadowClass}`}
        draggable={false}
      />
    );
  }

  if (PNG_CREST_TEAMS.has(teamId)) {
    return (
      <img
        src={`/crests/${teamId}.png`}
        alt={teamName || teamId}
        className={`${sizeClass} object-contain shrink-0 select-none ${shadowClass}`}
        draggable={false}
      />
    );
  }

  // Esports teams: NaVi & FaZe
  if (teamId === 'navi') {
    return (
      <svg viewBox="0 0 36 36" className={`${sizeClass} shrink-0 select-none`}>
        <polygon points="18,2 34,10 30,32 6,32 2,10" fill="#FDE047" stroke="#111" strokeWidth="2" />
        <path d="M10 24 L14 11 L19 21 L22 11 L26 11 L21 26 L16 16 L13 24 Z" fill="#111111" />
      </svg>
    );
  }

  if (teamId === 'faze') {
    return (
      <svg viewBox="0 0 36 36" className={`${sizeClass} shrink-0 select-none`}>
        <circle cx="18" cy="18" r="16" fill="#141418" stroke="#E11D48" strokeWidth="2.2" />
        <path d="M9 12 H27 L24 16 H15 V18 H22 L19 22 H15 V26 H11 V12 Z" fill="#E11D48" />
      </svg>
    );
  }

  if (teamId === 'alcaraz') {
    return <CompetitionFlag flagId="laliga" className={sizeClass} />;
  }
  if (teamId === 'sinner') {
    return <CompetitionFlag flagId="seriea" className={sizeClass} />;
  }
  if (teamId === 'zverev') {
    return <CompetitionFlag flagId="bundesliga" className={sizeClass} />;
  }
  if (teamId === 'fritz') {
    return <CompetitionFlag flagId="nba" className={sizeClass} />;
  }

  const MONOGRAM_BADGES: Record<
    string,
    { code: string; bg: string; ring: string; fg: string }
  > = {
    t1: { code: 'T1', bg: '#16090C', ring: '#E2012D', fg: '#FFFFFF' },
    geng: { code: 'GEN', bg: '#171409', ring: '#AA8A00', fg: '#FDE047' },
    vitality: { code: 'VIT', bg: '#171507', ring: '#FACC15', fg: '#FEF08A' },
    g2: { code: 'G2', bg: '#16161A', ring: '#E11D48', fg: '#FFFFFF' },
    oilers: { code: 'EDM', bg: '#041E42', ring: '#FF4C00', fg: '#FFFFFF' },
    rangers: { code: 'NYR', bg: '#0038A8', ring: '#CE1126', fg: '#FFFFFF' },
    leafs: { code: 'TOR', bg: '#00205B', ring: '#6CABDD', fg: '#FFFFFF' },
    bruins: { code: 'BOS', bg: '#141414', ring: '#FFB81C', fg: '#FFB81C' },
    knicks: { code: 'NYK', bg: '#006BB6', ring: '#F58426', fg: '#FFFFFF' },
    bucks: { code: 'MIL', bg: '#00471B', ring: '#EEE1C6', fg: '#FFFFFF' },
    mets: { code: 'NYM', bg: '#002D72', ring: '#FF5910', fg: '#FFFFFF' },
    phillies: { code: 'PHI', bg: '#E81828', ring: '#FFFFFF', fg: '#FFFFFF' },
    bengals: { code: 'CIN', bg: '#141414', ring: '#FB4F14', fg: '#FB4F14' },
    djokovic: { code: 'DJO', bg: '#0C2340', ring: '#EF4444', fg: '#FFFFFF' },
    medvedev: { code: 'MED', bg: '#0F2937', ring: '#38BDF8', fg: '#FFFFFF' },
    rublev: { code: 'RUB', bg: '#1F1429', ring: '#F43F5E', fg: '#FFFFFF' },
    sabalenka: { code: 'SAB', bg: '#1F1224', ring: '#EC4899', fg: '#FFFFFF' },
    swiatek: { code: 'IGA', bg: '#2A0F18', ring: '#F43F5E', fg: '#FFFFFF' },
    rune: { code: 'RUN', bg: '#2A0E14', ring: '#EF4444', fg: '#FFFFFF' },
  };

  const badge = MONOGRAM_BADGES[teamId] || {
    code: (teamName || teamId).slice(0, 3).toUpperCase(),
    bg: '#0E2936',
    ring: '#2CE5F6',
    fg: '#FFFFFF',
  };

  return (
    <svg viewBox="0 0 36 36" className={`${sizeClass} shrink-0 select-none`}>
      <circle cx="18" cy="18" r="16" fill={badge.bg} stroke={badge.ring} strokeWidth="2.4" />
      <text
        x="18"
        y="21.5"
        textAnchor="middle"
        fill={badge.fg}
        fontSize={badge.code.length > 2 ? '9.5' : '11.5'}
        fontWeight="900"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {badge.code}
      </text>
    </svg>
  );
};

/**
 * Crisp Circular Vector Flags (Zero OS Emoji Dependence)
 */
export const CompetitionFlag: React.FC<{
  flagId: string;
  className?: string;
}> = ({ flagId, className = 'w-4 h-4' }) => {
  const key = flagId.toLowerCase();

  if (key === 'epl' || key === 'england' || key.includes('🏴')) {
    return (
      <svg viewBox="0 0 24 24" className={`shrink-0 select-none rounded-full ${className}`}>
        <clipPath id="engClip">
          <circle cx="12" cy="12" r="11" />
        </clipPath>
        <g clipPath="url(#engClip)">
          <circle cx="12" cy="12" r="11" fill="#F8FAFC" />
          <rect x="9.8" y="0" width="4.4" height="24" fill="#CE1124" />
          <rect x="0" y="9.8" width="24" height="4.4" fill="#CE1124" />
        </g>
        <circle cx="12" cy="12" r="11" fill="none" stroke="#224554" strokeWidth="1" />
      </svg>
    );
  }

  if (key === 'ucl' || key === 'europe' || key.includes('🌍')) {
    return (
      <svg viewBox="0 0 24 24" className={`shrink-0 select-none rounded-full ${className}`}>
        <defs>
          <radialGradient id="uclGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="55%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#0F172A" />
          </radialGradient>
        </defs>
        <circle cx="12" cy="12" r="11" fill="url(#uclGrad)" stroke="#38BDF8" strokeWidth="1" />
        <path
          d="M7 9 C9 6 14 6 16 9 C14 12 16 15 13 18 C10 17 7 14 7 9 Z"
          fill="#34D399"
          fillOpacity="0.65"
        />
        <circle cx="12" cy="6.5" r="1" fill="#FFFFFF" />
        <circle cx="16.8" cy="9.5" r="1" fill="#FFFFFF" />
        <circle cx="15.2" cy="15.5" r="1" fill="#FFFFFF" />
        <circle cx="8.8" cy="15.5" r="1" fill="#FFFFFF" />
        <circle cx="7.2" cy="9.5" r="1" fill="#FFFFFF" />
      </svg>
    );
  }

  if (key === 'laliga' || key === 'spain' || key.includes('🇪🇸')) {
    return (
      <svg viewBox="0 0 24 24" className={`shrink-0 select-none rounded-full ${className}`}>
        <clipPath id="espClip">
          <circle cx="12" cy="12" r="11" />
        </clipPath>
        <g clipPath="url(#espClip)">
          <rect x="0" y="0" width="24" height="6.5" fill="#AA151B" />
          <rect x="0" y="6.5" width="24" height="11" fill="#F1BF00" />
          <rect x="0" y="17.5" width="24" height="6.5" fill="#AA151B" />
          <rect x="6.5" y="9.5" width="2.6" height="5" rx="1" fill="#AA151B" />
        </g>
        <circle cx="12" cy="12" r="11" fill="none" stroke="#224554" strokeWidth="1" />
      </svg>
    );
  }

  if (key === 'seriea' || key === 'italy' || key.includes('🇮🇹')) {
    return (
      <svg viewBox="0 0 24 24" className={`shrink-0 select-none rounded-full ${className}`}>
        <clipPath id="itaClip">
          <circle cx="12" cy="12" r="11" />
        </clipPath>
        <g clipPath="url(#itaClip)">
          <rect x="0" y="0" width="8" height="24" fill="#009246" />
          <rect x="8" y="0" width="8" height="24" fill="#F8FAFC" />
          <rect x="16" y="0" width="8" height="24" fill="#CE2B37" />
        </g>
        <circle cx="12" cy="12" r="11" fill="none" stroke="#224554" strokeWidth="1" />
      </svg>
    );
  }

  if (key === 'bundesliga' || key === 'germany' || key.includes('🇩🇪')) {
    return (
      <svg viewBox="0 0 24 24" className={`shrink-0 select-none rounded-full ${className}`}>
        <clipPath id="gerClip">
          <circle cx="12" cy="12" r="11" />
        </clipPath>
        <g clipPath="url(#gerClip)">
          <rect x="0" y="0" width="24" height="8" fill="#111111" />
          <rect x="0" y="8" width="24" height="8" fill="#DD0000" />
          <rect x="0" y="16" width="24" height="8" fill="#FFCE00" />
        </g>
        <circle cx="12" cy="12" r="11" fill="none" stroke="#224554" strokeWidth="1" />
      </svg>
    );
  }

  if (key === 'nba' || key === 'mlb' || key === 'nfl' || key === 'usa' || key.includes('🇺🇸')) {
    return (
      <svg viewBox="0 0 24 24" className={`shrink-0 select-none rounded-full ${className}`}>
        <clipPath id="usaClip">
          <circle cx="12" cy="12" r="11" />
        </clipPath>
        <g clipPath="url(#usaClip)">
          <rect x="0" y="0" width="24" height="24" fill="#F8FAFC" />
          <rect x="0" y="0" width="24" height="3.5" fill="#B22234" />
          <rect x="0" y="7" width="24" height="3.5" fill="#B22234" />
          <rect x="0" y="14" width="24" height="3.5" fill="#B22234" />
          <rect x="0" y="20.5" width="24" height="3.5" fill="#B22234" />
          <rect x="0" y="0" width="12" height="12" fill="#3C3B6E" />
          <circle cx="5" cy="5" r="1" fill="#FFFFFF" />
          <circle cx="8.5" cy="5" r="1" fill="#FFFFFF" />
          <circle cx="6.8" cy="8" r="1" fill="#FFFFFF" />
        </g>
        <circle cx="12" cy="12" r="11" fill="none" stroke="#224554" strokeWidth="1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={`shrink-0 select-none rounded-full ${className}`}>
      <circle cx="12" cy="12" r="10.5" fill="#102A36" stroke="#2CE5F6" strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="5" ry="10.5" fill="none" stroke="#2CE5F6" strokeWidth="1.2" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="#2CE5F6" strokeWidth="1.2" />
    </svg>
  );
};

/**
 * Uniform 1.5px Optical-Grid Vector Sport Icons
 */
export const SportIcon: React.FC<{
  sport: SportId | 'home' | 'live' | 'ice-hockey' | 'horse-racing' | 'casino' | 'dota' | 'cs2' | 'lol';
  className?: string;
}> = ({ sport, className = 'w-4 h-4' }) => {
  switch (sport) {
    case 'soccer':
      return (
        <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
          <polygon
            points="10,6.5 13,8.6 11.9,12.1 8.1,12.1 7,8.6"
            stroke="currentColor"
            strokeWidth="1.3"
            fill="currentColor"
            fillOpacity="0.18"
          />
          <line x1="10" y1="2" x2="10" y2="6.5" stroke="currentColor" strokeWidth="1.3" />
          <line x1="17.5" y1="7.5" x2="13" y2="8.6" stroke="currentColor" strokeWidth="1.3" />
          <line x1="14.8" y1="16.4" x2="11.9" y2="12.1" stroke="currentColor" strokeWidth="1.3" />
          <line x1="5.2" y1="16.4" x2="8.1" y2="12.1" stroke="currentColor" strokeWidth="1.3" />
          <line x1="2.5" y1="7.5" x2="7" y2="8.6" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );

    case 'tennis':
      return (
        <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M4.2 4.8 C7.5 7.5 7.5 12.5 4.2 15.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M15.8 4.8 C12.5 7.5 12.5 12.5 15.8 15.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );

    case 'basketball':
      return (
        <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
          <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.3" />
          <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.3" />
          <path d="M4.5 4.5 C8 8 8 12 4.5 15.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M15.5 4.5 C12 8 12 12 15.5 15.5" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      );

    case 'baseball':
      return (
        <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 4.2 C8.2 7.5 8.2 12.5 5 15.8" stroke="currentColor" strokeWidth="1.3" strokeDasharray="1.6 1.6" />
          <path d="M15 4.2 C11.8 7.5 11.8 12.5 15 15.8" stroke="currentColor" strokeWidth="1.3" strokeDasharray="1.6 1.6" />
        </svg>
      );

    case 'american-football':
      return (
        <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
          <path
            d="M16.5 3.5 C11.5 2.5 6.5 4.5 4.5 6.5 C2.5 8.5 0.5 13.5 3.5 16.5 C6.5 19.5 11.5 17.5 13.5 15.5 C15.5 13.5 17.5 8.5 16.5 3.5 Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <line x1="7.5" y1="12.5" x2="12.5" y2="7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="7.2" y1="9.8" x2="9.8" y2="12.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="9.5" y1="7.5" x2="12.1" y2="10.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case 'esports':
      return (
        <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
          <path
            d="M4.5 6.5 H15.5 C17 6.5 18 8 17.6 10 L16.7 14.2 C16.4 15.4 15.2 16 14.2 15.2 L12.2 13.5 H7.8 L5.8 15.2 C4.8 16 3.6 15.4 3.3 14.2 L2.4 10 C2 8 3 6.5 4.5 6.5 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <line x1="6.5" y1="8.8" x2="6.5" y2="11.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="5.3" y1="10" x2="7.7" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="13.2" cy="9.2" r="0.9" fill="currentColor" />
          <circle cx="14.7" cy="10.6" r="0.9" fill="currentColor" />
        </svg>
      );

    case 'ice-hockey':
      return (
        <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
          <path
            d="M14.5 3 L9.5 14.5 C9.1 15.4 8.2 16 7.2 16 H4.5 C3.7 16 3 15.3 3 14.5 C3 13.7 3.7 13 4.5 13 H7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse cx="14.5" cy="15.2" rx="2.5" ry="1.3" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );

    case 'horse-racing':
      return (
        <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
          <path
            d="M6 17 V12 C6 8.5 8 5.5 11.5 4 L13 2.5 L14 5 L16.5 7.5 L15 9.5 L12.5 8.5 L11 11.5 L13.5 17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'casino':
      return (
        <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
          <rect x="4" y="3" width="10" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 5.5 L16.5 6.5 C17.3 6.8 17.7 7.8 17.3 8.6 L14 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <polygon points="9,7.2 10.1,9.3 12.2,9.6 10.6,11.1 11,13.2 9,12.1 7,13.2 7.4,11.1 5.8,9.6 7.9,9.3" fill="currentColor" />
        </svg>
      );

    case 'dota':
      return (
        <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
          <rect x="3" y="3" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="5.5" y1="14.5" x2="14.5" y2="5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="6.8" cy="7.2" r="1.2" fill="currentColor" />
          <circle cx="13.2" cy="12.8" r="1.2" fill="currentColor" />
        </svg>
      );

    case 'cs2':
      return (
        <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.3" />
          <line x1="10" y1="1.5" x2="10" y2="5" stroke="currentColor" strokeWidth="1.4" />
          <line x1="10" y1="15" x2="10" y2="18.5" stroke="currentColor" strokeWidth="1.4" />
          <line x1="1.5" y1="10" x2="5" y2="10" stroke="currentColor" strokeWidth="1.4" />
          <line x1="15" y1="10" x2="18.5" y2="10" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );

    case 'lol':
      return (
        <svg viewBox="0 0 20 20" className={`shrink-0 ${className}`} fill="none">
          <path d="M6 3.5 V15.5 H14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="11.5" cy="8.5" r="3.2" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );

    default:
      return null;
  }
};
