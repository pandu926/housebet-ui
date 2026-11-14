import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
import { useSportsbook } from '../context/SportsbookContext';
import { COMPETITIONS, SportId } from '../data/sportsbookData';
import { CompetitionFlag, TeamCrest } from '../components/BrandIcons';
import {
  buildMatchRowSelections,
  MarketDisplayType,
  MatchTradingTile,
} from '../components/MatchRowAndCard';
import { OddsButton } from '../components/OddsButton';
import { getClubColor, MiniOddsSparkline } from '../components/OddsSparkline';

const SPORT_LABELS: Record<SportId, string> = {
  soccer: 'Football · Top 5 Europe',
  tennis: 'Tennis Tour',
  basketball: 'Basketball',
  baseball: 'Baseball',
  'american-football': 'American Football',
  'ice-hockey': 'Ice Hockey',
  esports: 'Esports',
};

export const FootballPage: React.FC<{ isPhoneView?: boolean }> = ({
  isPhoneView = false,
}) => {
  const {
    matches,
    selectedSport,
    selectedCompetition,
    setSelectedCompetition,
    followedCompetitions,
    toggleFollowCompetition,
    simulateNothingLive,
    navigateTo,
  } = useSportsbook();

  const currentSport: SportId =
    selectedSport === 'all' ? 'soccer' : selectedSport;

  const [marketMode, setMarketMode] = useState<MarketDisplayType>('1x2');
  const [timeFilter, setTimeFilter] = useState<'all' | 'live'>('all');

  // Competitions for the active sport (Starred pinned to #1)
  const sportLeagues = useMemo(() => {
    const base = COMPETITIONS.filter((c) => c.sportId === currentSport);
    return [...base].sort((a, b) => {
      const aStar = followedCompetitions.includes(a.id) ? 1 : 0;
      const bStar = followedCompetitions.includes(b.id) ? 1 : 0;
      return bStar - aStar;
    });
  }, [currentSport, followedCompetitions]);

  const activeCompId =
    selectedCompetition !== 'all' &&
    sportLeagues.some((l) => l.id === selectedCompetition)
      ? selectedCompetition
      : 'all';

  const sportMatches = useMemo(() => {
    return matches.filter((m) => {
      if (m.sportId !== currentSport) return false;
      if (simulateNothingLive && m.isLive) return false;
      if (activeCompId !== 'all' && m.competitionId !== activeCompId) return false;
      if (timeFilter === 'live' && !m.isLive) return false;
      return true;
    });
  }, [matches, currentSport, simulateNothingLive, activeCompId, timeFilter]);

  const showHeadlineBanner = sportMatches.length > 2;
  const headlineClash = showHeadlineBanner ? sportMatches[0] : undefined;
  const headlineSelections = useMemo(
    () => (headlineClash ? buildMatchRowSelections(headlineClash, '1x2') : []),
    [headlineClash]
  );

  return (
    <div className="pb-6">
      {/* Mobile Horizontal League Strip */}
      {isPhoneView && sportLeagues.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-3.5 pb-0.5">
          <button
            type="button"
            onClick={() => setSelectedCompetition('all')}
            className={`h-[34px] px-3 rounded-full text-[12px] font-extrabold shrink-0 border ${
              activeCompId === 'all'
                ? 'bg-[#133544] border-[#2CE5F6] text-white'
                : 'bg-[#091921] border-white/[0.07] text-[#84A2AF]'
            }`}
          >
            All Leagues
          </button>
          {sportLeagues.map((lg) => {
            const active = activeCompId === lg.id;
            const starred = followedCompetitions.includes(lg.id);
            return (
              <div
                key={lg.id}
                className={`h-[34px] px-3 rounded-full text-[12px] font-bold flex items-center gap-1.5 shrink-0 border ${
                  active
                    ? 'bg-[#133544] border-[#2CE5F6] text-white'
                    : 'bg-[#091921] border-white/[0.07] text-[#B8D2DD]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedCompetition(lg.id)}
                  className="flex items-center gap-1.5"
                >
                  <CompetitionFlag flagId={lg.id} className="w-3.5 h-3.5" />
                  <span>{lg.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleFollowCompetition(lg.id)}
                >
                  <Star
                    className={`w-3.5 h-3.5 ${
                      starred ? 'fill-[#F5B82E] text-[#F5B82E]' : 'text-[#6A8A98]'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ASYMMETRIC 2-PANE SPORT HUB (Soccer 5 Top European Leagues + All Other Sports) */}
      <div className="flex items-start gap-4">
        {/* Left Sticky Competition Rail (Desktop) */}
        {!isPhoneView && (
          <aside className="hidden lg:flex flex-col w-[236px] shrink-0 sticky top-[72px] rounded-[16px] bg-[#08171F] border border-white/[0.08] p-3 space-y-2">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#7896A3]">
                {SPORT_LABELS[currentSport]}
              </span>
              <span className="text-[10px] font-bold text-[#2CE5F6]">★ Pin #1</span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedCompetition('all')}
              className={`w-full h-[38px] px-3 rounded-[10px] text-[12.5px] font-extrabold flex items-center justify-between transition-colors ${
                activeCompId === 'all'
                  ? 'bg-[#133544] text-white border border-[#2CE5F6]/40'
                  : 'text-[#9CB7C4] hover:bg-[#0D222D] hover:text-white'
              }`}
            >
              <span>All Competitions</span>
              <span className="text-[11px] text-[#2CE5F6] tabular-nums">
                {matches.filter((m) => m.sportId === currentSport).length}
              </span>
            </button>

            <div className="space-y-1 pt-1 border-t border-white/[0.06]">
              {sportLeagues.map((lg) => {
                const isSelected = activeCompId === lg.id;
                const isStarred = followedCompetitions.includes(lg.id);
                const lgMatches = matches.filter((m) => m.competitionId === lg.id);
                const lgLive = simulateNothingLive
                  ? 0
                  : lgMatches.filter((m) => m.isLive).length;

                return (
                  <div
                    key={lg.id}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-[10px] transition-all border ${
                      isSelected
                        ? 'bg-[#11303E] border-[#2CE5F6]/40 text-white'
                        : 'border-transparent hover:bg-[#0D212B] text-[#C8DCE4]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedCompetition(lg.id)}
                      className="flex items-center gap-2.5 min-w-0 text-left flex-1"
                    >
                      <CompetitionFlag flagId={lg.id} className="w-4 h-4 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-bold truncate">
                          {lg.name}
                        </div>
                        <div className="text-[10.5px] text-[#6E8E9B] flex items-center gap-1.5">
                          <span>{lg.country}</span>
                          {lgLive > 0 && (
                            <span className="text-[#FF5C85] font-bold">
                              · {lgLive} live
                            </span>
                          )}
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleFollowCompetition(lg.id)}
                      className="p-1 text-[#6A8A98] hover:text-[#F5B82E]"
                      title={`Follow ${lg.name}`}
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
          </aside>
        )}

        {/* Right Fluid Matchday Workspace */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Headline Clash Banner (Apple Sports Color-Bleed) */}
          {headlineClash && (
            <div
              onClick={() => navigateTo('match', { matchId: headlineClash.id })}
              className="rounded-[17px] bg-[#091921] border border-[#1E4252] p-4 sm:p-5 cursor-pointer group transition-all hover:border-[#2CE5F6]/55"
              style={{
                backgroundImage: `radial-gradient(90% 90% at 0% 0%, ${getClubColor(
                  headlineClash.homeTeam.id
                )}28 0%, transparent 55%), radial-gradient(90% 90% at 100% 0%, ${getClubColor(
                  headlineClash.awayTeam.id
                )}22 0%, transparent 55%)`,
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <CompetitionFlag
                    flagId={headlineClash.competitionId}
                    className="w-4 h-4"
                  />
                  <span className="text-[11.5px] font-extrabold uppercase tracking-wider text-[#B8D2DD]">
                    {headlineClash.competitionName} · Featured Clash
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <MiniOddsSparkline
                    seedKey={headlineClash.id}
                    currentOdds={headlineClash.mainOdds.home}
                    width={64}
                    height={20}
                  />
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-[#2CE5F6]">
                    <span>+{headlineClash.totalMarketsCount} markets</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <TeamCrest
                      teamId={headlineClash.homeTeam.id}
                      teamName={headlineClash.homeTeam.name}
                      size="lg"
                    />
                    <span className="text-[16px] sm:text-[18px] font-black text-white">
                      {headlineClash.homeTeam.name}
                    </span>
                  </div>

                  <div className="px-3 py-1 rounded-[10px] bg-[#061218]/90 border border-white/[0.08] text-center shrink-0">
                    {headlineClash.isLive ? (
                      <div className="text-[17px] font-black text-white tabular-nums">
                        {headlineClash.homeTeam.score ?? 0} :{' '}
                        {headlineClash.awayTeam.score ?? 0}
                        <span className="ml-2 text-[11px] text-[#FF5C85]">
                          {headlineClash.clock}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[13px] font-extrabold text-[#B8D2DD] tabular-nums">
                        {headlineClash.startTime} · {headlineClash.startDate}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-[16px] sm:text-[18px] font-black text-white">
                      {headlineClash.awayTeam.name}
                    </span>
                    <TeamCrest
                      teamId={headlineClash.awayTeam.id}
                      teamName={headlineClash.awayTeam.name}
                      size="lg"
                    />
                  </div>
                </div>

                <div
                  className={`grid gap-2 xl:w-[330px] shrink-0 ${
                    headlineSelections.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                  }`}
                >
                  {headlineSelections.map((sel) => (
                    <OddsButton
                      key={sel.id}
                      selection={sel}
                      variant="stacked"
                      compact
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Filter & Market Mode Bar */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-[#08161D] p-1 rounded-[10px] border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setTimeFilter('all')}
                className={`h-[30px] px-3 rounded-[7px] text-[12px] font-extrabold transition-colors ${
                  timeFilter === 'all'
                    ? 'bg-[#133544] text-white'
                    : 'text-[#84A2AF] hover:text-white'
                }`}
              >
                All Fixtures ({sportMatches.length})
              </button>
              <button
                type="button"
                onClick={() => setTimeFilter('live')}
                className={`h-[30px] px-3 rounded-[7px] text-[12px] font-extrabold flex items-center gap-1.5 transition-colors ${
                  timeFilter === 'live'
                    ? 'bg-[#133544] text-white'
                    : 'text-[#84A2AF] hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E63]" />
                <span>In-Play Only</span>
              </button>
            </div>

            {currentSport === 'soccer' && (
              <div className="flex items-center gap-1 bg-[#08161D] p-1 rounded-[10px] border border-white/[0.06] text-[11.5px] font-bold">
                {(
                  [
                    { id: '1x2', label: 'Match Result' },
                    { id: 'ou', label: 'Over / Under' },
                    { id: 'btts', label: 'Both Score' },
                  ] as const
                ).map((mOpt) => (
                  <button
                    key={mOpt.id}
                    type="button"
                    onClick={() => setMarketMode(mOpt.id)}
                    className={`px-2.5 py-1 rounded-[7px] transition-colors ${
                      marketMode === mOpt.id
                        ? 'bg-[#153949] text-white'
                        : 'text-[#7896A3] hover:text-white'
                    }`}
                  >
                    {mOpt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grouped by Competition in 2-Column Trading Tiles (Excludes Headline Clash so 0 matches repeat!) */}
          {sportLeagues
            .filter((lg) => activeCompId === 'all' || lg.id === activeCompId)
            .map((lg) => {
              const lgRows = sportMatches.filter(
                (m) => m.competitionId === lg.id && m.id !== headlineClash?.id
              );
              if (lgRows.length === 0) return null;
              const isStarred = followedCompetitions.includes(lg.id);

              return (
                <section key={lg.id} className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <CompetitionFlag flagId={lg.id} className="w-4 h-4" />
                      <h3 className="text-[14px] font-extrabold text-white">
                        {lg.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => toggleFollowCompetition(lg.id)}
                        className="text-[#6A8A98] hover:text-[#F5B82E]"
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            isStarred ? 'fill-[#F5B82E] text-[#F5B82E]' : ''
                          }`}
                        />
                      </button>
                    </div>
                    <span className="text-[11px] font-semibold text-[#7896A3]">
                      {lgRows.length} {lgRows.length === 1 ? 'match' : 'matches'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {lgRows.map((m) => (
                      <MatchTradingTile
                        key={m.id}
                        match={m}
                        marketType={currentSport === 'soccer' ? marketMode : '1x2'}
                        showLeagueBadge={false}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
        </div>
      </div>
    </div>
  );
};
