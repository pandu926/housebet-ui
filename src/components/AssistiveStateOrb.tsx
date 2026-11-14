import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  Lock,
  Monitor,
  RotateCcw,
  Smartphone,
  TrendingUp,
  X,
} from 'lucide-react';
import { useSportsbook } from '../context/SportsbookContext';

export const AssistiveStateOrb: React.FC<{ isPhoneFrame?: boolean }> = ({
  isPhoneFrame = false,
}) => {
  const {
    isSidePanelOpen,
    isMobileSlipOpen,
    setIsMobileSlipOpen,
    slipItems,
    triggerOddsChangeDemo,
    toggleSuspendDemo,
    triggerBetFailedDemo,
    simulateNothingLive,
    setSimulateNothingLive,
    isDemoSuspended,
    resetBetPlacementState,
    viewportMode,
    setViewportMode,
    navigateTo,
  } = useSportsbook();

  const [open, setOpen] = useState(false);
  const [customPos, setCustomPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    dragging: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  }>({
    dragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const anySlipOddsChanged = slipItems.some((i) => i.oddsChanged);
  const anySlipSuspended = slipItems.some((i) => i.suspended);
  const hasActiveOverride =
    isDemoSuspended ||
    anySlipSuspended ||
    anySlipOddsChanged ||
    simulateNothingLive;

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (
        open &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  const isBoxedPhonePreview =
    isPhoneFrame &&
    viewportMode === 'phone' &&
    (typeof window !== 'undefined' ? window.innerWidth >= 768 : false);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isBoxedPhonePreview) return; // Keep fixed inside simulated 390px desktop preview frame
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      dragging: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      origX: customPos ? customPos.x : rect.left,
      origY: customPos ? customPos.y : rect.top,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragRef.current.moved = true;
      const maxX = window.innerWidth - 62;
      const maxY = window.innerHeight - 62;
      setCustomPos({
        x: Math.max(10, Math.min(maxX, dragRef.current.origX + dx)),
        y: Math.max(64, Math.min(maxY, dragRef.current.origY + dy)),
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragRef.current.dragging) {
      dragRef.current.dragging = false;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      if (!dragRef.current.moved) {
        setOpen((v) => !v);
      }
    } else {
      setOpen((v) => !v);
    }
  };

  const handleResetStates = () => {
    if (isDemoSuspended) toggleSuspendDemo();
    if (simulateNothingLive) setSimulateNothingLive(false);
    resetBetPlacementState();
    setOpen(false);
  };

  // Position calculation: shifts clear of open Desktop Side Panel and Mobile Bottom Bars
  const defaultPositionClass = isPhoneFrame
    ? `${
        slipItems.length > 0 && !isMobileSlipOpen
          ? 'bottom-[132px]'
          : 'bottom-[74px]'
      } right-3`
    : `bottom-[76px] md:bottom-5 ${
        isSidePanelOpen ? 'md:right-[358px] right-3.5' : 'right-3.5 md:right-5'
      }`;

  const openLeftward =
    !customPos || customPos.x > (typeof window !== 'undefined' ? window.innerWidth / 2 : 300);
  const openUpward =
    !customPos || customPos.y > 320;

  return (
    <div
      ref={containerRef}
      style={
        customPos && !isBoxedPhonePreview
          ? { left: customPos.x, top: customPos.y }
          : undefined
      }
      className={`${
        isBoxedPhonePreview ? 'sticky bottom-4 ml-auto mr-3' : 'fixed'
      } z-50 select-none transition-[right,bottom] duration-200 ${
        customPos && !isBoxedPhonePreview ? '' : defaultPositionClass
      }`}
    >
      {/* iOS AssistiveTouch Frosted-Glass Popover Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.86, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.86, y: 10 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={`absolute ${
              openUpward ? 'bottom-[62px]' : 'top-[62px]'
            } ${
              openLeftward ? 'right-0' : 'left-0'
            } w-[282px] rounded-[24px] bg-[#0A1C25]/95 backdrop-blur-2xl border border-white/[0.16] p-3.5 shadow-[0_24px_64px_rgba(0,0,0,0.8)] space-y-3`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-1">
              <div>
                <div className="text-[12px] font-extrabold text-white tracking-tight">
                  State Simulator
                </div>
                <div className="text-[10px] text-[#7F9EAC]">
                  1-tap edge states · Drag orb anywhere
                </div>
              </div>

              <div className="flex items-center gap-1">
                {hasActiveOverride && (
                  <button
                    type="button"
                    onClick={handleResetStates}
                    className="h-7 px-2 rounded-full bg-[#132E3B] hover:bg-[#1A3E4F] text-[10.5px] font-bold text-[#8CE9D8] flex items-center gap-1 transition-colors"
                    title="Reset simulated states"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-[#9AB6C3] hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2x2 iOS AssistiveTouch Tile Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* 1. Odds Changed */}
              <button
                type="button"
                onClick={() => {
                  triggerOddsChangeDemo();
                  if (isPhoneFrame || window.innerWidth < 768) {
                    setIsMobileSlipOpen(true);
                  }
                  setOpen(false);
                }}
                className={`rounded-[16px] p-3 border text-left transition-all flex flex-col gap-2 ${
                  anySlipOddsChanged
                    ? 'bg-[#123545] border-[#2CE5F6]/70 text-white'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#2CE5F6]/15 flex items-center justify-center text-[#2CE5F6]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[12px] font-extrabold leading-tight">
                    Odds Changed
                  </div>
                  <div className="text-[10px] text-[#84A2AF] mt-0.5">
                    Must accept price
                  </div>
                </div>
              </button>

              {/* 2. Market Suspended */}
              <button
                type="button"
                onClick={() => {
                  toggleSuspendDemo();
                  if (isPhoneFrame || window.innerWidth < 768) {
                    setIsMobileSlipOpen(true);
                  }
                  setOpen(false);
                }}
                className={`rounded-[16px] p-3 border text-left transition-all flex flex-col gap-2 ${
                  isDemoSuspended || anySlipSuspended
                    ? 'bg-[#F59E0B]/18 border-[#F59E0B]/70 text-white'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#F59E0B]/18 flex items-center justify-center text-[#FBBF24]">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[12px] font-extrabold leading-tight">
                    {isDemoSuspended ? 'Suspended: ON' : 'Suspended'}
                  </div>
                  <div className="text-[10px] text-[#84A2AF] mt-0.5">
                    Lock slip &amp; market
                  </div>
                </div>
              </button>

              {/* 3. Bet Failed */}
              <button
                type="button"
                onClick={() => {
                  triggerBetFailedDemo();
                  if (isPhoneFrame || window.innerWidth < 768) {
                    setIsMobileSlipOpen(true);
                  }
                  setOpen(false);
                }}
                className="rounded-[16px] p-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-left transition-all flex flex-col gap-2 text-white"
              >
                <div className="w-8 h-8 rounded-full bg-[#EF4444]/18 flex items-center justify-center text-[#F87171]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[12px] font-extrabold leading-tight">
                    Bet Failed
                  </div>
                  <div className="text-[10px] text-[#84A2AF] mt-0.5">
                    Rejected &amp; retry
                  </div>
                </div>
              </button>

              {/* 4. Nothing Live */}
              <button
                type="button"
                onClick={() => {
                  const next = !simulateNothingLive;
                  setSimulateNothingLive(next);
                  if (next) navigateTo('live');
                  setOpen(false);
                }}
                className={`rounded-[16px] p-3 border text-left transition-all flex flex-col gap-2 ${
                  simulateNothingLive
                    ? 'bg-[#B9F6EC]/18 border-[#B9F6EC]/65 text-white'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#B9F6EC]/18 flex items-center justify-center text-[#B9F6EC]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[12px] font-extrabold leading-tight">
                    {simulateNothingLive ? 'Empty Live: ON' : 'Nothing Live'}
                  </div>
                  <div className="text-[10px] text-[#84A2AF] mt-0.5">
                    Starting soon state
                  </div>
                </div>
              </button>
            </div>

            {/* Viewport Switcher Strip (Desktop -> Instant 390px Phone Frame) */}
            {!isPhoneFrame && (
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-1.5">
                <span className="text-[10.5px] font-bold text-[#7F9EAC] pl-1">
                  Viewport
                </span>
                <div className="flex items-center gap-1 bg-[#061218] p-1 rounded-[11px] border border-white/[0.07]">
                  <button
                    type="button"
                    onClick={() => {
                      setViewportMode('auto');
                      setOpen(false);
                    }}
                    className={`px-2 py-1 rounded-[7px] text-[10.5px] font-bold transition-colors ${
                      viewportMode === 'auto'
                        ? 'bg-[#153645] text-white'
                        : 'text-[#7F9EAC] hover:text-white'
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewportMode('desktop');
                      setOpen(false);
                    }}
                    className={`px-2 py-1 rounded-[7px] text-[10.5px] font-bold flex items-center gap-1 transition-colors ${
                      viewportMode === 'desktop'
                        ? 'bg-[#153645] text-[#2CE5F6]'
                        : 'text-[#7F9EAC] hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                    <span>1440</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setViewportMode('phone');
                      setOpen(false);
                    }}
                    className={`px-2 py-1 rounded-[7px] text-[10.5px] font-bold flex items-center gap-1 transition-colors ${
                      viewportMode === 'phone'
                        ? 'bg-[#153645] text-[#B9F6EC]'
                        : 'text-[#7F9EAC] hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>390</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* iPhone AssistiveTouch Floating Translucent Orb */}
      <button
        type="button"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        title="Assistive State Simulator (Odds Changed, Suspended, Bet Failed, Nothing Live)"
        aria-label="Open Prototype State Simulator"
        className={`group relative w-[50px] h-[50px] rounded-[16px] backdrop-blur-xl border flex flex-col items-center justify-center transition-transform active:scale-95 shadow-[0_10px_28px_rgba(0,0,0,0.65)] touch-none ${
          open
            ? 'bg-[#123342]/95 border-[#2CE5F6]/70'
            : 'bg-[#0B1E27]/80 hover:bg-[#102935]/90 border-white/[0.18] hover:border-[#2CE5F6]/50'
        }`}
      >
        {/* Active State Dot */}
        {hasActiveOverride && (
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#F59E0B] border-2 border-[#071318] animate-pulse" />
        )}

        {/* Concentric iOS AssistiveTouch Rings */}
        <span className="w-[32px] h-[32px] rounded-full bg-white/[0.12] border border-white/[0.2] flex items-center justify-center">
          <span className="w-[22px] h-[22px] rounded-full bg-white/[0.22] border border-white/[0.28] flex items-center justify-center">
            <span
              className={`w-[12px] h-[12px] rounded-full transition-colors ${
                open || hasActiveOverride
                  ? 'bg-[#2CE5F6] shadow-[0_0_10px_#2CE5F6]'
                  : 'bg-white/90 group-hover:bg-[#B9F6EC]'
              }`}
            />
          </span>
        </span>
      </button>
    </div>
  );
};
