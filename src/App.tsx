import React, { useEffect, useMemo, useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { SportsbookProvider, useSportsbook } from './context/SportsbookContext';
import { AppShell } from './components/AppShell';
import { SportsHomePage } from './pages/SportsHomePage';
import { LivePage } from './pages/LivePage';
import { FootballPage } from './pages/FootballPage';
import { MatchPage } from './pages/MatchPage';
import { MyBetsFullPage } from './components/BetSlipAndMyBets';
import { getActiveEdition } from './config/edition';
import { MatrixHomePage } from './editions/matrix/MatrixHomePage';
import { MatrixLivePage } from './editions/matrix/MatrixLivePage';
import { MatrixFootballPage } from './editions/matrix/MatrixFootballPage';
import { MatrixMatchPage } from './editions/matrix/MatrixMatchPage';
import { ArenaHomePage } from './editions/arena/ArenaHomePage';
import { ArenaLivePage } from './editions/arena/ArenaLivePage';
import { ArenaFootballPage } from './editions/arena/ArenaFootballPage';
import { ArenaMatchPage } from './editions/arena/ArenaMatchPage';
import { MultiMatchLiveDock } from './editions/arena/MultiMatchLiveDock';

const SportsbookRouter: React.FC = () => {
  const { activePage, viewportMode, setViewportMode } = useSportsbook();
  const edition = useMemo(() => getActiveEdition(), []);

  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => {
      setIsMobileViewport(window.innerWidth < 768);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isPhoneFrame = viewportMode === 'phone' && !isMobileViewport;
  const effectivePhoneView =
    viewportMode === 'phone'
      ? true
      : viewportMode === 'desktop'
      ? false
      : isMobileViewport;

  const renderActivePage = (phoneMode: boolean) => {
    if (edition === 'matrix') {
      switch (activePage) {
        case 'home':
          return <MatrixHomePage isPhoneView={phoneMode} />;
        case 'live':
          return <MatrixLivePage isPhoneView={phoneMode} />;
        case 'football':
          return <MatrixFootballPage isPhoneView={phoneMode} />;
        case 'match':
          return <MatrixMatchPage isPhoneView={phoneMode} />;
        case 'mybets':
          return <MyBetsFullPage isPhoneView={phoneMode} />;
        default:
          return <MatrixHomePage isPhoneView={phoneMode} />;
      }
    }

    if (edition === 'arena') {
      switch (activePage) {
        case 'home':
          return <ArenaHomePage isPhoneView={phoneMode} />;
        case 'live':
          return <ArenaLivePage isPhoneView={phoneMode} />;
        case 'football':
          return <ArenaFootballPage isPhoneView={phoneMode} />;
        case 'match':
          return <ArenaMatchPage isPhoneView={phoneMode} />;
        case 'mybets':
          return (
            <div className="space-y-3.5">
              <MultiMatchLiveDock isPhoneView={phoneMode} />
              <MyBetsFullPage isPhoneView={phoneMode} />
            </div>
          );
        default:
          return <ArenaHomePage isPhoneView={phoneMode} />;
      }
    }

    // Default Edition #1: Implied-Odds Trading Desk
    switch (activePage) {
      case 'home':
        return <SportsHomePage isPhoneView={phoneMode} />;
      case 'live':
        return <LivePage isPhoneView={phoneMode} />;
      case 'football':
        return <FootballPage isPhoneView={phoneMode} />;
      case 'match':
        return <MatchPage isPhoneView={phoneMode} />;
      case 'mybets':
        return <MyBetsFullPage isPhoneView={phoneMode} />;
      default:
        return <SportsHomePage isPhoneView={phoneMode} />;
    }
  };

  if (isPhoneFrame) {
    return (
      <div className="min-h-screen bg-[#040B0E] flex flex-col items-center py-4 px-2">
        <div className="mb-3 flex items-center gap-3 px-4 py-2 rounded-full bg-[#0C1E26] border border-[#1E4252] text-[12px] shadow-xl">
          <span className="font-bold text-[#B9F6EC] flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            390px Phone Preview Mode
          </span>
          <button
            type="button"
            onClick={() => setViewportMode('auto')}
            className="px-2.5 py-1 rounded-full bg-[#153543] hover:bg-[#1DA4D4] text-white font-bold flex items-center gap-1 transition-colors"
          >
            <Monitor className="w-3 h-3" />
            <span>Return to Full Desktop (1440px)</span>
          </button>
        </div>

        <div className="w-[390px] max-w-full rounded-[28px] border-[3px] border-[#1D3E4D] bg-[#071318] shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden relative">
          <AppShell isPhoneFrame>{renderActivePage(true)}</AppShell>
        </div>
      </div>
    );
  }

  return (
    <AppShell isPhoneFrame={effectivePhoneView}>
      {renderActivePage(effectivePhoneView)}
    </AppShell>
  );
};

export function App() {
  return (
    <SportsbookProvider>
      <SportsbookRouter />
    </SportsbookProvider>
  );
}

export default App;
