import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronUp, Lock, Star } from 'lucide-react';
import {
  getMarketsForMatch,
  MatchItem,
  OddSelection,
} from '../data/sportsbookData';
import { useSportsbook } from '../context/SportsbookContext';
import { CompetitionFlag, TeamCrest } from './BrandIcons';
import { OddsButton } from './OddsButton';
import {
  buildImpliedSeries,
  getClubColor,
  MiniOddsSparkline,
} from './OddsSparkline';

export type MarketDisplayType = '1x2' | 'ou' | 'btts' | 'dual';

export function buildMatchRowSelections(
  match: MatchItem,
  marketType: MarketDisplayType = '1x2'
): OddSelection[] {
  const matchTitle = `${match.homeTeam.name} v ${match.awayTeam.name}`;
  const scoreText =
    match.homeTeam.score !== undefined && match.awayTeam.score !== undefined
      ? `${match.homeTeam.score}–${match.awayTeam.score}`
      : undefined;

  if (marketType === 'ou' && match.overUnderOdds) {
    return [
      {
        id: `${match.id}-ou-o25`,
        matchId: match.id,
        matchTitle,
        competitionId: match.competitionId,
        competitionName: match.competitionName,
        sportId: match.sportId,
        marketId: 'mkt-tg-25',
        marketName: 'Total goals',
        label: `Over ${match.overUnderOdds.line}`,
        shortLabel: `Over ${match.overUnderOdds.line}`,
        odds: match.overUnderOdds.over,
        isLive: match.isLive,
        scoreText,
        clockText: match.clock,
      },
      {
        id: `${match.id}-ou-u25`,
        matchId: match.id,
        matchTitle,
        competitionId: match.competitionId,
        competitionName: match.competitionName,
        sportId: match.sportId,
        marketId: 'mkt-tg-25',
        marketName: 'Total goals',
        label: `Under ${match.overUnderOdds.line}`,
        shortLabel: `Under ${match.overUnderOdds.line}`,
        odds: match.overUnderOdds.under,
        isLive: match.isLive,
        scoreText,
        clockText: match.clock,
      },
    ];
  }

  if (marketType === 'btts' && match.bttsOdds) {
    return [
      {
        id: `${match.id}-btts-yes`,
        matchId: match.id,
        matchTitle,
        competitionId: match.competitionId,
        competitionName: match.competitionName,
        sportId: match.sportId,
        marketId: 'mkt-btts',
        marketName: 'Both teams to score',
        label: 'Yes',
        shortLabel: 'Yes (BTTS)',
        odds: match.bttsOdds.yes,
        isLive: match.isLive,
        scoreText,
        clockText: match.clock,
      },
      {
        id: `${match.id}-btts-no`,
        matchId: match.id,
        matchTitle,
        competitionId: match.competitionId,
        competitionName: match.competitionName,
        sportId: match.sportId,
        marketId: 'mkt-btts',
        marketName: 'Both teams to score',
        label: 'No',
        shortLabel: 'No (BTTS)',
        odds: match.bttsOdds.no,
        isLive: match.isLive,
        scoreText,
        clockText: match.clock,
      },
    ];
  }

  const list: OddSelection[] = [
    {
      id: `${match.id}-1x2-home`,
      matchId: match.id,
      matchTitle,
      competitionId: match.competitionId,
      competitionName: match.competitionName,
      sportId: match.sportId,
      marketId: 'mkt-1x2',
      marketName: 'Match result',
      label: match.homeTeam.name,
      shortLabel: match.homeTeam.shortName,
      odds: match.mainOdds.home,
      isLive: match.isLive,
      scoreText,
      clockText: match.clock,
    },
  ];

  if (match.mainOdds.draw !== undefined) {
    list.push({
      id: `${match.id}-1x2-draw`,
      matchId: match.id,
      matchTitle,
      competitionId: match.competitionId,
      competitionName: match.competitionName,
      sportId: match.sportId,
      marketId: 'mkt-1x2',
      marketName: 'Match result',
      label: 'Draw',
      shortLabel: 'Draw',
      odds: match.mainOdds.draw,
      isLive: match.isLive,
      scoreText,
      clockText: match.clock,
    });
  }

  list.push({
    id: `${match.id}-1x2-away`,
    matchId: match.id,
    matchTitle,
    competitionId: match.competitionId,
    competitionName: match.competitionName,
    sportId: match.sportId,
    marketId: 'mkt-1x2',
    marketName: 'Match result',
    label: match.awayTeam.name,
    shortLabel: match.awayTeam.shortName,
    odds: match.mainOdds.away,
    isLive: match.isLive,
    scoreText,
    clockText: match.clock,
  });

  return list;
}

