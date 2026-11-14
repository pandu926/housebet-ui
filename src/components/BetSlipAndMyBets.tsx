import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  ExternalLink,
  Lock,
  MessageSquare,
  RefreshCw,
  Send,
  Share2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { useSportsbook } from '../context/SportsbookContext';
import { UsdtBadge } from './BrandIcons';

export const BetSlipAndMyBetsPanelContent: React.FC<{
  onClose?: () => void;
  isMobileDrawer?: boolean;
  embeddedSlipOnly?: boolean;
}> = ({ onClose, isMobileDrawer = false, embeddedSlipOnly = false }) => {
  const {
    sidePanelTab,
    setSidePanelTab,
    slipItems,
    removeSelection,
    clearSlip,
    updateStake,
    acceptAllOddsChanges,
    betPlacementState,
    betErrorReason,
    lastPlacedBets,
    resetBetPlacementState,
    placeBets,
    myBets,
    cashOutBet,
    navigateTo,
    usdtBalance,
    communityBets,
    copyCommunityBet,
    shareBetToCommunity,
    applyStakeToAllSingles,
  } = useSportsbook();

  const [myBetsSubTab, setMyBetsSubTab] = useState<'open' | 'settled'>('open');
  const [confirmCashOutId, setConfirmCashOutId] = useState<string | null>(null);
  const [focusedStakeId, setFocusedStakeId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      user: 'CryptoWhale99',
      badge: 'VIP',
      text: 'Arsenal dominating possession at 52m, backing 2nd goal Arsenal @ 1.52 🔥',
      time: '1m ago',
    },
    {
      id: 2,
      user: 'SatoshiStriker',
      badge: 'PRO',
      text: 'Just cashed out my Tottenham single for 77.50 USDT!',
      time: '3m ago',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const openBets = myBets.filter((b) => b.status === 'Open');
  const settledBets = myBets.filter((b) => b.status !== 'Open');

  const anyOddsChanged = slipItems.some((i) => i.oddsChanged);
  const anySuspended = slipItems.some((i) => i.suspended);

  const totalStake = slipItems.reduce((sum, item) => {
    if (item.suspended) return sum;
    const val = parseFloat(item.stake || '0');
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const totalPayout = slipItems.reduce((sum, item) => {
    if (item.suspended) return sum;
    const val = parseFloat(item.stake || '0');
    if (isNaN(val) || val <= 0) return sum;
    return sum + val * item.currentOdds;
  }, 0);

  const quickStakes = [5, 10, 25, 50];

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: 'You',
        badge: 'PLAYER',
        text: chatInput.trim(),
        time: 'Just now',
      },
    ]);
    setChatInput('');
  };

  const effectiveTab = embeddedSlipOnly ? 'slip' : sidePanelTab;

  return (
    <div className="flex flex-col h-full bg-[#09181F] text-white select-none">
      {/* Top Panel Header */}
      {embeddedSlipOnly ? (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#16303C] bg-[#07141B] shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] font-extrabold text-white">
              Bet slip
            </span>
            <span
              className={`w-5 h-5 rounded-full text-[11px] font-extrabold flex items-center justify-center tabular-nums ${
                slipItems.length > 0
                  ? 'bg-[#1DA4D4] text-white'
                  : 'bg-[#152E3A] text-[#84A0AC]'
              }`}
            >
              {slipItems.length}
            </span>
            <span className="text-[11px] text-[#6E8E9B] font-semibold">
              · Singles only
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D212B] border border-white/[0.07] text-[11px] font-extrabold text-white tabular-nums">
            <UsdtBadge className="w-3.5 h-3.5" />
            <span>${usdtBalance.toFixed(2)}</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-[#16303C] shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSidePanelTab('slip')}
              className={`flex items-center gap-2 h-[36px] px-3 rounded-[9px] text-[13px] font-bold transition-all ${
                sidePanelTab === 'slip'
                  ? 'bg-[#12313E] text-white border border-[#1E4B5D]'
                  : 'text-[#84A0AC] hover:text-white'
              }`}
            >
              <span>Bet slip</span>
              <span
                className={`w-5 h-5 rounded-full text-[11px] font-extrabold flex items-center justify-center tabular-nums ${
                  slipItems.length > 0
                    ? 'bg-[#1DA4D4] text-white'
                    : 'bg-[#152E3A] text-[#84A0AC]'
                }`}
              >
                {slipItems.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSidePanelTab('mybets')}
              className={`flex items-center gap-2 h-[36px] px-3 rounded-[9px] text-[13px] font-bold transition-all ${
                sidePanelTab === 'mybets'
                  ? 'bg-[#12313E] text-white border border-[#1E4B5D]'
                  : 'text-[#84A0AC] hover:text-white'
              }`}
            >
              <span>My bets</span>
              <span className="w-5 h-5 rounded-full bg-[#B9F6EC] text-[#07181E] text-[11px] font-extrabold flex items-center justify-center tabular-nums">
                {openBets.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSidePanelTab('chat')}
              className={`flex items-center gap-1.5 h-[36px] px-3 rounded-[9px] text-[13px] font-bold transition-all ${
                sidePanelTab === 'chat'
                  ? 'bg-[#12313E] text-white border border-[#1E4B5D]'
                  : 'text-[#84A0AC] hover:text-white'
              }`}
            >
              <span>Chat</span>
            </button>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#84A0AC] hover:text-white hover:bg-[#132B36] transition-colors"
              aria-label="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* TAB 1: BET SLIP (SINGLES ONLY, USDT — Top-Aligned with Zero Dead Space) */}
      {effectiveTab === 'slip' && (
        <div className="flex-1 flex flex-col min-h-0 justify-between">
          {/* Scrollable Selections Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {betPlacementState === 'placed' && lastPlacedBets.length > 0 ? (
              <div className="rounded-[14px] bg-[#0D242E] border border-[#10B981]/50 p-4 space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                    <span className="text-[14.5px] font-extrabold text-white">
                      Bet placed!
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-[11px] font-bold">
                    Singles · Confirmed
                  </span>
                </div>

                <div className="space-y-2">
                  {lastPlacedBets.map((bet) => (
                    <div
                      key={bet.id}
                      className="rounded-[10px] bg-[#091920] border border-[#173543] p-3 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13.5px] font-bold text-white">
                          {bet.selectionLabel}
                        </span>
                        <span className="text-[13.5px] font-extrabold text-[#3AD4F7] tabular-nums">
                          {bet.odds.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-[11.5px] text-[#7D9BA8]">
                        {bet.marketName} · {bet.matchTitle}
                      </div>
                      <div className="flex items-center justify-between pt-1.5 border-t border-[#142D39] text-[12px]">
                        <span className="text-[#84A0AC]">
                          Stake:{' '}
                          <strong className="text-white tabular-nums">
                            ${bet.stake.toFixed(2)} USDT
                          </strong>
                        </span>
                        <span className="text-[#84A0AC]">
                          To return:{' '}
                          <strong className="text-[#10B981] tabular-nums">
                            ${bet.potentialReturn.toFixed(2)} USDT
                          </strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      resetBetPlacementState();
                      setSidePanelTab('mybets');
                    }}
                    className="h-10 rounded-[10px] bg-[#B9F6EC] hover:bg-[#9FEFE2] text-[#07181E] text-[12.5px] font-extrabold transition-colors"
                  >
                    View in My bets
                  </button>
                  <button
                    type="button"
                    onClick={resetBetPlacementState}
                    className="h-10 rounded-[10px] bg-[#142E3A] hover:bg-[#1B3C4B] text-white text-[12.5px] font-bold transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : slipItems.length === 0 ? (
              <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center px-4 py-8">
                <div className="w-12 h-12 rounded-full bg-[#0E242E] border border-[#1B3C4B] flex items-center justify-center text-[#3AD4F7] mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-[14px] font-bold text-white">
                  Your bet slip is empty
                </p>
                <p className="text-[12px] text-[#7D9BA8] mt-1 max-w-[230px]">
                  Tap any odds across Live, Soccer, or Match markets to add a single
                  selection in USDT.
                </p>
              </div>
            ) : (
              <>
                {/* Singles · N selection + Clear all Header */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-[13px] text-[#84A0AC]">
                    <strong className="text-white font-bold">Singles</strong> ·{' '}
                    {slipItems.length}{' '}
                    {slipItems.length === 1 ? 'selection' : 'selections'}
                  </div>
                  <button
                    type="button"
                    onClick={clearSlip}
                    className="text-[12.5px] font-semibold text-[#84A0AC] hover:text-white transition-colors"
                  >
                    Clear all
                  </button>
                </div>

                {/* Multi-Singles Quick Stake Helper (when 2+ singles are in slip) */}
                {slipItems.length > 1 && (
                  <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-[10px] bg-[#0D212A] border border-[#1B3C4B]">
                    <span className="text-[11.5px] font-semibold text-[#84A0AC]">
                      Stake for each single:
                    </span>
                    <div className="flex items-center gap-1">
                      {[10, 25, 50].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => applyStakeToAllSingles(amt.toFixed(2))}
                          className="px-2 py-0.5 rounded bg-[#143341] hover:bg-[#1DA4D4] text-[11px] font-extrabold text-[#2CE5F6] hover:text-white transition-colors tabular-nums"
                        >
                          ${amt} all
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selection Cards */}
                <div className="space-y-3">
                  {slipItems.map((item) => {
                    const stakeNum = parseFloat(item.stake || '0');
                    const estReturn =
                      !isNaN(stakeNum) && stakeNum > 0
                        ? (stakeNum * item.currentOdds).toFixed(2)
                        : null;
                    const isInputFocused = focusedStakeId === item.selection.id;

                    return (
                      <div
                        key={item.selection.id}
                        className={`rounded-[12px] p-3.5 border transition-all space-y-2.5 ${
                          item.suspended
                            ? 'bg-[#12222A]/80 border-[#F59E0B]/50'
                            : item.oddsChanged
                            ? 'bg-[#112731] border-[#F59E0B]/70'
                            : 'bg-[#0F242E] border-[#1D3E4D]'
                        }`}
                      >
                        {/* Top Row: Selection Name + Odds + Remove X */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-[14.5px] font-extrabold text-white truncate">
                              {item.selection.label}
                            </div>
                            <div className="text-[12px] text-[#84A0AC] truncate mt-0.5 flex items-center gap-1.5">
                              <span className="truncate">
                                {item.selection.marketName} ·{' '}
                                {item.selection.matchTitle}
                              </span>
                              {item.selection.isLive && (
                                <span className="text-[#FF477E] font-semibold tabular-nums shrink-0">
                                  {item.selection.scoreText || '1–0'} ·{' '}
                                  {item.selection.clockText || "52'"}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.suspended ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B] text-[11.5px] font-bold">
                                <Lock className="w-3 h-3" />
                                Suspended
                              </span>
                            ) : (
                              <div className="flex items-center gap-1">
                                {item.oddsChanged && item.prevOdds && (
                                  <span className="text-[11.5px] text-[#7D9BA8] line-through tabular-nums">
                                    {item.prevOdds.toFixed(2)}
                                  </span>
                                )}
                                {item.oddsChanged &&
                                  item.oddsDirection === 'up' && (
                                    <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                                  )}
                                {item.oddsChanged &&
                                  item.oddsDirection === 'down' && (
                                    <TrendingDown className="w-3.5 h-3.5 text-[#F59E0B]" />
                                  )}
                                <span
                                  className={`text-[14.5px] font-extrabold tabular-nums ${
                                    item.oddsChanged
                                      ? item.oddsDirection === 'up'
                                        ? 'text-[#10B981]'
                                        : 'text-[#FBBF24]'
                                      : 'text-[#3AD4F7]'
                                  }`}
                                >
                                  {item.currentOdds.toFixed(2)}
                                </span>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => removeSelection(item.selection.id)}
                              className="text-[#7D9BA8] hover:text-white p-0.5"
                              aria-label="Remove selection"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* STATE BANNER: ODDS CHANGED */}
                        {item.oddsChanged && !item.suspended && (
                          <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[8px] bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[11.5px] text-[#FBBF24]">
                            <span>
                              Odds changed from{' '}
                              <strong className="tabular-nums">
                                {(item.prevOdds ?? item.acceptedOdds).toFixed(2)}
                              </strong>{' '}
                              to{' '}
                              <strong className="tabular-nums">
                                {item.currentOdds.toFixed(2)}
                              </strong>
                            </span>
                            <button
                              type="button"
                              onClick={acceptAllOddsChanges}
                              className="font-extrabold underline hover:text-white shrink-0"
                            >
                              Accept
                            </button>
                          </div>
                        )}

                        {/* STATE BANNER: SELECTION SUSPENDED */}
                        {item.suspended && (
                          <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[8px] bg-[#F59E0B]/15 border border-[#F59E0B]/40 text-[11.5px] text-[#F59E0B]">
                            <span className="flex items-center gap-1.5 font-semibold">
                              <Lock className="w-3.5 h-3.5 shrink-0" />
                              Selection suspended in-play
                            </span>
                            <button
                              type="button"
                              onClick={() => removeSelection(item.selection.id)}
                              className="font-bold underline hover:text-white"
                            >
                              Remove
                            </button>
                          </div>
                        )}

                        {/* Stake Input + Returns Column */}
                        <div className="flex items-center justify-between gap-3">
                          <div
                            className={`flex-1 flex items-center h-[42px] px-3 rounded-[9px] bg-[#152E3A] border transition-colors ${
                              item.suspended
                                ? 'opacity-50 pointer-events-none border-[#1E3B48]'
                                : 'border-[#234A5B] focus-within:border-[#2CE5F6]'
                            }`}
                          >
                            <span className="text-[#84A0AC] font-semibold text-[13.5px] mr-1.5">
                              $
                            </span>
                            <input
                              type="text"
                              inputMode="decimal"
                              disabled={item.suspended}
                              value={item.stake}
                              onFocus={() => setFocusedStakeId(item.selection.id)}
                              onChange={(e) =>
                                updateStake(item.selection.id, e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (anySuspended) return;
                                  if (anyOddsChanged) {
                                    acceptAllOddsChanges();
                                  } else if (
                                    slipItems.length > 0 &&
                                    totalStake > 0 &&
                                    betPlacementState !== 'placing'
                                  ) {
                                    placeBets();
                                  }
                                }
                              }}
                              placeholder="0.00"
                              className="w-full bg-transparent text-[14px] font-bold text-white placeholder-[#7D9BA8] focus:outline-none tabular-nums"
                            />
                          </div>

                          <div className="text-right shrink-0 min-w-[66px]">
                            <div className="text-[11px] text-[#84A0AC]">
                              Returns
                            </div>
                            <div className="text-[13.5px] font-extrabold text-white tabular-nums mt-0.5">
                              {estReturn && !item.suspended
                                ? `$${estReturn}`
                                : '—'}
                            </div>
                            {estReturn && !item.suspended && stakeNum > 0 && (
                              <div className="text-[10px] font-bold text-[#10B981] tabular-nums">
                                +${(stakeNum * (item.currentOdds - 1)).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Whisper-Clean Quick Stake USDT Chips inside Bet Slip */}
                        {!item.suspended && (
                          <div className="flex items-center gap-1.5 pt-0.5">
                            {quickStakes.map((amt) => (
                              <button
                                key={amt}
                                type="button"
                                onClick={() =>
                                  updateStake(
                                    item.selection.id,
                                    amt.toFixed(2)
                                  )
                                }
                                className={`flex-1 h-7 rounded-[7px] border text-[11px] font-bold tabular-nums transition-colors ${
                                  stakeNum === amt
                                    ? 'bg-[#153A4A] border-[#2CE5F6]/60 text-white'
                                    : 'bg-[#10242E] hover:bg-[#173340] border-white/[0.06] text-[#9AB4BF] hover:text-white'
                                }`}
                              >
                                ${amt}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() =>
                                updateStake(item.selection.id, '100.00')
                              }
                              className="px-2.5 h-7 rounded-[7px] bg-[#10242E] hover:bg-[#173340] border border-white/[0.06] text-[10.5px] font-extrabold text-[#2CE5F6] transition-colors"
                            >
                              $100
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* STATE BANNER: BET FAILED */}
                {betPlacementState === 'failed' && (
                  <div className="rounded-[12px] bg-[#EF4444]/15 border border-[#EF4444]/50 p-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#F87171] shrink-0 mt-0.5" />
                      <div className="text-[12px] text-[#FECACA] leading-snug">
                        <strong className="font-bold text-white block mb-0.5">
                          Bet failed
                        </strong>
                        {betErrorReason ||
                          'Unable to place bet due to live price movement. Please retry.'}
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={resetBetPlacementState}
                        className="px-2.5 py-1 rounded bg-[#182E38] text-[11px] font-semibold text-[#CEDFE6] hover:text-white"
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        onClick={placeBets}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#EF4444] hover:bg-[#DC2626] text-white text-[11.5px] font-bold"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Retry bet
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sticky Bottom Summary & CTA Button (matching desk-slip & phone-slip-open) */}
          <div className="p-3.5 border-t border-[#16303C] bg-[#09181F] space-y-3 shrink-0">
            <div className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-1.5 text-[#84A0AC]">
                <span>Total stake</span>
                <strong className="text-white font-extrabold tabular-nums">
                  ${totalStake.toFixed(2)}
                </strong>
                <UsdtBadge className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-1.5 text-[#84A0AC]">
                <span>Payout</span>
                <strong className="text-white font-extrabold tabular-nums">
                  ${totalPayout.toFixed(2)}
                </strong>
                <UsdtBadge className="w-4 h-4" />
              </div>
            </div>

            {anySuspended ? (
              <button
                type="button"
                disabled
                className="w-full h-[46px] rounded-[11px] bg-[#2B2415] border border-[#F59E0B]/40 text-[#F59E0B] text-[14px] font-extrabold flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                <span>Selection suspended</span>
              </button>
            ) : anyOddsChanged ? (
              <button
                type="button"
                onClick={acceptAllOddsChanges}
                className="w-full h-[46px] rounded-[11px] bg-[#F59E0B] hover:bg-[#D97706] text-[#071318] text-[14px] font-extrabold transition-colors shadow-lg"
              >
                Accept odds change
              </button>
            ) : (
              <button
                type="button"
                disabled={
                  slipItems.length === 0 ||
                  totalStake <= 0 ||
                  betPlacementState === 'placing'
                }
                onClick={placeBets}
                className={`w-full h-[46px] rounded-[11px] text-[14px] font-extrabold transition-all flex items-center justify-center gap-2 ${
                  slipItems.length > 0 && totalStake > 0
                    ? 'bg-[#B9F6EC] hover:bg-[#9FEFE2] text-[#07181E] shadow-[0_0_20px_rgba(185,246,236,0.25)] cursor-pointer'
                    : 'bg-[#112630] text-[#5B7B8A] cursor-not-allowed'
                }`}
              >
                {betPlacementState === 'placing' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Placing single bet...</span>
                  </>
                ) : (
                  <span>Place bet</span>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY BETS (Inside Shared Panel/Drawer) */}
      {effectiveTab === 'mybets' && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-3.5 pb-2 flex items-center justify-between gap-2">
            <div className="flex-1 grid grid-cols-2 rounded-[10px] bg-[#0D2028] border border-[#17333F] p-1">
              <button
                type="button"
                onClick={() => setMyBetsSubTab('open')}
                className={`h-8 rounded-[7px] text-[12.5px] font-bold transition-all ${
                  myBetsSubTab === 'open'
                    ? 'bg-[#133340] text-white'
                    : 'text-[#84A0AC] hover:text-white'
                }`}
              >
                Open ({openBets.length})
              </button>
              <button
                type="button"
                onClick={() => setMyBetsSubTab('settled')}
                className={`h-8 rounded-[7px] text-[12.5px] font-bold transition-all ${
                  myBetsSubTab === 'settled'
                    ? 'bg-[#133340] text-white'
                    : 'text-[#84A0AC] hover:text-white'
                }`}
              >
                Settled ({settledBets.length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isMobileDrawer && onClose) onClose();
                navigateTo('mybets');
              }}
              className="h-10 px-2.5 rounded-[10px] bg-[#0D2028] border border-[#17333F] hover:border-[#2CE5F6] text-[#84A0AC] hover:text-white flex items-center gap-1 text-[11.5px] font-semibold shrink-0"
              title="Open full-page My bets view"
            >
              <span>Full view</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 pt-2 space-y-3">
            {(myBetsSubTab === 'open' ? openBets : settledBets).map((bet) => {
              const isConfirming = confirmCashOutId === bet.id;
              return (
                <div
                  key={bet.id}
                  className="rounded-[12px] bg-[#0F242E] border border-[#1B3B49] p-3.5 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[14px] font-extrabold text-white">
                        {bet.selectionLabel}
                      </div>
                      <div className="text-[11.5px] text-[#84A0AC] mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span>{bet.matchTitle}</span>
                        {bet.isLive && bet.status === 'Open' && (
                          <>
                            <span className="text-[#FF477E] font-bold">
                              • {bet.liveClock || "52'"}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-[#0E362D] text-[#10B981] text-[10.5px] font-bold tabular-nums">
                              {bet.liveScore || '1–0'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <span className="text-[14px] font-extrabold text-[#3AD4F7] tabular-nums">
                      {bet.odds.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#16323E] text-[12px]">
                    <div>
                      <div className="text-[#7D9BA8] text-[11px]">Stake</div>
                      <div className="font-bold text-white tabular-nums mt-0.5">
                        ${bet.stake.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#7D9BA8] text-[11px]">Returns</div>
                      <div className="font-bold text-white tabular-nums mt-0.5">
                        $
                        {(bet.settledReturn ?? bet.potentialReturn).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#7D9BA8] text-[11px]">Result</div>
                      <div className="mt-0.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            bet.status === 'Open'
                              ? 'bg-[#14303D] text-[#CEDFE6]'
                              : bet.status === 'Won'
                              ? 'bg-[#10B981]/20 text-[#10B981]'
                              : bet.status === 'Cashed Out'
                              ? 'bg-[#2CE5F6]/20 text-[#2CE5F6]'
                              : 'bg-[#EF4444]/20 text-[#F87171]'
                          }`}
                        >
                          {bet.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {bet.status === 'Open' && bet.cashOutOffer && (
                    <div className="pt-1">
                      {isConfirming ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              cashOutBet(bet.id);
                              setConfirmCashOutId(null);
                              setMyBetsSubTab('settled');
                            }}
                            className="flex-1 h-9 rounded-[9px] bg-[#10B981] hover:bg-[#059669] text-[#061814] text-[12.5px] font-extrabold transition-colors"
                          >
                            Confirm Cash Out ${bet.cashOutOffer.toFixed(2)} ₮
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmCashOutId(null)}
                            className="px-3 h-9 rounded-[9px] bg-[#152E3A] text-[12px] font-bold text-[#84A0AC] hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmCashOutId(bet.id)}
                          className="w-full h-9 rounded-[9px] bg-[#13323F] hover:bg-[#194252] border border-[#225063] text-[12.5px] font-bold text-[#B9F6EC] flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <span>Cash out</span>
                          <strong className="text-white tabular-nums">
                            ${bet.cashOutOffer.toFixed(2)}
                          </strong>
                          <UsdtBadge className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: COMMUNITY CHAT & COPY BETS */}
      {effectiveTab === 'chat' && (
        <div className="flex-1 flex flex-col min-h-0 justify-between">
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            <div className="rounded-[10px] bg-[#0D2129] border border-[#193846] p-2.5 text-[11.5px] text-[#84A0AC] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#2CE5F6] shrink-0" />
                <span>Housebets Lounge & Copy Bets</span>
              </div>
              <strong className="text-white tabular-nums">
                ${usdtBalance.toFixed(2)} ₮
              </strong>
            </div>

            {/* Clean Player Bets in Chat */}
            <div className="rounded-[12px] bg-[#0B1C24] border border-[#17333F] divide-y divide-[#16303B] overflow-hidden">
              {communityBets.slice(0, 4).map((cb) => (
                <div
                  key={cb.id}
                  className="p-3 flex items-center justify-between gap-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12.5px] font-bold text-white truncate">
                        {cb.selection.label}
                      </span>
                      <span className="text-[12.5px] font-bold text-[#3AD4F7] tabular-nums shrink-0">
                        {cb.selection.odds.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#7D9BA8] truncate mt-0.5">
                      {cb.selection.marketName} · {cb.selection.matchTitle}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#84A0AC] tabular-nums">
                      <Users className="w-3 h-3 text-[#7D9BA8]" />
                      {cb.copiedCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyCommunityBet(cb.id)}
                      className="h-7 px-2.5 rounded-[7px] bg-[#102630] hover:bg-[#163442] border border-[#1E4252] text-white text-[11.5px] font-bold transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-[10px] bg-[#0E222B] border border-[#16323F] p-3 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-bold text-[#2CE5F6]">
                      {msg.user}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-[#153442] text-[9.5px] font-extrabold text-[#B9F6EC]">
                      {msg.badge}
                    </span>
                  </div>
                  <span className="text-[10.5px] text-[#6E8D9A]">{msg.time}</span>
                </div>
                <p className="text-[12.5px] text-[#E3EFF3] leading-relaxed">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSendChat}
            className="p-3 border-t border-[#16303C] flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Share your pick with the community..."
              className="flex-1 h-10 px-3 rounded-[9px] bg-[#0F242E] border border-[#1D3E4D] text-[13px] text-white placeholder-[#74929F] focus:outline-none focus:border-[#2CE5F6]"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-[9px] bg-[#1DA4D4] hover:bg-[#25B4E7] text-white flex items-center justify-center transition-colors shrink-0"
              aria-label="Send chat message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export const MyBetsFullPage: React.FC<{ isPhoneView?: boolean }> = ({
  isPhoneView = false,
}) => {
  const {
    myBets,
    cashOutBet,
    shareBetToCommunity,
    goBack,
    navigateTo,
    slipItems,
    isSidePanelOpen,
    setSidePanelTab,
    setIsSidePanelOpen,
  } = useSportsbook();

  const [mobileSection, setMobileSection] = useState<'mybets' | 'slip'>('mybets');
  const [tab, setTab] = useState<'open' | 'settled'>('open');
  const [timeFilter, setTimeFilter] = useState<string>('All time');
  const [customDays, setCustomDays] = useState<number>(14);
  const [sportFilter, setSportFilter] = useState<string>('all');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [confirmCashOutId, setConfirmCashOutId] = useState<string | null>(null);

  const openBets = myBets.filter((b) => b.status === 'Open');
  const settledBets = myBets.filter((b) => b.status !== 'Open');

  const openExposure = openBets.reduce((s, b) => s + b.stake, 0);
  const totalCashOutReady = openBets.reduce(
    (s, b) => s + (b.cashOutOffer ?? 0),
    0
  );
  const settledTotalPaid = settledBets.reduce(
    (s, b) => s + (b.settledReturn ?? 0),
    0
  );

  const timeOptions = [
    'All time',
    'Today',
    'Last 7 days',
    'Last 30 days',
    'Custom',
  ];

  const nowMs = Date.now();
  const dayMs = 86400 * 1000;

  const activeList = (tab === 'open' ? openBets : settledBets).filter((b) => {
    if (sportFilter !== 'all' && b.sportId !== sportFilter) return false;
    if (timeFilter === 'All time') return true;
    const ageMs = Math.max(0, nowMs - b.timestamp);
    if (timeFilter === 'Today') return ageMs <= dayMs;
    if (timeFilter === 'Last 7 days') return ageMs <= 7 * dayMs;
    if (timeFilter === 'Last 30 days') return ageMs <= 30 * dayMs;
    if (timeFilter === 'Custom') return ageMs <= customDays * dayMs;
    return true;
  });

  const showEmbeddedDesktopSlip = !isPhoneView && !isSidePanelOpen;

  return (
    <div className="space-y-4 pb-12">
      {/* Header Row: Shared Bet Slip + My Bets Workspace */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={goBack}
            className="w-10 h-10 rounded-[10px] bg-[#0D2028] border border-white/[0.08] hover:border-[#285466] flex items-center justify-center text-white transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="h-10 px-4 rounded-[10px] bg-[#0D2028] border border-white/[0.08] flex items-center text-[14px] font-bold text-white">
            Bet slip &amp; My bets
          </div>

          <span className="text-[12.5px] text-[#7D9BA8] ml-1 tabular-nums hidden sm:inline">
            {openBets.length} open · {settledBets.length} settled · {slipItems.length} in slip
          </span>
        </div>

        {/* Mobile Segmented Switcher so Bet Slip + My Bets share this page seamlessly on 390px too */}
        {isPhoneView ? (
          <div className="w-full rounded-[11px] bg-[#0A1A22] border border-[#17333F] p-1 grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setMobileSection('mybets')}
              className={`h-9 rounded-[8px] text-[12.5px] font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                mobileSection === 'mybets'
                  ? 'bg-[#12323F] text-white border border-[#2CE5F6]/40'
                  : 'text-[#84A0AC] hover:text-white'
              }`}
            >
              <span>My bets</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#B9F6EC] text-[#07181E] text-[10.5px] font-extrabold tabular-nums leading-none">
                {openBets.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMobileSection('slip')}
              className={`h-9 rounded-[8px] text-[12.5px] font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                mobileSection === 'slip'
                  ? 'bg-[#12323F] text-white border border-[#2CE5F6]/40'
                  : 'text-[#84A0AC] hover:text-white'
              }`}
            >
              <span>Bet slip</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#1DA4D4] text-white text-[10.5px] font-extrabold tabular-nums leading-none">
                {slipItems.length}
              </span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setSidePanelTab('slip');
              setIsSidePanelOpen((v) => !v);
            }}
            className="h-9 px-3.5 rounded-[9px] bg-[#0D2028] hover:bg-[#132E3A] border border-white/[0.08] text-[12px] font-bold text-[#9AB6C3] hover:text-white flex items-center gap-2 transition-colors"
          >
            <span>{isSidePanelOpen ? 'Dock slip in page' : 'Pin slip to side rail'}</span>
          </button>
        )}
      </div>

      {isPhoneView && mobileSection === 'slip' ? (
        <div className="rounded-[16px] bg-[#09181F] border border-[#173543] overflow-hidden shadow-xl">
          <BetSlipAndMyBetsPanelContent embeddedSlipOnly />
        </div>
      ) : (
        <div
          className={
            showEmbeddedDesktopSlip
              ? 'grid grid-cols-1 lg:grid-cols-12 gap-4 items-start'
              : 'space-y-4'
          }
        >
          <div
            className={
              showEmbeddedDesktopSlip ? 'lg:col-span-8 space-y-4' : 'space-y-4'
            }
          >
            {/* 3-Card USDT Portfolio Position Summary */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
              <div className="rounded-[12px] bg-[#0B1C24] border border-white/[0.07] px-3.5 py-3">
                <div className="text-[11px] font-medium text-[#7D9BA8]">
                  Active stake
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[15px] sm:text-[17px] font-extrabold text-white tabular-nums">
            <span>${openExposure.toFixed(2)}</span>
            <UsdtBadge className="w-4 h-4" />
          </div>
        </div>

        <div className="rounded-[12px] bg-[#0B1C24] border border-white/[0.07] px-3.5 py-3">
          <div className="text-[11px] font-medium text-[#7D9BA8]">
            Cash out available
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[15px] sm:text-[17px] font-extrabold text-[#B9F6EC] tabular-nums">
            <span>${totalCashOutReady.toFixed(2)}</span>
            <UsdtBadge className="w-4 h-4" />
          </div>
        </div>

        <div className="rounded-[12px] bg-[#0B1C24] border border-white/[0.07] px-3.5 py-3">
          <div className="text-[11px] font-medium text-[#7D9BA8]">
            Settled payouts
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[15px] sm:text-[17px] font-extrabold text-[#3AD4F7] tabular-nums">
            <span>${settledTotalPaid.toFixed(2)}</span>
            <UsdtBadge className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Open (N) | Settled (N) Segmented Tabs */}
      <div className="w-full max-w-[330px] rounded-[12px] bg-[#0B1C23] border border-[#17333F] p-1 grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => setTab('open')}
          className={`h-[38px] rounded-[9px] text-[13px] font-bold transition-all ${
            tab === 'open'
              ? 'bg-[#12323F] text-white border border-[#1E4B5D]'
              : 'text-[#84A0AC] hover:text-white'
          }`}
        >
          Open ({openBets.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('settled')}
          className={`h-[38px] rounded-[9px] text-[13px] font-bold transition-all ${
            tab === 'settled'
              ? 'bg-[#12323F] text-white border border-[#1E4B5D]'
              : 'text-[#84A0AC] hover:text-white'
          }`}
        >
          Settled ({settledBets.length})
        </button>
      </div>

      {/* Filter Pills + All Sports Dropdown */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {timeOptions.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTimeFilter(t)}
              className={`h-[34px] px-3.5 rounded-full text-[12px] font-semibold transition-all shrink-0 border ${
                timeFilter === t
                  ? 'bg-[#12323F] border-[#1E4B5D] text-white'
                  : 'bg-[#0B1C23] border-[#17333F] text-[#84A0AC] hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
          {timeFilter === 'Custom' && (
            <div className="flex items-center gap-1.5 pl-1 shrink-0">
              {[3, 14, 60].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setCustomDays(d)}
                  className={`h-[30px] px-2.5 rounded-full text-[11px] font-bold border transition-colors ${
                    customDays === d
                      ? 'bg-[#1DA4D4]/20 border-[#2CE5F6] text-[#2CE5F6]'
                      : 'bg-[#0D2028] border-[#193643] text-[#84A0AC] hover:text-white'
                  }`}
                >
                  Last {d}d
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative w-[170px] shrink-0">
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            className="w-full h-[38px] pl-3.5 pr-8 rounded-[10px] bg-[#0B1C23] border border-[#17333F] text-[12.5px] font-semibold text-white appearance-none cursor-pointer focus:outline-none focus:border-[#2CE5F6]"
          >
            <option value="all">All sports</option>
            <option value="soccer">Soccer</option>
            <option value="tennis">Tennis</option>
            <option value="basketball">Basketball</option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#84A0AC] absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Bets Table / Cards matching desk-mybets.2bx-okxqkx1-o.webp */}
      <div className="rounded-[14px] bg-[#0B1C24] border border-[#17333F] overflow-hidden">
        {!isPhoneView && (
          <div className="grid grid-cols-12 items-center px-5 py-3 border-b border-[#16303B] text-[11.5px] font-medium text-[#7D9BA8]">
            <div className="col-span-2">Placed</div>
            <div className="col-span-4">Bet</div>
            <div className="col-span-1 text-right">Odds</div>
            <div className="col-span-1 text-right">Stake</div>
            <div className="col-span-1 text-right">Returns</div>
            <div className="col-span-3 text-right pr-6">Result</div>
          </div>
        )}

        {activeList.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-[14px] font-bold text-white">
              No {tab} bets found
            </p>
            <p className="text-[12.5px] text-[#7D9BA8]">
              Select any market odds to place a single USDT bet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#16303B]">
            {activeList.map((bet) => {
              const isExpanded = expandedRowId === bet.id;
              const isConfirming = confirmCashOutId === bet.id;

              return (
                <div key={bet.id} className="transition-colors hover:bg-[#0E242E]/60">
                  <div
                    onClick={() =>
                      setExpandedRowId((prev) =>
                        prev === bet.id ? null : bet.id
                      )
                    }
                    className="p-4 md:px-5 md:py-4 cursor-pointer"
                  >
                    {isPhoneView ? (
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-[14px] font-extrabold text-white">
                              {bet.selectionLabel}
                            </div>
                            <div className="text-[12px] text-[#84A0AC] mt-0.5 flex items-center gap-1.5 flex-wrap">
                              <span>{bet.matchTitle}</span>
                              {bet.isLive && bet.status === 'Open' && (
                                <>
                                  <span className="text-[#FF477E] font-semibold">
                                    • {bet.liveClock || "52'"}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded bg-[#0E362D] text-[#10B981] text-[10.5px] font-bold">
                                    {bet.liveScore || '1–0'}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <span className="text-[14px] font-extrabold text-[#3AD4F7] tabular-nums">
                            {bet.odds.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[12px] pt-2 border-t border-[#152E39]">
                          <span className="text-[#7D9BA8]">
                            Stake:{' '}
                            <strong className="text-white tabular-nums">
                              ${bet.stake.toFixed(2)}
                            </strong>
                          </span>
                          <span className="text-[#7D9BA8]">
                            Returns:{' '}
                            <strong className="text-white tabular-nums">
                              $
                              {(
                                bet.settledReturn ?? bet.potentialReturn
                              ).toFixed(2)}
                            </strong>
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              bet.status === 'Open'
                                ? 'bg-[#14303D] text-white'
                                : bet.status === 'Won'
                                ? 'bg-[#10B981]/20 text-[#10B981]'
                                : bet.status === 'Cashed Out'
                                ? 'bg-[#2CE5F6]/20 text-[#2CE5F6]'
                                : 'bg-[#EF4444]/20 text-[#F87171]'
                            }`}
                          >
                            {bet.status}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-12 items-center gap-2">
                        <div className="col-span-2 text-[12.5px] tabular-nums">
                          <div className="text-[#E6F1F5] font-medium">
                            {bet.placedAt}
                          </div>
                          <div className="text-[#74929F] text-[11.5px]">
                            {bet.placedTime}
                          </div>
                        </div>

                        <div className="col-span-4">
                          <div className="text-[14px] font-bold text-white">
                            {bet.selectionLabel}
                          </div>
                          <div className="text-[12px] text-[#84A0AC] mt-0.5 flex items-center gap-2 flex-wrap">
                            <span>{bet.matchTitle}</span>
                            {bet.isLive && bet.status === 'Open' && (
                              <>
                                <span className="text-[#FF477E] font-semibold tabular-nums">
                                  • {bet.liveClock || "52'"}
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-[#0E362D] text-[#10B981] text-[11px] font-bold tabular-nums">
                                  {bet.liveScore || '1–0'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="col-span-1 text-right text-[13.5px] font-bold text-[#3AD4F7] tabular-nums">
                          {bet.odds.toFixed(2)}
                        </div>

                        <div className="col-span-1 text-right text-[13.5px] font-semibold text-white tabular-nums">
                          ${bet.stake.toFixed(2)}
                        </div>

                        <div className="col-span-1 text-right text-[13.5px] font-semibold text-white tabular-nums">
                          $
                          {(bet.settledReturn ?? bet.potentialReturn).toFixed(
                            2
                          )}
                        </div>

                        <div className="col-span-3 flex items-center justify-end gap-2">
                          {bet.status === 'Open' && bet.cashOutOffer ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                cashOutBet(bet.id);
                                setTab('settled');
                              }}
                              className="h-8 px-3 rounded-[8px] bg-[#B9F6EC] hover:bg-[#9FEFE2] text-[#07181E] text-[11.5px] font-extrabold inline-flex items-center gap-1.5 transition-colors shrink-0"
                            >
                              <span>Cash out ${bet.cashOutOffer.toFixed(2)}</span>
                              <UsdtBadge className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span
                              className={`px-2.5 py-1 rounded-[6px] text-[11.5px] font-bold ${
                                bet.status === 'Open'
                                  ? 'bg-[#14303D] text-white'
                                  : bet.status === 'Won'
                                  ? 'bg-[#10B981]/20 text-[#10B981]'
                                  : bet.status === 'Cashed Out'
                                  ? 'bg-[#2CE5F6]/20 text-[#2CE5F6]'
                                  : 'bg-[#EF4444]/20 text-[#F87171]'
                              }`}
                            >
                              {bet.status}
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#84A0AC] shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#84A0AC] shrink-0" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded Row Details + Cash Out Action */}
                  {isExpanded && (
                    <div className="px-4 md:px-5 pb-4 pt-2 bg-[#09181F]/80 border-t border-[#142C36] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-[12px] text-[#84A0AC] flex items-center gap-3 flex-wrap">
                        <span>
                          Ticket ID:{' '}
                          <strong className="text-white font-mono">
                            #{bet.id.slice(-6).toUpperCase()}
                          </strong>
                        </span>
                        <span>·</span>
                        <span>
                          Market:{' '}
                          <strong className="text-white">
                            {bet.marketName} (Single)
                          </strong>
                        </span>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() =>
                            navigateTo('match', {
                              matchId: bet.matchId || 'ars-bha',
                            })
                          }
                          className="text-[#2CE5F6] hover:underline font-semibold"
                        >
                          Go to match page →
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() => shareBetToCommunity(bet.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#122D39] hover:bg-[#193E4E] border border-[#214B5E] text-[#B9F6EC] text-[11.5px] font-bold transition-colors"
                        >
                          <Share2 className="w-3 h-3 text-[#2CE5F6]" />
                          <span>
                            {bet.sharedToCommunity
                              ? `Shared (${bet.copiedCount ?? 15} copied)`
                              : 'Share for Copy-Bet'}
                          </span>
                        </button>
                      </div>

                      {bet.status === 'Open' && bet.cashOutOffer && (
                        <div className="flex items-center gap-2 shrink-0">
                          {isConfirming ? (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  cashOutBet(bet.id);
                                  setConfirmCashOutId(null);
                                  setTab('settled');
                                }}
                                className="h-9 px-4 rounded-[9px] bg-[#10B981] hover:bg-[#059669] text-[#061814] text-[12.5px] font-extrabold transition-colors"
                              >
                                Confirm Cash Out ${bet.cashOutOffer.toFixed(2)}{' '}
                                USDT
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmCashOutId(null)}
                                className="h-9 px-3 rounded-[9px] bg-[#152E3A] text-[12px] font-bold text-[#84A0AC] hover:text-white"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmCashOutId(bet.id)}
                              className="h-9 px-4 rounded-[9px] bg-[#B9F6EC] hover:bg-[#9FEFE2] text-[#07181E] text-[12.5px] font-extrabold flex items-center gap-1.5 transition-colors shadow-sm"
                            >
                              <span>
                                Cash out ${bet.cashOutOffer.toFixed(2)}
                              </span>
                              <UsdtBadge className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
          </div>

          {/* Right 4 Cols: Active Singles Bet Slip Embedded Right on the Shared Page */}
          {showEmbeddedDesktopSlip && (
            <aside className="lg:col-span-4 lg:sticky lg:top-[72px] rounded-[16px] bg-[#09181F] border border-[#173543] overflow-hidden shadow-[0_14px_38px_rgba(0,0,0,0.38)] min-h-[420px]">
              <BetSlipAndMyBetsPanelContent embeddedSlipOnly />
            </aside>
          )}
        </div>
      )}
    </div>
  );
};
