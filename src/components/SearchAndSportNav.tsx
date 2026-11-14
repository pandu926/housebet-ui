import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Home,
  Video,
  Star,
} from 'lucide-react';
import { useSportsbook } from '../context/SportsbookContext';
import { COMPETITIONS, getMarketsForMatch } from '../data/sportsbookData';
import { CompetitionFlag, SportIcon, TeamCrest } from './BrandIcons';

export const GlobalSearchBar: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  showDropdown?: boolean;
  compact?: boolean;
}> = ({
  placeholder = 'Search teams, players or markets...',
  value,
  onChange,
  showDropdown = true,
  compact = false,
}) => {
  const {
    globalSearch,
    setGlobalSearch,
    matches,
    navigateTo,
    toggleSelection,
    followedCompetitions,
    toggleFollowCompetition,
  } = useSportsbook();
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const query = value !== undefined ? value : globalSearch;
  const setQuery = onChange || setGlobalSearch;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const q = query.trim().toLowerCase();

  const matchedCompetitions = q
    ? COMPETITIONS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
      )
    : [];

  const matchedMatches = q
    ? matches.filter(
        (m) =>
          m.homeTeam.name.toLowerCase().includes(q) ||
          m.awayTeam.name.toLowerCase().includes(q) ||
          m.competitionName.toLowerCase().includes(q)
      )
    : [];

  // Search players & markets across all matches dynamically
  const matchedPlayerMarkets = q
    ? matches.slice(0, 6).flatMap((m) => {
        const mkts = getMarketsForMatch(m);
        return mkts.flatMap((mkt) =>
          mkt.selections
            .filter(
              (s) =>
                s.label.toLowerCase().includes(q) ||
                mkt.name.toLowerCase().includes(q)
            )
            .map((s) => ({ match: m, market: mkt, selection: s }))
        );
      })
    : [];

  const hasResults =
    matchedCompetitions.length > 0 ||
    matchedMatches.length > 0 ||
    matchedPlayerMarkets.length > 0;

  const topEuropeComps = COMPETITIONS.filter((c) => c.sportId === 'soccer');

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex items-center w-full ${
          compact ? 'h-[36px] px-3 rounded-[9px] bg-[#050E13]' : 'h-[42px] md:h-[44px] px-3.5 rounded-[11px] bg-[#0D2028]'
        } border transition-colors ${
          focused
            ? 'border-[#2CE5F6]/70 bg-[#0D222B]'
            : 'border-white/[0.08] hover:border-[#244A5B]'
        }`}
      >
        <Search className="w-3.5 h-3.5 text-[#7D9BA8] shrink-0 mr-2" />
        <input
          id="hb-sports-search"
          type="text"
          value={query}
          onFocus={() => setFocused(true)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[12.5px] md:text-[13px] text-white placeholder-[#6D8C99] focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1 text-[#7D9BA8] hover:text-white rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Instant Command Palette Popover (Shows Top 5 Europe + Hot Live Odds when focused, or live search results when typing) */}
      {showDropdown && focused && (
        <div
          className={`absolute ${
            compact
              ? 'left-0 right-0 lg:left-auto lg:right-0 lg:w-[560px] top-[42px]'
              : 'left-0 right-0 top-[48px]'
          } z-50 rounded-[13px] bg-[#0A1C24] border border-[#244C5E] shadow-2xl max-h-[420px] overflow-y-auto p-3.5 space-y-3.5`}
        >
          {q.length === 0 ? (
            <>
              {/* Quick Top 5 European Leagues Jump */}
              <div>
                <div className="flex items-center justify-between px-1 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#74929F]">
                    Top 5 European Leagues · 1-Click Filter
                  </span>
                  <span className="text-[10.5px] text-[#2CE5F6] font-semibold">
                    ★ Star to lock at #1
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {topEuropeComps.map((comp) => {
                    const isStarred = followedCompetitions.includes(comp.id);
                    return (
                      <div
                        key={comp.id}
                        className="flex items-center justify-between px-2.5 py-2 rounded-[9px] bg-[#112731] hover:bg-[#163442] border border-[#1C3D4C] transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setFocused(false);
                            navigateTo('football', { competition: comp.id });
                          }}
                          className="flex items-center gap-2 min-w-0 text-left flex-1"
                        >
                          <CompetitionFlag flagId={comp.id} className="w-4 h-4" />
                          <span className="text-[12px] font-bold text-white truncate">
                            {comp.name}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFollowCompetition(comp.id);
                          }}
                          className="ml-1 text-[#7D9BA8] hover:text-[#F5B82E]"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              isStarred ? 'text-[#F5B82E] fill-[#F5B82E]' : ''
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instant 1-Click Live Markets right inside Search */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#74929F] px-1 mb-2">
                  Trending Live Singles · Click Odds to Add to Slip
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {[
                    {
                      id: 'ars-bha-gs-saka-any',
                      matchId: 'ars-bha',
                      matchTitle: 'Arsenal v Brighton & Hove Albion',
                      compId: 'epl',
                      compName: 'Premier League',
                      marketId: 'mkt-goalscorers',
                      marketName: 'Anytime Goalscorer',
                      label: 'Bukayo Saka',
                      odds: 2.25,
                      teamId: 'arsenal',
                    },
                    {
                      id: 'ars-bha-ou-o25',
                      matchId: 'ars-bha',
                      matchTitle: 'Arsenal v Brighton & Hove Albion',
                      compId: 'epl',
                      compName: 'Premier League',
                      marketId: 'mkt-total-goals',
                      marketName: 'Total goals',
                      label: 'Over 2.5',
                      odds: 2.73,
                      teamId: 'arsenal',
                    },
                    {
                      id: 'rma-bay-1x2-home',
                      matchId: 'rma-bay',
                      matchTitle: 'Real Madrid v Bayern Munich',
                      compId: 'ucl',
                      compName: 'Champions League',
                      marketId: 'mkt-1x2',
                      marketName: 'Match result',
                      label: 'Real Madrid',
                      odds: 2.2,
                      teamId: 'real-madrid',
                    },
                    {
                      id: 'liv-mun-1x2-home',
                      matchId: 'liv-mun',
                      matchTitle: 'Liverpool v Manchester United',
                      compId: 'epl',
                      compName: 'Premier League',
                      marketId: 'mkt-1x2',
                      marketName: 'Match result',
                      label: 'Liverpool',
                      odds: 1.65,
                      teamId: 'liverpool',
                    },
                  ].map((hot) => (
                    <div
                      key={hot.id}
                      className="flex items-center justify-between px-2.5 py-2 rounded-[9px] bg-[#112731] border border-[#1B3A48]"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setFocused(false);
                          navigateTo('match', { matchId: hot.matchId });
                        }}
                        className="flex items-center gap-2 min-w-0 text-left pr-2"
                      >
                        <TeamCrest teamId={hot.teamId} size="xs" />
                        <div className="min-w-0">
                          <div className="text-[12.5px] font-bold text-white truncate">
                            {hot.label}
                          </div>
                          <div className="text-[11px] text-[#7D9BA8] truncate">
                            {hot.marketName} · {hot.matchTitle}
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toggleSelection({
                            id: hot.id,
                            matchId: hot.matchId,
                            matchTitle: hot.matchTitle,
                            competitionId: hot.compId,
                            competitionName: hot.compName,
                            sportId: 'soccer',
                            marketId: hot.marketId,
                            marketName: hot.marketName,
                            label: hot.label,
                            odds: hot.odds,
                            isLive: hot.matchId === 'ars-bha',
                            scoreText: hot.matchId === 'ars-bha' ? '1–0' : undefined,
                            clockText: hot.matchId === 'ars-bha' ? "52'" : undefined,
                          });
                          setFocused(false);
                        }}
                        className="px-2.5 py-1 rounded-[7px] bg-[#183846] hover:bg-[#1DA4D4] text-[#3AD4F7] hover:text-white text-[12.5px] font-extrabold tabular-nums transition-colors shrink-0"
                      >
                        {hot.odds.toFixed(2)}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : !hasResults ? (
            <div className="py-6 text-center text-[13px] text-[#7D9BA8]">
              No matches, players, or markets found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {matchedCompetitions.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#74929F] px-2 mb-1.5">
                    Competitions
                  </div>
                  <div className="space-y-1">
                    {matchedCompetitions.map((comp) => (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => {
                          setFocused(false);
                          setQuery('');
                          navigateTo('football', { competition: comp.id });
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-[8px] hover:bg-[#152E3A] text-left transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <CompetitionFlag flagId={comp.id} className="w-4 h-4" />
                          <span className="text-[13px] font-semibold text-white">
                            {comp.name}
                          </span>
                          <span className="text-[11.5px] text-[#74929F]">
                            · {comp.country}
                          </span>
                        </div>
                        <span className="text-[11.5px] text-[#2CE5F6] font-semibold">
                          {comp.matchCount} matches →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedMatches.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#74929F] px-2 mb-1.5">
                    Matches & Teams
                  </div>
                  <div className="space-y-1">
                    {matchedMatches.slice(0, 5).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setFocused(false);
                          setQuery('');
                          navigateTo('match', { matchId: m.id });
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-2 rounded-[8px] hover:bg-[#152E3A] text-left transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <TeamCrest teamId={m.homeTeam.id} size="xs" />
                          <span className="text-[13px] font-semibold text-white truncate">
                            {m.homeTeam.name} v {m.awayTeam.name}
                          </span>
                          {m.isLive && (
                            <span className="px-1.5 py-0.5 rounded bg-[#E91E63] text-[9.5px] font-extrabold text-white">
                              LIVE {m.clock}
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] font-bold text-[#3AD4F7] tabular-nums shrink-0 ml-2">
                          {m.mainOdds.home.toFixed(2)} / {m.mainOdds.away.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedPlayerMarkets.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#74929F] px-2 mb-1.5">
                    Players & Markets · Click Odds to Bet
                  </div>
                  <div className="space-y-1">
                    {matchedPlayerMarkets.slice(0, 6).map(({ match, market, selection }) => (
                      <div
                        key={selection.id}
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-[8px] bg-[#112630] border border-[#1B3A48]"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setFocused(false);
                            setQuery('');
                            navigateTo('match', { matchId: match.id });
                          }}
                          className="text-left min-w-0 pr-2"
                        >
                          <div className="text-[12.5px] font-semibold text-white truncate">
                            {selection.label}
                          </div>
                          <div className="text-[11px] text-[#7D9BA8] truncate">
                            {market.name} · {match.homeTeam.name} v {match.awayTeam.name}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            toggleSelection({
                              id: selection.id,
                              matchId: match.id,
                              matchTitle: `${match.homeTeam.name} v ${match.awayTeam.name}`,
                              competitionId: match.competitionId,
                              competitionName: match.competitionName,
                              sportId: match.sportId,
                              marketId: market.id,
                              marketName: market.name,
                              label: selection.label,
                              odds: selection.odds,
                              isLive: match.isLive,
                              scoreText:
                                match.homeTeam.score !== undefined
                                  ? `${match.homeTeam.score}–${match.awayTeam.score}`
                                  : undefined,
                              clockText: match.clock,
                            });
                            setFocused(false);
                          }}
                          className="px-2.5 py-1 rounded-[7px] bg-[#183745] hover:bg-[#1DA4D4] text-[#3AD4F7] hover:text-white text-[12.5px] font-bold tabular-nums transition-colors shrink-0"
                        >
                          {selection.odds.toFixed(2)}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const SportNavPills: React.FC<{ isMobileLayout?: boolean }> = ({
  isMobileLayout = false,
}) => {
  const {
    activePage,
    selectedSport,
    navigateTo,
    matches,
  } = useSportsbook();
  const liveCount = matches.filter((m) => m.isLive).length;

  const items: {
    id: string;
    label: string;
    badge?: number;
    isLiveBadge?: boolean;
    icon: React.ReactNode;
    onClick: () => void;
    active: boolean;
  }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-4 h-4" />,
      active: activePage === 'home' && selectedSport === 'all',
      onClick: () => navigateTo('home', { sport: 'all' }),
    },
    {
      id: 'live',
      label: 'Live',
      badge: liveCount,
      isLiveBadge: true,
      icon: (
        <div className="relative">
          <Video className="w-4 h-4 text-[#E91E63]" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#E91E63] animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#E91E63]" />
        </div>
      ),
      active: activePage === 'live',
      onClick: () => navigateTo('live', { sport: 'all' }),
    },
    {
      id: 'soccer',
      label: 'Soccer',
      icon: <SportIcon sport="soccer" className="w-4 h-4" />,
      active: activePage === 'football',
      onClick: () => navigateTo('football', { sport: 'soccer', competition: 'all' }),
    },
    {
      id: 'tennis',
      label: 'Tennis',
      icon: <SportIcon sport="tennis" className="w-4 h-4" />,
      active: activePage === 'home' && selectedSport === 'tennis',
      onClick: () => navigateTo('live', { sport: 'tennis' }),
    },
    {
      id: 'basketball',
      label: 'Basketball',
      icon: <SportIcon sport="basketball" className="w-4 h-4" />,
      active: activePage === 'home' && selectedSport === 'basketball',
      onClick: () => navigateTo('live', { sport: 'basketball' }),
    },
    {
      id: 'baseball',
      label: 'Baseball',
      icon: <SportIcon sport="baseball" className="w-4 h-4" />,
      active: activePage === 'home' && selectedSport === 'baseball',
      onClick: () => navigateTo('live', { sport: 'baseball' }),
    },
    {
      id: 'american-football',
      label: 'American Football',
      icon: <SportIcon sport="american-football" className="w-4 h-4" />,
      active: activePage === 'home' && selectedSport === 'american-football',
      onClick: () => navigateTo('live', { sport: 'american-football' }),
    },
    {
      id: 'esports',
      label: 'Esports',
      icon: <SportIcon sport="esports" className="w-4 h-4" />,
      active: activePage === 'home' && selectedSport === 'esports',
      onClick: () => navigateTo('live', { sport: 'esports' }),
    },
  ];

  if (isMobileLayout) {
    return (
      <div className="w-full rounded-[14px] bg-[#0B1C23] border border-[#17333F] p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            className={`flex flex-col items-center justify-center min-w-[66px] h-[54px] px-2.5 rounded-[10px] transition-all shrink-0 ${
              item.active
                ? 'bg-[#12323F] text-white border border-[#1E4A5C]'
                : 'text-[#84A0AC] hover:text-white hover:bg-[#10252E]'
            }`}
          >
            <div className={item.active ? 'text-[#2CE5F6]' : 'text-[#84A0AC]'}>
              {item.icon}
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11.5px] font-semibold leading-none whitespace-nowrap">
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="text-[#E91E63] font-bold tabular-nums">{item.badge}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full rounded-[12px] bg-[#0B1C23] border border-white/[0.06] p-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          className={`flex items-center gap-2 h-[36px] px-3.5 rounded-[8px] text-[13px] font-semibold transition-all shrink-0 ${
            item.active
              ? 'bg-[#12323F] text-white border border-[#1E4B5D]'
              : 'text-[#89A6B2] hover:text-white hover:bg-[#10252F]'
          }`}
        >
          <span className={item.active ? 'text-[#2CE5F6]' : 'text-[#7F9CA8]'}>
            {item.icon}
          </span>
          <span>{item.label}</span>
          {item.badge !== undefined && (
            <span className="text-[#E91E63] font-bold tabular-nums">{item.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
};
