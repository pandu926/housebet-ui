import React, { useMemo, useState } from 'react';
import { Activity, Clock, Star, Zap } from 'lucide-react';
import { useSportsbook } from '../../context/SportsbookContext';
import { COMPETITIONS, MatchItem, SportId } from '../../data/sportsbookData';
import {
  CompetitionFlag,
  SportIcon,
  UsdtBadge,
} from '../../components/BrandIcons';
import { FlashStakeToolbar, MobileMatrixMarketCol } from './FlashStakeToolbar';
import { MatrixCompetitionTable } from './MatrixMatchTable';

function groupMatchesByCompetition(list: MatchItem[]) {
  const map = new Map<
    string,
    {
      competitionId: string;
      competitionName: string;
      sportId: SportId;
      matches: MatchItem[];
    }
  >();
  for (const m of list) {
    const existing = map.get(m.competitionId);
    if (existing) {
      existing.matches.push(m);
    } else {
      map.set(m.competitionId, {
        competitionId: m.competitionId,
        competitionName: m.competitionName,
        sportId: m.sportId,
        matches: [m],
      });
    }
  }
  return Array.from(map.values());
}

export const MatrixHomePage: React.FC<{ isPhoneView?: boolean }> = ({
  isPhoneView = false,
}) => {
  const {
    matches,
    myBets,
    cashOutBet,
    navigateTo,
    followedCompetitions,
    toggleFollowCompetition,
    simulateNothingLive,
  } = useSportsbook();

  const [sportFilter, setSportFilter] = useState<'all' | SportId>('all');
  const [mobileCol, setMobileCol] = useState<MobileMatrixMarketCol>('1x2');

  const openBet = myBets.find((b) => b.status === 'Open');

  const sportFiltered = useMemo(
    () =>
      sportFilter === 'all'
        ? matches
        : matches.filter((m) => m.sportId === sportFilter),
    [matches, sportFilter]
  );

  const liveMatches = useMemo(
    () => (simulateNothingLive ? [] : sportFiltered.filter((m) => m.isLive)),
    [sportFiltered, simulateNothingLive]
  );

  const upcomingMatches = useMemo(
    () =>
      sportFiltered
        .filter((m) => !m.isLive)
        .sort((a, b) => (a.startsInMinutes ?? 999) - (b.startsInMinutes ?? 999)),
    [sportFiltered]
  );

  const liveGroups = useMemo(
    () => groupMatchesByCompetition(liveMatches),
    [liveMatches]
  );
  const upcomingGroups = useMemo(
    () => groupMatchesByCompetition(upcomingMatches),
    [upcomingMatches]
  );

  const sportTabs: Array<{ id: 'all' | SportId; label: string }> = [
    { id: 'all', label: 'All Sports' },
    { id: 'soccer', label: 'Soccer' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'basketball', label: 'Basketball' },
    { id: 'baseball', label: 'Baseball' },
    { id: 'american-football', label: 'NFL' },
    { id: 'ice-hockey', label: 'Hockey' },
    { id: 'esports', label: 'Esports' },
  ];

  // Top 5 Required European Football Leagues + Key Global Competitions
  const topCompetitions = COMPETITIONS.slice(0, 8);

  return (
    <div className="space-y-4">
      <FlashStakeToolbar
        isPhoneView={isPhoneView}
        mobileCol={mobileCol}
        onChangeMobileCol={setMobileCol}
      />

      {/* Institutional Terminal Status + Open Position Quick Cash Out */}
      <div className="rounded-[12px] bg-gradient-to-r from-[#0A1E28] via-[#091922] to-[#08161E] border border-[#183847] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[8px] bg-[#123646] border border-[#2CE5F6]/40 flex items-center justify-center text-[#2CE5F6]">
              <Activity className="w-4 h-4" />
            </span>
            <div>
              <div className="text-[13px] font-extrabold text-white leading-tight flex items-center gap-2">
                <span>Pro Multi-Market Matrix</span>
                <span className="px-1.5 py-0.5 rounded bg-[#113140] text-[#2CE5F6] text-[9.5px] font-extrabold uppercase tracking-wider">
                  1X2 · HDP · O/U
                </span>
              </div>
              <div className="text-[11px] text-[#7D9CA9]">
                Simultaneous 3-market liquidity · Zero-drawer USDT singles execution
              </div>
            </div>
          </div>
        </div>

        {openBet && (
          <div className="flex items-center gap-2.5 bg-[#06131A] border border-[#1B3D4D] rounded-[9px] px-2.5 py-1.5">
            <div className="text-[11px] leading-tight">
              <div className="text-[#7D9CA9] font-semibold">
                Open Single · {openBet.selectionLabel} @ {openBet.odds.toFixed(2)}
              </div>
              <div className="text-white font-extrabold tabular-nums">
                Stake ${openBet.stake.toFixed(2)} → Return $
                {openBet.potentialReturn.toFixed(2)}
              </div>
            </div>
            {openBet.cashOutOffer && (
              <button
                type="button"
                onClick={() => cashOutBet(openBet.id)}
                className="h-7 px-2.5 rounded-[7px] bg-[#B9F6EC] hover:bg-[#9FEFE2] text-[#06181F] text-[11px] font-extrabold flex items-center gap-1 shrink-0 transition-colors"
              >
                <UsdtBadge className="w-3.5 h-3.5" />
                <span>Cash out ${openBet.cashOutOffer.toFixed(2)}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Top Competitions Ribbon (Required Top 5 Euro Leagues + Global Tourneys with ★ Follow) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#6D8E9C] pr-1 shrink-0">
          Top Leagues:
        </span>
        {topCompetitions.map((comp) => {
          const isPinned = followedCompetitions.includes(comp.id);
          return (
            <div
              key={comp.id}
              className="h-8 px-2.5 rounded-[8px] bg-[#091922] hover:bg-[#0F2633] border border-[#163341] flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <button
                type="button"
                onClick={() =>
                  navigateTo('football', {
                    sport: comp.sportId,
                    competition: comp.id,
                  })
                }
                className="flex items-center gap-1.5 text-[11.5px] font-bold text-[#DCEAF0] hover:text-white"
              >
                <CompetitionFlag flagId={comp.id} className="w-3.5 h-3.5" />
                <span>{comp.name}</span>
              </button>
              <button
                type="button"
                onClick={() => toggleFollowCompetition(comp.id)}
                className="text-[#5C7D8B] hover:text-[#F5B82E]"
                title={`Follow ${comp.name}`}
              >
                <Star
                  className={`w-3 h-3 ${
                    isPinned ? 'fill-[#F5B82E] text-[#F5B82E]' : ''
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Sport Matrix Filter Strip */}
      <div className="flex items-center justify-between gap-2 border-b border-[#142D39] pb-2">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {sportTabs.map((sp) => {
            const active = sportFilter === sp.id;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => setSportFilter(sp.id)}
                className={`h-8 px-3 rounded-[8px] text-[12px] font-bold flex items-center gap-1.5 shrink-0 transition-colors ${
                  active
                    ? 'bg-[#133646] text-[#2CE5F6] border border-[#2CE5F6]/40'
                    : 'text-[#84A3B0] hover:text-white hover:bg-[#0C1F29]'
                }`}
              >
                {sp.id !== 'all' && (
                  <SportIcon sport={sp.id} className="w-3.5 h-3.5" />
                )}
                <span>{sp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: LIVE NOW PRO MATRIX */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF2E63] animate-pulse" />
            <h2 className="text-[14px] font-extrabold text-white tracking-tight uppercase">
              Live Now · In-Play Order Book
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#FF2E63]/15 text-[#FF5C85] text-[11px] font-extrabold tabular-nums">
              {liveMatches.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('live')}
            className="text-[11.5px] font-bold text-[#2CE5F6] hover:underline"
          >
            Full In-Play Terminal →
          </button>
        </div>

        {liveGroups.length === 0 ? (
          <div className="rounded-[12px] bg-[#091922] border border-[#193847] p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#B9F6EC] shrink-0" />
              <div className="text-[12.5px] text-[#DCEAF0]">
                <strong className="text-white">Nothing live right now</strong> in
                this filter — trade pre-match liquidity in{' '}
                <strong className="text-[#2CE5F6]">Starting soon</strong> below.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {liveGroups.map((grp) => (
              <MatrixCompetitionTable
                key={`live-${grp.competitionId}`}
                competitionId={grp.competitionId}
                competitionName={grp.competitionName}
                sportId={grp.sportId}
                matches={grp.matches}
                isPhoneView={isPhoneView}
                mobileCol={mobileCol}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: STARTING SOON PRO MATRIX */}
      <section className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#2CE5F6]" />
            <h2 className="text-[14px] font-extrabold text-white tracking-tight uppercase">
              Starting Soon · Pre-Match Matrix
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#123240] text-[#2CE5F6] text-[11px] font-extrabold tabular-nums">
              {upcomingMatches.length}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          {upcomingGroups.map((grp) => (
            <MatrixCompetitionTable
              key={`up-${grp.competitionId}`}
              competitionId={grp.competitionId}
              competitionName={grp.competitionName}
              sportId={grp.sportId}
              matches={grp.matches}
              isPhoneView={isPhoneView}
              mobileCol={mobileCol}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
