import React, { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { useSportsbook } from '../../context/SportsbookContext';
import { COMPETITIONS, SportId } from '../../data/sportsbookData';
import { CompetitionFlag, SportIcon } from '../../components/BrandIcons';
import { FlashStakeToolbar, MobileMatrixMarketCol } from './FlashStakeToolbar';
import { MatrixCompetitionTable } from './MatrixMatchTable';

const SPORT_LABELS: Record<SportId, string> = {
  soccer: 'Football',
  tennis: 'Tennis',
  basketball: 'Basketball',
  baseball: 'Baseball',
  'american-football': 'American Football',
  'ice-hockey': 'Ice Hockey',
  esports: 'Esports',
};

export const MatrixFootballPage: React.FC<{ isPhoneView?: boolean }> = ({
  isPhoneView = false,
}) => {
  const {
    matches,
    selectedSport,
    selectedCompetition,
    setSelectedCompetition,
    followedCompetitions,
    toggleFollowCompetition,
    followedTeams,
    simulateNothingLive,
  } = useSportsbook();

  const [onlyFollowed, setOnlyFollowed] = useState<boolean>(false);
  const [mobileCol, setMobileCol] = useState<MobileMatrixMarketCol>('1x2');

  const activeSport: SportId =
    selectedSport === 'all' ? 'soccer' : selectedSport;

  const sportCompetitions = useMemo(
    () => COMPETITIONS.filter((c) => c.sportId === activeSport),
    [activeSport]
  );

  const sportMatches = useMemo(() => {
    return matches
      .filter((m) => m.sportId === activeSport)
      .map((m) => (simulateNothingLive && m.isLive ? { ...m, isLive: false } : m))
      .filter((m) => {
        if (
          selectedCompetition !== 'all' &&
          m.competitionId !== selectedCompetition
        ) {
          return false;
        }
        if (onlyFollowed) {
          return (
            followedCompetitions.includes(m.competitionId) ||
            followedTeams.includes(m.homeTeam.id) ||
            followedTeams.includes(m.awayTeam.id)
          );
        }
        return true;
      });
  }, [
    matches,
    activeSport,
    selectedCompetition,
    onlyFollowed,
    followedCompetitions,
    followedTeams,
    simulateNothingLive,
  ]);

  const orderedCompGroups = useMemo(() => {
    const comps = [...sportCompetitions].sort((a, b) => {
      const aPin = followedCompetitions.includes(a.id) ? 0 : 1;
      const bPin = followedCompetitions.includes(b.id) ? 0 : 1;
      return aPin - bPin;
    });

    return comps
      .map((c) => ({
        comp: c,
        matches: sportMatches.filter((m) => m.competitionId === c.id),
      }))
      .filter((g) => g.matches.length > 0);
  }, [sportCompetitions, sportMatches, followedCompetitions]);

  return (
    <div className="space-y-3.5">
      <FlashStakeToolbar
        isPhoneView={isPhoneView}
        mobileCol={mobileCol}
        onChangeMobileCol={setMobileCol}
      />

      {/* Mobile Competition Pills */}
      {isPhoneView && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSelectedCompetition('all')}
            className={`h-8 px-3 rounded-[8px] text-[11.5px] font-extrabold shrink-0 ${
              selectedCompetition === 'all'
                ? 'bg-[#143848] text-[#2CE5F6] border border-[#2CE5F6]/45'
                : 'bg-[#091922] text-[#8AA7B4] border border-[#163341]'
            }`}
          >
            All {SPORT_LABELS[activeSport]}
          </button>
          {sportCompetitions.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCompetition(c.id)}
              className={`h-8 px-2.5 rounded-[8px] text-[11.5px] font-bold flex items-center gap-1.5 shrink-0 ${
                selectedCompetition === c.id
                  ? 'bg-[#143848] text-white border border-[#2CE5F6]/45'
                  : 'bg-[#091922] text-[#B8D0DB] border border-[#163341]'
              }`}
            >
              <CompetitionFlag flagId={c.id} className="w-3.5 h-3.5" />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}

      <div
        className={
          isPhoneView
            ? 'space-y-3'
            : 'grid grid-cols-1 lg:grid-cols-12 gap-4 items-start'
        }
      >
        {/* Left Sticky Competition Rail (Desktop) */}
        {!isPhoneView && (
          <aside className="hidden lg:block lg:col-span-3 rounded-[12px] bg-[#08161E] border border-[#163341] p-3 sticky top-[68px] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SportIcon
                  sport={activeSport}
                  className="w-4 h-4 text-[#2CE5F6]"
                />
                <span className="text-[13.5px] font-extrabold text-white">
                  {SPORT_LABELS[activeSport]} Leagues
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOnlyFollowed((v) => !v)}
                className={`h-6 px-2 rounded-[6px] text-[10.5px] font-extrabold flex items-center gap-1 transition-colors ${
                  onlyFollowed
                    ? 'bg-[#F5B82E]/20 text-[#F5B82E] border border-[#F5B82E]/40'
                    : 'bg-[#0D212C] text-[#84A3B0] hover:text-white'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                <span>Followed</span>
              </button>
            </div>

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCompetition('all')}
                className={`w-full h-9 px-2.5 rounded-[8px] text-[12px] font-bold flex items-center justify-between transition-colors ${
                  selectedCompetition === 'all'
                    ? 'bg-[#133645] text-[#2CE5F6] border border-[#2CE5F6]/35'
                    : 'text-[#C8DEE7] hover:bg-[#0D212C]'
                }`}
              >
                <span>All Competitions</span>
                <span className="text-[11px] text-[#7D9CA9] tabular-nums">
                  {matches.filter((m) => m.sportId === activeSport).length}
                </span>
              </button>

              {sportCompetitions.map((comp) => {
                const count = matches.filter(
                  (m) => m.competitionId === comp.id
                ).length;
                const isPinned = followedCompetitions.includes(comp.id);
                const isSelectedComp = selectedCompetition === comp.id;

                return (
                  <div
                    key={comp.id}
                    className={`w-full h-9 px-2.5 rounded-[8px] flex items-center justify-between transition-colors ${
                      isSelectedComp
                        ? 'bg-[#133645] text-white border border-[#2CE5F6]/35'
                        : 'text-[#C8DEE7] hover:bg-[#0D212C]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedCompetition(comp.id)}
                      className="flex items-center gap-2 min-w-0 flex-1 text-left text-[12px] font-bold"
                    >
                      <CompetitionFlag
                        flagId={comp.id}
                        className="w-4 h-4 shrink-0"
                      />
                      <span className="truncate">{comp.name}</span>
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-[#7D9CA9] tabular-nums">
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFollowCompetition(comp.id)}
                        className="text-[#5C7D8B] hover:text-[#F5B82E]"
                        title={`Follow ${comp.name}`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            isPinned ? 'fill-[#F5B82E] text-[#F5B82E]' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Right 9 Cols: Simultaneous 3-Market Pro Matrix Tables */}
        <div className={isPhoneView ? 'space-y-3' : 'lg:col-span-9 space-y-3'}>
          {orderedCompGroups.length === 0 ? (
            <div className="rounded-[12px] bg-[#08161E] border border-[#163341] p-6 text-center space-y-2">
              <div className="text-[14px] font-extrabold text-white">
                No fixtures match your filter
              </div>
              <button
                type="button"
                onClick={() => {
                  setOnlyFollowed(false);
                  setSelectedCompetition('all');
                }}
                className="h-8 px-3 rounded-[8px] bg-[#143746] text-[12px] font-bold text-[#2CE5F6]"
              >
                Reset Competition Filter
              </button>
            </div>
          ) : (
            orderedCompGroups.map((g) => (
              <MatrixCompetitionTable
                key={g.comp.id}
                competitionId={g.comp.id}
                competitionName={g.comp.name}
                sportId={g.comp.sportId}
                matches={g.matches}
                isPhoneView={isPhoneView}
                mobileCol={mobileCol}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
