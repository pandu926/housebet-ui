import React, { useMemo, useState } from 'react';
import { Clock, Flame, Radio, Star } from 'lucide-react';
import { useSportsbook } from '../../context/SportsbookContext';
import { COMPETITIONS, SportId } from '../../data/sportsbookData';
import {
  CompetitionFlag,
  SportIcon,
  TeamCrest,
  UsdtBadge,
} from '../../components/BrandIcons';
import { MultiMatchLiveDock } from './MultiMatchLiveDock';
import { ArenaMatchCard } from './ArenaMatchCard';
import { CasinoLiveBetStream } from './CasinoLiveBetStream';

export const ArenaHomePage: React.FC<{ isPhoneView?: boolean }> = ({
  isPhoneView = false,
}) => {
  const {
    matches,
    pinnedMatchIds,
    navigateTo,
    followedCompetitions,
    toggleFollowCompetition,
    myBets,
    cashOutBet,
    simulateNothingLive,
  } = useSportsbook();

  const [sportFilter, setSportFilter] = useState<'all' | SportId>('all');

  const openBet = myBets.find((b) => b.status === 'Open');

  const liveMatches = useMemo(() => {
    if (simulateNothingLive) return [];
    return matches
      .filter((m) => m.isLive)
      .filter((m) => (sportFilter === 'all' ? true : m.sportId === sportFilter));
  }, [matches, sportFilter, simulateNothingLive]);

  // Avoid duplicating the 3 matches already visible in the top MultiMatchLiveDock unless filtered specifically
  const unpinnedFirstLive = useMemo(() => {
    const rest = liveMatches.filter((m) => !pinnedMatchIds.includes(m.id));
    const docked = liveMatches.filter((m) => pinnedMatchIds.includes(m.id));
    return rest.length >= 4 ? rest.slice(0, 6) : [...rest, ...docked].slice(0, 6);
  }, [liveMatches, pinnedMatchIds]);

  const startingSoonMatches = useMemo(
    () =>
      matches
        .filter((m) => !m.isLive)
        .filter((m) => (sportFilter === 'all' ? true : m.sportId === sportFilter))
        .sort((a, b) => (a.startsInMinutes ?? 999) - (b.startsInMinutes ?? 999))
        .slice(0, 5),
    [matches, sportFilter]
  );

  const sportTabs: Array<{ id: 'all' | SportId; label: string }> = [
    { id: 'all', label: 'All Arena' },
    { id: 'soccer', label: 'Soccer' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'basketball', label: 'Basketball' },
    { id: 'baseball', label: 'Baseball' },
    { id: 'american-football', label: 'NFL' },
    { id: 'ice-hockey', label: 'Hockey' },
    { id: 'esports', label: 'Esports' },
  ];

  return (
    <div className="space-y-4">
      {/* Signature Feature #1: Persistent Multi-Match Live Watch Dock */}
      <MultiMatchLiveDock isPhoneView={isPhoneView} />

      {/* Top Competitions Ribbon (All 5 Required Euro Football Leagues + Global Tourneys) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {COMPETITIONS.slice(0, 8).map((comp) => {
          const starred = followedCompetitions.includes(comp.id);
          return (
            <div
              key={comp.id}
              className="h-8 px-2.5 rounded-[9px] bg-[#091922] hover:bg-[#0F2633] border border-[#163443] flex items-center gap-1.5 shrink-0 transition-colors"
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
                className="text-[#5A7B89] hover:text-[#F5B82E]"
                title={`Follow ${comp.name}`}
              >
                <Star
                  className={`w-3 h-3 ${
                    starred ? 'fill-[#F5B82E] text-[#F5B82E]' : ''
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Sport Filter Strip */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-[#142D39] pb-2">
        {sportTabs.map((sp) => {
          const active = sportFilter === sp.id;
          return (
            <button
              key={sp.id}
              type="button"
              onClick={() => setSportFilter(sp.id)}
              className={`h-8 px-3 rounded-[8px] text-[12px] font-bold flex items-center gap-1.5 shrink-0 transition-colors ${
                active
                  ? 'bg-[#143848] text-[#2CE5F6] border border-[#2CE5F6]/45'
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

      {/* Main 12-Col Arena Workspace: Live Action (8 Cols) + Starting Soon & Cash-Out (4 Cols) */}
      <div
        className={
          isPhoneView
            ? 'space-y-4'
            : 'grid grid-cols-1 lg:grid-cols-12 gap-4 items-start'
        }
      >
        {/* Left 8 Cols: Live Now Arena */}
        <section className={isPhoneView ? 'space-y-2.5' : 'lg:col-span-8 space-y-2.5'}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Radio className="w-4 h-4 text-[#FF2E63] animate-pulse shrink-0" />
              <h2 className="text-[13.5px] sm:text-[14px] font-extrabold text-white uppercase tracking-tight truncate">
                {isPhoneView ? 'Live Now' : 'Live Now · Pin Any Match to Dock'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#FF2E63]/15 text-[#FF5C85] text-[11px] font-extrabold tabular-nums shrink-0">
                {liveMatches.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigateTo('live')}
              className="text-[11.5px] font-bold text-[#2CE5F6] hover:underline whitespace-nowrap shrink-0"
            >
              {isPhoneView ? 'All Live →' : 'View All Live →'}
            </button>
          </div>

          {unpinnedFirstLive.length === 0 ? (
            <div className="rounded-[13px] bg-[#091922] border border-[#193847] p-4 flex items-center gap-3">
              <Clock className="w-4 h-4 text-[#B9F6EC] shrink-0" />
              <div className="text-[12.5px] text-[#DCEAF0]">
                <strong className="text-white">Nothing live right now</strong> —
                browse <strong className="text-[#2CE5F6]">Starting soon</strong>{' '}
                fixtures to pin upcoming kickoffs to your Dock.
              </div>
            </div>
          ) : (
            <div
              className={
                isPhoneView
                  ? 'space-y-2.5'
                  : 'grid grid-cols-1 md:grid-cols-2 gap-2.5'
              }
            >
              {unpinnedFirstLive.map((m) => (
                <ArenaMatchCard
                  key={m.id}
                  match={m}
                  isPhoneView={isPhoneView}
                />
              ))}
            </div>
          )}
        </section>

        {/* Right 4 Cols: Open Cash-Out Ticket + Starting Soon Kickoff Radar */}
        <aside className={isPhoneView ? 'space-y-3' : 'lg:col-span-4 space-y-3'}>
          {openBet && (
            <div className="rounded-[13px] bg-gradient-to-br from-[#0D2835] to-[#081720] border border-[#2CE5F6]/35 p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-[#2CE5F6]">
                <span>Active Open Single</span>
                <button
                  type="button"
                  onClick={() => navigateTo('mybets')}
                  className="text-[#9AB7C4] hover:text-white normal-case font-bold"
                >
                  All My Bets →
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[13px] font-extrabold text-white truncate">
                    {openBet.selectionLabel} @ {openBet.odds.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-[#8AA9B6] truncate">
                    {openBet.matchTitle} · Stake ${openBet.stake.toFixed(2)}
                  </div>
                </div>
                {openBet.cashOutOffer && (
                  <button
                    type="button"
                    onClick={() => cashOutBet(openBet.id)}
                    className="h-8 px-3 rounded-[8px] bg-[#B9F6EC] hover:bg-[#9FEFE2] text-[#06181F] text-[11.5px] font-extrabold flex items-center gap-1 shrink-0 transition-colors"
                  >
                    <UsdtBadge className="w-3.5 h-3.5" />
                    <span>Cash out ${openBet.cashOutOffer.toFixed(2)}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Starting Soon Radar */}
          <div className="rounded-[13px] bg-[#08161E] border border-[#173544] overflow-hidden">
            <div className="px-3.5 py-2.5 bg-[#0B1E28] border-b border-[#163342] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#2CE5F6]" />
                <span className="text-[13px] font-extrabold text-white">
                  Starting Soon
                </span>
              </div>
              <span className="text-[10.5px] font-bold text-[#7A9AA8]">
                Next Kickoffs
              </span>
            </div>

            <div className="divide-y divide-[#122935]">
              {startingSoonMatches.map((m) => (
                <div
                  key={m.id}
                  onClick={() => navigateTo('match', { matchId: m.id })}
                  className="px-3.5 py-2.5 hover:bg-[#0C202B] cursor-pointer transition-colors flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10.5px] text-[#7D9CA9]">
                      <SportIcon
                        sport={m.sportId}
                        className="w-3 h-3 text-[#2CE5F6]"
                      />
                      <span className="truncate">{m.competitionName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-white truncate">
                      <TeamCrest
                        teamId={m.homeTeam.id}
                        teamName={m.homeTeam.name}
                        size="xs"
                      />
                      <span className="truncate">{m.homeTeam.shortName}</span>
                      <span className="text-[#5E7F8D] font-bold">v</span>
                      <TeamCrest
                        teamId={m.awayTeam.id}
                        teamName={m.awayTeam.name}
                        size="xs"
                      />
                      <span className="truncate">{m.awayTeam.shortName}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="px-2 py-0.5 rounded bg-[#112D3B] text-[#2CE5F6] text-[10.5px] font-extrabold tabular-nums">
                      {m.startsInMinutes && m.startsInMinutes <= 90
                        ? `in ${m.startsInMinutes}m`
                        : m.startTime}
                    </div>
                    <div className="text-[10.5px] font-bold text-[#9AB7C4] tabular-nums mt-0.5">
                      {m.mainOdds.home.toFixed(2)} / {m.mainOdds.away.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Signature Feature #2: Housebets Casino-Native Live USDT Singles Bet-Stream */}
      <CasinoLiveBetStream isPhoneView={isPhoneView} />
    </div>
  );
};
