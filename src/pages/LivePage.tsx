import React, { useMemo, useState } from 'react';
import { Radio, RotateCcw } from 'lucide-react';
import { useSportsbook } from '../context/SportsbookContext';
import { COMPETITIONS, SportId } from '../data/sportsbookData';
import { CompetitionFlag } from '../components/BrandIcons';
import {
  MarketDisplayType,
  MatchTradingTile,
} from '../components/MatchRowAndCard';

export const LivePage: React.FC<{ isPhoneView?: boolean }> = ({
  isPhoneView = false,
}) => {
  const {
    matches,
    selectedSport,
    setSelectedSport,
    selectedCompetition,
    setSelectedCompetition,
    simulateNothingLive,
    setSimulateNothingLive,
  } = useSportsbook();

  const [marketMode, setMarketMode] = useState<MarketDisplayType>('1x2');

  const allLiveMatches = useMemo(
    () => (simulateNothingLive ? [] : matches.filter((m) => m.isLive)),
    [matches, simulateNothingLive]
  );

  const sportFilteredLive = useMemo(() => {
    if (selectedSport === 'all') return allLiveMatches;
    return allLiveMatches.filter((m) => m.sportId === selectedSport);
  }, [allLiveMatches, selectedSport]);

  const finalLiveMatches = useMemo(() => {
    if (selectedCompetition === 'all') return sportFilteredLive;
    return sportFilteredLive.filter((m) => m.competitionId === selectedCompetition);
  }, [sportFilteredLive, selectedCompetition]);

  const startingSoonMatches = useMemo(
    () =>
      matches
        .filter(
          (m) =>
            !m.isLive &&
            (selectedSport === 'all' || m.sportId === selectedSport)
        )
        .sort((a, b) => (a.startsInMinutes ?? 999) - (b.startsInMinutes ?? 999)),
    [matches, selectedSport]
  );

  // Available live competitions for filter chips
  const liveCompetitions = useMemo(() => {
    const ids = new Set(sportFilteredLive.map((m) => m.competitionId));
    return COMPETITIONS.filter((c) => ids.has(c.id));
  }, [sportFilteredLive]);

  const sportCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allLiveMatches.length };
    allLiveMatches.forEach((m) => {
      counts[m.sportId] = (counts[m.sportId] || 0) + 1;
    });
    return counts;
  }, [allLiveMatches]);

  // Only show sports that have live matches (or all when testing Nothing Live) so filter stays razor-clean
  const sportFilters: Array<{ id: 'all' | SportId; label: string }> = [
    { id: 'all', label: 'All Sports' },
    { id: 'soccer', label: 'Soccer' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'basketball', label: 'NBA' },
    { id: 'ice-hockey', label: 'NHL' },
    { id: 'esports', label: 'Esports' },
    { id: 'baseball', label: 'MLB' },
    { id: 'american-football', label: 'NFL' },
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* 1. COMPACT IN-PLAY ARENA CONTROL HEADER (Zero Duplicate Live Mover Cards, Zero Navbar Clones) */}
      <div className="rounded-[15px] bg-[#08171F] border border-white/[0.07] px-3.5 py-3 space-y-2.5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="inline-flex items-center gap-1.5 shrink-0 pr-2 border-r border-white/[0.08]">
              <Radio className="w-4 h-4 text-[#FF2E63]" />
              <h1 className="text-[14px] font-extrabold text-white tracking-tight">
                Live In-Play
              </h1>
              <span className="px-1.5 py-0.5 rounded bg-[#FF2E63]/18 text-[#FF5C85] text-[11px] font-extrabold tabular-nums">
                {finalLiveMatches.length}
              </span>
            </div>

            {/* Compact Sport Scope Chips */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {sportFilters
                .filter((sp) => sp.id === 'all' || (sportCounts[sp.id] || 0) > 0 || selectedSport === sp.id)
                .map((sp) => {
                  const active = selectedSport === sp.id;
                  const cnt = sportCounts[sp.id] || 0;
                  return (
                    <button
                      key={sp.id}
                      type="button"
                      onClick={() => {
                        setSelectedSport(sp.id);
                        setSelectedCompetition('all');
                      }}
                      className={`h-[30px] px-2.5 rounded-[8px] text-[11.5px] font-bold flex items-center gap-1.5 shrink-0 transition-all border ${
                        active
                          ? 'bg-[#133544] border-[#2CE5F6]/50 text-white'
                          : 'bg-[#050F14] border-white/[0.05] text-[#84A2AF] hover:text-white'
                      }`}
                    >
                      <span>{sp.label}</span>
                      <span className="text-[10.5px] font-extrabold text-[#6E8E9B] tabular-nums">
                        {cnt}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {!isPhoneView && (
            <div className="flex items-center gap-1 bg-[#050F14] p-0.5 rounded-[8px] border border-white/[0.06] text-[11px] font-bold shrink-0">
              {(
                [
                  { id: '1x2', label: 'Match Winner' },
                  { id: 'ou', label: 'Totals (O/U)' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMarketMode(opt.id)}
                  className={`px-2.5 py-1 rounded-[6px] transition-colors ${
                    marketMode === opt.id
                      ? 'bg-[#163847] text-white'
                      : 'text-[#7896A3] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Competition Sub-Filter Chips */}
        {liveCompetitions.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-white/[0.05]">
            <button
              type="button"
              onClick={() => setSelectedCompetition('all')}
              className={`h-[27px] px-2.5 rounded-full text-[11px] font-bold shrink-0 border transition-colors ${
                selectedCompetition === 'all'
                  ? 'bg-[#143746] border-[#2CE5F6]/45 text-white'
                  : 'bg-[#0B1D26] border-white/[0.06] text-[#84A2AF] hover:text-white'
              }`}
            >
              All Competitions ({sportFilteredLive.length})
            </button>

            {liveCompetitions.map((comp) => {
              const isAct = selectedCompetition === comp.id;
              return (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => setSelectedCompetition(comp.id)}
                  className={`h-[27px] px-2.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 shrink-0 border transition-colors ${
                    isAct
                      ? 'bg-[#143746] border-[#2CE5F6]/45 text-white'
                      : 'bg-[#0B1D26] border-white/[0.06] text-[#84A2AF] hover:text-white'
                  }`}
                >
                  <CompetitionFlag flagId={comp.id} className="w-3.5 h-3.5" />
                  <span>{comp.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. NOTHING LIVE FALLBACK -> SHOW STARTING SOON (Required Scorecard State) */}
      {finalLiveMatches.length === 0 ? (
        <div className="space-y-4">
          <div className="rounded-[16px] bg-gradient-to-r from-[#0B2029] to-[#0E2834] border border-[#224A5C] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[16px] font-extrabold text-white">
                Nothing live right now
              </div>
              <p className="text-[12.5px] text-[#94B2BF]">
                No matches are currently in play for this filter. Showing{' '}
                <strong className="text-white">Starting soon</strong> fixtures below so you can get ahead of kickoff.
              </p>
            </div>
            {simulateNothingLive && (
              <button
                type="button"
                onClick={() => setSimulateNothingLive(false)}
                className="h-9 px-3.5 rounded-[9px] bg-[#B9F6EC] text-[#06181F] text-[12px] font-extrabold inline-flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Live Feed</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-[#92B0BD]">
              Starting Soon
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {startingSoonMatches.map((m) => (
                <MatchTradingTile key={m.id} match={m} marketType={marketMode} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* 3. 2-COLUMN IN-PLAY TRADING BENTO GRID (Zero Duplicate Cards) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {finalLiveMatches.map((match) => (
            <MatchTradingTile
              key={match.id}
              match={match}
              marketType={marketMode}
              showLeagueBadge
            />
          ))}
        </div>
      )}
    </div>
  );
};
