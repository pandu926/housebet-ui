import React from 'react';
import { Columns, Lock, Pin, Radio, X } from 'lucide-react';
import { useSportsbook } from '../../context/SportsbookContext';
import { MatchItem, OddSelection } from '../../data/sportsbookData';
import { SportIcon, TeamCrest } from '../../components/BrandIcons';

function buildMainSelections(match: MatchItem): OddSelection[] {
  const matchTitle = `${match.homeTeam.name} v ${match.awayTeam.name}`;
  const scoreText =
    match.homeTeam.score !== undefined && match.awayTeam.score !== undefined
      ? `${match.homeTeam.score}–${match.awayTeam.score}`
      : undefined;

  const m1x2 = match.markets?.find((m) => m.id === 'mkt-1x2');
  const susp = Boolean(match.suspended || m1x2?.suspended);

  const list: OddSelection[] = [
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
      suspended: susp,
      isLive: match.isLive,
      scoreText,
      clockText: match.clock,
    },
  ];

  if (match.sportId === 'soccer' && match.mainOdds.draw !== undefined) {
    list.push({
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
      suspended: susp,
      isLive: match.isLive,
      scoreText,
      clockText: match.clock,
    });
  }

  const awayIdx = match.sportId === 'soccer' ? 2 : 1;
  list.push({
    id: m1x2?.selections[awayIdx]?.id || `${match.id}-1x2-away`,
    matchId: match.id,
    matchTitle,
    competitionId: match.competitionId,
    competitionName: match.competitionName,
    sportId: match.sportId,
    marketId: 'mkt-1x2',
    marketName: match.sportId === 'soccer' ? 'Match result' : 'Match winner',
    label: match.awayTeam.name,
    shortLabel: match.awayTeam.shortName,
    odds: m1x2?.selections[awayIdx]?.odds ?? match.mainOdds.away,
    suspended: susp,
    isLive: match.isLive,
    scoreText,
    clockText: match.clock,
  });

  return list;
}

