import React, { useMemo, useState } from 'react';
import { Clock, Radio, RotateCcw } from 'lucide-react';
import { useSportsbook } from '../../context/SportsbookContext';
import { COMPETITIONS, SportId } from '../../data/sportsbookData';
import { CompetitionFlag, SportIcon } from '../../components/BrandIcons';
import { MultiMatchLiveDock } from './MultiMatchLiveDock';
import { ArenaMatchCard } from './ArenaMatchCard';

export const ArenaLivePage: React.FC<{ isPhoneView?: boolean }> = ({
  isPhoneView = false,
}) => {
  const { matches, simulateNothingLive, setSimulateNothingLive } =
    useSportsbook();

  const [sportFilter, setSportFilter] = useState<'all' | SportId>('all');
  const [compFilter, setCompFilter] = useState<'all' | string>('all');

  const allLive = useMemo(
    () => (simulateNothingLive ? [] : matches.filter((m) => m.isLive)),
    [matches, simulateNothingLive]
  );

  const filteredLive = useMemo(() => {
    return allLive.filter((m) => {
      if (sportFilter !== 'all' && m.sportId !== sportFilter) return false;
      if (compFilter !== 'all' && m.competitionId !== compFilter) return false;
      return true;
    });
  }, [allLive, sportFilter, compFilter]);

  const liveCompetitions = useMemo(() => {
    const subset =
      sportFilter === 'all'
        ? allLive
        : allLive.filter((m) => m.sportId === sportFilter);
    const ids = new Set(subset.map((m) => m.competitionId));
    return COMPETITIONS.filter((c) => ids.has(c.id));
  }, [allLive, sportFilter]);

  const startingSoonFallback = useMemo(
    () =>
      matches
        .filter((m) => !m.isLive)
        .filter((m) => (sportFilter === 'all' ? true : m.sportId === sportFilter))
        .sort((a, b) => (a.startsInMinutes ?? 999) - (b.startsInMinutes ?? 999)),
    [matches, sportFilter]
  );

  const sportList: Array<{ id: 'all' | SportId; label: string }> = [
    { id: 'all', label: 'All Live' },
    { id: 'soccer', label: 'Soccer' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'basketball', label: 'Basketball' },
    { id: 'baseball', label: 'Baseball' },
    { id: 'american-football', label: 'NFL' },
    { id: 'ice-hockey', label: 'Hockey' },
    { id: 'esports', label: 'Esports' },
  ];

  return (
    <div className="space-y-3.5">
      {!simulateNothingLive && <MultiMatchLiveDock isPhoneView={isPhoneView} />}

      {/* Live Filter Header */}
      <div className="rounded-[13px] bg-[#08161E] border border-[#173544] p-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#FF2E63] animate-pulse" />
            <h1 className="text-[15px] font-extrabold text-white">
              Live In-Play Arena
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#FF2E63]/15 text-[#FF5C85] text-[11px] font-extrabold tabular-nums">
              {filteredLive.length} Live
            </span>
          </div>

          {simulateNothingLive && (
            <button
              type="button"
              onClick={() => setSimulateNothingLive(false)}
              className="h-7 px-2.5 rounded-[7px] bg-[#143746] text-[11px] font-extrabold text-[#2CE5F6] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restore Live Matches</span>
            </button>
          )}
        </div>

        {/* Sport Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {sportList.map((sp) => {
            const count =
              sp.id === 'all'
                ? allLive.length
                : allLive.filter((m) => m.sportId === sp.id).length;
            const active = sportFilter === sp.id;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() => {
                  setSportFilter(sp.id);
                  setCompFilter('all');
                }}
                className={`h-8 px-2.5 rounded-[8px] text-[12px] font-bold flex items-center gap-1.5 shrink-0 transition-colors ${
                  active
                    ? 'bg-[#143848] text-white border border-[#2CE5F6]/45'
                    : 'bg-[#0B1D27] text-[#84A3B0] hover:text-white'
                }`}
              >
                {sp.id !== 'all' && (
                  <SportIcon sport={sp.id} className="w-3.5 h-3.5" />
                )}
                <span>{sp.label}</span>
                <span className="text-[10.5px] font-extrabold text-[#2CE5F6] tabular-nums">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Competition Pills */}
        {liveCompetitions.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => setCompFilter('all')}
              className={`h-7 px-2.5 rounded-[7px] text-[11px] font-bold shrink-0 ${
                compFilter === 'all'
                  ? 'bg-[#2CE5F6]/15 text-[#2CE5F6] border border-[#2CE5F6]/40'
                  : 'text-[#7F9EAC] hover:text-white'
              }`}
            >
              All Competitions
            </button>
            {liveCompetitions.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCompFilter(c.id)}
                className={`h-7 px-2.5 rounded-[7px] text-[11px] font-bold flex items-center gap-1.5 shrink-0 ${
                  compFilter === c.id
                    ? 'bg-[#2CE5F6]/15 text-[#2CE5F6] border border-[#2CE5F6]/40'
                    : 'bg-[#0B1C25] text-[#9AB7C4] hover:text-white'
                }`}
              >
                <CompetitionFlag flagId={c.id} className="w-3.5 h-3.5" />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Live Cards or Required "Nothing Live -> Starting Soon" Fallback */}
      {filteredLive.length === 0 ? (
        <div className="space-y-3">
          <div className="rounded-[13px] bg-[#0A1D26] border border-[#1D4050] p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#123342] border border-[#2CE5F6]/35 flex items-center justify-center text-[#B9F6EC] shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[14px] font-extrabold text-white">
                  Nothing live right now — Showing Starting soon
                </div>
                <div className="text-[12px] text-[#86A4B1]">
                  No matches currently in play. Pin or bet on upcoming Starting soon fixtures below.
                </div>
              </div>
            </div>
          </div>

          <div
            className={
              isPhoneView
                ? 'space-y-2.5'
                : 'grid grid-cols-1 md:grid-cols-2 gap-3'
            }
          >
            {startingSoonFallback.map((m) => (
              <ArenaMatchCard key={m.id} match={m} isPhoneView={isPhoneView} />
            ))}
          </div>
        </div>
      ) : (
        <div
          className={
            isPhoneView
              ? 'space-y-2.5'
              : 'grid grid-cols-1 md:grid-cols-2 gap-3'
          }
        >
          {filteredLive.map((m) => (
            <ArenaMatchCard key={m.id} match={m} isPhoneView={isPhoneView} />
          ))}
        </div>
      )}
    </div>
  );
};
