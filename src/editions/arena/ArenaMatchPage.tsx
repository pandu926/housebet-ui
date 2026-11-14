import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Lock,
  Pin,
  Search,
  Star,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { useSportsbook } from '../../context/SportsbookContext';
import {
  getMarketsForMatch,
  MarketGroupCategory,
  OddSelection,
} from '../../data/sportsbookData';
import {
  CompetitionFlag,
  SportIcon,
  TeamCrest,
  UsdtBadge,
} from '../../components/BrandIcons';
import { MultiMatchLiveDock } from './MultiMatchLiveDock';
import { CasinoLiveBetStream } from './CasinoLiveBetStream';

export const ArenaMatchPage: React.FC<{ isPhoneView?: boolean }> = ({
  isPhoneView = false,
}) => {
  const {
    matches,
    currentMatch,
    goBack,
    pinnedMatchIds,
    togglePinMatch,
    followedCompetitions,
    toggleFollowCompetition,
    followedTeams,
    toggleFollowTeam,
    isSelected,
    toggleSelection,
    oddsFlashMap,
    myBets,
    cashOutBet,
    navigateTo,
  } = useSportsbook();

  const [category, setCategory] = useState<MarketGroupCategory>('all');
  const [marketQuery, setMarketQuery] = useState<string>('');
  const [dualViewActive, setDualViewActive] = useState<boolean>(false);

  const allMarkets = useMemo(
    () => getMarketsForMatch(currentMatch),
    [currentMatch]
  );

  // Contextual Live Time-Window Spotlight Markets (Zero stats/xG — pure time-sensitive betting!)
  const liveWindowMarkets = useMemo(() => {
    if (!currentMatch.isLive) return [];
    return allMarkets
      .filter(
        (m) =>
          m.category.includes('minutes') ||
          m.id === 'mkt-next-goal' ||
          m.id === 'mkt-set-winner' ||
          m.id === 'mkt-period-1'
      )
      .slice(0, 2);
  }, [allMarkets, currentMatch.isLive]);

  const filteredMarkets = useMemo(() => {
    return allMarkets.filter((m) => {
      if (category !== 'all' && !m.category.includes(category)) return false;
      if (marketQuery.trim()) {
        const q = marketQuery.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.selections.some((s) => s.label.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [allMarkets, category, marketQuery]);

  // Secondary Pinned Match for Dual-Match Split View on Desktop
  const secondaryPinnedMatch = useMemo(() => {
    const otherId = pinnedMatchIds.find((id) => id !== currentMatch.id);
    if (!otherId) return null;
    return matches.find((m) => m.id === otherId) || null;
  }, [pinnedMatchIds, currentMatch.id, matches]);

  const secondaryMarkets = useMemo(
    () =>
      secondaryPinnedMatch
        ? getMarketsForMatch(secondaryPinnedMatch).slice(0, 4)
        : [],
    [secondaryPinnedMatch]
  );

  const openMatchBet = myBets.find(
    (b) => b.status === 'Open' && b.matchId === currentMatch.id
  );

  const isPinned = pinnedMatchIds.includes(currentMatch.id);
  const matchTitle = `${currentMatch.homeTeam.name} v ${currentMatch.awayTeam.name}`;
  const scoreText =
    currentMatch.homeTeam.score !== undefined &&
    currentMatch.awayTeam.score !== undefined
      ? `${currentMatch.homeTeam.score}–${currentMatch.awayTeam.score}`
      : undefined;

  const categories: Array<{ id: MarketGroupCategory; label: string }> =
    currentMatch.sportId === 'soccer'
      ? [
          { id: 'all', label: 'All' },
          { id: 'popular', label: 'Popular' },
          { id: 'goals', label: 'Goals' },
          { id: 'halves', label: 'Halves' },
          { id: 'handicaps', label: 'Handicaps' },
          { id: 'goalscorers', label: 'Goalscorers' },
          { id: 'corners-cards', label: 'Corners & cards' },
        ]
      : [
          { id: 'all', label: 'All' },
          { id: 'popular', label: 'Popular' },
          { id: 'handicaps', label: 'Spread / Handicap' },
          { id: 'goals', label: 'Totals' },
          { id: 'halves', label: 'Periods / Sets' },
          { id: 'players', label: 'Player Props' },
        ];

  const renderSelectionButton = (
    mktId: string,
    mktName: string,
    mktSuspended: boolean | undefined,
    s: {
      id: string;
      label: string;
      shortLabel?: string;
      sublabel?: string;
      odds: number;
      prevOdds?: number;
      direction?: 'up' | 'down' | null;
      suspended?: boolean;
    },
    targetMatch = currentMatch,
    useShortLabel = false
  ) => {
    const tTitle = `${targetMatch.homeTeam.name} v ${targetMatch.awayTeam.name}`;
    const tScore =
      targetMatch.homeTeam.score !== undefined &&
      targetMatch.awayTeam.score !== undefined
        ? `${targetMatch.homeTeam.score}–${targetMatch.awayTeam.score}`
        : undefined;

    const selObj: OddSelection = {
      id: s.id,
      matchId: targetMatch.id,
      matchTitle: tTitle,
      competitionId: targetMatch.competitionId,
      competitionName: targetMatch.competitionName,
      sportId: targetMatch.sportId,
      marketId: mktId,
      marketName: mktName,
      label: s.label,
      shortLabel: s.shortLabel || s.label,
      odds: s.odds,
      prevOdds: s.prevOdds,
      direction: s.direction,
      suspended: Boolean(targetMatch.suspended || mktSuspended || s.suspended),
      isLive: targetMatch.isLive,
      scoreText: tScore,
      clockText: targetMatch.clock,
    };

    const active = isSelected(s.id);
    const flash = oddsFlashMap[s.id];
    const isFlash = flash && Date.now() - flash.ts < 3200;

    if (selObj.suspended) {
      return (
        <div
          key={s.id}
          className="h-[42px] px-2.5 rounded-[9px] bg-[#061017] border border-[#1C3442]/70 flex items-center justify-between text-[#658492] select-none cursor-not-allowed"
        >
          <span className="text-[12px] font-semibold truncate pr-1">
            {useShortLabel && s.shortLabel ? s.shortLabel : s.label}
          </span>
          <Lock className="w-3.5 h-3.5 text-[#F59E0B]/80 shrink-0" />
        </div>
      );
    }

    return (
      <button
        key={s.id}
        type="button"
        onClick={() => toggleSelection(selObj)}
        className={`h-[42px] px-3 rounded-[9px] border flex items-center justify-between gap-2 transition-all text-left ${
          active
            ? 'bg-[#153F50] border-[#2CE5F6] text-white'
            : isFlash && flash.dir === 'up'
            ? 'bg-[#10B981]/15 border-[#10B981]/60 text-white'
            : isFlash && flash.dir === 'down'
            ? 'bg-[#F43F5E]/15 border-[#F43F5E]/60 text-white'
            : 'bg-[#0C202B] hover:bg-[#123040] border-[#193A4A] text-[#E6F3F8]'
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-bold truncate leading-tight">
            {useShortLabel && s.shortLabel ? s.shortLabel : s.label}
          </div>
          {s.sublabel && (
            <div className="text-[9.5px] text-[#7696A4] truncate leading-none mt-0.5">
              {s.sublabel}
            </div>
          )}
        </div>

        <span
          className={`text-[13px] font-extrabold tabular-nums shrink-0 flex items-center gap-0.5 ${
            active
              ? 'text-[#2CE5F6]'
              : isFlash && flash.dir === 'up'
              ? 'text-[#34D399]'
              : isFlash && flash.dir === 'down'
              ? 'text-[#FB7185]'
              : 'text-[#3AD4F7]'
          }`}
        >
          <span>{s.odds.toFixed(2)}</span>
          {isFlash &&
            (flash.dir === 'up' ? (
              <TrendingUp className="w-3 h-3 text-[#34D399]" />
            ) : (
              <TrendingDown className="w-3 h-3 text-[#FB7185]" />
            ))}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-3.5">
      {/* Persistent Multi-Match Live Dock with Dual-Match Split Toggle */}
      <MultiMatchLiveDock
        isPhoneView={isPhoneView}
        dualViewActive={dualViewActive}
        onToggleDualView={() => setDualViewActive((v) => !v)}
      />

      <div
        className={
          !isPhoneView && dualViewActive && secondaryPinnedMatch
            ? 'grid grid-cols-1 lg:grid-cols-12 gap-4 items-start'
            : 'space-y-3.5'
        }
      >
        {/* PRIMARY MATCH COLUMN */}
        <div
          className={
            !isPhoneView && dualViewActive && secondaryPinnedMatch
              ? 'lg:col-span-7 space-y-3.5'
              : 'space-y-3.5'
          }
        >
          {/* Arena Match Scoreboard */}
          <div className="rounded-[14px] bg-gradient-to-b from-[#0C222E] to-[#08161E] border border-[#1B3E4F] p-3.5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="h-7 px-2.5 rounded-[7px] bg-[#0D2330] hover:bg-[#143547] border border-[#1C3F50] text-[11.5px] font-bold text-[#DCEAF0] flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#9AB7C4]">
                  <CompetitionFlag
                    flagId={currentMatch.competitionId}
                    className="w-4 h-4"
                  />
                  <span>{currentMatch.competitionName}</span>
                  <button
                    type="button"
                    onClick={() =>
                      toggleFollowCompetition(currentMatch.competitionId)
                    }
                    className="text-[#5C7D8B] hover:text-[#F5B82E]"
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        followedCompetitions.includes(currentMatch.competitionId)
                          ? 'fill-[#F5B82E] text-[#F5B82E]'
                          : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {currentMatch.isLive ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF2E63]/15 border border-[#FF2E63]/40 text-[#FF5C85] text-[11.5px] font-extrabold tabular-nums flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E63] animate-pulse" />
                    <span>{currentMatch.clock}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#102936] text-[#B8D0DB] text-[11.5px] font-bold">
                    {currentMatch.startDate} · {currentMatch.startTime}
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => togglePinMatch(currentMatch.id)}
                  className={`h-7 px-2.5 rounded-[7px] border text-[11px] font-extrabold flex items-center gap-1 ${
                    isPinned
                      ? 'bg-[#143D4F] border-[#2CE5F6] text-[#2CE5F6]'
                      : 'bg-[#0D212C] border-[#1B3E4F] text-[#9AB7C4] hover:text-white'
                  }`}
                >
                  <Pin className="w-3 h-3" />
                  <span>{isPinned ? 'Docked' : 'Pin to Dock'}</span>
                </button>
              </div>
            </div>

            {/* Teams & Scoreline */}
            <div className="py-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <TeamCrest
                  teamId={currentMatch.homeTeam.id}
                  teamName={currentMatch.homeTeam.name}
                  size="md"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] sm:text-[17px] font-extrabold text-white truncate">
                      {isPhoneView
                        ? currentMatch.homeTeam.shortName
                        : currentMatch.homeTeam.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleFollowTeam(currentMatch.homeTeam.id)}
                      className="text-[#5C7D8B] hover:text-[#F5B82E]"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          followedTeams.includes(currentMatch.homeTeam.id)
                            ? 'fill-[#F5B82E] text-[#F5B82E]'
                            : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-4 py-1.5 rounded-[10px] bg-[#051017] border border-[#1B3E4F] text-[18px] sm:text-[22px] font-black text-white tabular-nums shrink-0">
                {currentMatch.isLive && scoreText ? scoreText : 'vs'}
              </div>

              <div className="flex items-center justify-end gap-2.5 min-w-0 flex-1">
                <div className="min-w-0 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleFollowTeam(currentMatch.awayTeam.id)}
                      className="text-[#5C7D8B] hover:text-[#F5B82E]"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          followedTeams.includes(currentMatch.awayTeam.id)
                            ? 'fill-[#F5B82E] text-[#F5B82E]'
                            : ''
                        }`}
                      />
                    </button>
                    <span className="text-[14px] sm:text-[17px] font-extrabold text-white truncate">
                      {isPhoneView
                        ? currentMatch.awayTeam.shortName
                        : currentMatch.awayTeam.name}
                    </span>
                  </div>
                </div>
                <TeamCrest
                  teamId={currentMatch.awayTeam.id}
                  teamName={currentMatch.awayTeam.name}
                  size="md"
                />
              </div>
            </div>

            {/* Contextual Open Ticket Cash Out Bar */}
            {openMatchBet && openMatchBet.cashOutOffer && (
              <div className="pt-2 border-t border-white/[0.07] flex items-center justify-between gap-2">
                <div className="text-[11.5px] text-[#B8D0DB] truncate">
                  Open Single: <strong className="text-white">{openMatchBet.selectionLabel}</strong> @{' '}
                  {openMatchBet.odds.toFixed(2)} (${openMatchBet.stake.toFixed(2)} stake)
                </div>
                <button
                  type="button"
                  onClick={() => cashOutBet(openMatchBet.id)}
                  className="h-7 px-3 rounded-[7px] bg-[#B9F6EC] hover:bg-[#9FEFE2] text-[#06181F] text-[11.5px] font-extrabold flex items-center gap-1 shrink-0"
                >
                  <UsdtBadge className="w-3.5 h-3.5" />
                  <span>Cash out ${openMatchBet.cashOutOffer.toFixed(2)}</span>
                </button>
              </div>
            )}
          </div>

          {/* Contextual Live Time-Window Spotlight ("Happening Now" Fast Markets) */}
          {liveWindowMarkets.length > 0 && (
            <div className="rounded-[13px] bg-gradient-to-r from-[#0D2938] to-[#091A24] border border-[#2CE5F6]/45 p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-[#2CE5F6] uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Happening Now · Live Time-Window Markets</span>
                </div>
                <span className="text-[10.5px] font-bold text-[#8CE9D8] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Clock {currentMatch.clock}</span>
                </span>
              </div>

              <div
                className={`grid grid-cols-1 ${
                  dualViewActive ? '' : 'md:grid-cols-2'
                } gap-2.5`}
              >
                {liveWindowMarkets.map((mkt) => (
                  <div
                    key={`spot-${mkt.id}`}
                    className="rounded-[10px] bg-[#07151E]/90 border border-[#1A3D4E] p-2.5 space-y-2"
                  >
                    <div className="text-[11.5px] font-extrabold text-white flex items-center justify-between">
                      <span>{mkt.name}</span>
                      {(currentMatch.suspended || mkt.suspended) && (
                        <span className="text-[10px] text-[#FBBF24] flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Suspended
                        </span>
                      )}
                    </div>
                    <div
                      className={`grid ${
                        mkt.layout === '3col' ? 'grid-cols-3' : 'grid-cols-2'
                      } gap-1.5`}
                    >
                      {mkt.selections.map((s) =>
                        renderSelectionButton(
                          mkt.id,
                          mkt.name,
                          mkt.suspended,
                          s,
                          currentMatch,
                          mkt.layout === '3col'
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Market Category Filter + Instant Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`h-8 px-3 rounded-[8px] text-[11.5px] font-extrabold shrink-0 transition-colors ${
                    category === cat.id
                      ? 'bg-[#143949] text-[#2CE5F6] border border-[#2CE5F6]/45'
                      : 'bg-[#091922] text-[#8AA7B4] hover:text-white border border-[#15313F]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div
              className={`h-8 px-2.5 rounded-[8px] bg-[#08161E] border border-[#173544] focus-within:border-[#2CE5F6] flex items-center gap-1.5 ${
                dualViewActive ? 'sm:w-[155px]' : 'sm:w-[210px]'
              } shrink-0`}
            >
              <Search className="w-3.5 h-3.5 text-[#6D8E9C]" />
              <input
                type="text"
                value={marketQuery}
                onChange={(e) => setMarketQuery(e.target.value)}
                placeholder="Search markets..."
                className="w-full bg-transparent text-[12px] text-white placeholder-[#688896] outline-none"
              />
              {marketQuery && (
                <button
                  type="button"
                  onClick={() => setMarketQuery('')}
                  className="text-[#6D8E9C] hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* All Match Market Cards */}
          <div className="space-y-2.5">
            {filteredMarkets.map((mkt) => {
              const isMktSuspended = Boolean(
                currentMatch.suspended || mkt.suspended
              );
              return (
                <div
                  key={mkt.id}
                  className="rounded-[12px] bg-[#08161E] border border-[#163443] overflow-hidden"
                >
                  <div className="px-3.5 py-2.5 bg-[#0B1D27] border-b border-[#15303E] flex items-center justify-between">
                    <span className="text-[13px] font-extrabold text-white">
                      {mkt.name}
                    </span>
                    {isMktSuspended && (
                      <span className="px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#FBBF24] text-[10.5px] font-extrabold flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Suspended</span>
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-2.5 grid ${
                      mkt.layout === '3col'
                        ? 'grid-cols-3'
                        : 'grid-cols-1 sm:grid-cols-2'
                    } gap-2`}
                  >
                    {mkt.selections.map((s) =>
                      renderSelectionButton(
                        mkt.id,
                        mkt.name,
                        mkt.suspended,
                        s,
                        currentMatch,
                        mkt.layout === '3col'
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECONDARY PINNED MATCH SPLIT TERMINAL (Desktop Dual-Match View) */}
        {!isPhoneView && dualViewActive && secondaryPinnedMatch && (
          <aside className="hidden lg:block lg:col-span-5 rounded-[14px] bg-[#081720] border border-[#2CE5F6]/45 p-3.5 sticky top-[68px] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#2CE5F6]">
                <SportIcon
                  sport={secondaryPinnedMatch.sportId}
                  className="w-3.5 h-3.5"
                />
                <span>Pinned Split Companion</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  navigateTo('match', { matchId: secondaryPinnedMatch.id })
                }
                className="text-[11px] font-bold text-[#9AB7C4] hover:text-white"
              >
                Make Primary →
              </button>
            </div>

            <div className="rounded-[10px] bg-[#051017] border border-[#193A4A] p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <TeamCrest
                  teamId={secondaryPinnedMatch.homeTeam.id}
                  teamName={secondaryPinnedMatch.homeTeam.name}
                  size="sm"
                />
                <span className="text-[13px] font-extrabold text-white truncate">
                  {secondaryPinnedMatch.homeTeam.shortName}
                </span>
              </div>
              <div className="text-center shrink-0">
                <div className="text-[15px] font-black text-[#B9F6EC] tabular-nums">
                  {secondaryPinnedMatch.isLive &&
                  secondaryPinnedMatch.homeTeam.score !== undefined &&
                  secondaryPinnedMatch.awayTeam.score !== undefined
                    ? `${secondaryPinnedMatch.homeTeam.score} – ${secondaryPinnedMatch.awayTeam.score}`
                    : 'vs'}
                </div>
                <div className="text-[10px] font-extrabold text-[#FF5C85]">
                  {secondaryPinnedMatch.clock || secondaryPinnedMatch.startTime}
                </div>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[13px] font-extrabold text-white truncate">
                  {secondaryPinnedMatch.awayTeam.shortName}
                </span>
                <TeamCrest
                  teamId={secondaryPinnedMatch.awayTeam.id}
                  teamName={secondaryPinnedMatch.awayTeam.name}
                  size="sm"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              {secondaryMarkets.map((mkt) => (
                <div
                  key={`sec-${mkt.id}`}
                  className="rounded-[10px] bg-[#091A24] border border-[#163443] p-2.5 space-y-1.5"
                >
                  <div className="text-[11.5px] font-extrabold text-white">
                    {mkt.name}
                  </div>
                  <div
                    className={`grid ${
                      mkt.layout === '3col' ? 'grid-cols-3' : 'grid-cols-2'
                    } gap-1.5`}
                  >
                    {mkt.selections
                      .slice(0, 4)
                      .map((s) =>
                        renderSelectionButton(
                          mkt.id,
                          mkt.name,
                          mkt.suspended,
                          s,
                          secondaryPinnedMatch,
                          true
                        )
                      )}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* Live USDT Singles Bet-Stream Footer */}
      <CasinoLiveBetStream
        isPhoneView={isPhoneView}
        matchIdFilter={currentMatch.id}
      />
    </div>
  );
};
