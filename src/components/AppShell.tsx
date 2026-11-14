import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  Calendar,
  ChevronUp,
  Crown,
  Globe,
  Megaphone,
  Menu,
  MessageSquare,
  PanelLeft,
  PanelRight,
  Pin,
  Search,
  Sparkles,
  User,
  Video,
  X,
} from 'lucide-react';
import { useSportsbook } from '../context/SportsbookContext';
import { COMPETITIONS, PageId } from '../data/sportsbookData';
import {
  CompetitionFlag,
  GoldTrophyIcon,
  HousebetsLogo,
  SportIcon,
  UsdtBadge,
} from './BrandIcons';
import { BetSlipAndMyBetsPanelContent } from './BetSlipAndMyBets';
import { SportsbookSubHeader } from './SportsbookSubHeader';
import { AssistiveStateOrb } from './AssistiveStateOrb';

export const AppShell: React.FC<{
  children: React.ReactNode;
  isPhoneFrame?: boolean;
}> = ({ children, isPhoneFrame = false }) => {
  const {
    activePage,
    navigateTo,
    isSidePanelOpen,
    setIsSidePanelOpen,
    isMobileSlipOpen,
    setIsMobileSlipOpen,
    sidePanelTab,
    setSidePanelTab,
    slipItems,
    myBets,
    usdtBalance,
    notificationToast,
    triggerToast,
  } = useSportsbook();

  const [showMobilePagesMenu, setShowMobilePagesMenu] = useState<boolean>(false);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState<boolean>(false);

  const openBetsCount = myBets.filter((b) => b.status === 'Open').length;
  const primarySlipItem = slipItems[0];
  const anySlipOddsChanged = slipItems.some((i) => i.oddsChanged);
  const anySlipSuspended = slipItems.some((i) => i.suspended);

  return (
    <div className="min-h-screen flex flex-col bg-[#071318] text-[#F1F7F9] relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#12323F] border border-[#2CE5F6] text-[12.5px] font-bold text-white shadow-2xl flex items-center gap-2 max-w-[92vw]"
          >
            <Sparkles className="w-4 h-4 text-[#2CE5F6] shrink-0" />
            <span className="truncate">{notificationToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP BAR (Exact match to desk-*.webp & phone-*.webp) */}
      <header className="sticky top-0 z-40 h-[56px] bg-[#071318]/95 backdrop-blur-md border-b border-[#142B35] px-3 md:px-4 flex items-center justify-between gap-2 shrink-0">
        {/* Left: Sidebar Toggle (Desktop) + Housebets Wave Logo */}
        <div className="flex items-center gap-2.5">
          {!isPhoneFrame && (
            <button
              type="button"
              onClick={() => setIsLeftDrawerOpen((v) => !v)}
              className={`hidden md:flex w-9 h-9 rounded-[9px] border items-center justify-center transition-colors ${
                isLeftDrawerOpen
                  ? 'bg-[#12323F] border-[#2CE5F6] text-[#2CE5F6]'
                  : 'bg-[#0D2028] border-[#193643] hover:border-[#285466] text-[#CEDFE6] hover:text-white'
              }`}
              title="Toggle Top Leagues & Navigation Drawer"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}
          <div onClick={() => navigateTo('home')}>
            <HousebetsLogo />
          </div>
        </div>

        {/* Center (Desktop): Weekly Prize $50,000.00 + Crown */}
        {!isPhoneFrame && (
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                triggerToast(
                  'Housebets Weekly $50,000.00 Leaderboard active!'
                )
              }
              className="h-10 px-3.5 rounded-[10px] bg-[#0D2028] border border-[#193643] hover:border-[#295466] flex items-center gap-2.5 transition-colors"
            >
              <GoldTrophyIcon className="w-5 h-5" />
              <div className="text-left leading-tight">
                <div className="text-[10px] text-[#84A0AC] font-medium">
                  Weekly Prize
                </div>
                <div className="text-[12.5px] font-extrabold text-[#F5B82E] tabular-nums">
                  $50,000.00
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                triggerToast('Housebets VIP Club · Instant USDT Rakeback')
              }
              className="w-10 h-10 rounded-[10px] bg-[#0D2028] border border-[#193643] hover:border-[#295466] flex items-center justify-center text-[#CEDFE6] hover:text-[#F5B82E] transition-colors"
              title="VIP Lounge"
            >
              <Crown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right: Search, Side Panel Toggle, Log In, Register */}
        <div className="flex items-center gap-2">
          {!isPhoneFrame && (
            <>
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => {
                    document.getElementById('hb-sports-search')?.focus();
                  }, 80);
                }}
                className="hidden md:flex w-9 h-9 rounded-[9px] bg-[#0D2028] border border-[#193643] hover:border-[#285466] items-center justify-center text-[#CEDFE6] hover:text-white transition-colors"
                title="Search teams, players or leagues"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsSidePanelOpen((v) => !v)}
                className={`hidden md:flex relative w-9 h-9 rounded-[9px] border items-center justify-center transition-colors ${
                  isSidePanelOpen
                    ? 'bg-[#12323F] border-[#2CE5F6] text-white'
                    : 'bg-[#0D2028] border-[#193643] hover:border-[#285466] text-[#CEDFE6]'
                }`}
                title="Toggle Bet Slip & My Bets Side Panel"
              >
                <PanelRight className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() =>
              triggerToast(
                `Demo Wallet Active: $${usdtBalance.toFixed(2)} USDT available.`
              )
            }
            className="h-9 px-3.5 rounded-[9px] bg-[#102630] hover:bg-[#163340] border border-[#1D3E4D] text-[13px] font-bold text-white transition-colors"
          >
            Log In
          </button>

          <button
            type="button"
            onClick={() =>
              triggerToast(
                `Demo Account Ready · $${usdtBalance.toFixed(2)} USDT loaded for instant singles betting`
              )
            }
            className="h-9 px-3.5 rounded-[9px] bg-[#B9F6EC] hover:bg-[#9FEFE2] text-[#07181E] text-[13px] font-extrabold transition-colors"
          >
            Register
          </button>
        </div>
      </header>

      {/* MAIN BODY SHELL: Left Icon Rail + Main Content + Right Side Panel */}
      <div className="flex-1 flex min-h-0 relative">
        {/* LEFT NAVIGATION RAIL (Desktop only) */}
        {!isPhoneFrame && (
          <aside className="hidden md:flex flex-col items-center w-[54px] shrink-0 bg-[#071318] border-r border-[#132933] py-3 gap-2.5 select-none">
            {/* Group 1: Casino / Sports */}
            <div className="flex flex-col items-center gap-1 p-1 rounded-[12px] bg-[#0B1C24] border border-white/[0.06]">
              <button
                type="button"
                onClick={() =>
                  triggerToast('Housebets Casino Lobby — Switching back to Sportsbook')
                }
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#7D9BA8] hover:text-white transition-colors"
                title="Casino"
              >
                <SportIcon sport="casino" className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="w-8 h-8 rounded-[8px] bg-[#123340] border border-[#1F4E61] flex items-center justify-center text-[#2CE5F6]"
                title="Sportsbook"
              >
                <SportIcon sport="basketball" className="w-4 h-4" />
              </button>
            </div>

            {/* Group 2: Core 5-Page Navigation */}
            <div className="flex flex-col items-center gap-1 p-1 rounded-[12px] bg-[#0B1C24] border border-white/[0.06]">
              <button
                type="button"
                onClick={() => navigateTo('live')}
                className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors ${
                  activePage === 'live'
                    ? 'bg-[#123340] border border-[#1F4E61] text-[#2CE5F6]'
                    : 'text-[#7D9BA8] hover:text-white'
                }`}
                title="Live In-Play"
              >
                <Video className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigateTo('football')}
                className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors ${
                  activePage === 'football'
                    ? 'bg-[#123340] border border-[#1F4E61] text-[#2CE5F6]'
                    : 'text-[#7D9BA8] hover:text-white'
                }`}
                title="Football / Schedule"
              >
                <Calendar className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigateTo('home')}
                className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors ${
                  activePage === 'home' || activePage === 'match'
                    ? 'bg-[#123340] border border-[#1F4E61] text-[#2CE5F6]'
                    : 'text-[#7D9BA8] hover:text-white'
                }`}
                title="Sports Home"
              >
                <Globe className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => navigateTo('mybets')}
                className={`relative w-8 h-8 rounded-[8px] flex items-center justify-center transition-colors ${
                  activePage === 'mybets'
                    ? 'bg-[#123340] border border-[#1F4E61] text-[#2CE5F6]'
                    : 'text-[#7D9BA8] hover:text-white'
                }`}
                title="My Bets"
              >
                <Pin className="w-4 h-4" />
              </button>
            </div>

            {/* Group 3: Sports Quick Icons (Exact Sport Equipment SVGs) */}
            <div className="flex flex-col items-center gap-1 p-1 rounded-[12px] bg-[#0B1C24] border border-white/[0.06]">
              <button
                type="button"
                onClick={() => navigateTo('football', { sport: 'soccer', competition: 'all' })}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#7D9BA8] hover:text-white transition-colors"
                title="Soccer"
              >
                <SportIcon sport="soccer" className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigateTo('football', { sport: 'tennis', competition: 'all' })}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#7D9BA8] hover:text-white transition-colors"
                title="Tennis"
              >
                <SportIcon sport="tennis" className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigateTo('football', { sport: 'basketball', competition: 'all' })}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#7D9BA8] hover:text-white transition-colors"
                title="Basketball"
              >
                <SportIcon sport="basketball" className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  navigateTo('football', { sport: 'american-football', competition: 'all' })
                }
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#7D9BA8] hover:text-white transition-colors"
                title="American Football"
              >
                <SportIcon sport="american-football" className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigateTo('football', { sport: 'ice-hockey', competition: 'all' })}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#7D9BA8] hover:text-white transition-colors"
                title="Ice Hockey"
              >
                <SportIcon sport="ice-hockey" className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigateTo('football', { sport: 'baseball', competition: 'all' })}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#7D9BA8] hover:text-white transition-colors"
                title="Baseball"
              >
                <SportIcon sport="baseball" className="w-4 h-4" />
              </button>
            </div>

            {/* Group 4: Esports Quick Titles (CS2 / Dota 2 / LoL) */}
            <div className="flex flex-col items-center gap-1 p-1 rounded-[12px] bg-[#0B1C24] border border-white/[0.06]">
              <button
                type="button"
                onClick={() => navigateTo('football', { sport: 'esports', competition: 'cs2' })}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#7D9BA8] hover:text-white transition-colors"
                title="CS2"
              >
                <SportIcon sport="cs2" className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigateTo('football', { sport: 'esports', competition: 'all' })}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#7D9BA8] hover:text-white transition-colors"
                title="Dota 2"
              >
                <SportIcon sport="dota" className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  navigateTo('football', { sport: 'esports', competition: 'lol-worlds' })
                }
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#7D9BA8] hover:text-white transition-colors"
                title="League of Legends"
              >
                <SportIcon sport="lol" className="w-4 h-4" />
              </button>
            </div>

            {/* Group 5: Bottom Utility Icons */}
            <div className="mt-auto flex flex-col items-center gap-1 p-1 rounded-[12px] bg-[#0B1C24] border border-[#16323F]">
              <button
                type="button"
                onClick={() =>
                  triggerToast('Housebets News · Global platform updates')
                }
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#7D9BA8] hover:text-white transition-colors"
                title="Announcements"
              >
                <Megaphone className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerToast('Weekly $50,000.00 Leaderboard · Active')
                }
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#7D9BA8] hover:text-white transition-colors"
                title="Leaderboard"
              >
                <Award className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSidePanelTab('mybets');
                  setIsSidePanelOpen(true);
                }}
                className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#7D9BA8] hover:text-white transition-colors"
                title="Account & My Bets"
              >
                <User className="w-4 h-4" />
              </button>
            </div>
          </aside>
        )}

        {/* EXPANDED LEFT LEAGUE & NAVIGATION DRAWER (When PanelLeft is clicked on Desktop) */}
        {!isPhoneFrame && isLeftDrawerOpen && (
          <aside className="hidden md:flex flex-col w-[228px] shrink-0 bg-[#08161D] border-r border-[#152E3A] p-3.5 space-y-4 select-none">
            <div className="space-y-1">
              <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#6E8E9B] px-2 mb-1">
                Sportsbook
              </div>
              {(
                [
                  { id: 'home', label: 'Sports Home' },
                  { id: 'live', label: 'Live In-Play' },
                  { id: 'football', label: 'Football Hub' },
                  { id: 'match', label: 'Match Desk' },
                  { id: 'mybets', label: 'Bet Slip & My Bets' },
                ] as Array<{ id: PageId; label: string }>
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => navigateTo(p.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[9px] text-[12.5px] font-bold transition-colors ${
                    activePage === p.id
                      ? 'bg-[#12323F] text-[#2CE5F6] border border-[#1E4B5D]'
                      : 'text-[#CEDFE6] hover:bg-[#0E242E] hover:text-white'
                  }`}
                >
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-1 pt-2 border-t border-[#142C36]">
              <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#2CE5F6] px-2 mb-1">
                Top 5 European Leagues
              </div>
              {COMPETITIONS.slice(0, 5).map((comp) => (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => navigateTo('football', { competition: comp.id })}
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-[9px] text-[12.5px] font-semibold text-[#CEDFE6] hover:bg-[#0E242E] hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-2 truncate">
                    <CompetitionFlag flagId={comp.id} className="w-4 h-4" />
                    <span className="truncate">{comp.name}</span>
                  </span>
                  <span className="text-[11px] text-[#7D9BA8] tabular-nums">
                    {comp.matchCount}
                  </span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* CENTER MAIN CONTENT AREA */}
        <main
          className={`flex-1 min-w-0 px-3.5 sm:px-5 md:px-6 pt-3.5 ${
            isPhoneFrame ? 'pb-28' : 'pb-28 md:pb-12'
          }`}
        >
          <div className="max-w-[1220px] mx-auto">
            {isPhoneFrame ? (
              <SportsbookSubHeader isPhoneView />
            ) : (
              <>
                <div className="hidden md:block">
                  <SportsbookSubHeader isPhoneView={false} />
                </div>
                <div className="md:hidden">
                  <SportsbookSubHeader isPhoneView />
                </div>
              </>
            )}
            {children}
          </div>
        </main>

        {/* RIGHT DOCKED SIDE PANEL (Desktop only, matching desk-slip.0ta9-jl3qs44u.webp) */}
        {!isPhoneFrame && isSidePanelOpen && (
          <aside className="hidden md:block w-[336px] lg:w-[350px] shrink-0 border-l border-[#152E3A] bg-[#09181F] sticky top-[56px] h-[calc(100vh-56px)] z-30">
            <BetSlipAndMyBetsPanelContent
              onClose={() => setIsSidePanelOpen(false)}
            />
          </aside>
        )}
      </div>

      {/* MOBILE / PHONE BOTTOM BET SLIP BAR (matching phone-slip.089v5e1rp42p1.webp) */}
      <div className={isPhoneFrame ? 'block' : 'md:hidden'}>
        <AnimatePresence>
          {slipItems.length > 0 && !isMobileSlipOpen && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              className="fixed bottom-[66px] left-3 right-3 z-40"
            >
              <button
                type="button"
                onClick={() => {
                  setSidePanelTab('slip');
                  setIsMobileSlipOpen(true);
                }}
                className="w-full h-[50px] px-3.5 rounded-[13px] bg-[#B9F6EC] hover:bg-[#A4F2E5] text-[#07181E] shadow-[0_8px_30px_rgba(0,0,0,0.65)] flex items-center justify-between gap-2 transition-transform active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-[8px] bg-[#071318] text-white text-[13px] font-extrabold flex items-center justify-center tabular-nums shrink-0">
                    {slipItems.length}
                  </span>
                  <span className="text-[14px] font-extrabold text-[#07181E] truncate">
                    {primarySlipItem.selection.label} @{' '}
                    {primarySlipItem.currentOdds.toFixed(2)}
                    {slipItems.length > 1
                      ? ` (+${slipItems.length - 1} more)`
                      : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {anySlipSuspended && (
                    <span className="px-2 py-0.5 rounded bg-[#071318] text-[#F59E0B] text-[10.5px] font-extrabold">
                      Suspended
                    </span>
                  )}
                  {anySlipOddsChanged && !anySlipSuspended && (
                    <span className="px-2 py-0.5 rounded bg-[#071318] text-[#FBBF24] text-[10.5px] font-extrabold">
                      Odds Δ
                    </span>
                  )}
                  <ChevronUp className="w-5 h-5 text-[#07181E] stroke-[2.5]" />
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE BOTTOM SHEET DRAWER (matching phone-slip-open.3m5w2bgtk_skd.webp) */}
        <AnimatePresence>
          {isMobileSlipOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileSlipOpen(false)}
                className="fixed inset-0 bg-black/55 z-40"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="fixed bottom-[60px] left-0 right-0 z-50 h-[375px] max-h-[75vh] rounded-t-[20px] bg-[#09181F] border-t border-[#1D3E4D] shadow-[0_-12px_40px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col"
              >
                <BetSlipAndMyBetsPanelContent
                  isMobileDrawer
                  onClose={() => setIsMobileSlipOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* GLOBAL HOUSEBETS PLATFORM DRAWER (Pure global shell menu, no sportsbook sub-features) */}
        <AnimatePresence>
          {showMobilePagesMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobilePagesMenu(false)}
                className="fixed inset-0 bg-black/65 z-40"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="fixed bottom-[60px] left-0 right-0 z-50 rounded-t-[20px] bg-[#091921] border-t border-[#1D3E4D] p-4 space-y-3 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <HousebetsLogo compact />
                  <button
                    type="button"
                    onClick={() => setShowMobilePagesMenu(false)}
                    className="p-1 text-[#84A0AC] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMobilePagesMenu(false);
                      navigateTo('home');
                    }}
                    className="w-full h-10 px-3.5 rounded-[10px] bg-[#12313F] border border-[#2CE5F6]/40 text-white text-[13px] font-bold flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2.5">
                      <SportIcon sport="basketball" className="w-4 h-4 text-[#2CE5F6]" />
                      <span>Sportsbook</span>
                    </span>
                    <span className="text-[10.5px] text-[#2CE5F6] font-extrabold uppercase">
                      Active
                    </span>
                  </button>

                  {['Casino Lobby', 'Housebets Originals', 'VIP & Rewards', 'Live Support'].map(
                    (section) => (
                      <button
                        key={section}
                        type="button"
                        onClick={() => {
                          setShowMobilePagesMenu(false);
                          triggerToast(`${section} · Global Housebets platform`);
                        }}
                        className="w-full h-10 px-3.5 rounded-[10px] bg-[#0D212B] border border-white/[0.06] text-[#9CB7C4] hover:text-white text-[13px] font-semibold flex items-center justify-between"
                      >
                        <span>{section}</span>
                        <span className="text-[10.5px] text-[#5E7E8B]">Platform</span>
                      </button>
                    )
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* PHONE GLOBAL SITE BOTTOM NAVIGATION BAR (Menu | Sports | Casino | Chat | Search) */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 h-[60px] bg-[#071318] border-t border-[#152E3A] px-2 flex items-center justify-between select-none">
          <button
            type="button"
            onClick={() => setShowMobilePagesMenu((v) => !v)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-1 text-[#84A0AC] hover:text-white"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10.5px] font-semibold">Menu</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsMobileSlipOpen(false);
              navigateTo('home');
            }}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-[11px] bg-[#0F2D39] text-[#2CE5F6]"
          >
            <SportIcon sport="basketball" className="w-5 h-5 text-[#2CE5F6]" />
            <span className="text-[10.5px] font-bold text-[#2CE5F6]">Sports</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsMobileSlipOpen(false);
              triggerToast('Casino Lobby · Global Housebets platform');
            }}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-1 text-[#84A0AC] hover:text-white relative"
          >
            <SportIcon sport="casino" className="w-5 h-5" />
            <span className="text-[10.5px] font-semibold">Casino</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSidePanelTab('chat');
              setIsMobileSlipOpen(true);
            }}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-1 text-[#84A0AC] hover:text-white"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10.5px] font-semibold">Chat</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsMobileSlipOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => {
                document.getElementById('hb-sports-search')?.focus();
              }, 120);
            }}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-1 text-[#84A0AC] hover:text-white"
          >
            <Search className="w-5 h-5" />
            <span className="text-[10.5px] font-semibold">Search</span>
          </button>
        </nav>
      </div>

      {/* iPhone AssistiveTouch Floating State & Viewport Simulator Orb */}
      <AssistiveStateOrb isPhoneFrame={isPhoneFrame} />
    </div>
  );
};
