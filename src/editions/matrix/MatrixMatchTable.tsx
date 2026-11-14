import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Lock,
  RefreshCw,
  Star,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { useSportsbook } from '../../context/SportsbookContext';
import {
  getMarketsForMatch,
  MatchItem,
  OddSelection,
} from '../../data/sportsbookData';
import {
  CompetitionFlag,
  SportIcon,
  TeamCrest,
  UsdtBadge,
} from '../../components/BrandIcons';
import { MobileMatrixMarketCol } from './FlashStakeToolbar';

interface DerivedMatrixColumns {
  home1x2: OddSelection;
  draw1x2: OddSelection | null;
  away1x2: OddSelection;
  hdpHome: { sel: OddSelection; tag: string };
  hdpAway: { sel: OddSelection; tag: string };
  totOver: { sel: OddSelection; tag: string };
  totUnder: { sel: OddSelection; tag: string };
}

function deriveMatrixColumns(match: MatchItem): DerivedMatrixColumns {
  const mkts = getMarketsForMatch(match);
  const matchTitle = `${match.homeTeam.name} v ${match.awayTeam.name}`;
  const scoreText =
    match.homeTeam.score !== undefined && match.awayTeam.score !== undefined
      ? `${match.homeTeam.score}–${match.awayTeam.score}`
      : undefined;

  const toOddSel = (
    mktId: string,
    mktName: string,
    id: string,
    label: string,
    odds: number,
    shortLabel?: string,
    suspended?: boolean
  ): OddSelection => ({
    id,
    matchId: match.id,
    matchTitle,
    competitionId: match.competitionId,
    competitionName: match.competitionName,
    sportId: match.sportId,
    marketId: mktId,
    marketName: mktName,
    label,
    shortLabel: shortLabel || label,
    odds,
    suspended: Boolean(match.suspended || suspended),
    isLive: match.isLive,
    scoreText,
    clockText: match.clock,
  });

  // 1. Main 1X2 / Moneyline
  const m1x2 = mkts.find((m) => m.id === 'mkt-1x2');
  const homeSelRaw = m1x2?.selections[0];
  const drawSelRaw =
    match.sportId === 'soccer' && m1x2 && m1x2.selections.length >= 3
      ? m1x2.selections[1]
      : null;
  const awaySelRaw =
    match.sportId === 'soccer' && m1x2 && m1x2.selections.length >= 3
      ? m1x2.selections[2]
      : m1x2?.selections[1];

  const home1x2 = toOddSel(
    m1x2?.id || 'mkt-1x2',
    m1x2?.name || 'Match result',
    homeSelRaw?.id || `${match.id}-1x2-home`,
    homeSelRaw?.label || match.homeTeam.name,
    homeSelRaw?.odds ?? match.mainOdds.home,
    match.homeTeam.shortName,
    m1x2?.suspended || homeSelRaw?.suspended
  );

  const draw1x2 =
    match.sportId === 'soccer' && (drawSelRaw || match.mainOdds.draw)
      ? toOddSel(
          m1x2?.id || 'mkt-1x2',
          m1x2?.name || 'Match result',
          drawSelRaw?.id || `${match.id}-1x2-draw`,
          'Draw',
          drawSelRaw?.odds ?? match.mainOdds.draw ?? 3.4,
          'Draw',
          m1x2?.suspended || drawSelRaw?.suspended
        )
      : null;

  const away1x2 = toOddSel(
    m1x2?.id || 'mkt-1x2',
    m1x2?.name || 'Match result',
    awaySelRaw?.id || `${match.id}-1x2-away`,
    awaySelRaw?.label || match.awayTeam.name,
    awaySelRaw?.odds ?? match.mainOdds.away,
    match.awayTeam.shortName,
    m1x2?.suspended || awaySelRaw?.suspended
  );

  // 2. Handicap / Spread
  const mHdp = mkts.find(
    (m) =>
      m.id === 'mkt-handicap-asian' ||
      m.id === 'mkt-spread' ||
      m.id === 'mkt-game-hcp'
  );
  const hdpH = mHdp?.selections[0];
  const hdpA = mHdp?.selections[1];
  const extractParenTag = (lbl: string | undefined, fallback: string) => {
    if (!lbl) return fallback;
    const m = lbl.match(/\(([^)]+)\)/);
    if (!m) return fallback;
    return m[1].replace(/\s*Games|\s*Maps/gi, '');
  };

  const hdpHome = {
    tag: extractParenTag(hdpH?.label, '-0.5'),
    sel: toOddSel(
      mHdp?.id || 'mkt-hdp',
      mHdp?.name || 'Handicap',
      hdpH?.id || `${match.id}-hdp-h`,
      hdpH?.label || `${match.homeTeam.name} (-0.5)`,
      hdpH?.odds ?? 1.88,
      `${match.homeTeam.shortName} ${extractParenTag(hdpH?.label, '-0.5')}`,
      mHdp?.suspended || hdpH?.suspended
    ),
  };

  const hdpAway = {
    tag: extractParenTag(hdpA?.label, '+0.5'),
    sel: toOddSel(
      mHdp?.id || 'mkt-hdp',
      mHdp?.name || 'Handicap',
      hdpA?.id || `${match.id}-hdp-a`,
      hdpA?.label || `${match.awayTeam.name} (+0.5)`,
      hdpA?.odds ?? 1.92,
      `${match.awayTeam.shortName} ${extractParenTag(hdpA?.label, '+0.5')}`,
      mHdp?.suspended || hdpA?.suspended
    ),
  };

  // 3. Totals (Over / Under)
  const mTot = mkts.find(
    (m) =>
      m.id === 'mkt-tg-25' ||
      m.id === 'mkt-totals' ||
      m.id === 'mkt-total-games'
  );
  const totO = mTot?.selections[0];
  const totU = mTot?.selections[1];
  const lineNum =
    match.overUnderOdds?.line?.replace(/\s*Maps/i, '') ||
    totO?.label.replace(/^Over\s+/i, '').replace(/\s*Games|\s*Maps/gi, '') ||
    '2.5';

  const totOver = {
    tag: `O ${lineNum}`,
    sel: toOddSel(
      mTot?.id || 'mkt-tot',
      mTot?.name || 'Total',
      totO?.id || `${match.id}-tot-o`,
      totO?.label || `Over ${lineNum}`,
      totO?.odds ?? match.overUnderOdds?.over ?? 1.88,
      `O ${lineNum}`,
      mTot?.suspended || totO?.suspended
    ),
  };

  const totUnder = {
    tag: `U ${lineNum}`,
    sel: toOddSel(
      mTot?.id || 'mkt-tot',
      mTot?.name || 'Total',
      totU?.id || `${match.id}-tot-u`,
      totU?.label || `Under ${lineNum}`,
      totU?.odds ?? match.overUnderOdds?.under ?? 1.92,
      `U ${lineNum}`,
      mTot?.suspended || totU?.suspended
    ),
  };

  return {
    home1x2,
    draw1x2,
    away1x2,
    hdpHome,
    hdpAway,
    totOver,
    totUnder,
  };
}

