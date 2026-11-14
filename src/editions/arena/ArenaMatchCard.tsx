import React from 'react';
import {
  ChevronRight,
  Lock,
  Pin,
  Star,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useSportsbook } from '../../context/SportsbookContext';
import { MatchItem, OddSelection } from '../../data/sportsbookData';
import {
  CompetitionFlag,
  SportIcon,
  TeamCrest,
} from '../../components/BrandIcons';

export const ArenaMatchCard: React.FC<{
  match: MatchItem;
  isPhoneView?: boolean;
}> = ({ match, isPhoneView = false }) => {
  const {
    navigateTo,
    pinnedMatchIds,
    togglePinMatch,
    followedTeams,
    toggleFollowTeam,
    followedCompetitions,
    toggleFollowCompetition,
    isSelected,
    toggleSelection,
    oddsFlashMap,
  } = useSportsbook();

  const isPinned = pinnedMatchIds.includes(match.id);
  const isCompFollowed = followedCompetitions.includes(match.competitionId);
  const isHomeFollowed = followedTeams.includes(match.homeTeam.id);
  const isAwayFollowed = followedTeams.includes(match.awayTeam.id);

  const matchTitle = `${match.homeTeam.name} v ${match.awayTeam.name}`;
  const scoreText =
    match.homeTeam.score !== undefined && match.awayTeam.score !== undefined
      ? `${match.homeTeam.score}–${match.awayTeam.score}`
      : undefined;

  const m1x2 = match.markets?.find((m) => m.id === 'mkt-1x2');
  const isSusp = Boolean(match.suspended || m1x2?.suspended);

  const selections: OddSelection[] = [
    {
      id: m1x2?.selections[0]?.id || `${match.id}-1x2-home`,
      matchId: match.id,
      matchTitle,
      competitionId: match.competitionId,
      competitionName: match.competitionName,
      sportId: match.sportId,
      marketId: 'mkt-1x2',
      marketName: match.sportId === 'soccer' ? 'Match result' : 'Match winner',
      label: match.homeTeam.name,
      shortLabel: match.homeTeam.shortName,
      odds: m1x2?.selections[0]?.odds ?? match.mainOdds.home,
      suspended: isSusp,
      isLive: match.isLive,
      scoreText,
      clockText: match.clock,
    },
    ...(match.sportId === 'soccer' && match.mainOdds.draw !== undefined
      ? [
          {
            id: m1x2?.selections[1]?.id || `${match.id}-1x2-draw`,
            matchId: match.id,
            matchTitle,
            competitionId: match.competitionId,
            competitionName: match.competitionName,
            sportId: match.sportId,
            marketId: 'mkt-1x2',
            marketName: 'Match result',
            label: 'Draw',
            shortLabel: 'Draw',
            odds: m1x2?.selections[1]?.odds ?? match.mainOdds.draw,
            suspended: isSusp,
            isLive: match.isLive,
            scoreText,
            clockText: match.clock,
          },
        ]
      : []),
    {
      id:
        m1x2?.selections[match.sportId === 'soccer' ? 2 : 1]?.id ||
        `${match.id}-1x2-away`,
      matchId: match.id,
      matchTitle,
      competitionId: match.competitionId,
      competitionName: match.competitionName,
      sportId: match.sportId,
      marketId: 'mkt-1x2',
      marketName: match.sportId === 'soccer' ? 'Match result' : 'Match winner',
      label: match.awayTeam.name,
      shortLabel: match.awayTeam.shortName,
      odds:
        m1x2?.selections[match.sportId === 'soccer' ? 2 : 1]?.odds ??
        match.mainOdds.away,
      suspended: isSusp,
      isLive: match.isLive,
      scoreText,
      clockText: match.clock,
    },
  ];

  return (
    <div
      className={`rounded-[13px] border p-3 transition-all flex flex-col justify-between gap-2.5 ${
        isPinned
          ? 'bg-[#0B1F2A] border-[#2CE5F6]/50 shadow-[0_0_20px_rgba(44,229,246,0.08)]'
          : 'bg-[#091821] hover:bg-[#0C1F2B] border-[#173544]'
      }`}
    >
      {/* Top Meta Bar: League + ★ + Live Clock + Pin to Dock */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <CompetitionFlag flagId={match.competitionId} className="w-4 h-4 shrink-0" />
          <SportIcon
            sport={match.sportId}
            className="w-3.5 h-3.5 text-[#2CE5F6] shrink-0"
          />
          <button
            type="button"
            onClick={() =>
              navigateTo('football', {
                sport: match.sportId,
                competition: match.competitionId,
              })
            }
            className="text-[11.5px] font-bold text-[#9AB7C4] hover:text-white truncate"
          >
            {match.competitionName}
          </button>
          <button
            type="button"
            onClick={() => toggleFollowCompetition(match.competitionId)}
            className="text-[#567786] hover:text-[#F5B82E] shrink-0"
            title="Follow competition"
          >
            <Star
              className={`w-3 h-3 ${
                isCompFollowed ? 'fill-[#F5B82E] text-[#F5B82E]' : ''
              }`}
            />
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {match.isLive ? (
            <span className="px-2 py-0.5 rounded-full bg-[#FF2E63]/15 border border-[#FF2E63]/35 text-[#FF5C85] text-[10.5px] font-extrabold tabular-nums flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E63] animate-pulse" />
              {match.clock || 'LIVE'}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-[#0E2430] text-[#B8D0DB] text-[10.5px] font-bold tabular-nums">
              {match.startsInMinutes && match.startsInMinutes <= 60
                ? `In ${match.startsInMinutes}m`
                : `${match.startDate} · ${match.startTime}`}
            </span>
          )}

          <button
            type="button"
            onClick={() => togglePinMatch(match.id)}
            title={isPinned ? 'Unpin from Multi-Match Dock' : 'Pin to Multi-Match Dock'}
            className={`h-6 px-2 rounded-[6px] border text-[10.5px] font-extrabold flex items-center gap-1 transition-colors ${
              isPinned
                ? 'bg-[#143D4F] border-[#2CE5F6] text-[#2CE5F6]'
                : 'bg-[#0D212C] hover:bg-[#133140] border-[#1A3B4B] text-[#8AA9B6] hover:text-white'
            }`}
          >
            <Pin className="w-3 h-3" />
            <span>{isPinned ? 'Docked' : 'Pin'}</span>
          </button>
        </div>
      </div>

      {/* Head-to-Head Arena Scoreline */}
      <div
        onClick={() => navigateTo('match', { matchId: match.id })}
        className="py-1 flex items-center justify-between gap-2 cursor-pointer group"
      >
        {/* Home */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <TeamCrest
            teamId={match.homeTeam.id}
            teamName={match.homeTeam.name}
            size="sm"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-extrabold text-white group-hover:text-[#2CE5F6] truncate">
                {isPhoneView ? match.homeTeam.shortName : match.homeTeam.name}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollowTeam(match.homeTeam.id);
                }}
                className="text-[#567786] hover:text-[#F5B82E] shrink-0"
              >
                <Star
                  className={`w-3 h-3 ${
                    isHomeFollowed ? 'fill-[#F5B82E] text-[#F5B82E]' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Center Score Pill */}
        <div className="px-3 py-1 rounded-[8px] bg-[#061118] border border-[#193A4A] text-[14px] font-black text-white tabular-nums shrink-0">
          {match.isLive &&
          match.homeTeam.score !== undefined &&
          match.awayTeam.score !== undefined
            ? `${match.homeTeam.score} – ${match.awayTeam.score}`
            : 'vs'}
        </div>

        {/* Away */}
        <div className="flex items-center justify-end gap-2 min-w-0 flex-1">
          <div className="min-w-0 text-right">
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollowTeam(match.awayTeam.id);
                }}
                className="text-[#567786] hover:text-[#F5B82E] shrink-0"
              >
                <Star
                  className={`w-3 h-3 ${
                    isAwayFollowed ? 'fill-[#F5B82E] text-[#F5B82E]' : ''
                  }`}
                />
              </button>
              <span className="text-[13px] font-extrabold text-white group-hover:text-[#2CE5F6] truncate">
                {isPhoneView ? match.awayTeam.shortName : match.awayTeam.name}
              </span>
            </div>
          </div>
          <TeamCrest
            teamId={match.awayTeam.id}
            teamName={match.awayTeam.name}
            size="sm"
          />
        </div>
      </div>

      {/* Bottom: 1X2 / Moneyline Pills + Markets Count */}
      <div className="flex items-center gap-1.5">
        <div
          className={`flex-1 grid ${
            selections.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
          } gap-1.5`}
        >
          {selections.map((s) => {
            const active = isSelected(s.id);
            const flash = oddsFlashMap[s.id];
            const isFlash = flash && Date.now() - flash.ts < 3200;

            if (s.suspended) {
              return (
                <div
                  key={s.id}
                  className="h-[38px] rounded-[8px] bg-[#061016] border border-[#1D3542] flex items-center justify-center gap-1 text-[11px] font-bold text-[#6A8896] select-none"
                >
                  <Lock className="w-3 h-3 text-[#F59E0B]" />
                  <span>Suspended</span>
                </div>
              );
            }

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSelection(s)}
                className={`h-[38px] px-2 rounded-[8px] border flex items-center justify-between gap-1 transition-all ${
                  active
                    ? 'bg-[#153F50] border-[#2CE5F6] text-white'
                    : isFlash && flash.dir === 'up'
                    ? 'bg-[#10B981]/15 border-[#10B981]/60 text-white'
                    : isFlash && flash.dir === 'down'
                    ? 'bg-[#F43F5E]/15 border-[#F43F5E]/60 text-white'
                    : 'bg-[#0D212C] hover:bg-[#133040] border-[#1A3B4B] text-[#E6F3F8]'
                }`}
              >
                <span className="text-[10.5px] font-bold text-[#8AA9B6] truncate">
                  {isPhoneView && selections.length === 3
                    ? s.label === 'Draw'
                      ? 'X'
                      : s.id.endsWith('-home')
                      ? '1'
                      : '2'
                    : s.shortLabel}
                </span>
                <span className="text-[12.5px] font-extrabold text-[#3AD4F7] tabular-nums flex items-center gap-0.5 shrink-0">
                  <span>{s.odds.toFixed(2)}</span>
                  {isFlash &&
                    (flash.dir === 'up' ? (
                      <TrendingUp className="w-2.5 h-2.5 text-[#34D399]" />
                    ) : (
                      <TrendingDown className="w-2.5 h-2.5 text-[#FB7185]" />
                    ))}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => navigateTo('match', { matchId: match.id })}
          className="h-[38px] px-2.5 rounded-[8px] bg-[#0C1E28] hover:bg-[#133242] border border-[#183746] text-[11px] font-extrabold text-[#9AB7C4] hover:text-[#2CE5F6] flex items-center gap-0.5 tabular-nums shrink-0 transition-colors"
          title="Open match markets"
        >
          <span>+{match.totalMarketsCount}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
