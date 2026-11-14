import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Flame,
  Lock,
  Pin,
  Search,
  Star,
  Users,
  X,
} from 'lucide-react';
import { useSportsbook } from '../context/SportsbookContext';
import {
  COMPETITIONS,
  getMarketsForMatch,
  MarketGroup,
  MarketGroupCategory,
  OddSelection,
} from '../data/sportsbookData';
import {
  CompetitionFlag,
  TeamCrest,
  UsdtBadge,
} from '../components/BrandIcons';
import { OddsButton } from '../components/OddsButton';
import {
  getClubColor,
  OddsPriceTerminalChart,
} from '../components/OddsSparkline';

export const MatchPage: React.FC<{ isPhoneView?: boolean }> = ({
  isPhoneView = false,
}) => {
  const {
    currentMatch,
    matches,
    navigateTo,
    goBack,
    followedTeams,
    toggleFollowTeam,
    isSidePanelOpen,
    myBets,
    cashOutBet,
    communityBets,
    copyCommunityBet,
    isSelected,
  } = useSportsbook();

  const [activeCategory, setActiveCategory] =
    useState<MarketGroupCategory>('popular');
  const [marketSearch, setMarketSearch] = useState<string>('');
  const [collapsedIds, setCollapsedIds] = useState<Record<string, boolean>>({});
  const [pinnedMarketIds, setPinnedMarketIds] = useState<string[]>([]);
  const [showMobileChart, setShowMobileChart] = useState<boolean>(false);
  const [showMatchDropdown, setShowMatchDropdown] = useState<boolean>(false);
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveCategory('popular');
    setMarketSearch('');
  }, [currentMatch.id]);

  const toggleCollapse = (mktId: string) => {
    setCollapsedIds((prev) => ({ ...prev, [mktId]: !prev[mktId] }));
  };

  const togglePinMarket = (mktId: string) => {
    setPinnedMarketIds((prev) =>
      prev.includes(mktId)
        ? prev.filter((id) => id !== mktId)
        : [...prev, mktId]
    );
  };

  const rawMarkets: MarketGroup[] = getMarketsForMatch(currentMatch);

  const countCat = (cat: MarketGroupCategory) =>
    cat === 'all'
      ? rawMarkets.length
      : rawMarkets.filter((m) => m.category.includes(cat)).length;

  const categoryTabs: {
    id: MarketGroupCategory;
    label: string;
    count: number;
  }[] =
    currentMatch.id === 'ars-bha'
      ? [
          { id: 'popular', label: 'Popular', count: 10 },
          { id: 'goalscorers', label: 'Goalscorers', count: 9 },
          { id: 'goals', label: 'Goals', count: 11 },
          { id: 'players', label: 'Players', count: 11 },
          { id: 'halves', label: 'Halves', count: 8 },
          { id: 'handicaps', label: 'Handicaps', count: 5 },
          { id: 'corners-cards', label: 'Corners & cards', count: 14 },
          { id: 'minutes', label: 'Minutes', count: 10 },
          { id: 'specials', label: 'Specials', count: 7 },
          { id: 'all', label: 'All markets', count: 85 },
        ]
      : currentMatch.sportId === 'soccer'
      ? [
          { id: 'popular', label: 'Popular', count: countCat('popular') },
          { id: 'goalscorers', label: 'Goalscorers', count: countCat('goalscorers') },
          { id: 'goals', label: 'Goals', count: countCat('goals') },
          { id: 'players', label: 'Players', count: countCat('players') },
          { id: 'halves', label: 'Halves', count: countCat('halves') },
          { id: 'handicaps', label: 'Handicaps', count: countCat('handicaps') },
          {
            id: 'corners-cards',
            label: 'Corners & cards',
            count: countCat('corners-cards'),
          },
          { id: 'minutes', label: 'Minutes', count: countCat('minutes') },
          { id: 'specials', label: 'Specials', count: countCat('specials') },
          { id: 'all', label: 'All markets', count: countCat('all') },
        ]
      : currentMatch.sportId === 'tennis'
      ? [
          { id: 'popular', label: 'Popular', count: countCat('popular') },
          { id: 'halves', label: 'Sets', count: countCat('halves') },
          { id: 'goals', label: 'Games', count: countCat('goals') },
          { id: 'handicaps', label: 'Handicaps', count: countCat('handicaps') },
          { id: 'players', label: 'Player props', count: countCat('players') },
          { id: 'specials', label: 'Specials', count: countCat('specials') },
          { id: 'all', label: 'All markets', count: countCat('all') },
        ]
      : [
          { id: 'popular', label: 'Popular', count: countCat('popular') },
          { id: 'handicaps', label: 'Spreads', count: countCat('handicaps') },
          { id: 'goals', label: 'Totals', count: countCat('goals') },
          { id: 'players', label: 'Player props', count: countCat('players') },
          { id: 'halves', label: 'Halves & Qtrs', count: countCat('halves') },
          { id: 'specials', label: 'Specials', count: countCat('specials') },
          { id: 'all', label: 'All markets', count: countCat('all') },
        ];

  const q = marketSearch.trim().toLowerCase();

  const visibleMarkets = rawMarkets
    .filter((mkt) => {
      const matchesCategory =
        activeCategory === 'all' || mkt.category.includes(activeCategory);
      if (!matchesCategory && !q) return false;
      if (!q) return true;
      return (
        mkt.name.toLowerCase().includes(q) ||
        mkt.selections.some((s) => s.label.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      const aPin = pinnedMarketIds.includes(a.id) ? 1 : 0;
      const bPin = pinnedMarketIds.includes(b.id) ? 1 : 0;
      return bPin - aPin;
    });

  const isHomeFollowed = followedTeams.includes(currentMatch.homeTeam.id);
  const isAwayFollowed = followedTeams.includes(currentMatch.awayTeam.id);

  const shortMatchCode =
    currentMatch.id === 'ars-bha'
      ? 'ARS - BHA'
      : `${currentMatch.homeTeam.shortName
          .slice(0, 3)
          .toUpperCase()} - ${currentMatch.awayTeam.shortName
          .slice(0, 3)
          .toUpperCase()}`;

  const matchTitle = `${currentMatch.homeTeam.name} v ${currentMatch.awayTeam.name}`;
  const scoreText =
    currentMatch.homeTeam.score !== undefined &&
    currentMatch.awayTeam.score !== undefined
      ? `${currentMatch.homeTeam.score}–${currentMatch.awayTeam.score}`
      : undefined;

  const activeMatchBets = myBets.filter(
    (b) => b.status === 'Open' && b.matchId === currentMatch.id
  );

  // Strictly scope player singles & match switcher to the current sport (zero soccer leak into other sports!)
  const matchCommunityPicks = communityBets.filter(
    (cb) => cb.selection.matchId === currentMatch.id
  );
  const sportCommunityPicks = communityBets.filter(
    (cb) => cb.selection.sportId === currentMatch.sportId
  );
  const displayPicks =
    matchCommunityPicks.length > 0 ? matchCommunityPicks : sportCommunityPicks;

  const sameSportMatches = matches.filter(
    (m) => m.sportId === currentMatch.sportId
  );
  const quickLiveMatches = matches
    .filter((m) => m.isLive && m.sportId === currentMatch.sportId)
    .slice(0, 5);
  const homeColor = getClubColor(currentMatch.homeTeam.id);
  const awayColor = getClubColor(currentMatch.awayTeam.id);

  return (
    <div className={isPhoneView ? 'space-y-2.5 pb-10' : 'space-y-4 pb-10'}>
      {/* 1. TOP QUICK-JUMP RIBBON: Back + Match Switcher + Live Strip */}
      <div className="flex items-center justify-between gap-2 relative">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goBack}
            className="w-9 h-9 rounded-[10px] bg-[#0A1C24] hover:bg-[#112A36] border border-white/[0.08] flex items-center justify-center text-[#C8DCE4] hover:text-white transition-colors shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center h-9 rounded-[10px] bg-[#0A1C24] border border-white/[0.08] px-2.5 text-[12px] gap-1.5">
            {!isPhoneView && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      currentMatch.sportId === 'soccer' ? 'football' : 'live',
                      { competition: currentMatch.competitionId }
                    )
                  }
                  className="flex items-center gap-1.5 text-[#9AB6C3] hover:text-white font-semibold"
                >
                  <CompetitionFlag
                    flagId={currentMatch.competitionId}
                    className="w-3.5 h-3.5"
                  />
                  <span>{currentMatch.competitionName}</span>
                </button>
                <span className="text-[#2B5264]">/</span>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowMatchDropdown((v) => !v)}
              className="flex items-center gap-1 text-white font-extrabold hover:text-[#2CE5F6]"
            >
              <span>{shortMatchCode}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7896A3]" />
            </button>
          </div>

          {showMatchDropdown && (
            <div className="absolute left-11 top-11 z-40 w-72 rounded-[13px] bg-[#091A22] border border-[#244E61] shadow-2xl p-2 space-y-1 max-h-72 overflow-y-auto">
              <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#6E8E9B] px-2 py-1">
                Switch Match Desk
              </div>
              {sameSportMatches.slice(0, 10).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setShowMatchDropdown(false);
                    navigateTo('match', { matchId: m.id });
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[8px] text-[12px] text-left transition-colors ${
                    m.id === currentMatch.id
                      ? 'bg-[#143746] text-[#2CE5F6] font-bold'
                      : 'text-[#DCEAF0] hover:bg-[#0F2631]'
                  }`}
                >
                  <span className="truncate pr-2">
                    {m.homeTeam.shortName} v {m.awayTeam.shortName}
                  </span>
                  {m.isLive ? (
                    <span className="text-[10.5px] font-extrabold text-[#FF5C85] shrink-0">
                      {m.homeTeam.score}–{m.awayTeam.score} · {m.clock}
                    </span>
                  ) : (
                    <span className="text-[10.5px] text-[#7896A3] shrink-0">
                      {m.startTime}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 1-Click Live Match Switcher Strip (Desktop) */}
        {!isPhoneView && quickLiveMatches.length > 1 && (
          <div className="hidden md:flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickLiveMatches.map((lm) => {
              const isCurrent = lm.id === currentMatch.id;
              return (
                <button
                  key={lm.id}
                  type="button"
                  onClick={() => navigateTo('match', { matchId: lm.id })}
                  className={`h-8 px-2.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 shrink-0 transition-all border ${
                    isCurrent
                      ? 'bg-[#123342] border-[#2CE5F6]/60 text-white'
                      : 'bg-[#091921] border-white/[0.06] text-[#8CA8B5] hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E63]" />
                  <TeamCrest teamId={lm.homeTeam.id} size="xs" />
                  <span className="text-white font-extrabold tabular-nums">
                    {lm.homeTeam.score ?? 0}–{lm.awayTeam.score ?? 0}
                  </span>
                  <TeamCrest teamId={lm.awayTeam.id} size="xs" />
                  <span className="text-[10px] text-[#6E8E9B]">{lm.clock}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. SPLIT TRADING DESK ARCHITECTURE (Left Sticky Arena & Price Chart | Right Fluid Market Matrix) */}
      <div
        className={
          isPhoneView
            ? 'space-y-2.5'
            : 'grid grid-cols-1 lg:grid-cols-12 gap-4 items-start'
        }
      >
        {/* LEFT COLUMN (5 Cols on Desktop): Apple Sports Arena + Polymarket Odds Curve + Active Position Ticket */}
        <div
          className={
            isPhoneView
              ? 'space-y-2.5'
              : 'lg:col-span-5 lg:sticky lg:top-[68px] space-y-3.5'
          }
        >
          {/* A. APPLE SPORTS COLOR-BLEED BROADCAST SCOREBOARD */}
          <div
            className={`rounded-[18px] bg-[#08171F] border border-[#1E4252] ${
              isPhoneView ? 'p-3' : 'p-4 sm:p-5'
            } relative overflow-hidden shadow-[0_12px_34px_rgba(0,0,0,0.36)]`}
            style={{
              backgroundImage: `radial-gradient(95% 95% at 0% 0%, ${homeColor}30 0%, transparent 60%), radial-gradient(95% 95% at 100% 0%, ${awayColor}2B 0%, transparent 60%)`,
            }}
          >
            {/* Competition Badge Row */}
            <div className={`flex items-center justify-between ${isPhoneView ? 'mb-2' : 'mb-3.5'}`}>
              <div className="inline-flex items-center gap-1.5">
                <CompetitionFlag
                  flagId={currentMatch.competitionId}
                  className="w-3.5 h-3.5"
                />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B8D2DD]">
                  {currentMatch.competitionName}
                </span>
              </div>

              {currentMatch.isLive ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF2E63]/20 border border-[#FF2E63]/45 text-[#FF6B8E] text-[11px] font-extrabold tabular-nums">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E63] animate-pulse" />
                  <span>LIVE · {currentMatch.clock}</span>
                </span>
              ) : (
                <span className="text-[11px] font-bold text-[#8CA8B5] tabular-nums">
                  {currentMatch.startDate} · {currentMatch.startTime}
                </span>
              )}
            </div>

            {/* Club-vs-Club Editorial Display */}
            <div className="grid grid-cols-3 items-center gap-2">
              {/* Home Club */}
              <div className="flex flex-col items-center text-center gap-1.5 min-w-0">
                <TeamCrest
                  teamId={currentMatch.homeTeam.id}
                  teamName={currentMatch.homeTeam.name}
                  size={isPhoneView ? 'md' : 'lg'}
                />
                <div className="text-[13.5px] sm:text-[15.5px] font-black text-white leading-tight line-clamp-2">
                  {currentMatch.homeTeam.name}
                </div>
                <button
                  type="button"
                  onClick={() => toggleFollowTeam(currentMatch.homeTeam.id)}
                  className={`inline-flex items-center gap-1 h-[24px] px-2.5 rounded-full text-[10.5px] font-bold border transition-colors ${
                    isHomeFollowed
                      ? 'bg-[#33270D]/85 border-[#F5B82E]/50 text-[#F5B82E]'
                      : 'bg-[#06131A]/75 border-white/[0.1] text-[#9CB7C4] hover:text-white'
                  }`}
                >
                  <Star
                    className={`w-3 h-3 ${
                      isHomeFollowed ? 'fill-[#F5B82E] text-[#F5B82E]' : ''
                    }`}
                  />
                  <span>{isHomeFollowed ? 'Following' : 'Follow'}</span>
                </button>
              </div>

              {/* Center Giant Score */}
              <div className="flex flex-col items-center justify-center">
                {currentMatch.isLive ? (
                  <>
                    <div className="flex items-center gap-2 text-[36px] sm:text-[44px] font-black leading-none text-white tabular-nums tracking-tight">
                      <span>{currentMatch.homeTeam.score ?? 0}</span>
                      <span className="text-[#4B6E7D] text-[26px]">:</span>
                      <span>{currentMatch.awayTeam.score ?? 0}</span>
                    </div>
                    {currentMatch.id === 'ars-bha' && (
                      <span className="mt-2 px-2 py-0.5 rounded bg-[#06131A]/80 border border-white/[0.07] text-[10.5px] font-semibold text-[#9CB7C4]">
                        ⚽ 23&apos; B. Saka
                      </span>
                    )}
                  </>
                ) : (
                  <div className="text-[28px] font-black text-white tabular-nums">
                    {currentMatch.startTime}
                  </div>
                )}
              </div>

              {/* Away Club */}
              <div className="flex flex-col items-center text-center gap-1.5 min-w-0">
                <TeamCrest
                  teamId={currentMatch.awayTeam.id}
                  teamName={currentMatch.awayTeam.name}
                  size={isPhoneView ? 'md' : 'lg'}
                />
                <div className="text-[13.5px] sm:text-[15.5px] font-black text-white leading-tight line-clamp-2">
                  {currentMatch.awayTeam.name}
                </div>
                <button
                  type="button"
                  onClick={() => toggleFollowTeam(currentMatch.awayTeam.id)}
                  className={`inline-flex items-center gap-1 h-[24px] px-2.5 rounded-full text-[10.5px] font-bold border transition-colors ${
                    isAwayFollowed
                      ? 'bg-[#33270D]/85 border-[#F5B82E]/50 text-[#F5B82E]'
                      : 'bg-[#06131A]/75 border-white/[0.1] text-[#9CB7C4] hover:text-white'
                  }`}
                >
                  <Star
                    className={`w-3 h-3 ${
                      isAwayFollowed ? 'fill-[#F5B82E] text-[#F5B82E]' : ''
                    }`}
                  />
                  <span>{isAwayFollowed ? 'Following' : 'Follow'}</span>
                </button>
              </div>
            </div>

            {/* Mobile Toggle for Odds Chart so Markets stay high above the fold on 390x844 */}
            {isPhoneView && (
              <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowMobileChart((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-[11.5px] font-bold text-[#2CE5F6]"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>
                    {showMobileChart ? 'Hide odds price curve' : 'View live odds curve'}
                  </span>
                </button>
                <span className="text-[11px] font-semibold text-[#8CA8B5] tabular-nums">
                  {currentMatch.homeTeam.shortName} {currentMatch.mainOdds.home.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* B. ACTIVE USDT POSITION TICKET (1-Click Live Cash Out right on Match Desk!) */}
          {activeMatchBets.length > 0 && (
            <div
              className={`rounded-[15px] bg-gradient-to-r from-[#0B2530] via-[#0E2E3B] to-[#092029] border border-[#2CE5F6]/45 ${
                isPhoneView ? 'px-3 py-2.5' : 'p-3.5 space-y-2.5'
              } shadow-[0_8px_24px_rgba(0,0,0,0.3)]`}
            >
              {activeMatchBets.map((bet) => {
                const livePnl = (bet.cashOutOffer ?? bet.stake) - bet.stake;
                const pnlPct = Math.round((livePnl / bet.stake) * 100);
                return (
                  <div key={bet.id} className={isPhoneView ? 'space-y-1.5' : 'space-y-2.5'}>
                    {!isPhoneView && (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8CE9D8]">
                            Your Match Position
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10.5px] font-extrabold tabular-nums ${
                            livePnl >= 0
                              ? 'bg-[#10B981]/18 text-[#34D399]'
                              : 'bg-[#FB7185]/18 text-[#FB7185]'
                          }`}
                        >
                          {livePnl >= 0 ? '+' : ''}${livePnl.toFixed(2)} ({pnlPct >= 0 ? '+' : ''}
                          {pnlPct}%)
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-[13.5px] font-extrabold text-white truncate">
                          {isPhoneView && (
                            <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
                          )}
                          <span>{bet.selectionLabel}</span>
                          <span className="text-[#3AD4F7] tabular-nums">
                            @{bet.odds.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#8CA8B5] tabular-nums">
                          Stake ${bet.stake.toFixed(2)} ·{' '}
                          <span className="text-[#34D399] font-bold">
                            {livePnl >= 0 ? '+' : ''}${livePnl.toFixed(2)} P&amp;L
                          </span>
                        </div>
                      </div>

                      {bet.cashOutOffer !== undefined && (
                        <button
                          type="button"
                          onClick={() => cashOutBet(bet.id)}
                          className="h-[34px] px-3 rounded-[9px] bg-[#B9F6EC] hover:bg-[#9FEFE2] text-[#06181F] text-[11.5px] font-extrabold inline-flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                        >
                          <span>Cash out ${bet.cashOutOffer.toFixed(2)}</span>
                          <UsdtBadge className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* C. POLYMARKET LIVE IMPLIED-ODDS TERMINAL CHART */}
          {(!isPhoneView || showMobileChart) && (
            <OddsPriceTerminalChart
              matchId={currentMatch.id}
              homeLabel={currentMatch.homeTeam.shortName || currentMatch.homeTeam.name}
              awayLabel={currentMatch.awayTeam.shortName || currentMatch.awayTeam.name}
              homeTeamId={currentMatch.homeTeam.id}
              awayTeamId={currentMatch.awayTeam.id}
              homeOdds={currentMatch.mainOdds.home}
              drawOdds={currentMatch.mainOdds.draw}
              awayOdds={currentMatch.mainOdds.away}
              isLive={currentMatch.isLive}
            />
          )}

          {/* D. MATCH COMMUNITY SINGLES TAPE (Desktop Left Column - only shown when picks exist for this sport) */}
          {!isPhoneView && displayPicks.length > 0 && (
            <div className="rounded-[15px] bg-[#091921] border border-white/[0.07] overflow-hidden">
              <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#142D3A] bg-[#07141B]">
                <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-white">
                  <Flame className="w-3.5 h-3.5 text-[#2CE5F6]" />
                  <span>Live Player Singles</span>
                </div>
                <span className="text-[10px] text-[#7896A3] font-semibold">
                  Copy selection
                </span>
              </div>
              <div className="divide-y divide-[#132A36]">
                {displayPicks.slice(0, 3).map((cb) => {
                  const inSlip = isSelected(cb.selection.id);
                  return (
                    <div
                      key={cb.id}
                      className="flex items-center justify-between gap-2 px-3.5 py-2.5"
                    >
                      <div className="min-w-0">
                        <div className="text-[12px] font-bold text-white truncate">
                          {cb.selection.label}{' '}
                          <span className="text-[#7896A3] font-normal">
                            · {cb.selection.marketName}
                          </span>
                        </div>
                        <div className="text-[10.5px] text-[#6D8D9B] flex items-center gap-1.5">
                          <span>{cb.playerHandle}</span>
                          <span>·</span>
                          <span className="inline-flex items-center gap-0.5">
                            <Users className="w-3 h-3" />
                            {cb.copiedCount}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[12.5px] font-extrabold text-[#3AD4F7] tabular-nums">
                          {cb.selection.odds.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyCommunityBet(cb.id)}
                          className={`h-[28px] px-2.5 rounded-[7px] text-[11px] font-extrabold flex items-center gap-1 transition-colors ${
                            inSlip
                              ? 'bg-[#1DA4D4] text-white'
                              : 'bg-[#132C38] hover:bg-[#1B3C4C] border border-[#244B5E] text-white'
                          }`}
                        >
                          {inSlip ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <span>Copy</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (7 Cols on Desktop): Sticky Filter Bar + High-Density Market Execution Cards */}
        <div className={isPhoneView ? 'space-y-3' : 'lg:col-span-7 space-y-3.5'}>
          {/* Market Search + Category Tabs Deck */}
          <div className="rounded-[15px] bg-[#08171F] border border-white/[0.08] p-2.5 space-y-2">
            <div className="flex items-center w-full h-[38px] px-3 rounded-[9px] bg-[#050E13] border border-white/[0.07] focus-within:border-[#2CE5F6]/70 transition-colors">
              <Search className="w-3.5 h-3.5 text-[#7896A3] shrink-0 mr-2" />
              <input
                type="text"
                value={marketSearch}
                onChange={(e) => setMarketSearch(e.target.value)}
                placeholder="Filter markets or players (e.g. Saka, Over 2.5, Handicap)..."
                className="w-full bg-transparent text-[12.5px] text-white placeholder-[#6D8C99] focus:outline-none"
              />
              {marketSearch && (
                <button
                  type="button"
                  onClick={() => setMarketSearch('')}
                  className="p-1 text-[#7896A3] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative flex items-center">
              <div
                ref={tabsScrollRef}
                className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full pr-7"
              >
                {categoryTabs.map((tab) => {
                  const isActive = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveCategory(tab.id)}
                      className={`flex items-center gap-1.5 h-[32px] px-3 rounded-[8px] text-[12px] font-bold transition-all shrink-0 ${
                        isActive
                          ? 'bg-[#133645] text-white border border-[#2CE5F6]/40'
                          : 'text-[#84A2AF] hover:text-white hover:bg-[#0D222C]'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10.5px] tabular-nums ${
                          isActive ? 'text-[#2CE5F6]' : 'text-[#5E7E8B]'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {!isPhoneView && isSidePanelOpen && (
                <button
                  type="button"
                  onClick={() =>
                    tabsScrollRef.current?.scrollBy({
                      left: 150,
                      behavior: 'smooth',
                    })
                  }
                  className="absolute right-0 w-7 h-8 rounded-[7px] bg-[#102833] border border-[#1E4353] flex items-center justify-center text-white"
                  aria-label="Scroll market tabs"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Market Execution Cards */}
          <div className="space-y-3">
            {visibleMarkets.map((mkt) => {
              const isCollapsed = Boolean(collapsedIds[mkt.id]);
              const isMarketSuspended = Boolean(mkt.suspended);
              const isPinned = pinnedMarketIds.includes(mkt.id);

              return (
                <div
                  key={mkt.id}
                  className={`rounded-[15px] bg-[#091921] border overflow-hidden transition-colors ${
                    isPinned
                      ? 'border-[#2CE5F6]/45'
                      : 'border-white/[0.08] hover:border-white/[0.14]'
                  }`}
                >
                  {/* Market Header */}
                  <div className="w-full flex items-center justify-between px-4 py-2.5 border-b border-[#142D3A] bg-[#07141B]/70">
                    <button
                      type="button"
                      onClick={() => toggleCollapse(mkt.id)}
                      className="flex-1 flex items-center gap-2 text-left"
                    >
                      <span className="text-[13.5px] font-extrabold text-white tracking-tight">
                        {mkt.name}
                      </span>
                      {isMarketSuspended && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[#F59E0B] text-[10.5px] font-bold">
                          <Lock className="w-3 h-3" />
                          Suspended
                        </span>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => togglePinMarket(mkt.id)}
                        className={`p-1 rounded transition-colors ${
                          isPinned
                            ? 'text-[#2CE5F6]'
                            : 'text-[#6A8A98] hover:text-white'
                        }`}
                        title={isPinned ? 'Unpin market' : 'Pin market to top'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCollapse(mkt.id)}
                        className="p-0.5 text-[#84A0AC] hover:text-white"
                      >
                        {isCollapsed ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Market Selections */}
                  {!isCollapsed && (
                    <div className="p-3.5">
                      {isMarketSuspended ? (
                        <div className="h-[46px] w-full rounded-[11px] bg-[#0B1B23] border border-[#243E4B] flex items-center justify-center gap-2 text-[#F59E0B] select-none">
                          <Lock className="w-4 h-4 text-[#F59E0B]" />
                          <span className="text-[12px] font-bold">
                            Market temporarily suspended · In-play incident
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`grid gap-2 ${
                            mkt.layout === '3col'
                              ? 'grid-cols-3'
                              : isPhoneView && mkt.selections.length > 2
                              ? 'grid-cols-1'
                              : 'grid-cols-2'
                          }`}
                        >
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
                              shortLabel: s.shortLabel,
                              odds: s.odds,
                              prevOdds: s.prevOdds,
                              direction: s.direction,
                              suspended: s.suspended,
                              isLive: currentMatch.isLive,
                              scoreText,
                              clockText: currentMatch.clock,
                            };

                            return (
                              <OddsButton
                                key={s.id}
                                selection={selObj}
                                variant={
                                  mkt.layout === '3col' ? 'stacked' : 'inline'
                                }
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
