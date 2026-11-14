import React, { useEffect, useState } from 'react';
import { Check, Lock, TrendingDown, TrendingUp } from 'lucide-react';
import { OddSelection } from '../data/sportsbookData';
import { useSportsbook } from '../context/SportsbookContext';

interface OddsButtonProps {
  selection: OddSelection;
  variant?: 'stacked' | 'inline';
  compact?: boolean;
  showVolumeBar?: boolean;
  className?: string;
}

export const OddsButton: React.FC<OddsButtonProps> = ({
  selection,
  variant = 'stacked',
  compact = false,
  showVolumeBar = true,
  className = '',
}) => {
  const { isSelected, toggleSelection, oddsFlashMap } = useSportsbook();
  const active = isSelected(selection.id);
  const flashInfo = oddsFlashMap[selection.id];
  const [flashClass, setFlashClass] = useState<string>('');

  useEffect(() => {
    if (!flashInfo) return;
    const cls = flashInfo.dir === 'up' ? 'animate-odd-up' : 'animate-odd-down';
    setFlashClass(cls);
    const timer = setTimeout(() => setFlashClass(''), 1200);
    return () => clearTimeout(timer);
  }, [flashInfo?.ts, flashInfo]);

  const isRecentFlash = flashInfo && Date.now() - flashInfo.ts < 9000;
  const impliedPct = Math.min(94, Math.max(4, Math.round((1 / selection.odds) * 95)));

  if (selection.suspended) {
    return (
      <div
        className={`flex items-center justify-center gap-1.5 rounded-[10px] bg-[#0B1B23] border border-[#243E4B] text-[#F59E0B] select-none cursor-not-allowed opacity-90 ${
          variant === 'inline' ? 'h-[44px] px-3.5' : compact ? 'h-[46px] px-2.5' : 'h-[48px] px-3'
        } ${className}`}
        title="Selection temporarily suspended"
      >
        <Lock className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
        <span className="text-[11.5px] font-bold tracking-tight">Suspended</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleSelection(selection);
        }}
        className={`relative overflow-hidden group flex items-center justify-between w-full h-[44px] px-3.5 rounded-[11px] border transition-all duration-150 select-none text-left ${
          active
            ? 'bg-gradient-to-r from-[#178AB5] to-[#1DA4D4] border-[#5BE7FF] text-white shadow-[0_0_20px_rgba(44,229,246,0.28)]'
            : 'bg-[#0F242E] border-white/[0.08] hover:bg-[#15313E] hover:border-[#2CE5F6]/50 text-[#E6F1F5]'
        } ${flashClass} ${className}`}
      >
        <div className="min-w-0 pr-2 flex items-center gap-2">
          <span
            className={`text-[13px] truncate ${
              active ? 'font-extrabold text-white' : 'font-semibold text-[#ECF5F8]'
            }`}
          >
            {selection.label}
          </span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded tabular-nums shrink-0 ${
              active
                ? 'bg-black/25 text-white'
                : 'bg-[#08151B] text-[#6E8E9B] group-hover:text-[#98B5C2]'
            }`}
          >
            {impliedPct}%
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isRecentFlash && flashInfo.dir === 'up' && (
            <TrendingUp
              className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#10B981]'}`}
            />
          )}
          {isRecentFlash && flashInfo.dir === 'down' && (
            <TrendingDown
              className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#FB7185]'}`}
            />
          )}
          <span
            className={`text-[14px] font-extrabold tabular-nums tracking-tight ${
              active
                ? 'text-white'
                : isRecentFlash && flashInfo.dir === 'up'
                ? 'text-[#10B981]'
                : isRecentFlash && flashInfo.dir === 'down'
                ? 'text-[#FB7185]'
                : 'text-[#3AD4F7]'
            }`}
          >
            {selection.odds.toFixed(2)}
          </span>
          {active && <Check className="w-3.5 h-3.5 text-[#B9F6EC] stroke-[3]" />}
        </div>

        {showVolumeBar && (
          <span
            className={`absolute bottom-0 left-0 h-[2px] transition-all ${
              active
                ? 'bg-[#B9F6EC] opacity-95'
                : 'bg-gradient-to-r from-[#2CE5F6] to-[#10B981] opacity-35 group-hover:opacity-80'
            }`}
            style={{ width: `${impliedPct}%` }}
          />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleSelection(selection);
      }}
      className={`relative overflow-hidden group flex flex-col justify-between items-start w-full rounded-[11px] border transition-all duration-150 select-none text-left ${
        compact ? 'h-[46px] px-2.5 py-1.5' : 'h-[48px] px-3 py-1.5'
      } ${
        active
          ? 'bg-gradient-to-br from-[#178AB5] to-[#1DA4D4] border-[#5BE7FF] text-white shadow-[0_0_18px_rgba(44,229,246,0.28)]'
          : 'bg-[#0F242E] border-white/[0.08] hover:bg-[#15313E] hover:border-[#2CE5F6]/50 text-[#E6F1F5]'
      } ${flashClass} ${className}`}
    >
      <div className="w-full flex items-center justify-between gap-1">
        <span
          className={`text-[11px] leading-tight truncate ${
            active ? 'text-white font-bold' : 'text-[#9CB7C4] group-hover:text-[#D5E6EE] font-semibold'
          }`}
        >
          {selection.shortLabel || selection.label}
        </span>
        {active ? (
          <Check className="w-3 h-3 text-[#B9F6EC] stroke-[3] shrink-0" />
        ) : (
          <span className="text-[9.5px] font-bold text-[#5E7E8B] tabular-nums shrink-0">
            {impliedPct}%
          </span>
        )}
      </div>

      <div className="w-full flex items-center justify-between gap-1">
        <span
          className={`text-[14px] leading-none font-extrabold tabular-nums ${
            active
              ? 'text-white'
              : isRecentFlash && flashInfo.dir === 'up'
              ? 'text-[#10B981]'
              : isRecentFlash && flashInfo.dir === 'down'
              ? 'text-[#FB7185]'
              : 'text-[#3AD4F7]'
          }`}
        >
          {selection.odds.toFixed(2)}
        </span>
        {isRecentFlash && flashInfo.dir === 'up' && (
          <span className={`text-[9px] font-bold ${active ? 'text-white' : 'text-[#10B981]'}`}>
            ▲
          </span>
        )}
        {isRecentFlash && flashInfo.dir === 'down' && (
          <span className={`text-[9px] font-bold ${active ? 'text-white' : 'text-[#FB7185]'}`}>
            ▼
          </span>
        )}
      </div>

      {showVolumeBar && (
        <span
          className={`absolute bottom-0 left-0 h-[2px] transition-all ${
            active
              ? 'bg-[#B9F6EC] opacity-95'
              : 'bg-gradient-to-r from-[#2CE5F6] to-[#10B981] opacity-35 group-hover:opacity-80'
          }`}
          style={{ width: `${impliedPct}%` }}
        />
      )}
    </button>
  );
};
