import React, { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  Clock,
  Flame,
  Lock,
  Star,
  Users,
} from 'lucide-react';
import { useSportsbook } from '../context/SportsbookContext';
import { COMPETITIONS, MatchItem, SportId } from '../data/sportsbookData';
import {
  CompetitionFlag,
  SportIcon,
  TeamCrest,
} from '../components/BrandIcons';
import { buildMatchRowSelections } from '../components/MatchRowAndCard';
import { OddsButton } from '../components/OddsButton';
import { getClubColor, MiniOddsSparkline } from '../components/OddsSparkline';

type LiveFilterId = 'all' | 'soccer' | 'tennis' | 'basketball' | 'following';

export const SportsHomePage: React.FC<{ isPhoneView?: boolean }> = () => {
  const {
    matches,
    followedTeams,
    followedCompetitions,
    toggleFollowTeam,
    toggleFollowCompetition,
    navigateTo,
    simulateNothingLive,
    communityBets,
    copyCommunityBet,
    isSelected,
  } = useSportsbook();

  const [liveFilter, setLiveFilter] = useState<LiveFilterId>('all');

  const liveMatches = useMemo(
    () => (simulateNothingLive ? [] : matches.filter((m) => m.isLive)),
    [matches, simulateNothingLive]
  );

  const startingSoonMatches = useMemo(
    () =>
      matches
        .filter((m) => !m.isLive)
        .sort((a, b) => (a.startsInMinutes ?? 999) - (b.startsInMinutes ?? 999)),
    [matches]
  );

  // 1. MARQUEE SHOWCASE: 3 distinct cross-sport clashes (never repeated in the lists below!)
  const marqueeMatches = useMemo(() => {
    if (liveMatches.length > 0) {
      const preferredIds = ['ars-bha', 'alc-sin', 'rma-bay'];
      const picked = preferredIds
        .map((id) => matches.find((m) => m.id === id))
        .filter((m): m is MatchItem => Boolean(m));
      if (picked.length === 3) return picked;
      return liveMatches.slice(0, 3);
    }
    return startingSoonMatches.slice(0, 3);
  }, [liveMatches, startingSoonMatches, matches]);

  const marqueeIds = useMemo(
    () => new Set(marqueeMatches.map((m) => m.id)),
    [marqueeMatches]
  );

  // 2. TOP 5 EUROPEAN COMPETITIONS (Starred pinned first — single unified place for league favourites)
  const topCompetitions = useMemo(() => {
    const soccerComps = COMPETITIONS.filter((c) => c.sportId === 'soccer');
    return [...soccerComps].sort((a, b) => {
      const aStar = followedCompetitions.includes(a.id) ? 1 : 0;
      const bStar = followedCompetitions.includes(b.id) ? 1 : 0;
      return bStar - aStar;
    });
  }, [followedCompetitions]);

  // Followed count for the inline filter badge
  const followedLiveOrUpcomingCount = useMemo(
    () =>
      matches.filter(
        (m) =>
          (followedCompetitions.includes(m.competitionId) ||
            followedTeams.includes(m.homeTeam.id) ||
            followedTeams.includes(m.awayTeam.id)) &&
          !(simulateNothingLive && m.isLive)
      ).length,
    [matches, followedCompetitions, followedTeams, simulateNothingLive]
  );

  // 3. LIVE NOW BOARD MATCHES (Excludes marquee cards in default view so 0 matches repeat on Home!)
  const boardLiveMatches = useMemo(() => {
    if (liveFilter === 'following') {
      return matches
        .filter(
          (m) =>
            (followedCompetitions.includes(m.competitionId) ||
              followedTeams.includes(m.homeTeam.id) ||
              followedTeams.includes(m.awayTeam.id)) &&
            !(simulateNothingLive && m.isLive)
        )
        .slice(0, 6);
    }

    const basePool = liveMatches.length > 0 ? liveMatches : startingSoonMatches;
    const deduped = basePool.filter((m) => !marqueeIds.has(m.id));

    if (liveFilter === 'all') {
      // Interleave multi-sport live action cleanly (Soccer, NBA, Tennis, NHL, Esports)
      const preferredOrder = [
        'avl-ful',
        'lal-gsw',
        'new-eve',
        'edm-nyr',
        't1-geng',
        'atm-sev',
        'juv-rom',
      ];
      const ordered: MatchItem[] = [];
      preferredOrder.forEach((id) => {
        const found = deduped.find((m) => m.id === id);
        if (found) ordered.push(found);
      });
      deduped.forEach((m) => {
        if (!ordered.some((x) => x.id === m.id)) ordered.push(m);
      });
      return ordered.slice(0, 6);
    }

    return deduped.filter((m) => m.sportId === (liveFilter as SportId)).slice(0, 6);
  }, [
    liveFilter,
    matches,
    followedCompetitions,
    followedTeams,
    simulateNothingLive,
    liveMatches,
    startingSoonMatches,
    marqueeIds,
  ]);

  // 4. STARTING SOON RADAR (Excludes marquee cards so Real Madrid v Bayern never appears twice!)
  const radarUpcomingMatches = useMemo(
    () => startingSoonMatches.filter((m) => !marqueeIds.has(m.id)).slice(0, 4),
    [startingSoonMatches, marqueeIds]
  );

  return (
    <div className="space-y-5 pb-6">
      {/* 1. CROSS-SPORT MARQUEE CLASHES (3-Card Editorial Bento Strip — Compact, Multi-Sport, Zero Chart Bloat) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-extrabold uppercase tracking-wider text-[#92B0BD]">
              Featured Clashes
            </span>
            <span className="text-[11px] text-[#6B8B99] hidden sm:inline">
              · Live &amp; marquee kickoffs across sports
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('live')}
            className="text-[12px] font-bold text-[#2CE5F6] hover:underline"
          >
            Open Live Arena ({liveMatches.length}) →
          </button>
        </div>

        <div className="flex md:grid md:grid-cols-3 gap-3.5 overflow-x-auto no-scrollbar snap-x pb-0.5">
          {marqueeMatches.map((match) => {
            const selections = buildMatchRowSelections(match, '1x2');
            const homeColor = getClubColor(match.homeTeam.id);
            const awayColor = getClubColor(match.awayTeam.id);

            return (
              <div
                key={match.id}
                onClick={() => navigateTo('match', { matchId: match.id })}
                className="w-[306px] md:w-auto shrink-0 snap-start rounded-[16px] bg-[#08171F] border border-[#1B3E4E] hover:border-[#2CE5F6]/55 p-3.5 flex flex-col justify-between relative overflow-hidden cursor-pointer group transition-all shadow-[0_10px_28px_rgba(0,0,0,0.3)]"
                style={{
                  backgroundImage: `radial-gradient(100% 90% at 0% 0%, ${homeColor}26 0%, transparent 58%), radial-gradient(100% 90% at 100% 0%, ${awayColor}22 0%, transparent 58%)`,
                }}
              >
                {/* Top Meta Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <CompetitionFlag
                      flagId={match.competitionId}
                      className="w-3.5 h-3.5 shrink-0"
                    />
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#B8D2DD] truncate">
                      {match.competitionName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {match.isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FF2E63]/20 border border-[#FF2E63]/45 text-[#FF6B8E] text-[10.5px] font-extrabold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E63] animate-pulse" />
                        <span>{match.clock}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0E2733] border border-[#2CE5F6]/30 text-[#8CE9D8] text-[10.5px] font-extrabold tabular-nums">
                        {match.startsInMinutes
                          ? `In ${match.startsInMinutes}m`
                          : match.startTime}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[#2CE5F6]">
                      +{match.totalMarketsCount}
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Club vs Club Editorial Score Row */}
                <div className="space-y-2 mb-3.5">
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <TeamCrest
                        teamId={match.homeTeam.id}
                        teamName={match.homeTeam.name}
                        size="md"
                      />
                      <span className="text-[14.5px] font-extrabold text-white truncate group-hover:text-[#2CE5F6] transition-colors">
                        {match.homeTeam.name}
                      </span>
                    </div>

                    {match.isLive ? (
                      <span className="min-w-[28px] h-7 px-2 rounded-[7px] bg-[#051117]/90 border border-white/[0.1] flex items-center justify-center text-[15px] font-black text-white tabular-nums">
                        {match.homeTeam.score ?? 0}
                      </span>
                    ) : (
                      <MiniOddsSparkline
                        seedKey={match.id}
                        currentOdds={match.mainOdds.home}
                        width={48}
                        height={15}
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <TeamCrest
                        teamId={match.awayTeam.id}
                        teamName={match.awayTeam.name}
                        size="md"
                      />
                      <span className="text-[14.5px] font-extrabold text-[#DCEAF0] truncate group-hover:text-white transition-colors">
                        {match.awayTeam.name}
                      </span>
                    </div>

                    {match.isLive ? (
                      <span className="min-w-[28px] h-7 px-2 rounded-[7px] bg-[#051117]/90 border border-white/[0.06] flex items-center justify-center text-[15px] font-black text-[#9AB6C3] tabular-nums">
                        {match.awayTeam.score ?? 0}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-[#7D9CA9] tabular-nums">
                        {match.startDate} · {match.startTime}
                      </span>
                    )}
                  </div>
                </div>

                {/* Direct 1-Tap Odds Row */}
                <div
                  className={`grid gap-1.5 ${
                    selections.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                  }`}
                >
                  {selections.map((sel) => (
                    <OddsButton
                      key={sel.id}
                      selection={sel}
                      variant="stacked"
                      compact
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. TOP 5 EUROPEAN COMPETITIONS RIBBON (Single Unified League & Star Bar) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-[12px] font-extrabold uppercase tracking-wider text-[#92B0BD]">
            Top Competitions
          </h2>
          <button
            type="button"
            onClick={() =>
              navigateTo('football', { sport: 'soccer', competition: 'all' })
            }
            className="text-[12px] font-bold text-[#8CA8B5] hover:text-white"
          >
            All Football Leagues →
          </button>
        </div>

        <div className="flex lg:grid lg:grid-cols-5 gap-2.5 overflow-x-auto no-scrollbar pb-0.5">
          {topCompetitions.map((comp) => {
            const isStarred = followedCompetitions.includes(comp.id);
            const compMatches = matches.filter((m) => m.competitionId === comp.id);
            const liveCount = simulateNothingLive
              ? 0
              : compMatches.filter((m) => m.isLive).length;

            return (
              <div
                key={comp.id}
                className={`w-[196px] lg:w-auto shrink-0 group rounded-[12px] px-3 py-2.5 border transition-all flex items-center justify-between gap-2 ${
                  isStarred
                    ? 'bg-[#0E2733] border-[#2CE5F6]/40'
                    : 'bg-[#091921] border-white/[0.07] hover:border-[#254E61]'
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    navigateTo('football', {
                      sport: 'soccer',
                      competition: comp.id,
                    })
                  }
                  className="flex items-center gap-2.5 min-w-0 text-left flex-1"
                >
                  <CompetitionFlag flagId={comp.id} className="w-4 h-4 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-extrabold text-white truncate group-hover:text-[#2CE5F6] transition-colors">
                      {comp.name}
                    </div>
                    <div className="text-[10.5px] text-[#7896A3] tabular-nums">
                      {liveCount > 0 ? (
                        <span className="text-[#FF5C85] font-bold">
                          ● {liveCount} live
                        </span>
                      ) : (
                        <span>{compMatches.length} matches</span>
                      )}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => toggleFollowCompetition(comp.id)}
                  className="p-1 text-[#6A8A98] hover:text-[#F5B82E] shrink-0"
                  title={`Follow ${comp.name}`}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      isStarred ? 'fill-[#F5B82E] text-[#F5B82E]' : ''
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SIMULTANEOUS DUAL COMMAND DECK: LIVE NOW (LEFT 7 COLS) + STARTING SOON & PLAYER PROPS (RIGHT 5 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT 7 COLS: MULTI-SPORT IN-PLAY BOARD */}
        <section className="lg:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2E63] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF2E63]" />
              </span>
              <h2 className="text-[14px] font-extrabold text-white tracking-tight">
                Live Now
              </h2>
              <span className="px-1.5 py-0.5 rounded-md bg-[#FF2E63]/15 text-[#FF5C85] text-[11px] font-extrabold tabular-nums">
                {liveMatches.length}
              </span>
            </div>

            {/* Clean Inline Sport + Following Filter */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'soccer', label: 'Soccer' },
                  { id: 'tennis', label: 'Tennis' },
                  { id: 'basketball', label: 'NBA' },
                  {
                    id: 'following',
                    label: `Following (${followedLiveOrUpcomingCount})`,
                    starred: true,
                  },
                ] as Array<{ id: LiveFilterId; label: string; starred?: boolean }>
              ).map((pill) => {
                const active = liveFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setLiveFilter(pill.id)}
                    className={`h-[28px] px-2.5 rounded-[8px] text-[11.5px] font-bold flex items-center gap-1 shrink-0 transition-colors ${
                      active
                        ? 'bg-[#143746] text-white border border-[#2CE5F6]/40'
                        : 'bg-[#091921] text-[#84A2AF] hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {pill.starred && (
                      <Star className="w-3 h-3 text-[#F5B82E] fill-[#F5B82E]" />
                    )}
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {liveMatches.length === 0 && liveFilter !== 'following' && (
            <div className="rounded-[12px] bg-[#0B2029] border border-[#1E4354] px-3.5 py-2.5 text-[12px] text-[#B8D2DD]">
              Nothing live right now — showing{' '}
              <strong className="text-white">Starting soon</strong> fixtures
            </div>
          )}

          <div className="rounded-[16px] bg-[#091921] border border-white/[0.08] divide-y divide-[#132B37] overflow-hidden">
            {boardLiveMatches.length === 0 ? (
              <div className="p-6 text-center text-[13px] text-[#7D9CA9]">
                No matches in this filter right now.{' '}
                <button
                  type="button"
                  onClick={() => setLiveFilter('all')}
                  className="text-[#2CE5F6] font-bold hover:underline ml-1"
                >
                  Show all live matches
                </button>
              </div>
            ) : (
              boardLiveMatches.map((match) => {
                const selections = buildMatchRowSelections(match, '1x2');
                const starred = followedTeams.includes(match.homeTeam.id);
                const homeColor = getClubColor(match.homeTeam.id);
                const awayColor = getClubColor(match.awayTeam.id);

                return (
                  <div
                    key={match.id}
                    onClick={() => navigateTo('match', { matchId: match.id })}
                    className="relative px-3.5 py-3 hover:bg-[#0E2430]/80 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    {/* Left Dual-Club Accent Bar */}
                    <div
                      className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full opacity-85"
                      style={{
                        background: `linear-gradient(to bottom, ${homeColor}, ${awayColor})`,
                      }}
                    />

                    {/* Match Info + Scores */}
                    <div className="flex-1 min-w-0 pl-1.5">
                      <div className="flex items-center justify-between sm:justify-start gap-2 mb-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {match.isLive ? (
                            <span className="px-1.5 py-0.5 rounded bg-[#FF2E63]/20 text-[#FF6B8E] text-[10px] font-extrabold uppercase tracking-wide shrink-0 tabular-nums">
                              {match.clock}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-[#102834] text-[#9AB6C3] text-[10px] font-bold shrink-0 tabular-nums">
                              {match.startTime}
                            </span>
                          )}
                          <SportIcon
                            sport={match.sportId}
                            className="w-3 h-3 text-[#6E8E9B] shrink-0"
                          />
                          <span className="text-[11px] font-semibold text-[#7F9EAC] truncate">
                            {match.competitionName}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFollowTeam(match.homeTeam.id);
                          }}
                          className="text-[#6A8A98] hover:text-[#F5B82E] sm:ml-auto sm:mr-2"
                          title={`Follow ${match.homeTeam.name}`}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              starred ? 'fill-[#F5B82E] text-[#F5B82E]' : ''
                            }`}
                          />
                        </button>
                      </div>

                      <div className="space-y-1.5 pr-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <TeamCrest
                              teamId={match.homeTeam.id}
                              teamName={match.homeTeam.name}
                              size="sm"
                            />
                            <span className="text-[13.5px] font-bold text-white truncate group-hover:text-[#2CE5F6] transition-colors">
                              {match.homeTeam.name}
                            </span>
                          </div>
                          {match.isLive && (
                            <span className="text-[14px] font-black text-white tabular-nums shrink-0">
                              {match.homeTeam.score ?? 0}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <TeamCrest
                              teamId={match.awayTeam.id}
                              teamName={match.awayTeam.name}
                              size="sm"
                            />
                            <span className="text-[13.5px] font-bold text-[#D2E3EA] truncate group-hover:text-white transition-colors">
                              {match.awayTeam.name}
                            </span>
                          </div>
                          {match.isLive && (
                            <span className="text-[14px] font-black text-[#8CA8B5] tabular-nums shrink-0">
                              {match.awayTeam.score ?? 0}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Odds Execution Buttons */}
                    <div className="w-full sm:w-[264px] xl:w-[292px] shrink-0">
                      {match.suspended ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="h-[44px] w-full rounded-[10px] bg-[#0D2029] border border-[#243E4B] flex items-center justify-center gap-1.5 text-[#F59E0B]"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span className="text-[11.5px] font-bold">Suspended</span>
                        </div>
                      ) : (
                        <div
                          className={`grid gap-1.5 ${
                            selections.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                          }`}
                        >
                          {selections.map((sel) => (
                            <OddsButton
                              key={sel.id}
                              selection={sel}
                              variant="stacked"
                              compact
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            <div className="px-4 py-2.5 bg-[#07141B] flex items-center justify-between">
              <span className="text-[11.5px] text-[#7896A3]">
                Real-time USDT decimal odds · Singles only
              </span>
              <button
                type="button"
                onClick={() => navigateTo('live')}
                className="text-[12px] font-extrabold text-[#2CE5F6] hover:underline"
              >
                View all {liveMatches.length} live matches →
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT 5 COLS: STARTING SOON KICKOFF RADAR + CURATED PLAYER PROPS */}
        <div className="lg:col-span-5 space-y-4">
          {/* PANEL A: STARTING SOON (Visible Simultaneously — Never Buried in a Tab!) */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2CE5F6]" />
                <h2 className="text-[14px] font-extrabold text-white tracking-tight">
                  Starting Soon
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('football', { competition: 'all' })}
                className="text-[12px] font-bold text-[#8CA8B5] hover:text-white"
              >
                Full schedule →
              </button>
            </div>

            <div className="rounded-[16px] bg-[#091921] border border-white/[0.08] divide-y divide-[#132B37] overflow-hidden">
              {radarUpcomingMatches.map((match) => {
                const selections = buildMatchRowSelections(match, '1x2');
                return (
                  <div
                    key={match.id}
                    onClick={() => navigateTo('match', { matchId: match.id })}
                    className="p-3.5 hover:bg-[#0E2430]/80 transition-colors cursor-pointer group space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <CompetitionFlag
                          flagId={match.competitionId}
                          className="w-3.5 h-3.5 shrink-0"
                        />
                        <span className="text-[11px] font-semibold text-[#84A2AF] truncate">
                          {match.competitionName}
                        </span>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-[#0E2B36] border border-[#2CE5F6]/25 text-[#8CE9D8] text-[10.5px] font-extrabold tabular-nums shrink-0">
                        {match.startsInMinutes
                          ? `In ${match.startsInMinutes}m`
                          : match.startTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <TeamCrest
                          teamId={match.homeTeam.id}
                          teamName={match.homeTeam.name}
                          size="xs"
                        />
                        <span className="text-[13px] font-extrabold text-white truncate group-hover:text-[#2CE5F6] transition-colors">
                          {match.homeTeam.shortName || match.homeTeam.name}
                        </span>
                        <span className="text-[11px] text-[#5E7E8B] font-bold">v</span>
                        <TeamCrest
                          teamId={match.awayTeam.id}
                          teamName={match.awayTeam.name}
                          size="xs"
                        />
                        <span className="text-[13px] font-extrabold text-[#DCEAF0] truncate">
                          {match.awayTeam.shortName || match.awayTeam.name}
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-[#6E8E9B] tabular-nums shrink-0">
                        {match.startTime}
                      </span>
                    </div>

                    <div
                      className={`grid gap-1.5 ${
                        selections.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                      }`}
                    >
                      {selections.map((sel) => (
                        <OddsButton
                          key={sel.id}
                          selection={sel}
                          variant="stacked"
                          compact
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* PANEL B: TRENDING PLAYER PROPS (Pure Non-1X2 Prop Singles · Zero Match Card Redundancy) */}
          <section className="rounded-[16px] bg-[#091921] border border-white/[0.08] overflow-hidden">
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#132B37] bg-[#07141B]">
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#2CE5F6]" />
                <span className="text-[12.5px] font-extrabold text-white">
                  Trending Player Props
                </span>
              </div>
              <span className="text-[10.5px] font-semibold text-[#7896A3]">
                Copy to slip · $0 stake
              </span>
            </div>

            <div className="divide-y divide-[#132B37]">
              {communityBets.slice(0, 3).map((cb) => {
                const matchObj = matches.find((m) => m.id === cb.selection.matchId);
                const inSlip = isSelected(cb.selection.id);
                return (
                  <div
                    key={cb.id}
                    className="flex items-center justify-between gap-2.5 px-3.5 py-2.5 hover:bg-[#0E2430]/80 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigateTo('match', { matchId: cb.selection.matchId })
                      }
                      className="flex items-center gap-2.5 min-w-0 text-left flex-1 group"
                    >
                      <TeamCrest
                        teamId={matchObj?.homeTeam.id || 'arsenal'}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-extrabold text-white truncate group-hover:text-[#2CE5F6] transition-colors">
                          {cb.selection.label}
                        </div>
                        <div className="text-[10.5px] text-[#7896A3] truncate">
                          {cb.selection.marketName} · {cb.selection.matchTitle}
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[12.5px] font-extrabold text-[#3AD4F7] tabular-nums">
                        {cb.selection.odds.toFixed(2)}
                      </span>
                      <span className="hidden xl:inline-flex items-center gap-1 text-[10.5px] text-[#6E8E9B] tabular-nums">
                        <Users className="w-3 h-3" />
                        {cb.copiedCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyCommunityBet(cb.id)}
                        className={`h-[28px] px-2.5 rounded-[7px] text-[11px] font-extrabold transition-all flex items-center gap-1 ${
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
          </section>
        </div>
      </div>
    </div>
  );
};
