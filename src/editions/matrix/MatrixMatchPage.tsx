import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Lock,
  RefreshCw,
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
  TeamCrest,
  UsdtBadge,
} from '../../components/BrandIcons';
import { FlashStakeToolbar } from './FlashStakeToolbar';

export const MatrixMatchPage: React.FC<{ isPhoneView?: boolean }> = ({
  isPhoneView = false,
}) => {
  const {
    currentMatch,
    goBack,
    followedCompetitions,
    toggleFollowCompetition,
    followedTeams,
    toggleFollowTeam,
    isSelected,
    toggleSelection,
    selectMatrixOdd,
    oddsFlashMap,
    showImpliedProb,
    myBets,
    cashOutBet,
    matrixExecMode,
    inlineTicketMatchId,
    inlineTicketSelectionId,
    closeInlineTicket,
    slipItems,
    updateStake,
    acceptAllOddsChanges,
    placeInstantSingle,
    betPlacementState,
    betErrorReason,
    lastPlacedBets,
    resetBetPlacementState,
    navigateTo,
  } = useSportsbook();

  const [category, setCategory] = useState<MarketGroupCategory>('all');
  const [marketQuery, setMarketQuery] = useState<string>('');

  const allMarkets = useMemo(
    () => getMarketsForMatch(currentMatch),
    [currentMatch]
  );

  const filteredMarkets = useMemo(() => {
    return allMarkets.filter((m) => {
      if (category !== 'all' && !m.category.includes(category)) return false;
      if (marketQuery.trim()) {
        const q = marketQuery.toLowerCase();
        const inTitle = m.name.toLowerCase().includes(q);
        const inSel = m.selections.some((s) =>
          s.label.toLowerCase().includes(q)
        );
        return inTitle || inSel;
      }
      return true;
    });
  }, [allMarkets, category, marketQuery]);

  const categories: Array<{ id: MarketGroupCategory; label: string }> =
    currentMatch.sportId === 'soccer'
      ? [
          { id: 'all', label: 'All Markets' },
          { id: 'popular', label: 'Popular' },
          { id: 'goals', label: 'Goals' },
          { id: 'halves', label: 'Halves' },
          { id: 'handicaps', label: 'Handicaps' },
          { id: 'goalscorers', label: 'Goalscorers' },
          { id: 'corners-cards', label: 'Corners & cards' },
        ]
      : [
          { id: 'all', label: 'All Markets' },
          { id: 'popular', label: 'Popular' },
          { id: 'handicaps', label: 'Spread / Handicap' },
          { id: 'goals', label: 'Totals' },
          { id: 'halves', label: 'Periods / Sets' },
          { id: 'players', label: 'Player Props' },
        ];

  const openMatchBet = myBets.find(
    (b) => b.status === 'Open' && b.matchId === currentMatch.id
  );

  const matchTitle = `${currentMatch.homeTeam.name} v ${currentMatch.awayTeam.name}`;
  const scoreText =
    currentMatch.homeTeam.score !== undefined &&
    currentMatch.awayTeam.score !== undefined
      ? `${currentMatch.homeTeam.score}–${currentMatch.awayTeam.score}`
      : undefined;

  const activeInlineItem =
    !isPhoneView &&
    matrixExecMode === 'inline' &&
    inlineTicketMatchId === currentMatch.id &&
    inlineTicketSelectionId
      ? slipItems.find((i) => i.selection.id === inlineTicketSelectionId)
      : undefined;

  const justPlacedHere =
    !isPhoneView &&
    matrixExecMode === 'inline' &&
    inlineTicketMatchId === currentMatch.id &&
    betPlacementState === 'placed' &&
    lastPlacedBets[0]?.matchId === currentMatch.id
      ? lastPlacedBets[0]
      : undefined;

  const stakeNumeric = activeInlineItem
    ? parseFloat(activeInlineItem.stake || '0') || 0
    : 0;

  return (
    <div className="space-y-3">
      <FlashStakeToolbar isPhoneView={isPhoneView} />

      {/* Ultra-Compact Single-Band Institutional Match Scoreboard */}
      <div className="rounded-[12px] bg-[#081720] border border-[#193A4A] px-3.5 py-2.5 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Left: Back + League */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goBack}
              className="h-7 px-2 rounded-[7px] bg-[#0D2330] hover:bg-[#143547] border border-[#1B3E4F] text-[11.5px] font-bold text-[#DCEAF0] flex items-center gap-1 transition-colors"
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

          {/* Right: Live Clock Badge + Open Position Instant Cash Out */}
          <div className="flex items-center gap-2">
            {currentMatch.suspended && (
              <span className="px-2 py-0.5 rounded bg-[#F59E0B]/20 border border-[#F59E0B]/50 text-[#FBBF24] text-[10.5px] font-extrabold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Suspended Markets</span>
              </span>
            )}
            {currentMatch.isLive ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF2E63]/15 border border-[#FF2E63]/40 text-[#FF5C85] text-[11.5px] font-extrabold tabular-nums flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E63] animate-pulse" />
                <span>LIVE · {currentMatch.clock}</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-[#112B38] text-[#B8D0DB] text-[11.5px] font-bold">
                {currentMatch.startDate} · {currentMatch.startTime}
              </span>
            )}

            {openMatchBet && openMatchBet.cashOutOffer && (
              <button
                type="button"
                onClick={() => cashOutBet(openMatchBet.id)}
                className="h-7 px-2.5 rounded-[7px] bg-[#B9F6EC] hover:bg-[#9FEFE2] text-[#06181F] text-[11px] font-extrabold flex items-center gap-1 transition-colors"
              >
                <UsdtBadge className="w-3.5 h-3.5" />
                <span>Cash out ${openMatchBet.cashOutOffer.toFixed(2)}</span>
              </button>
            )}
          </div>
        </div>

        {/* Scoreboard Strip */}
        <div className="pt-1.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <TeamCrest
              teamId={currentMatch.homeTeam.id}
              teamName={currentMatch.homeTeam.name}
              size="md"
            />
            <span className="text-[14px] sm:text-[16px] font-extrabold text-white truncate">
              {isPhoneView
                ? currentMatch.homeTeam.shortName
                : currentMatch.homeTeam.name}
            </span>
            <button
              type="button"
              onClick={() => toggleFollowTeam(currentMatch.homeTeam.id)}
              className="text-[#5C7D8B] hover:text-[#F5B82E] shrink-0"
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

          <div className="px-3.5 py-1 rounded-[9px] bg-[#051017] border border-[#193A4A] text-[17px] sm:text-[20px] font-black text-white tabular-nums tracking-tight shrink-0">
            {currentMatch.isLive &&
            currentMatch.homeTeam.score !== undefined &&
            currentMatch.awayTeam.score !== undefined
              ? `${currentMatch.homeTeam.score} – ${currentMatch.awayTeam.score}`
              : 'vs'}
          </div>

          <div className="flex items-center justify-end gap-2 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => toggleFollowTeam(currentMatch.awayTeam.id)}
              className="text-[#5C7D8B] hover:text-[#F5B82E] shrink-0"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  followedTeams.includes(currentMatch.awayTeam.id)
                    ? 'fill-[#F5B82E] text-[#F5B82E]'
                    : ''
                }`}
              />
            </button>
            <span className="text-[14px] sm:text-[16px] font-extrabold text-white truncate text-right">
              {isPhoneView
                ? currentMatch.awayTeam.shortName
                : currentMatch.awayTeam.name}
            </span>
            <TeamCrest
              teamId={currentMatch.awayTeam.id}
              teamName={currentMatch.awayTeam.name}
              size="md"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs + Instant Market Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`h-8 px-2.5 rounded-[8px] text-[11.5px] font-extrabold shrink-0 transition-colors ${
                category === cat.id
                  ? 'bg-[#143949] text-[#2CE5F6] border border-[#2CE5F6]/45'
                  : 'bg-[#091922] text-[#8AA7B4] hover:text-white border border-[#15313F]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="h-8 px-2.5 rounded-[8px] bg-[#08161E] border border-[#173544] focus-within:border-[#2CE5F6] flex items-center gap-1.5 sm:w-[220px] shrink-0">
          <Search className="w-3.5 h-3.5 text-[#6D8E9C] shrink-0" />
          <input
            type="text"
            value={marketQuery}
            onChange={(e) => setMarketQuery(e.target.value)}
            placeholder="Filter match markets..."
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

      {/* Sticky Inline Flash-Single Ticket Bar on Desktop Match Page */}
      {justPlacedHere && (
        <div className="px-3.5 py-2.5 rounded-[10px] bg-[#0D2E2A] border border-[#10B981]/50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[12px] font-bold text-[#B9F6EC]">
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <span>
              Single Placed: <strong>${justPlacedHere.stake.toFixed(2)} USDT</strong> on{' '}
              <strong>{justPlacedHere.selectionLabel}</strong> @{' '}
              <strong>{justPlacedHere.odds.toFixed(2)}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                resetBetPlacementState();
                closeInlineTicket();
                navigateTo('mybets');
              }}
              className="h-7 px-2.5 rounded-[7px] bg-[#14433D] text-[11.5px] font-extrabold text-[#B9F6EC]"
            >
              View in My Bets
            </button>
            <button
              type="button"
              onClick={() => {
                resetBetPlacementState();
                closeInlineTicket();
              }}
              className="text-[#8BC7BC] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {activeInlineItem && (
        <div className="sticky top-[62px] z-20 px-3.5 py-2.5 rounded-[10px] bg-[#0B222E]/95 backdrop-blur-md border border-[#2CE5F6]/55 shadow-xl space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-[#143D4F] text-[#2CE5F6] text-[10px] font-extrabold uppercase flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Flash Single
              </span>
              <span className="text-[12px] text-[#8AA9B6] font-semibold">
                {activeInlineItem.selection.marketName}:
              </span>
              <span className="text-[13px] font-extrabold text-white">
                {activeInlineItem.selection.label}
              </span>
              <span className="text-[13px] font-extrabold text-[#2CE5F6] tabular-nums">
                @ {activeInlineItem.currentOdds.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="h-8 px-2.5 rounded-[8px] bg-[#061218] border border-[#1D4050] flex items-center gap-1.5 w-[112px]">
                <UsdtBadge className="w-3.5 h-3.5" />
                <input
                  type="text"
                  inputMode="decimal"
                  value={activeInlineItem.stake}
                  onChange={(e) =>
                    updateStake(activeInlineItem.selection.id, e.target.value)
                  }
                  className="w-full bg-transparent text-[12.5px] font-extrabold text-white outline-none tabular-nums"
                />
              </div>

              <span className="text-[12px] font-extrabold text-[#B9F6EC] tabular-nums">
                Return ${(stakeNumeric * activeInlineItem.currentOdds).toFixed(2)}
              </span>

              {activeInlineItem.suspended ? (
                <span className="h-8 px-3 rounded-[8px] bg-[#F59E0B]/20 text-[#FBBF24] text-[11.5px] font-extrabold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Suspended</span>
                </span>
              ) : activeInlineItem.oddsChanged ? (
                <button
                  type="button"
                  onClick={acceptAllOddsChanges}
                  className="h-8 px-3 rounded-[8px] bg-[#2CE5F6] text-[#06181F] text-[12px] font-extrabold"
                >
                  Accept {activeInlineItem.currentOdds.toFixed(2)}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    placeInstantSingle(activeInlineItem.selection.id)
                  }
                  className="h-8 px-3.5 rounded-[8px] bg-[#B9F6EC] hover:bg-[#9FEFE2] text-[#06181F] text-[12px] font-extrabold"
                >
                  Place ${stakeNumeric.toFixed(2)} Single
                </button>
              )}

              <button
                type="button"
                onClick={closeInlineTicket}
                className="p-1 text-[#7898A6] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {betPlacementState === 'failed' && betErrorReason && (
            <div className="pt-1 border-t border-[#EF4444]/30 flex items-center justify-between text-[11.5px] text-[#FCA5A5]">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F87171]" />
                <span>{betErrorReason}</span>
              </span>
              <button
                type="button"
                onClick={() => placeInstantSingle(activeInlineItem.selection.id)}
                className="h-6 px-2.5 rounded bg-[#EF4444]/30 text-white font-extrabold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2-Column High-Density Order-Book Market Grid */}
      <div
        className={
          isPhoneView
            ? 'space-y-2.5'
            : 'grid grid-cols-1 lg:grid-cols-2 gap-3 items-start'
        }
      >
        {filteredMarkets.map((mkt) => {
          const isMktSuspended = Boolean(currentMatch.suspended || mkt.suspended);
          const colClass =
            mkt.layout === '3col' ? 'grid-cols-3' : 'grid-cols-2';

          return (
            <div
              key={mkt.id}
              className="rounded-[11px] bg-[#08161E] border border-[#163342] overflow-hidden"
            >
              <div className="px-3 py-2 bg-[#0B1D27] border-b border-[#15303E] flex items-center justify-between gap-2">
                <span className="text-[12.5px] font-extrabold text-white">
                  {mkt.name}
                </span>
                {isMktSuspended && (
                  <span className="px-1.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#FBBF24] text-[10px] font-extrabold flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Suspended</span>
                  </span>
                )}
              </div>

              <div className={`p-2 grid ${colClass} gap-1.5`}>
                {mkt.selections.map((s) => {
                  const selObj: OddSelection = {
                    id: s.id,
                    matchId: currentMatch.id,
                    matchTitle,
                    competitionId: currentMatch.competitionId,
                    competitionName: currentMatch.competitionName,
                    sportId: currentMatch.sportId,
                    marketId: mkt.id,
                    marketName: mkt.name,
                    label: s.label,
                    shortLabel: s.shortLabel || s.label,
                    odds: s.odds,
                    prevOdds: s.prevOdds,
                    direction: s.direction,
                    suspended: Boolean(isMktSuspended || s.suspended),
                    isLive: currentMatch.isLive,
                    scoreText,
                    clockText: currentMatch.clock,
                  };

                  const active = isSelected(s.id);
                  const flash = oddsFlashMap[s.id];
                  const isFlash = flash && Date.now() - flash.ts < 3200;
                  const impliedPct = Math.round((1 / s.odds) * 100);

                  if (selObj.suspended) {
                    return (
                      <div
                        key={s.id}
                        className="h-[40px] px-2.5 rounded-[8px] bg-[#061118] border border-[#1B3340]/60 flex items-center justify-between text-[#638290] cursor-not-allowed select-none"
                      >
                        <span className="text-[11.5px] font-semibold truncate pr-1">
                          {s.shortLabel || s.label}
                        </span>
                        <Lock className="w-3.5 h-3.5 text-[#F59E0B]/80 shrink-0" />
                      </div>
                    );
                  }

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        isPhoneView
                          ? toggleSelection(selObj)
                          : selectMatrixOdd(selObj)
                      }
                      className={`h-[40px] px-2.5 rounded-[8px] border flex items-center justify-between gap-1.5 transition-all text-left ${
                        active
                          ? 'bg-[#143D4F] border-[#2CE5F6] text-white'
                          : isFlash && flash.dir === 'up'
                          ? 'bg-[#10B981]/15 border-[#10B981]/60 text-white'
                          : isFlash && flash.dir === 'down'
                          ? 'bg-[#F43F5E]/15 border-[#F43F5E]/60 text-white'
                          : 'bg-[#0C1F29] hover:bg-[#122D3B] border-[#193847] text-[#E6F3F8]'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-[11.5px] font-bold truncate leading-tight">
                          {mkt.layout === '3col' && s.shortLabel
                            ? s.shortLabel
                            : s.label}
                        </div>
                        {s.sublabel && (
                          <div className="text-[9.5px] text-[#7293A1] truncate leading-none mt-0.5">
                            {s.sublabel}
                          </div>
                        )}
                      </div>

                      <span
                        className={`text-[12.5px] font-extrabold tabular-nums shrink-0 flex items-center gap-0.5 ${
                          active
                            ? 'text-[#2CE5F6]'
                            : isFlash && flash.dir === 'up'
                            ? 'text-[#34D399]'
                            : isFlash && flash.dir === 'down'
                            ? 'text-[#FB7185]'
                            : 'text-[#3AD4F7]'
                        }`}
                      >
                        <span>
                          {showImpliedProb ? `${impliedPct}%` : s.odds.toFixed(2)}
                        </span>
                        {isFlash &&
                          (flash.dir === 'up' ? (
                            <TrendingUp className="w-3 h-3 text-[#34D399]" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-[#FB7185]" />
                          ))}
                      </span>
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