const MatrixOddCell: React.FC<{
  sel: OddSelection | null;
  subTag?: string;
  isPhoneView?: boolean;
}> = ({ sel, subTag, isPhoneView = false }) => {
  const {
    isSelected,
    toggleSelection,
    selectMatrixOdd,
    oddsFlashMap,
    showImpliedProb,
  } = useSportsbook();

  if (!sel) {
    return (
      <div className="h-[42px] rounded-[7px] bg-[#061117]/70 border border-white/[0.03] flex items-center justify-center text-[11px] font-bold text-[#355260] select-none">
        —
      </div>
    );
  }

  if (sel.suspended) {
    return (
      <div
        title="Market suspended"
        className="h-[42px] rounded-[7px] bg-[#07131A] border border-[#243B47]/60 flex flex-col items-center justify-center gap-0.5 text-[#5D7C8A] cursor-not-allowed select-none"
      >
        <Lock className="w-3 h-3 text-[#F59E0B]/80" />
        <span className="text-[8.5px] font-extrabold uppercase tracking-wider text-[#8BA6B2]">
          SUSP
        </span>
      </div>
    );
  }

  const active = isSelected(sel.id);
  const flash = oddsFlashMap[sel.id];
  const isRecentFlash = flash && Date.now() - flash.ts < 3200;
  const impliedPct = Math.round((1 / sel.odds) * 100);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPhoneView) {
      toggleSelection(sel);
    } else {
      selectMatrixOdd(sel);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`h-[42px] px-1.5 rounded-[7px] border flex flex-col items-center justify-center transition-all relative select-none ${
        active
          ? 'bg-[#153F50] border-[#2CE5F6] text-white shadow-[0_0_12px_rgba(44,229,246,0.22)]'
          : isRecentFlash && flash.dir === 'up'
          ? 'bg-[#10B981]/15 border-[#10B981]/60 text-white'
          : isRecentFlash && flash.dir === 'down'
          ? 'bg-[#F43F5E]/15 border-[#F43F5E]/60 text-white'
          : 'bg-[#0C1F29] hover:bg-[#122D3B] border-[#193847] hover:border-[#29596E] text-[#E6F3F8]'
      }`}
    >
      {subTag && (
        <span
          className={`text-[9.5px] font-bold leading-none mb-0.5 tabular-nums truncate max-w-full ${
            active ? 'text-[#B9F6EC]' : 'text-[#7293A1]'
          }`}
        >
          {subTag}
        </span>
      )}
      <span
        className={`text-[12.5px] font-extrabold leading-none tabular-nums flex items-center gap-0.5 ${
          active
            ? 'text-[#2CE5F6]'
            : isRecentFlash && flash.dir === 'up'
            ? 'text-[#34D399]'
            : isRecentFlash && flash.dir === 'down'
            ? 'text-[#FB7185]'
            : 'text-[#3AD4F7]'
        }`}
      >
        <span>
          {showImpliedProb ? `${impliedPct}%` : sel.odds.toFixed(2)}
        </span>
        {isRecentFlash &&
          (flash.dir === 'up' ? (
            <TrendingUp className="w-2.5 h-2.5 text-[#34D399]" />
          ) : (
            <TrendingDown className="w-2.5 h-2.5 text-[#FB7185]" />
          ))}
      </span>
    </button>
  );
};