export const MultiMatchLiveDock: React.FC<{
  isPhoneView?: boolean;
  dualViewActive?: boolean;
  onToggleDualView?: () => void;
}> = ({ isPhoneView = false, dualViewActive = false, onToggleDualView }) => {
  const {
    matches,
    pinnedMatchIds,
    togglePinMatch,
    activePage,
    selectedMatchId,
    navigateTo,
    isSelected,
    toggleSelection,
    simulateNothingLive,
  } = useSportsbook();

  const pinnedMatches = pinnedMatchIds
    .map((id) => matches.find((m) => m.id === id))
    .filter((m): m is MatchItem => Boolean(m))
    .map((m) => (simulateNothingLive && m.isLive ? { ...m, isLive: false } : m));

  if (pinnedMatches.length === 0) {
    return (
      <div className="mb-3.5 rounded-[12px] bg-[#081720] border border-dashed border-[#1C3F50] px-3.5 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[12px] text-[#8AA9B6]">
          <Pin className="w-3.5 h-3.5 text-[#2CE5F6]" />
          <span>
            <strong className="text-white">Multi-Match Live Watch Dock</strong> —
            Click <strong>Pin</strong> on up to 3 matches to monitor live scores &amp; trade 1-tap singles side-by-side.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-[14px] bg-gradient-to-b from-[#0B1F2A] to-[#08161E] border border-[#1B3E4F] p-2.5 shadow-lg">
      {/* Dock Header */}
      <div className="flex items-center justify-between gap-2 px-1 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-[6px] bg-[#133848] border border-[#2CE5F6]/40 flex items-center justify-center text-[#2CE5F6]">
            <Radio className="w-3 h-3 animate-pulse" />
          </span>
          <span className="text-[11.5px] font-extrabold uppercase tracking-wider text-white">
            Multi-Match Live Dock
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#112F3D] text-[#2CE5F6] text-[10px] font-extrabold tabular-nums">
            {pinnedMatches.length}/3 Pinned
          </span>
        </div>

        {!isPhoneView && onToggleDualView && pinnedMatches.length >= 2 && (
          <button
            type="button"
            onClick={onToggleDualView}
            className={`h-7 px-2.5 rounded-[7px] border text-[11px] font-extrabold flex items-center gap-1.5 transition-colors ${
              dualViewActive
                ? 'bg-[#143D4F] border-[#2CE5F6] text-[#2CE5F6]'
                : 'bg-[#0C212C] border-[#1C3F50] text-[#B8D0DB] hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>
              {dualViewActive
                ? 'Dual-Match Split: ON'
                : 'Split Dual-Match View'}
            </span>
          </button>
        )}
      </div>

      {/* Pinned Match Mini-Terminals */}
      <div
        className={
          isPhoneView
            ? 'flex items-stretch gap-2 overflow-x-auto no-scrollbar pb-0.5'
            : 'grid grid-cols-1 md:grid-cols-3 gap-2.5'
        }
      >
        {pinnedMatches.map((match) => {
          const isCurrentMatch =
            activePage === 'match' && selectedMatchId === match.id;
          const sels = buildMainSelections(match);

          return (
            <div
              key={match.id}
              className={`${
                isPhoneView ? 'w-[258px] shrink-0' : ''
              } rounded-[11px] p-2.5 border transition-all flex flex-col justify-between gap-2 ${
                isCurrentMatch
                  ? 'bg-[#0F2A38] border-[#2CE5F6]/70 shadow-[0_0_16px_rgba(44,229,246,0.14)]'
                  : 'bg-[#07141C] hover:bg-[#0A1C26] border-[#163443]'
              }`}
            >
              {/* Top Meta + Unpin */}
              <div className="flex items-center justify-between gap-1.5">
                <button
                  type="button"
                  onClick={() => navigateTo('match', { matchId: match.id })}
                  className="flex items-center gap-1.5 min-w-0 text-left"
                >
                  <SportIcon
                    sport={match.sportId}
                    className="w-3.5 h-3.5 text-[#2CE5F6] shrink-0"
                  />
                  <span className="text-[10.5px] font-bold text-[#8AA9B6] truncate">
                    {match.competitionName}
                  </span>
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  {match.isLive ? (
                    <span className="px-1.5 py-0.5 rounded bg-[#FF2E63]/15 text-[#FF5C85] text-[10px] font-extrabold tabular-nums flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E63] animate-pulse" />
                      {match.clock}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#7F9EAC]">
                      {match.startTime}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => togglePinMatch(match.id)}
                    className="w-5 h-5 rounded hover:bg-white/[0.08] flex items-center justify-center text-[#6D8E9C] hover:text-white"
                    title="Unpin from Live Dock"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Compact Scoreline */}
              <button
                type="button"
                onClick={() => navigateTo('match', { matchId: match.id })}
                className="w-full flex items-center justify-between gap-2 text-left group"
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <TeamCrest
                    teamId={match.homeTeam.id}
                    teamName={match.homeTeam.name}
                    size="xs"
                  />
                  <span className="text-[12px] font-extrabold text-white group-hover:text-[#2CE5F6] truncate">
                    {match.homeTeam.shortName}
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded bg-[#050E14] border border-[#173544] text-[12px] font-black text-[#B9F6EC] tabular-nums shrink-0">
                  {match.isLive &&
                  match.homeTeam.score !== undefined &&
                  match.awayTeam.score !== undefined
                    ? `${match.homeTeam.score} – ${match.awayTeam.score}`
                    : 'vs'}
                </span>

                <div className="flex items-center justify-end gap-1.5 min-w-0 flex-1">
                  <span className="text-[12px] font-extrabold text-white group-hover:text-[#2CE5F6] truncate">
                    {match.awayTeam.shortName}
                  </span>
                  <TeamCrest
                    teamId={match.awayTeam.id}
                    teamName={match.awayTeam.name}
                    size="xs"
                  />
                </div>
              </button>

              {/* 1-Click Dock Odds Strip */}
              <div
                className={`grid ${
                  sels.length === 3 ? 'grid-cols-3' : 'grid-cols-2'
                } gap-1`}
              >
                {sels.map((s, idx) => {
                  const selected = isSelected(s.id);
                  const shortTag =
                    sels.length === 3
                      ? idx === 0
                        ? '1'
                        : idx === 1
                        ? 'X'
                        : '2'
                      : idx === 0
                      ? '1'
                      : '2';

                  if (s.suspended) {
                    return (
                      <div
                        key={s.id}
                        className="h-[30px] rounded-[6px] bg-[#061016] border border-[#1D3542] flex items-center justify-center gap-1 text-[10px] font-bold text-[#6A8896]"
                      >
                        <Lock className="w-3 h-3 text-[#F59E0B]" />
                        <span>Susp</span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSelection(s)}
                      className={`h-[30px] px-2 rounded-[6px] border flex items-center justify-between text-[11px] font-extrabold tabular-nums transition-colors ${
                        selected
                          ? 'bg-[#153F50] border-[#2CE5F6] text-white'
                          : 'bg-[#0C202B] hover:bg-[#123040] border-[#1A3B4B] text-[#DCEAF0]'
                      }`}
                    >
                      <span className="text-[10px] text-[#7898A6]">
                        {shortTag}
                      </span>
                      <span className="text-[#3AD4F7]">{s.odds.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