export const DesktopMatchRow: React.FC<{
  match: MatchItem;
  marketType?: MarketDisplayType;
  showStar?: boolean;
}> = ({ match, marketType = '1x2', showStar = false }) => {
  const { navigateTo, followedTeams, toggleFollowTeam } = useSportsbook();
  const [inlineExpanded, setInlineExpanded] = useState<boolean>(false);
  const starred = showStar || followedTeams.includes(match.homeTeam.id);
  const selections = buildMatchRowSelections(
    match,
    marketType === 'dual' ? '1x2' : marketType
  );
  const ouSelections =
    marketType === 'dual' && match.overUnderOdds
      ? buildMatchRowSelections(match, 'ou')
      : [];
  const matchTitle = `${match.homeTeam.name} v ${match.awayTeam.name}`;
  const scoreText =
    match.homeTeam.score !== undefined && match.awayTeam.score !== undefined
      ? `${match.homeTeam.score}–${match.awayTeam.score}`
      : undefined;

  const extraMarkets = inlineExpanded
    ? getMarketsForMatch(match)
        .filter((m) => m.id !== 'mkt-1x2' && !m.suspended)
        .slice(0, 3)
    : [];

  return (
    <div className="border-t border-[#16303B]">
      <div
        onClick={() => navigateTo('match', { matchId: match.id })}
        className="group flex items-center justify-between px-4 py-3 hover:bg-[#102630]/75 transition-colors cursor-pointer"
      >
        {/* Left: Time or LIVE Clock */}
        <div className="w-[88px] shrink-0 flex flex-col justify-center pr-2">
          {match.isLive ? (
            <>
              <span className="inline-flex items-center justify-center w-fit px-1.5 py-0.5 rounded-[5px] bg-[#E91E63] text-white text-[10px] font-extrabold tracking-wider uppercase">
                LIVE
              </span>
              <span className="text-[12px] font-semibold text-[#D6E6EC] mt-1 tabular-nums">
                {match.clock}
              </span>
            </>
          ) : (
            <>
              <span className="text-[13px] font-semibold text-[#E8F2F6] tabular-nums">
                {match.startTime}
              </span>
              <span className="text-[11px] text-[#7D9BA8] mt-0.5">
                {match.startDate}
              </span>
            </>
          )}
        </div>

        {/* Middle: Teams & Scores */}
        <div className="flex-1 min-w-0 flex items-center justify-between pr-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <TeamCrest
                teamId={match.homeTeam.id}
                teamName={match.homeTeam.name}
                size="sm"
              />
              <span className="text-[13.5px] font-semibold text-[#F1F7F9] truncate group-hover:text-[#2CE5F6] transition-colors">
                {match.homeTeam.name}
              </span>
            </div>
            <div className="flex items-center gap-2.5 min-w-0">
              <TeamCrest
                teamId={match.awayTeam.id}
                teamName={match.awayTeam.name}
                size="sm"
              />
              <span className="text-[13.5px] font-semibold text-[#F1F7F9] truncate group-hover:text-[#2CE5F6] transition-colors">
                {match.awayTeam.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFollowTeam(match.homeTeam.id);
              }}
              className={`p-1 rounded-full hover:bg-[#183542] transition-opacity ${
                starred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              title={`Follow ${match.homeTeam.name}`}
            >
              <Star
                className={`w-4 h-4 ${
                  starred
                    ? 'fill-[#F5B82E] text-[#F5B82E]'
                    : 'text-[#6A8A98] hover:text-[#F5B82E]'
                }`}
              />
            </button>

            {match.isLive && (
              <div className="flex flex-col items-end gap-1.5 tabular-nums font-bold text-[13.5px]">
                <span className="text-white">{match.homeTeam.score ?? 0}</span>
                <span className="text-[#7E9CA9]">
                  {match.awayTeam.score ?? 0}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Odds Columns or Suspended Bar */}
        <div
          className={
            marketType === 'dual' && ouSelections.length === 2
              ? 'w-[370px] xl:w-[548px] shrink-0'
              : 'w-[350px] lg:w-[405px] shrink-0'
          }
        >
          {match.suspended ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="h-[48px] w-full rounded-[10px] bg-[#10232C] border border-[#1E3B48] flex items-center justify-center gap-2 text-[#F59E0B] select-none"
            >
              <Lock className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span className="text-[12.5px] font-semibold">Suspended</span>
            </div>
          ) : marketType === 'dual' && ouSelections.length === 2 ? (
            <div className="flex items-center gap-2.5">
              <div
                className={`flex-1 grid gap-1.5 ${
                  selections.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                }`}
              >
                {selections.map((sel) => (
                  <OddsButton key={sel.id} selection={sel} variant="stacked" compact />
                ))}
              </div>
              <div className="hidden xl:grid w-[186px] shrink-0 grid-cols-2 gap-1.5 pl-2.5 border-l border-white/[0.07]">
                {ouSelections.map((sel) => (
                  <OddsButton key={sel.id} selection={sel} variant="stacked" compact />
                ))}
              </div>
            </div>
          ) : (
            <div
              className={`grid gap-2 ${
                selections.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
              }`}
            >
              {selections.map((sel) => (
                <OddsButton key={sel.id} selection={sel} variant="stacked" />
              ))}
            </div>
          )}
        </div>

        {/* Right: More Markets Counter */}
        <div className="w-[62px] shrink-0 flex items-center justify-end pl-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('match', { matchId: match.id });
            }}
            className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-[#89A7B3] hover:text-white transition-colors tabular-nums"
          >
            <span>+{match.totalMarketsCount}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const PhoneMatchCard: React.FC<{
  match: MatchItem;
  marketType?: MarketDisplayType;
  fullWidth?: boolean;
  showLeagueLabel?: boolean;
}> = ({ match, marketType = '1x2', fullWidth = false, showLeagueLabel = false }) => {
  const { navigateTo, toggleFollowTeam } = useSportsbook();
  const [starred, setStarred] = useState<boolean>(false);
  const selections = buildMatchRowSelections(match, marketType);

  return (
    <div
      onClick={() => navigateTo('match', { matchId: match.id })}
      className={`rounded-[14px] bg-[#0D2028] border border-[#193643] p-3.5 flex flex-col justify-between transition-colors hover:border-[#254E60] cursor-pointer shrink-0 ${
        fullWidth ? 'w-full' : 'w-[280px]'
      }`}
    >
      {/* Top Meta Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 min-w-0">
          {match.isLive ? (
            <>
              <span className="px-1.5 py-0.5 rounded-[5px] bg-[#E91E63] text-white text-[10px] font-extrabold tracking-wider uppercase shrink-0">
                LIVE
              </span>
              <span className="text-[12.5px] font-bold text-white tabular-nums shrink-0">
                {match.clock}
              </span>
              {showLeagueLabel && (
                <span className="text-[12px] text-[#7D9BA8] truncate max-w-[72px]">
                  · {match.competitionName}
                </span>
              )}
            </>
          ) : (
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[12.5px] font-bold text-white tabular-nums">
                {match.startTime}
              </span>
              <span className="text-[11.5px] text-[#7D9BA8] truncate">{match.startDate}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setStarred((s) => !s);
              toggleFollowTeam(match.homeTeam.id);
            }}
            className="text-[#7D9BA8] hover:text-[#F5B82E] transition-colors"
            title="Follow match"
          >
            <Star
              className={`w-4 h-4 ${
                starred ? 'fill-[#F5B82E] text-[#F5B82E]' : ''
              }`}
            />
          </button>
          <span className="inline-flex items-center text-[12px] font-semibold text-[#89A7B3] tabular-nums">
            +{match.totalMarketsCount}
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Teams & Scores */}
      <div className="space-y-2 mb-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <TeamCrest teamId={match.homeTeam.id} teamName={match.homeTeam.name} size="sm" />
            <span className="text-[13.5px] font-bold text-white truncate">
              {match.homeTeam.name}
            </span>
          </div>
          {match.isLive && (
            <span className="w-6 h-6 rounded-[6px] bg-[#132A34] flex items-center justify-center text-[12.5px] font-bold text-white tabular-nums shrink-0">
              {match.homeTeam.score ?? 0}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <TeamCrest teamId={match.awayTeam.id} teamName={match.awayTeam.name} size="sm" />
            <span className="text-[13.5px] font-bold text-white truncate">
              {match.awayTeam.name}
            </span>
          </div>
          {match.isLive && (
            <span className="w-6 h-6 rounded-[6px] bg-[#132A34] flex items-center justify-center text-[12.5px] font-bold text-[#89A7B3] tabular-nums shrink-0">
              {match.awayTeam.score ?? 0}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Odds or Suspended */}
      {match.suspended ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className="h-[46px] w-full rounded-[10px] bg-[#10232C] border border-[#1E3B48] flex items-center justify-center gap-2 text-[#F59E0B]"
        >
          <Lock className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span className="text-[12.5px] font-semibold">Suspended</span>
        </div>
      ) : (
        <div
          className={`grid gap-1.5 ${
            selections.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
          }`}
        >
          {selections.map((sel) => (
            <OddsButton key={sel.id} selection={sel} variant="stacked" compact />
          ))}
        </div>
      )}
    </div>
  );
};

export const FeaturedMatchCard: React.FC<{ match: MatchItem }> = ({ match }) => {
  const { navigateTo } = useSportsbook();
  const selections = buildMatchRowSelections(match, '1x2');

  return (
    <div
      onClick={() => navigateTo('match', { matchId: match.id })}
      className="w-[282px] shrink-0 rounded-[14px] bg-[#0C1F27] border border-[#183440] hover:border-[#285466] p-4 flex flex-col justify-between transition-all cursor-pointer group"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <CompetitionFlag flagId={match.competitionId} className="w-3.5 h-3.5" />
          <span className="text-[11.5px] font-medium text-[#84A0AC] truncate">
            {match.competitionName}
          </span>
        </div>
        {match.isLive ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-1.5 py-0.5 rounded-[5px] bg-[#E91E63] text-white text-[10px] font-extrabold uppercase tracking-wider">
              LIVE
            </span>
            <span className="text-[12px] font-bold text-white tabular-nums">{match.clock}</span>
          </div>
        ) : (
          <span className="text-[11.5px] text-[#84A0AC] tabular-nums shrink-0">
            {match.startDate} · {match.startTime}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="space-y-2.5 mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <TeamCrest teamId={match.homeTeam.id} teamName={match.homeTeam.name} size="md" />
            <span className="text-[13.5px] font-bold text-white truncate group-hover:text-[#2CE5F6] transition-colors">
              {match.homeTeam.name}
            </span>
          </div>
          {match.isLive && (
            <span className="w-6 h-6 rounded-[6px] bg-[#132933] flex items-center justify-center text-[12.5px] font-bold text-white tabular-nums">
              {match.homeTeam.score ?? 0}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <TeamCrest teamId={match.awayTeam.id} teamName={match.awayTeam.name} size="md" />
            <span className="text-[13.5px] font-bold text-white truncate group-hover:text-[#2CE5F6] transition-colors">
              {match.awayTeam.name}
            </span>
          </div>
          {match.isLive && (
            <span className="w-6 h-6 rounded-[6px] bg-[#132933] flex items-center justify-center text-[12.5px] font-bold text-[#89A7B3] tabular-nums">
              {match.awayTeam.score ?? 0}
            </span>
          )}
        </div>
      </div>

      {/* Odds */}
      <div className={`grid gap-2 ${selections.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {selections.map((sel) => (
          <OddsButton key={sel.id} selection={sel} variant="stacked" compact />
        ))}
      </div>
    </div>
  );
};

/**
 * Apple Sports × Polymarket Modular Match Trading Bento Card
 * Replaces flat 1-column wireframe rows with high-contrast club color accents,
 * live implied-odds sparklines, editorial tabular scores, and USDT return buttons.
 */
export const MatchTradingTile: React.FC<{
  match: MatchItem;
  marketType?: MarketDisplayType;
  showLeagueBadge?: boolean;
}> = ({ match, marketType = '1x2', showLeagueBadge = true }) => {
  const { navigateTo, followedTeams, toggleFollowTeam } = useSportsbook();
  const starred = followedTeams.includes(match.homeTeam.id);

  const primaryType = marketType === 'dual' ? '1x2' : marketType;
  const selections = buildMatchRowSelections(match, primaryType);
  const homeColor = getClubColor(match.homeTeam.id);
  const awayColor = getClubColor(match.awayTeam.id);

  return (
    <div
      onClick={() => navigateTo('match', { matchId: match.id })}
      className="relative overflow-hidden rounded-[15px] bg-[#0A1B23] border border-white/[0.08] hover:border-[#2CE5F6]/45 p-4 flex flex-col justify-between transition-all cursor-pointer group shadow-[0_6px_22px_rgba(0,0,0,0.24)]"
      style={{
        backgroundImage: `radial-gradient(120% 90% at 0% 0%, ${homeColor}18 0%, transparent 55%), radial-gradient(110% 80% at 100% 0%, ${awayColor}14 0%, transparent 55%)`,
      }}
    >
      {/* Left Vertical Dual-Club Accent Bar */}
      <div
        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full opacity-85"
        style={{
          background: `linear-gradient(to bottom, ${homeColor}, ${awayColor})`,
        }}
      />

      {/* Top Meta Bar: Competition + Live Clock / Kickoff + Sparkline + Markets */}
      <div className="flex items-center justify-between gap-2 mb-3 pl-1">
        <div className="flex items-center gap-2 min-w-0">
          {match.isLive ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[6px] bg-[#FF2E63]/18 border border-[#FF2E63]/40 text-[#FF5C85] text-[10.5px] font-extrabold tracking-wide uppercase shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E63] animate-pulse" />
              <span>{match.clock}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-[#102631] border border-white/[0.06] text-[#B8D2DD] text-[10.5px] font-bold tabular-nums shrink-0">
              {match.startDate === 'Today' ? match.startTime : `${match.startDate} · ${match.startTime}`}
            </span>
          )}

          {showLeagueBadge && (
            <div className="flex items-center gap-1.5 min-w-0">
              <CompetitionFlag flagId={match.competitionId} className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[11.5px] font-semibold text-[#8CA8B5] truncate">
                {match.competitionName}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-[7px] bg-[#061218]/80 border border-white/[0.06]">
            {match.isLive && !match.suspended && (
              <span className="hidden xl:inline text-[10px] font-semibold text-[#7896A3] tabular-nums">
                Open{' '}
                {buildImpliedSeries(match.id, match.mainOdds.home, 10).openOdds.toFixed(
                  2
                )}
              </span>
            )}
            <MiniOddsSparkline
              seedKey={match.id}
              currentOdds={match.mainOdds.home}
              width={48}
              height={15}
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFollowTeam(match.homeTeam.id);
            }}
            className="text-[#6E8E9B] hover:text-[#F5B82E] transition-colors"
            title={`Follow ${match.homeTeam.name}`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                starred ? 'fill-[#F5B82E] text-[#F5B82E]' : ''
              }`}
            />
          </button>

          <span className="inline-flex items-center text-[11px] font-bold text-[#7D9CA9] group-hover:text-[#2CE5F6] transition-colors tabular-nums">
            +{match.totalMarketsCount}
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Matchup Body: High-Contrast Crests & Editorial Scores */}
      <div className="space-y-2.5 mb-3.5 pl-1">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <TeamCrest teamId={match.homeTeam.id} teamName={match.homeTeam.name} size="md" />
            <span className="text-[14.5px] font-extrabold text-white truncate group-hover:text-[#2CE5F6] transition-colors tracking-tight">
              {match.homeTeam.name}
            </span>
          </div>
          {match.isLive && (
            <span className="min-w-[28px] h-7 px-2 rounded-[7px] bg-[#061319]/90 border border-white/[0.09] flex items-center justify-center text-[15px] font-black text-white tabular-nums">
              {match.homeTeam.score ?? 0}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <TeamCrest teamId={match.awayTeam.id} teamName={match.awayTeam.name} size="md" />
            <span className="text-[14.5px] font-extrabold text-[#DCEAF0] truncate group-hover:text-white transition-colors tracking-tight">
              {match.awayTeam.name}
            </span>
          </div>
          {match.isLive && (
            <span className="min-w-[28px] h-7 px-2 rounded-[7px] bg-[#061319]/90 border border-white/[0.06] flex items-center justify-center text-[15px] font-black text-[#9AB6C3] tabular-nums">
              {match.awayTeam.score ?? 0}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Direct Execution Deck */}
      <div className="pl-1">
        {match.suspended ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="h-[48px] w-full rounded-[11px] bg-[#0B1B23] border border-[#243E4B] flex items-center justify-center gap-2 text-[#F59E0B] select-none"
          >
            <Lock className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-[12px] font-bold">Market Suspended</span>
          </div>
        ) : (
          <div
            className={`grid gap-2 ${
              selections.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}
          >
            {selections.map((sel) => (
              <OddsButton key={sel.id} selection={sel} variant="stacked" compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
