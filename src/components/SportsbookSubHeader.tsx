import React from 'react';
import { Home, Receipt } from 'lucide-react';
import { useSportsbook } from '../context/SportsbookContext';
import { SportId } from '../data/sportsbookData';
import { SportIcon } from './BrandIcons';
import { GlobalSearchBar } from './SearchAndSportNav';

export const SportsbookSubHeader: React.FC<{ isPhoneView?: boolean }> = ({
  isPhoneView = false,
}) => {
  const {
    activePage,
    selectedSport,
    navigateTo,
    matches,
    myBets,
    simulateNothingLive,
  } = useSportsbook();

  const liveCount = simulateNothingLive
    ? 0
    : matches.filter((m) => m.isLive).length;
  const openBets = myBets.filter((b) => b.status === 'Open');

  const sportsList: Array<{ id: SportId; label: string; compactLabel: string }> = [
    { id: 'soccer', label: 'Soccer', compactLabel: 'Soccer' },
    { id: 'tennis', label: 'Tennis', compactLabel: 'Tennis' },
    { id: 'basketball', label: 'Basketball', compactLabel: 'Basketball' },
    { id: 'baseball', label: 'Baseball', compactLabel: 'Baseball' },
    { id: 'american-football', label: 'American Football', compactLabel: 'NFL' },
    { id: 'ice-hockey', label: 'Ice Hockey', compactLabel: 'Hockey' },
    { id: 'esports', label: 'Esports', compactLabel: 'Esports' },
  ];

  const activeSportOnHub =
    activePage === 'football'
      ? selectedSport === 'all'
        ? 'soccer'
        : selectedSport
      : null;

  return (
    <div className="mb-4">
      <div className="w-full rounded-[13px] bg-[#0A1A22] border border-white/[0.07] p-1.5 flex flex-col lg:flex-row lg:items-center gap-2">
        {/* Mobile Top Row: Search + My Bets (hidden on lg+ where it sits inline on the right) */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="flex-1 min-w-0">
            <GlobalSearchBar
              compact
              placeholder="Search teams, players, leagues..."
            />
          </div>

          <button
            type="button"
            onClick={() => navigateTo('mybets')}
            className={`h-[36px] px-3 rounded-[9px] border text-[12px] font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
              activePage === 'mybets'
                ? 'bg-[#143746] border-[#2CE5F6]/60 text-white'
                : 'bg-[#061218] border-[#1A3744] text-[#DCEAF0]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-[#8CE9D8]" />
            <span>My bets</span>
            {openBets.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#B9F6EC] text-[#06181F] text-[10px] font-extrabold tabular-nums leading-none">
                {openBets.length}
              </span>
            )}
          </button>
        </div>

        {/* Unified Sportsbook Navigation Tabs */}
        <div className="flex items-center gap-0.5 xl:gap-1 overflow-x-auto no-scrollbar flex-1 min-w-0">
          {/* Home */}
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className={`h-[36px] px-2.5 xl:px-3 rounded-[9px] text-[12.5px] font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              activePage === 'home'
                ? 'bg-[#133544] text-white border border-[#2CE5F6]/40 shadow-sm'
                : 'text-[#8CA8B5] hover:text-white hover:bg-[#0F242F]'
            }`}
          >
            <Home
              className={`w-3.5 h-3.5 ${
                activePage === 'home' ? 'text-[#2CE5F6]' : 'text-[#7896A3]'
              }`}
            />
            <span>Home</span>
          </button>

          {/* Live In-Play */}
          <button
            type="button"
            onClick={() => navigateTo('live', { sport: 'all', competition: 'all' })}
            className={`h-[36px] px-2.5 xl:px-3 rounded-[9px] text-[12.5px] font-bold flex items-center gap-1.5 shrink-0 transition-all ${
              activePage === 'live'
                ? 'bg-[#133544] text-white border border-[#2CE5F6]/40 shadow-sm'
                : 'text-[#8CA8B5] hover:text-white hover:bg-[#0F242F]'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2E63] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF2E63]" />
            </span>
            <span>Live</span>
            <span className="text-[11px] font-extrabold text-[#FF5C85] tabular-nums">
              {liveCount}
            </span>
          </button>

          <div className="h-4 w-[1px] bg-white/[0.08] mx-0.5 shrink-0" />

          {/* All Sports Tabs */}
          {sportsList.map((sp) => {
            const isActive = activeSportOnHub === sp.id;
            return (
              <button
                key={sp.id}
                type="button"
                onClick={() =>
                  navigateTo('football', { sport: sp.id, competition: 'all' })
                }
                className={`h-[36px] px-2.5 xl:px-3 rounded-[9px] text-[12.5px] font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#133544] text-white border border-[#2CE5F6]/40 shadow-sm'
                    : 'text-[#8CA8B5] hover:text-white hover:bg-[#0F242F]'
                }`}
              >
                <SportIcon
                  sport={sp.id}
                  className={`w-3.5 h-3.5 ${
                    isActive ? 'text-[#2CE5F6]' : 'text-[#7896A3]'
                  }`}
                />
                <span>{isPhoneView ? sp.compactLabel : sp.compactLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Right Inline: Compact Expandable Search + My Bets */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 pl-2 border-l border-white/[0.07]">
          <div className="w-[195px] xl:w-[220px] focus-within:w-[285px] transition-all">
            <GlobalSearchBar
              compact
              placeholder="Search teams, players, markets..."
            />
          </div>

          <button
            type="button"
            onClick={() => navigateTo('mybets')}
            className={`h-[36px] px-3 rounded-[9px] border text-[12.5px] font-extrabold flex items-center gap-1.5 shrink-0 transition-all ${
              activePage === 'mybets'
                ? 'bg-[#143746] border-[#2CE5F6]/60 text-white shadow-sm'
                : 'bg-[#061218] border-[#1A3744] hover:border-[#2CE5F6]/45 text-[#DCEAF0] hover:text-white'
            }`}
          >
            <Receipt
              className={`w-3.5 h-3.5 ${
                activePage === 'mybets' ? 'text-[#2CE5F6]' : 'text-[#8CE9D8]'
              }`}
            />
            <span>My bets</span>
            {openBets.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#B9F6EC] text-[#06181F] text-[10.5px] font-extrabold tabular-nums leading-none">
                {openBets.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
