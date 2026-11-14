import React from 'react';
import { Layers, Percent, Zap } from 'lucide-react';
import { useSportsbook } from '../../context/SportsbookContext';
import { UsdtBadge } from '../../components/BrandIcons';

export type MobileMatrixMarketCol = '1x2' | 'hdp' | 'ou';

export const FlashStakeToolbar: React.FC<{
  isPhoneView?: boolean;
  mobileCol?: MobileMatrixMarketCol;
  onChangeMobileCol?: (col: MobileMatrixMarketCol) => void;
}> = ({ isPhoneView = false, mobileCol = '1x2', onChangeMobileCol }) => {
  const {
    flashStakePreset,
    setFlashStakePreset,
    matrixExecMode,
    setMatrixExecMode,
    showImpliedProb,
    setShowImpliedProb,
    inlineTicketSelectionId,
    updateStake,
    slipItems,
    setIsSidePanelOpen,
    setSidePanelTab,
  } = useSportsbook();

  const presets = [10, 25, 50, 100];

  const handlePresetClick = (amt: number) => {
    setFlashStakePreset(amt);
    if (inlineTicketSelectionId) {
      updateStake(inlineTicketSelectionId, String(amt));
    }
  };

  if (isPhoneView) {
    return (
      <div className="mb-3 rounded-[11px] bg-[#08171F] border border-[#163443] px-2.5 py-2 flex items-center justify-between gap-2">
        {/* Mobile Market Column Switcher for Pro Matrix */}
        {onChangeMobileCol ? (
          <div className="flex items-center gap-0.5 bg-[#051016] p-0.5 rounded-[8px] border border-[#15303E] shrink-0">
            {(
              [
                { id: '1x2', label: '1X2' },
                { id: 'hdp', label: 'HDP' },
                { id: 'ou', label: 'O/U' },
              ] as Array<{ id: MobileMatrixMarketCol; label: string }>
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeMobileCol(tab.id)}
                className={`px-2 py-1 rounded-[6px] text-[10.5px] font-extrabold tracking-tight transition-colors ${
                  mobileCol === tab.id
                    ? 'bg-[#143949] text-[#2CE5F6]'
                    : 'text-[#7A9AA8] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#2CE5F6]">
            <Zap className="w-3.5 h-3.5" />
            <span>Flash Stake</span>
          </div>
        )}

        {/* Quick USDT Stake Presets */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <UsdtBadge className="w-3.5 h-3.5 shrink-0" />
          {presets.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handlePresetClick(amt)}
              className={`h-6 px-2 rounded-[6px] text-[10.5px] font-extrabold tabular-nums transition-colors shrink-0 ${
                flashStakePreset === amt
                  ? 'bg-[#B9F6EC] text-[#06181F]'
                  : 'bg-[#0D232E] text-[#9AB7C4] border border-[#193948]'
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3.5 rounded-[11px] bg-[#08161E] border border-[#173544] px-3 py-2 flex flex-wrap items-center justify-between gap-2.5">
      {/* Left: Execution Mode + 1-Tap Flash USDT Stake Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-[#050F15] p-0.5 rounded-[8px] border border-[#15303E]">
          <button
            type="button"
            onClick={() => setMatrixExecMode('inline')}
            className={`h-7 px-2.5 rounded-[6px] text-[11.5px] font-extrabold flex items-center gap-1.5 transition-colors ${
              matrixExecMode === 'inline'
                ? 'bg-[#133848] text-[#2CE5F6] border border-[#2CE5F6]/35'
                : 'text-[#7F9EAC] hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Inline Flash-Single</span>
          </button>
          <button
            type="button"
            onClick={() => setMatrixExecMode('slip')}
            className={`h-7 px-2.5 rounded-[6px] text-[11.5px] font-extrabold flex items-center gap-1.5 transition-colors ${
              matrixExecMode === 'slip'
                ? 'bg-[#133848] text-white border border-[#2CE5F6]/35'
                : 'text-[#7F9EAC] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Standard Slip</span>
          </button>
        </div>

        <div className="h-4 w-[1px] bg-[#173544] hidden sm:block" />

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-[#7D9CA9] uppercase tracking-wider flex items-center gap-1">
            <UsdtBadge className="w-3.5 h-3.5" />
            <span>Default Stake:</span>
          </span>
          <div className="flex items-center gap-1">
            {presets.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handlePresetClick(amt)}
                className={`h-7 px-2.5 rounded-[7px] text-[11.5px] font-extrabold tabular-nums transition-all ${
                  flashStakePreset === amt
                    ? 'bg-[#B9F6EC] text-[#06181F] shadow-sm'
                    : 'bg-[#0D222D] hover:bg-[#133140] text-[#B8D0DB] border border-[#1B3C4B]'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Implied Probability Toggle + Queued Singles Indicator */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowImpliedProb((v) => !v)}
          className={`h-7 px-2.5 rounded-[7px] border text-[11.5px] font-bold flex items-center gap-1.5 transition-colors ${
            showImpliedProb
              ? 'bg-[#133848] border-[#2CE5F6]/50 text-[#2CE5F6]'
              : 'bg-[#0C1F29] border-[#1A3947] text-[#8AA7B4] hover:text-white'
          }`}
        >
          <Percent className="w-3 h-3" />
          <span>Implied %</span>
        </button>

        {slipItems.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setSidePanelTab('slip');
              setIsSidePanelOpen(true);
            }}
            className="h-7 px-2.5 rounded-[7px] bg-[#123342] hover:bg-[#184356] border border-[#2CE5F6]/40 text-[11.5px] font-extrabold text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Slip</span>
            <span className="px-1.5 py-0.2 rounded bg-[#B9F6EC] text-[#06181F] text-[10.5px] tabular-nums">
              {slipItems.length}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