export const MatrixCompetitionTable: React.FC<{
  competitionId: string;
  competitionName: string;
  sportId: MatchItem['sportId'];
  matches: MatchItem[];
  isPhoneView?: boolean;
  mobileCol?: MobileMatrixMarketCol;
}> = ({
  competitionId,
  competitionName,
  sportId,
  matches,
  isPhoneView = false,
  mobileCol = '1x2',
}) => {
  const {
    navigateTo,
    followedCompetitions,
    toggleFollowCompetition,
    followedTeams,
    toggleFollowTeam,
    matrixExecMode,
    inlineTicketMatchId,
    inlineTicketSelectionId,
    closeInlineTicket,
    slipItems,
    updateStake,
    acceptAllOddsChanges,
    placeInstantSingle,
    betPlacementState,
    betErrorReason,
    lastPlacedBets,
    resetBetPlacementState,
    setIsSidePanelOpen,
    setSidePanelTab,
  } = useSportsbook();

  if (matches.length === 0) return null;

  const isCompFollowed = followedCompetitions.includes(competitionId);

  return (
    <div className="rounded-[12px] bg-[#08161E] border border-[#163240] overflow-hidden">
      {/* Institutional League & Column Header */}
      <div className="px-3 py-2 bg-[#0B1D27] border-b border-[#15303E] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => toggleFollowCompetition(competitionId)}
            title={isCompFollowed ? 'Unfollow competition' : 'Follow competition'}
            className="text-[#6F909E] hover:text-[#F5B82E] transition-colors shrink-0"
          >
            <Star
              className={`w-3.5 h-3.5 ${
                isCompFollowed ? 'fill-[#F5B82E] text-[#F5B82E]' : ''
              }`}
            />
          </button>
          <CompetitionFlag flagId={competitionId} className="w-4 h-4 shrink-0" />
          <SportIcon sport={sportId} className="w-3.5 h-3.5 text-[#2CE5F6] shrink-0" />
          <button
            type="button"
            onClick={() =>
              navigateTo('football', {
                sport: sportId,
                competition: competitionId,
              })
            }
            className="text-[12.5px] font-extrabold text-white hover:text-[#2CE5F6] truncate transition-colors"
          >
            {competitionName}
          </button>
          <span className="text-[10.5px] font-bold text-[#6C8C9A] tabular-nums">
            ({matches.length})
          </span>
        </div>

        {/* Column Labels */}
        {isPhoneView ? (
          <div className="w-[146px] shrink-0 grid grid-cols-3 text-center text-[9.5px] font-extrabold uppercase tracking-wider text-[#6D8E9C]">
            {mobileCol === '1x2' ? (
              <>
                <span>1</span>
                <span>{sportId === 'soccer' ? 'X' : '—'}</span>
                <span>2</span>
              </>
            ) : mobileCol === 'hdp' ? (
              <>
                <span className="col-span-3">Handicap / Spread</span>
              </>
            ) : (
              <>
                <span className="col-span-3">Total Over / Under</span>
              </>
            )}
          </div>
        ) : (
          <div className="hidden md:grid grid-cols-[204px_142px_142px_48px] lg:grid-cols-[216px_154px_154px_52px] items-center gap-2 shrink-0 text-[9.5px] font-extrabold uppercase tracking-wider text-[#6E8F9D]">
            <div className="grid grid-cols-3 text-center">
              <span>1</span>
              <span>X</span>
              <span>2</span>
            </div>
            <div className="text-center border-l border-white/[0.06]">
              Handicap
            </div>
            <div className="text-center border-l border-white/[0.06]">
              Total O/U
            </div>
            <div className="text-right pr-1">Mkts</div>
          </div>
        )}
      </div>

      {/* Dense Match Rows */}
      <div className="divide-y divide-[#122935]">
        {matches.map((match) => {
          const cols = deriveMatrixColumns(match);
          const isHomeStarred = followedTeams.includes(match.homeTeam.id);
          const isAwayStarred = followedTeams.includes(match.awayTeam.id);

          // Check if Inline Flash-Single Drawer should open below this row (Desktop)
          const activeInlineSlipItem =
            !isPhoneView &&
            matrixExecMode === 'inline' &&
            inlineTicketMatchId === match.id &&
            inlineTicketSelectionId
              ? slipItems.find((i) => i.selection.id === inlineTicketSelectionId)
              : undefined;

          const justPlacedHere =
            !isPhoneView &&
            matrixExecMode === 'inline' &&
            inlineTicketMatchId === match.id &&
            betPlacementState === 'placed' &&
            lastPlacedBets[0]?.matchId === match.id
              ? lastPlacedBets[0]
              : undefined;

          const stakeNumeric = activeInlineSlipItem
            ? parseFloat(activeInlineSlipItem.stake || '0') || 0
            : 0;
          const potentialPayout = activeInlineSlipItem
            ? stakeNumeric * activeInlineSlipItem.currentOdds
            : 0;

          return (
            <div key={match.id} className="bg-[#08161E] hover:bg-[#0A1B25] transition-colors">
              <div className="px-3 py-2 flex items-center justify-between gap-2">
                {/* Left: Clock / Status + Teams + Live Scores */}
                <div
                  onClick={() => navigateTo('match', { matchId: match.id })}
                  className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer group"
                >
                  {/* Fixed Width Status / Clock Column */}
                  <div
                    className={`${
                      isPhoneView ? 'w-[38px]' : 'w-[54px] sm:w-[62px]'
                    } shrink-0 flex flex-col items-start justify-center`}
                  >
                    {match.isLive ? (
                      <>
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#FF4D79] tabular-nums leading-tight">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E63] animate-pulse shrink-0" />
                          <span className="truncate max-w-[46px]">
                            {match.clock || 'LIVE'}
                          </span>
                        </span>
                        {match.suspended && !isPhoneView && (
                          <span className="text-[8.5px] font-extrabold uppercase text-[#F59E0B] mt-0.5">
                            Locked
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-[10.5px] font-extrabold text-[#B8D0DB] tabular-nums leading-tight">
                          {match.startTime}
                        </span>
                        <span className="text-[9px] font-semibold text-[#688896] truncate max-w-[52px]">
                          {match.startsInMinutes && match.startsInMinutes <= 60
                            ? `in ${match.startsInMinutes}m`
                            : match.startDate}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Teams & Live Scores Stack */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1.5 pr-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {!isPhoneView && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFollowTeam(match.homeTeam.id);
                            }}
                            className="text-[#547584] hover:text-[#F5B82E] shrink-0"
                            title={`Follow ${match.homeTeam.name}`}
                          >
                            <Star
                              className={`w-3 h-3 ${
                                isHomeStarred
                                  ? 'fill-[#F5B82E] text-[#F5B82E]'
                                  : ''
                              }`}
                            />
                          </button>
                        )}
                        <TeamCrest
                          teamId={match.homeTeam.id}
                          teamName={match.homeTeam.name}
                          size="xs"
                        />
                        <span className="text-[12px] sm:text-[12.5px] font-bold text-[#EEF6F9] group-hover:text-[#2CE5F6] truncate transition-colors">
                          {isPhoneView
                            ? match.homeTeam.shortName
                            : match.homeTeam.name}
                        </span>
                      </div>
                      {match.isLive && match.homeTeam.score !== undefined && (
                        <span className="text-[12px] font-extrabold text-white tabular-nums shrink-0">
                          {match.homeTeam.score}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-1.5 pr-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {!isPhoneView && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFollowTeam(match.awayTeam.id);
                            }}
                            className="text-[#547584] hover:text-[#F5B82E] shrink-0"
                            title={`Follow ${match.awayTeam.name}`}
                          >
                            <Star
                              className={`w-3 h-3 ${
                                isAwayStarred
                                  ? 'fill-[#F5B82E] text-[#F5B82E]'
                                  : ''
                              }`}
                            />
                          </button>
                        )}
                        <TeamCrest
                          teamId={match.awayTeam.id}
                          teamName={match.awayTeam.name}
                          size="xs"
                        />
                        <span className="text-[12px] sm:text-[12.5px] font-bold text-[#C9DFE8] group-hover:text-[#2CE5F6] truncate transition-colors">
                          {isPhoneView
                            ? match.awayTeam.shortName
                            : match.awayTeam.name}
                        </span>
                      </div>
                      {match.isLive && match.awayTeam.score !== undefined && (
                        <span className="text-[12px] font-extrabold text-[#B9F6EC] tabular-nums shrink-0">
                          {match.awayTeam.score}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Simultaneous Pro Odds Matrix */}
                {isPhoneView ? (
                  <div className="w-[146px] shrink-0">
                    {mobileCol === '1x2' ? (
                      <div className="grid grid-cols-3 gap-1">
                        <MatrixOddCell sel={cols.home1x2} isPhoneView />
                        <MatrixOddCell sel={cols.draw1x2} isPhoneView />
                        <MatrixOddCell sel={cols.away1x2} isPhoneView />
                      </div>
                    ) : mobileCol === 'hdp' ? (
                      <div className="grid grid-cols-2 gap-1">
                        <MatrixOddCell
                          sel={cols.hdpHome.sel}
                          subTag={cols.hdpHome.tag}
                          isPhoneView
                        />
                        <MatrixOddCell
                          sel={cols.hdpAway.sel}
                          subTag={cols.hdpAway.tag}
                          isPhoneView
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1">
                        <MatrixOddCell
                          sel={cols.totOver.sel}
                          subTag={cols.totOver.tag}
                          isPhoneView
                        />
                        <MatrixOddCell
                          sel={cols.totUnder.sel}
                          subTag={cols.totUnder.tag}
                          isPhoneView
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden md:grid grid-cols-[204px_142px_142px_48px] lg:grid-cols-[216px_154px_154px_52px] items-center gap-2 shrink-0">
                    {/* Market 1: 1X2 */}
                    <div className="grid grid-cols-3 gap-1">
                      <MatrixOddCell sel={cols.home1x2} />
                      <MatrixOddCell sel={cols.draw1x2} />
                      <MatrixOddCell sel={cols.away1x2} />
                    </div>

                    {/* Market 2: Handicap / Spread */}
                    <div className="grid grid-cols-2 gap-1 pl-2 border-l border-white/[0.06]">
                      <MatrixOddCell
                        sel={cols.hdpHome.sel}
                        subTag={cols.hdpHome.tag}
                      />
                      <MatrixOddCell
                        sel={cols.hdpAway.sel}
                        subTag={cols.hdpAway.tag}
                      />
                    </div>

                    {/* Market 3: Total Over / Under */}
                    <div className="grid grid-cols-2 gap-1 pl-2 border-l border-white/[0.06]">
                      <MatrixOddCell
                        sel={cols.totOver.sel}
                        subTag={cols.totOver.tag}
                      />
                      <MatrixOddCell
                        sel={cols.totUnder.sel}
                        subTag={cols.totUnder.tag}
                      />
                    </div>

                    {/* All Match Markets Jump */}
                    <button
                      type="button"
                      onClick={() => navigateTo('match', { matchId: match.id })}
                      className="h-[42px] rounded-[7px] bg-[#0B1D26] hover:bg-[#133241] border border-[#173442] text-[11px] font-extrabold text-[#93B3C1] hover:text-[#2CE5F6] flex items-center justify-center gap-0.5 tabular-nums transition-colors"
                      title={`Open all ${match.totalMarketsCount} markets`}
                    >
                      <span>+{match.totalMarketsCount}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* INLINE FLASH-SINGLE EXECUTION BAR (Zero-Drawer Desktop Trading) */}
              {justPlacedHere && (
                <div className="mx-3 mb-2.5 px-3.5 py-2.5 rounded-[9px] bg-[#0D2E2A] border border-[#10B981]/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-[#B9F6EC]">
                    <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />
                    <span>
                      Single Placed: <strong>${justPlacedHere.stake.toFixed(2)} USDT</strong> on{' '}
                      <strong>{justPlacedHere.selectionLabel}</strong> @{' '}
                      <strong>{justPlacedHere.odds.toFixed(2)}</strong> · Potential Return{' '}
                      <strong className="text-white">
                        ${justPlacedHere.potentialReturn.toFixed(2)} USDT
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        resetBetPlacementState();
                        closeInlineTicket();
                        navigateTo('mybets');
                      }}
                      className="h-7 px-2.5 rounded-[7px] bg-[#14433D] hover:bg-[#1B574F] text-[11.5px] font-extrabold text-[#B9F6EC] transition-colors"
                    >
                      View in My Bets
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetBetPlacementState();
                        closeInlineTicket();
                      }}
                      className="p-1 text-[#8BC7BC] hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {activeInlineSlipItem && (
                <div className="mx-3 mb-2.5 px-3.5 py-2.5 rounded-[10px] bg-[#0B212C] border border-[#2CE5F6]/45 shadow-lg space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Ticket Summary */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="px-1.5 py-0.5 rounded bg-[#143D4F] text-[#2CE5F6] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shrink-0">
                        <Zap className="w-3 h-3" />
                        Single
                      </span>
                      <span className="text-[12px] text-[#8AA9B6] font-semibold truncate">
                        {activeInlineSlipItem.selection.marketName}:
                      </span>
                      <span className="text-[13px] font-extrabold text-white truncate">
                        {activeInlineSlipItem.selection.label}
                      </span>
                      <span className="text-[13.5px] font-extrabold text-[#2CE5F6] tabular-nums">
                        @ {activeInlineSlipItem.currentOdds.toFixed(2)}
                      </span>
                    </div>

                    {/* Stake Input + Quick Presets + Instant Mint Place CTA */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        {[10, 25, 50, 100].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() =>
                              updateStake(
                                activeInlineSlipItem.selection.id,
                                String(amt)
                              )
                            }
                            className={`h-7 px-2 rounded-[6px] text-[11px] font-extrabold tabular-nums transition-colors ${
                              stakeNumeric === amt
                                ? 'bg-[#17465A] text-[#2CE5F6] border border-[#2CE5F6]/50'
                                : 'bg-[#07151D] text-[#8AA9B6] hover:text-white border border-[#173544]'
                            }`}
                          >
                            ${amt}
                          </button>
                        ))}
                      </div>

                      <div className="h-8 px-2.5 rounded-[8px] bg-[#061218] border border-[#1D4050] focus-within:border-[#2CE5F6] flex items-center gap-1.5 w-[114px]">
                        <UsdtBadge className="w-3.5 h-3.5" />
                        <input
                          type="text"
                          inputMode="decimal"
                          value={activeInlineSlipItem.stake}
                          onChange={(e) =>
                            updateStake(
                              activeInlineSlipItem.selection.id,
                              e.target.value
                            )
                          }
                          placeholder="0.00"
                          className="w-full bg-transparent text-[12.5px] font-extrabold text-white outline-none tabular-nums"
                        />
                      </div>

                      <div className="text-right px-1">
                        <div className="text-[9.5px] text-[#7898A6] uppercase font-bold leading-none">
                          Potential Return
                        </div>
                        <div className="text-[12.5px] font-extrabold text-[#B9F6EC] tabular-nums mt-0.5">
                          ${potentialPayout.toFixed(2)} USDT
                        </div>
                      </div>

                      {activeInlineSlipItem.suspended ? (
                        <span className="h-8 px-3 rounded-[8px] bg-[#F59E0B]/20 border border-[#F59E0B]/50 text-[#FBBF24] text-[11.5px] font-extrabold flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Suspended</span>
                        </span>
                      ) : activeInlineSlipItem.oddsChanged ? (
                        <button
                          type="button"
                          onClick={acceptAllOddsChanges}
                          className="h-8 px-3.5 rounded-[8px] bg-[#2CE5F6] hover:bg-[#57ECFA] text-[#06181F] text-[12px] font-extrabold transition-colors"
                        >
                          Accept {activeInlineSlipItem.currentOdds.toFixed(2)}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={betPlacementState === 'placing'}
                          onClick={() =>
                            placeInstantSingle(activeInlineSlipItem.selection.id)
                          }
                          className="h-8 px-3.5 rounded-[8px] bg-[#B9F6EC] hover:bg-[#9FEFE2] disabled:opacity-50 text-[#06181F] text-[12px] font-extrabold transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <span>
                            {betPlacementState === 'placing'
                              ? 'Placing...'
                              : `Place $${stakeNumeric > 0 ? stakeNumeric.toFixed(2) : '0.00'} Single`}
                          </span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setSidePanelTab('slip');
                          setIsSidePanelOpen(true);
                        }}
                        className="h-8 px-2.5 rounded-[8px] bg-[#0E2835] hover:bg-[#15394B] border border-[#1E4456] text-[11px] font-bold text-[#B8D0DB] hover:text-white transition-colors"
                      >
                        Full Slip
                      </button>

                      <button
                        type="button"
                        onClick={closeInlineTicket}
                        className="p-1 text-[#7898A6] hover:text-white"
                        title="Close inline ticket"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Edge-State Alerts (Odds Changed / Bet Failed) */}
                  {activeInlineSlipItem.oddsChanged && (
                    <div className="pt-1.5 border-t border-white/[0.08] flex items-center justify-between text-[11.5px] text-[#FBBF24]">
                      <span>
                        Live price updated ({activeInlineSlipItem.prevOdds?.toFixed(2)} →{' '}
                        {activeInlineSlipItem.currentOdds.toFixed(2)}). Player must accept new odds before placing.
                      </span>
                    </div>
                  )}

                  {betPlacementState === 'failed' && betErrorReason && (
                    <div className="pt-1.5 border-t border-[#EF4444]/30 flex items-center justify-between gap-2 text-[11.5px] text-[#FCA5A5]">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#F87171] shrink-0" />
                        <span>{betErrorReason}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          placeInstantSingle(activeInlineSlipItem.selection.id)
                        }
                        className="h-6 px-2.5 rounded bg-[#EF4444]/25 hover:bg-[#EF4444]/40 text-white font-extrabold flex items-center gap-1 shrink-0"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
