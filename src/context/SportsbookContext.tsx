import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CommunityBet,
  INITIAL_COMMUNITY_BETS,
  INITIAL_MATCHES,
  INITIAL_MY_BETS,
  MatchItem,
  OddSelection,
  PageId,
  PlacedBet,
  SportId,
} from '../data/sportsbookData';

export interface SlipItem {
  selection: OddSelection;
  stake: string;
  acceptedOdds: number;
  currentOdds: number;
  prevOdds?: number;
  oddsDirection?: 'up' | 'down' | null;
  oddsChanged: boolean;
  suspended: boolean;
}

export type BetPlacementState = 'idle' | 'placing' | 'placed' | 'failed';

export interface LiveStreamTicket {
  id: string;
  ticketCode: string;
  playerAlias: string;
  timeLabel: string;
  stake: number;
  potentialReturn: number;
  isHighRoller: boolean;
  selection: OddSelection;
}

const INITIAL_LIVE_STREAM_TICKETS: LiveStreamTicket[] = [
  {
    id: 'lst-1',
    ticketCode: '#HB-9482',
    playerAlias: 'Player_7F2A',
    timeLabel: '2s ago',
    stake: 350.0,
    potentialReturn: 955.5,
    isHighRoller: true,
    selection: {
      id: 'ars-bha-ou-o25',
      matchId: 'ars-bha',
      matchTitle: 'Arsenal v Brighton',
      competitionId: 'epl',
      competitionName: 'Premier League',
      sportId: 'soccer',
      marketId: 'mkt-tg-25',
      marketName: 'Total goals',
      label: 'Over 2.5',
      odds: 2.73,
      isLive: true,
      scoreText: '1–0',
      clockText: "52'",
    },
  },
  {
    id: 'lst-2',
    ticketCode: '#HB-9481',
    playerAlias: 'Player_31C9',
    timeLabel: '6s ago',
    stake: 75.0,
    potentialReturn: 131.25,
    isHighRoller: false,
    selection: {
      id: 'alc-sin-1x2-home',
      matchId: 'alc-sin',
      matchTitle: 'Carlos Alcaraz v Jannik Sinner',
      competitionId: 'atp',
      competitionName: 'ATP Masters 1000',
      sportId: 'tennis',
      marketId: 'mkt-1x2',
      marketName: 'Match winner',
      label: 'Carlos Alcaraz',
      shortLabel: 'Alcaraz',
      odds: 1.75,
      isLive: true,
      scoreText: '1–1',
      clockText: 'Set 3 · 4-3',
    },
  },
  {
    id: 'lst-3',
    ticketCode: '#HB-9480',
    playerAlias: 'Player_88E1',
    timeLabel: '11s ago',
    stake: 500.0,
    potentialReturn: 810.0,
    isHighRoller: true,
    selection: {
      id: 'lal-gsw-1x2-home',
      matchId: 'lal-gsw',
      matchTitle: 'LA Lakers v Golden State Warriors',
      competitionId: 'nba',
      competitionName: 'NBA',
      sportId: 'basketball',
      marketId: 'mkt-1x2',
      marketName: 'Moneyline',
      label: 'LA Lakers',
      shortLabel: 'Lakers',
      odds: 1.62,
      isLive: true,
      scoreText: '88–84',
      clockText: 'Q3 · 04:12',
    },
  },
  {
    id: 'lst-4',
    ticketCode: '#HB-9479',
    playerAlias: 'Player_19B4',
    timeLabel: '18s ago',
    stake: 40.0,
    potentialReturn: 84.0,
    isHighRoller: false,
    selection: {
      id: 'ars-bha-gs-saka',
      matchId: 'ars-bha',
      matchTitle: 'Arsenal v Brighton',
      competitionId: 'epl',
      competitionName: 'Premier League',
      sportId: 'soccer',
      marketId: 'mkt-goalscorers-anytime',
      marketName: 'Anytime goalscorer',
      label: 'Bukayo Saka',
      odds: 2.1,
      isLive: true,
      scoreText: '1–0',
      clockText: "52'",
    },
  },
  {
    id: 'lst-5',
    ticketCode: '#HB-9478',
    playerAlias: 'Player_60D2',
    timeLabel: '24s ago',
    stake: 280.0,
    potentialReturn: 442.4,
    isHighRoller: true,
    selection: {
      id: 'kc-buf-1x2-home',
      matchId: 'kc-buf',
      matchTitle: 'Kansas City Chiefs v Buffalo Bills',
      competitionId: 'nfl',
      competitionName: 'NFL',
      sportId: 'american-football',
      marketId: 'mkt-1x2',
      marketName: 'Moneyline',
      label: 'Kansas City Chiefs',
      shortLabel: 'Chiefs',
      odds: 1.58,
      isLive: true,
      scoreText: '21–17',
      clockText: 'Q3 · 08:45',
    },
  },
  {
    id: 'lst-6',
    ticketCode: '#HB-9477',
    playerAlias: 'Player_44A7',
    timeLabel: '31s ago',
    stake: 60.0,
    potentialReturn: 115.2,
    isHighRoller: false,
    selection: {
      id: 't1-geng-1x2-home',
      matchId: 't1-geng',
      matchTitle: 'T1 v Gen.G',
      competitionId: 'lol-worlds',
      competitionName: 'LoL Worlds',
      sportId: 'esports',
      marketId: 'mkt-1x2',
      marketName: 'Match winner',
      label: 'T1',
      shortLabel: 'T1',
      odds: 1.92,
      isLive: true,
      scoreText: '1–1',
      clockText: 'Game 3 · 24m',
    },
  },
  {
    id: 'lst-7',
    ticketCode: '#HB-9476',
    playerAlias: 'Player_9C05',
    timeLabel: '39s ago',
    stake: 300.0,
    potentialReturn: 495.0,
    isHighRoller: true,
    selection: {
      id: 'liv-mun-1x2-home',
      matchId: 'liv-mun',
      matchTitle: 'Liverpool v Manchester United',
      competitionId: 'epl',
      competitionName: 'Premier League',
      sportId: 'soccer',
      marketId: 'mkt-1x2',
      marketName: 'Match result',
      label: 'Liverpool',
      shortLabel: 'Liverpool',
      odds: 1.65,
      isLive: false,
    },
  },
];

interface SportsbookContextType {
  // Navigation
  activePage: PageId;
  selectedMatchId: string;
  selectedSport: 'all' | SportId;
  setSelectedSport: React.Dispatch<React.SetStateAction<'all' | SportId>>;
  selectedCompetition: 'all' | string;
  setSelectedCompetition: React.Dispatch<React.SetStateAction<'all' | string>>;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  navigateTo: (
    page: PageId,
    opts?: { matchId?: string; sport?: 'all' | SportId; competition?: 'all' | string }
  ) => void;
  goBack: () => void;

  // Layout & Panels
  isLeftNavCollapsed: boolean;
  setIsLeftNavCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isSidePanelOpen: boolean;
  setIsSidePanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileSlipOpen: boolean;
  setIsMobileSlipOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sidePanelTab: 'slip' | 'mybets' | 'chat';
  setSidePanelTab: (tab: 'slip' | 'mybets' | 'chat') => void;
  viewportMode: 'auto' | 'desktop' | 'phone';
  setViewportMode: (mode: 'auto' | 'desktop' | 'phone') => void;

  // Data & Live State
  matches: MatchItem[];
  currentMatch: MatchItem;
  oddsFlashMap: Record<string, { dir: 'up' | 'down'; prev: number; ts: number }>;
  followedCompetitions: string[];
  followedTeams: string[];
  toggleFollowCompetition: (compId: string) => void;
  toggleFollowTeam: (teamId: string) => void;

  // Bet Slip & My Bets
  usdtBalance: number;
  slipItems: SlipItem[];
  isSelected: (selectionId: string) => boolean;
  toggleSelection: (sel: OddSelection) => void;
  removeSelection: (selectionId: string) => void;
  clearSlip: () => void;
  updateStake: (selectionId: string, val: string) => void;
  acceptAllOddsChanges: () => void;
  betPlacementState: BetPlacementState;
  betErrorReason: string | null;
  lastPlacedBets: PlacedBet[];
  resetBetPlacementState: () => void;
  placeBets: () => void;

  // My Bets & Cash Out
  myBets: PlacedBet[];
  cashOutBet: (betId: string) => void;

  // Social Copy-Betting (Stake-style Community Singles & Copy Counter)
  communityBets: CommunityBet[];
  copyCommunityBet: (betId: string, copyStake?: boolean) => void;
  shareBetToCommunity: (betId: string) => void;
  applyStakeToAllSingles: (val: string) => void;
  autoAcceptOdds: boolean;
  setAutoAcceptOdds: React.Dispatch<React.SetStateAction<boolean>>;
  notificationToast: string | null;
  triggerToast: (msg: string) => void;

  // Interactive State Simulators (For Judges & Testing Every State)
  simulateNothingLive: boolean;
  setSimulateNothingLive: React.Dispatch<React.SetStateAction<boolean>>;
  simulateNextBetFail: boolean;
  setSimulateNextBetFail: React.Dispatch<React.SetStateAction<boolean>>;
  isDemoSuspended: boolean;
  triggerOddsChangeDemo: () => void;
  toggleSuspendDemo: () => void;
  triggerBetFailedDemo: () => void;
  autoLivePulse: boolean;
  setAutoLivePulse: React.Dispatch<React.SetStateAction<boolean>>;

  // Next-Gen Crypto Trading UX Controls
  previewStake: number | null;
  setPreviewStake: React.Dispatch<React.SetStateAction<number | null>>;
  showImpliedProb: boolean;
  setShowImpliedProb: React.Dispatch<React.SetStateAction<boolean>>;
  proMatrixView: boolean;
  setProMatrixView: React.Dispatch<React.SetStateAction<boolean>>;

  // Edition #2 (Matrix): Flash-Singles & Inline Matrix Execution
  flashStakePreset: number;
  setFlashStakePreset: React.Dispatch<React.SetStateAction<number>>;
  matrixExecMode: 'inline' | 'slip';
  setMatrixExecMode: React.Dispatch<React.SetStateAction<'inline' | 'slip'>>;
  inlineTicketMatchId: string | null;
  inlineTicketSelectionId: string | null;
  closeInlineTicket: () => void;
  selectMatrixOdd: (sel: OddSelection, forceOpenDrawer?: boolean) => void;
  placeInstantSingle: (selectionId: string, customStake?: number) => void;

  // Edition #3 (Arena): Multi-Match Live Watch Dock & Casino USDT Bet-Stream
  pinnedMatchIds: string[];
  togglePinMatch: (matchId: string) => void;
  liveStreamTickets: LiveStreamTicket[];
  isStreamPaused: boolean;
  setIsStreamPaused: React.Dispatch<React.SetStateAction<boolean>>;
  mirrorStreamTicket: (ticket: LiveStreamTicket) => void;
}

const SportsbookContext = createContext<SportsbookContextType | undefined>(undefined);

export const SportsbookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [pageHistory, setPageHistory] = useState<PageId[]>(['home']);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('ars-bha');
  const [selectedSport, setSelectedSport] = useState<'all' | SportId>('all');
  const [selectedCompetition, setSelectedCompetition] = useState<'all' | string>('all');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  const [isLeftNavCollapsed, setIsLeftNavCollapsed] = useState<boolean>(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(false);
  const [isMobileSlipOpen, setIsMobileSlipOpen] = useState<boolean>(false);
  const [sidePanelTab, setSidePanelTab] = useState<'slip' | 'mybets' | 'chat'>('slip');
  const [viewportMode, setViewportMode] = useState<'auto' | 'desktop' | 'phone'>('auto');

  const [matches, setMatches] = useState<MatchItem[]>(INITIAL_MATCHES);
  const [oddsFlashMap, setOddsFlashMap] = useState<
    Record<string, { dir: 'up' | 'down'; prev: number; ts: number }>
  >({});

  const [followedCompetitions, setFollowedCompetitions] = useState<string[]>(['epl']);
  const [followedTeams, setFollowedTeams] = useState<string[]>(['arsenal']);

  const [usdtBalance, setUsdtBalance] = useState<number>(1250.0);
  const [slipItems, setSlipItems] = useState<SlipItem[]>([]);
  const [betPlacementState, setBetPlacementState] = useState<BetPlacementState>('idle');
  const [betErrorReason, setBetErrorReason] = useState<string | null>(null);
  const [lastPlacedBets, setLastPlacedBets] = useState<PlacedBet[]>([]);
  const [myBets, setMyBets] = useState<PlacedBet[]>(INITIAL_MY_BETS);
  const [communityBets, setCommunityBets] = useState<CommunityBet[]>(
    INITIAL_COMMUNITY_BETS
  );
  const [autoAcceptOdds, setAutoAcceptOdds] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast((prev) => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  // Simulator States
  const [simulateNothingLive, setSimulateNothingLive] = useState<boolean>(false);
  const [simulateNextBetFail, setSimulateNextBetFail] = useState<boolean>(false);
  const [isDemoSuspended, setIsDemoSuspended] = useState<boolean>(false);
  const [autoLivePulse, setAutoLivePulse] = useState<boolean>(true);

  // Next-Gen Crypto Trading UX States
  const [previewStake, setPreviewStake] = useState<number | null>(null);
  const [showImpliedProb, setShowImpliedProb] = useState<boolean>(false);
  const [proMatrixView, setProMatrixView] = useState<boolean>(true);

  // Edition #2 (Matrix): Flash-Singles & Inline Matrix Execution
  const [flashStakePreset, setFlashStakePreset] = useState<number>(25);
  const [matrixExecMode, setMatrixExecMode] = useState<'inline' | 'slip'>('inline');
  const [inlineTicketMatchId, setInlineTicketMatchId] = useState<string | null>(null);
  const [inlineTicketSelectionId, setInlineTicketSelectionId] = useState<string | null>(null);

  // Edition #3 (Arena): Multi-Match Live Watch Dock & Casino USDT Bet-Stream
  const [pinnedMatchIds, setPinnedMatchIds] = useState<string[]>([
    'ars-bha',
    'alc-sin',
    'lal-gsw',
  ]);
  const [liveStreamTickets, setLiveStreamTickets] = useState<LiveStreamTicket[]>(
    INITIAL_LIVE_STREAM_TICKETS
  );
  const [isStreamPaused, setIsStreamPaused] = useState<boolean>(false);

  const navigateTo = useCallback(
    (
      page: PageId,
      opts?: { matchId?: string; sport?: 'all' | SportId; competition?: 'all' | string }
    ) => {
      setPageHistory((prev) => [...prev.slice(-8), page]);
      setActivePage(page);
      if (opts?.matchId) setSelectedMatchId(opts.matchId);
      if (opts?.sport !== undefined) setSelectedSport(opts.sport);
      if (opts?.competition !== undefined) setSelectedCompetition(opts.competition);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const goBack = useCallback(() => {
    setPageHistory((prev) => {
      if (prev.length <= 1) {
        setActivePage('home');
        return ['home'];
      }
      const nextHist = prev.slice(0, -1);
      const target = nextHist[nextHist.length - 1] || 'home';
      setActivePage(target);
      return nextHist;
    });
  }, []);

  const toggleFollowCompetition = useCallback((compId: string) => {
    setFollowedCompetitions((prev) =>
      prev.includes(compId) ? prev.filter((id) => id !== compId) : [...prev, compId]
    );
  }, []);

  const toggleFollowTeam = useCallback((teamId: string) => {
    setFollowedTeams((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  }, []);

  const currentMatch =
    matches.find((m) => m.id === selectedMatchId) || matches[0];

  const isSelected = useCallback(
    (selectionId: string) => slipItems.some((item) => item.selection.id === selectionId),
    [slipItems]
  );

  const toggleSelection = useCallback(
    (sel: OddSelection) => {
      if (sel.suspended) return;
      setBetPlacementState('idle');
      setBetErrorReason(null);

      setSlipItems((prev) => {
        const exists = prev.some((item) => item.selection.id === sel.id);
        if (exists) {
          return prev.filter((item) => item.selection.id !== sel.id);
        }
        const newItem: SlipItem = {
          selection: sel,
          stake: previewStake ? String(previewStake) : '',
          acceptedOdds: sel.odds,
          currentOdds: sel.odds,
          oddsChanged: false,
          suspended: Boolean(sel.suspended),
        };
        return [...prev, newItem];
      });

      setSidePanelTab('slip');
      setIsSidePanelOpen(true);
    },
    [previewStake]
  );

  const removeSelection = useCallback((selectionId: string) => {
    setSlipItems((prev) => prev.filter((item) => item.selection.id !== selectionId));
    setBetPlacementState('idle');
    setBetErrorReason(null);
  }, []);

  const clearSlip = useCallback(() => {
    setSlipItems([]);
    setBetPlacementState('idle');
    setBetErrorReason(null);
  }, []);

  const updateStake = useCallback((selectionId: string, val: string) => {
    // Allow numbers and single decimal point
    const cleaned = val.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    const formatted =
      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;

    setBetPlacementState('idle');
    setBetErrorReason(null);
    setSlipItems((prev) =>
      prev.map((item) =>
        item.selection.id === selectionId ? { ...item, stake: formatted } : item
      )
    );
  }, []);

  const acceptAllOddsChanges = useCallback(() => {
    setBetErrorReason(null);
    setBetPlacementState('idle');
    setSlipItems((prev) =>
      prev.map((item) => ({
        ...item,
        acceptedOdds: item.currentOdds,
        oddsChanged: false,
      }))
    );
  }, []);

  const resetBetPlacementState = useCallback(() => {
    setBetPlacementState('idle');
    setBetErrorReason(null);
  }, []);

  const placeBets = useCallback(() => {
    if (slipItems.length === 0) return;
    const anySuspended = slipItems.some((i) => i.suspended);
    const anyOddsChanged = slipItems.some((i) => i.oddsChanged);
    if (anySuspended || anyOddsChanged) return;

    const validStakes = slipItems.filter((i) => parseFloat(i.stake || '0') > 0);
    if (validStakes.length === 0) {
      setBetPlacementState('failed');
      setBetErrorReason('Enter a valid USDT stake amount greater than $0.00.');
      return;
    }

    const totalStake = validStakes.reduce((acc, i) => acc + parseFloat(i.stake || '0'), 0);
    if (totalStake > usdtBalance) {
      setBetPlacementState('failed');
      setBetErrorReason(
        `Insufficient USDT balance ($${usdtBalance.toFixed(2)} available). Lower stake or deposit.`
      );
      return;
    }

    setBetPlacementState('placing');
    setBetErrorReason(null);

    setTimeout(() => {
      if (simulateNextBetFail) {
        setBetPlacementState('failed');
        setBetErrorReason(
          'Bet failed: Live market risk check rejected the request due to rapid in-play action. Please retry.'
        );
        return;
      }

      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 5);
      const newPlacedBets: PlacedBet[] = validStakes.map((item, idx) => {
        const stakeNum = parseFloat(item.stake || '0');
        const retNum = Number((stakeNum * item.currentOdds).toFixed(2));
        return {
          id: `hb-open-${Date.now()}-${idx}`,
          placedAt: 'Today',
          placedTime: timeStr,
          timestamp: Date.now(),
          selectionId: item.selection.id,
          matchId: item.selection.matchId,
          matchTitle: item.selection.matchTitle,
          sportId: item.selection.sportId,
          marketName: item.selection.marketName,
          selectionLabel: item.selection.label,
          odds: item.currentOdds,
          stake: stakeNum,
          potentialReturn: retNum,
          status: 'Open',
          isLive: item.selection.isLive,
          liveClock: item.selection.clockText || "52'",
          liveScore: item.selection.scoreText || '1–0',
          cashOutOffer: Number((stakeNum * 0.94).toFixed(2)),
        };
      });

      setUsdtBalance((b) => Number((b - totalStake).toFixed(2)));
      setMyBets((prev) => [...newPlacedBets, ...prev]);
      setLastPlacedBets(newPlacedBets);
      setBetPlacementState('placed');
      setSlipItems([]);
    }, 420);
  }, [slipItems, usdtBalance, simulateNextBetFail]);

  const cashOutBet = useCallback(
    (betId: string) => {
      setMyBets((prev) =>
        prev.map((bet) => {
          if (bet.id !== betId || bet.status !== 'Open') return bet;
          const payout = bet.cashOutOffer ?? bet.stake;
          setUsdtBalance((b) => Number((b + payout).toFixed(2)));
          triggerToast(
            `Cashed out $${payout.toFixed(2)} USDT to your wallet!`
          );
          return {
            ...bet,
            status: 'Cashed Out',
            settledReturn: payout,
          };
        })
      );
    },
    [triggerToast]
  );

  const applyStakeToAllSingles = useCallback((val: string) => {
    const cleaned = val.replace(/[^0-9.]/g, '');
    setBetPlacementState('idle');
    setBetErrorReason(null);
    setSlipItems((prev) =>
      prev.map((item) =>
        item.suspended ? item : { ...item, stake: cleaned }
      )
    );
  }, []);

  const copyCommunityBet = useCallback(
    (betId: string) => {
      const target = communityBets.find((cb) => cb.id === betId);
      if (!target) return;

      setCommunityBets((prev) =>
        prev.map((cb) =>
          cb.id === betId
            ? {
                ...cb,
                copiedCount: cb.copiedByMe ? cb.copiedCount : cb.copiedCount + 1,
                copiedByMe: true,
              }
            : cb
        )
      );

      setBetPlacementState('idle');
      setBetErrorReason(null);

      // Only copy the match selection with empty stake so the user enters their own stake
      setSlipItems((prev) => {
        const exists = prev.some(
          (item) => item.selection.id === target.selection.id
        );
        if (exists) {
          return prev;
        }
        return [
          ...prev,
          {
            selection: target.selection,
            stake: '',
            acceptedOdds: target.selection.odds,
            currentOdds: target.selection.odds,
            oddsChanged: false,
            suspended: false,
          },
        ];
      });

      setSidePanelTab('slip');
      setIsSidePanelOpen(true);
    },
    [communityBets]
  );

  const shareBetToCommunity = useCallback(
    (betId: string) => {
      const bet = myBets.find((b) => b.id === betId);
      if (!bet) return;

      setMyBets((prev) =>
        prev.map((b) =>
          b.id === betId
            ? {
                ...b,
                sharedToCommunity: true,
                copiedCount: (b.copiedCount ?? 14) + 1,
              }
            : b
        )
      );

      const newEntry: CommunityBet = {
        id: `cb-user-${Date.now()}`,
        playerHandle: 'You (Verified)',
        playerBadge: 'YOU',
        winRate: '76% W/R',
        timeAgo: 'Just now',
        comment: `Shared from My Bets — backing ${bet.selectionLabel} single @ ${bet.odds.toFixed(2)}!`,
        selection: {
          id: bet.selectionId,
          matchId: bet.matchId || 'ars-bha',
          matchTitle: bet.matchTitle,
          competitionId: 'epl',
          competitionName: 'Premier League',
          sportId: bet.sportId,
          marketId: 'mkt-shared',
          marketName: bet.marketName,
          label: bet.selectionLabel,
          shortLabel: bet.selectionLabel,
          odds: bet.odds,
          isLive: bet.isLive,
          scoreText: bet.liveScore,
          clockText: bet.liveClock,
        },
        stake: bet.stake,
        potentialReturn: bet.potentialReturn,
        copiedCount: 1,
        copiedByMe: true,
        category: ['trending', 'live'],
      };

      setCommunityBets((prev) => [newEntry, ...prev]);
      triggerToast(
        `Your single bet (${bet.selectionLabel} @ ${bet.odds.toFixed(2)}) is now live in Community Copy-Bets!`
      );
    },
    [myBets, triggerToast]
  );

  // Ensure a default selection is in the slip if user clicks a simulator trigger with an empty slip
  const ensureSelectionForDemo = useCallback((): SlipItem[] => {
    if (slipItems.length > 0) return slipItems;
    const defaultSel: OddSelection = {
      id: 'ars-bha-1x2-home',
      matchId: 'ars-bha',
      matchTitle: 'Arsenal v Brighton & Hove Albion',
      competitionId: 'epl',
      competitionName: 'Premier League',
      sportId: 'soccer',
      marketId: 'mkt-1x2',
      marketName: 'Match result',
      label: 'Arsenal',
      shortLabel: 'Arsenal',
      odds: 1.30,
      isLive: true,
      scoreText: '1–0',
      clockText: "52'",
    };
    const item: SlipItem = {
      selection: defaultSel,
      stake: '25.00',
      acceptedOdds: 1.30,
      currentOdds: 1.30,
      oddsChanged: false,
      suspended: false,
    };
    return [item];
  }, [slipItems]);

  // DEMO 1: Trigger Odds Movement & "Player must accept" state
  const triggerOddsChangeDemo = useCallback(() => {
    setBetPlacementState('idle');
    setBetErrorReason(null);
    setSidePanelTab('slip');
    setIsSidePanelOpen(true);

    const flashUpdates: Record<string, { dir: 'up' | 'down'; prev: number; ts: number }> = {};
    const now = Date.now();

    // Update matches & markets odds
    setMatches((prevMatches) =>
      prevMatches.map((m) => {
        if (m.id !== 'ars-bha') return m;
        const oldHome = m.mainOdds.home;
        const newHome = oldHome <= 1.28 ? 1.36 : Number((oldHome - 0.05).toFixed(2));
        const dirHome: 'up' | 'down' = newHome > oldHome ? 'up' : 'down';
        flashUpdates['ars-bha-1x2-home'] = { dir: dirHome, prev: oldHome, ts: now };

        const oldDraw = m.mainOdds.draw || 4.6;
        const newDraw = oldDraw >= 4.75 ? 4.45 : Number((oldDraw + 0.15).toFixed(2));
        flashUpdates['ars-bha-1x2-draw'] = {
          dir: newDraw > oldDraw ? 'up' : 'down',
          prev: oldDraw,
          ts: now,
        };

        const updatedMarkets = m.markets?.map((mkt) => ({
          ...mkt,
          selections: mkt.selections.map((s) => {
            if (s.id === 'ars-bha-1x2-home') {
              return { ...s, prevOdds: oldHome, odds: newHome, direction: dirHome };
            }
            if (s.id === 'ars-bha-1x2-draw') {
              return {
                ...s,
                prevOdds: oldDraw,
                odds: newDraw,
                direction: newDraw > oldDraw ? ('up' as const) : ('down' as const),
              };
            }
            if (s.id === 'ars-bha-ou-o25') {
              const nextO = s.odds >= 2.8 ? 2.62 : Number((s.odds + 0.09).toFixed(2));
              const d: 'up' | 'down' = nextO > s.odds ? 'up' : 'down';
              flashUpdates[s.id] = { dir: d, prev: s.odds, ts: now };
              return { ...s, prevOdds: s.odds, odds: nextO, direction: d };
            }
            return s;
          }),
        }));

        return {
          ...m,
          mainOdds: { ...m.mainOdds, home: newHome, draw: newDraw },
          markets: updatedMarkets,
        };
      })
    );

    setOddsFlashMap((prev) => ({ ...prev, ...flashUpdates }));

    // Update slip items so player MUST accept the new odds
    const baseItems = ensureSelectionForDemo();
    setSlipItems(
      baseItems.map((item) => {
        const delta = item.currentOdds <= 1.26 ? 0.08 : -0.05;
        const nextOdds = Number(Math.max(1.05, item.currentOdds + delta).toFixed(2));
        const dir: 'up' | 'down' = nextOdds > item.currentOdds ? 'up' : 'down';
        return {
          ...item,
          prevOdds: item.currentOdds,
          currentOdds: nextOdds,
          oddsDirection: dir,
          oddsChanged: true,
        };
      })
    );
  }, [ensureSelectionForDemo]);

  // DEMO 2: Toggle Suspended State on Match Markets & Active Selection in Slip
  const toggleSuspendDemo = useCallback(() => {
    setBetPlacementState('idle');
    setBetErrorReason(null);
    setSidePanelTab('slip');
    setIsSidePanelOpen(true);

    setIsDemoSuspended((prev) => {
      const nextSusp = !prev;
      setMatches((prevMatches) =>
        prevMatches.map((m) => {
          if (m.id !== 'ars-bha') return m;
          const updatedMarkets = m.markets?.map((mkt) => {
            if (mkt.id === 'mkt-1x2' || mkt.id === 'mkt-next-goal' || mkt.id === 'mkt-minutes-fast') {
              return {
                ...mkt,
                suspended: nextSusp,
                selections: mkt.selections.map((s) => ({ ...s, suspended: nextSusp })),
              };
            }
            return mkt;
          });
          return {
            ...m,
            suspended: nextSusp,
            markets: updatedMarkets,
          };
        })
      );

      const baseItems = ensureSelectionForDemo();
      setSlipItems(
        baseItems.map((item) => ({
          ...item,
          suspended: nextSusp,
        }))
      );
      return nextSusp;
    });
  }, [ensureSelectionForDemo]);

  // DEMO 3: Trigger Bet Failed State Immediately
  const triggerBetFailedDemo = useCallback(() => {
    const baseItems = ensureSelectionForDemo();
    setSlipItems(
      baseItems.map((item) => ({
        ...item,
        suspended: false,
        oddsChanged: false,
        stake: parseFloat(item.stake || '0') > 0 ? item.stake : '25.00',
      }))
    );
    setSidePanelTab('slip');
    setIsSidePanelOpen(true);
    setBetPlacementState('failed');
    setBetErrorReason(
      'Bet failed: Market price changed during VAR check on pitch. Review your stake or click Retry Bet.'
    );
  }, [ensureSelectionForDemo]);

  // Subtle background live odds pulse so the sportsbook feels alive
  useEffect(() => {
    if (!autoLivePulse) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const liveRowIds = [
        'ars-bha-1x2-draw',
        'ars-bha-1x2-away',
        'avl-ful-1x2-home',
        'atm-sev-1x2-home',
        'lal-bos-1x2-home',
        'ars-bha-ou-o25',
        'ars-bha-ou-u25',
        'ars-bha-btts-yes',
      ];
      const pickId = liveRowIds[Math.floor(Math.random() * liveRowIds.length)];
      const dir: 'up' | 'down' = Math.random() > 0.48 ? 'up' : 'down';
      const delta = dir === 'up' ? 0.02 : -0.02;

      setOddsFlashMap((f) => ({
        ...f,
        [pickId]: { dir, prev: 2.0, ts: now },
      }));

      setMatches((prevMatches) =>
        prevMatches.map((m) => {
          if (m.id !== 'ars-bha' || m.suspended || !m.markets) return m;
          const nextMarkets = m.markets.map((mkt) => ({
            ...mkt,
            selections: mkt.selections.map((s) => {
              if (s.id !== pickId) return s;
              const nextVal = Number(Math.max(1.12, Math.min(12.0, s.odds + delta)).toFixed(2));
              return { ...s, prevOdds: s.odds, odds: nextVal, direction: dir };
            }),
          }));
          return { ...m, markets: nextMarkets };
        })
      );
    }, 3400);

    return () => clearInterval(interval);
  }, [autoLivePulse]);

  const closeInlineTicket = useCallback(() => {
    setInlineTicketMatchId(null);
    setInlineTicketSelectionId(null);
  }, []);

  const selectMatrixOdd = useCallback(
    (sel: OddSelection, forceOpenDrawer = false) => {
      if (sel.suspended) return;
      setBetPlacementState('idle');
      setBetErrorReason(null);

      setSlipItems((prev) => {
        const exists = prev.some((item) => item.selection.id === sel.id);
        if (exists && inlineTicketSelectionId === sel.id && !forceOpenDrawer) {
          setInlineTicketMatchId(null);
          setInlineTicketSelectionId(null);
          return prev.filter((item) => item.selection.id !== sel.id);
        }
        setInlineTicketMatchId(sel.matchId);
        setInlineTicketSelectionId(sel.id);
        if (exists) {
          return prev.map((item) =>
            item.selection.id === sel.id
              ? {
                  ...item,
                  stake: item.stake || String(flashStakePreset),
                }
              : item
          );
        }
        const newItem: SlipItem = {
          selection: sel,
          stake: String(flashStakePreset),
          acceptedOdds: sel.odds,
          currentOdds: sel.odds,
          oddsChanged: false,
          suspended: Boolean(sel.suspended),
        };
        return [...prev, newItem];
      });

      if (forceOpenDrawer || matrixExecMode === 'slip') {
        setSidePanelTab('slip');
        setIsSidePanelOpen(true);
      }
    },
    [flashStakePreset, inlineTicketSelectionId, matrixExecMode]
  );

  const placeInstantSingle = useCallback(
    (selectionId: string, customStake?: number) => {
      const targetItem = slipItems.find((i) => i.selection.id === selectionId);
      if (!targetItem) return;
      if (targetItem.suspended || targetItem.oddsChanged) return;

      const stakeNum =
        customStake !== undefined
          ? customStake
          : parseFloat(targetItem.stake || '0');

      if (isNaN(stakeNum) || stakeNum <= 0) {
        setBetPlacementState('failed');
        setBetErrorReason('Enter a valid USDT stake amount greater than $0.00.');
        return;
      }

      if (stakeNum > usdtBalance) {
        setBetPlacementState('failed');
        setBetErrorReason(
          `Insufficient USDT balance ($${usdtBalance.toFixed(2)} available).`
        );
        return;
      }

      setBetPlacementState('placing');
      setBetErrorReason(null);

      setTimeout(() => {
        if (simulateNextBetFail) {
          setBetPlacementState('failed');
          setBetErrorReason(
            'Bet failed: Live market risk check rejected the request due to rapid in-play action. Please retry.'
          );
          return;
        }

        const now = new Date();
        const timeStr = now.toTimeString().slice(0, 5);
        const retNum = Number((stakeNum * targetItem.currentOdds).toFixed(2));
        const placed: PlacedBet = {
          id: `hb-open-${Date.now()}`,
          placedAt: 'Today',
          placedTime: timeStr,
          timestamp: Date.now(),
          selectionId: targetItem.selection.id,
          matchId: targetItem.selection.matchId,
          matchTitle: targetItem.selection.matchTitle,
          sportId: targetItem.selection.sportId,
          marketName: targetItem.selection.marketName,
          selectionLabel: targetItem.selection.label,
          odds: targetItem.currentOdds,
          stake: stakeNum,
          potentialReturn: retNum,
          status: 'Open',
          isLive: targetItem.selection.isLive,
          liveClock: targetItem.selection.clockText || "52'",
          liveScore: targetItem.selection.scoreText || '1–0',
          cashOutOffer: Number((stakeNum * 0.94).toFixed(2)),
        };

        setUsdtBalance((b) => Number((b - stakeNum).toFixed(2)));
        setMyBets((prev) => [placed, ...prev]);
        setLastPlacedBets([placed]);
        setBetPlacementState('placed');
        setSlipItems((prev) =>
          prev.filter((i) => i.selection.id !== selectionId)
        );
        triggerToast(
          `Flash Single Placed: $${stakeNum.toFixed(2)} USDT on ${targetItem.selection.label} @ ${targetItem.currentOdds.toFixed(2)}`
        );
      }, 320);
    },
    [slipItems, usdtBalance, simulateNextBetFail, triggerToast]
  );

  const togglePinMatch = useCallback(
    (matchId: string) => {
      setPinnedMatchIds((prev) => {
        if (prev.includes(matchId)) {
          return prev.filter((id) => id !== matchId);
        }
        const next = prev.length >= 3 ? [...prev.slice(1), matchId] : [...prev, matchId];
        triggerToast(`Pinned to Live Watch Dock (${next.length}/3 active)`);
        return next;
      });
    },
    [triggerToast]
  );

  const mirrorStreamTicket = useCallback(
    (ticket: LiveStreamTicket) => {
      setBetPlacementState('idle');
      setBetErrorReason(null);
      setSlipItems((prev) => {
        if (prev.some((i) => i.selection.id === ticket.selection.id)) {
          return prev;
        }
        return [
          ...prev,
          {
            selection: ticket.selection,
            stake: '',
            acceptedOdds: ticket.selection.odds,
            currentOdds: ticket.selection.odds,
            oddsChanged: false,
            suspended: false,
          },
        ];
      });
      setSidePanelTab('slip');
      setIsSidePanelOpen(true);
      triggerToast(
        `Mirrored ${ticket.selection.label} @ ${ticket.selection.odds.toFixed(2)} to Bet Slip`
      );
    },
    [triggerToast]
  );

  // Subtle live ticker rotation for Edition #3 Casino USDT Singles Stream
  useEffect(() => {
    if (!autoLivePulse || isStreamPaused) return;
    const streamTimer = setInterval(() => {
      setLiveStreamTickets((prev) => {
        const samplePool = INITIAL_LIVE_STREAM_TICKETS;
        const template = samplePool[Math.floor(Math.random() * samplePool.length)];
        const stakes = [25, 50, 120, 275, 400, 85, 650];
        const nextStake = stakes[Math.floor(Math.random() * stakes.length)];
        const codeNum = 9483 + Math.floor((Date.now() / 1000) % 900);
        const hexSuffix = Math.floor(1000 + Math.random() * 8999)
          .toString(16)
          .toUpperCase();
        const freshTicket: LiveStreamTicket = {
          ...template,
          id: `lst-${Date.now()}`,
          ticketCode: `#HB-${codeNum}`,
          playerAlias: `Player_${hexSuffix}`,
          timeLabel: 'Just now',
          stake: nextStake,
          potentialReturn: Number((nextStake * template.selection.odds).toFixed(2)),
          isHighRoller: nextStake >= 250,
        };
        const aged = prev.slice(0, 9).map((t, idx) => ({
          ...t,
          timeLabel: `${(idx + 1) * 5}s ago`,
        }));
        return [freshTicket, ...aged];
      });
    }, 5200);
    return () => clearInterval(streamTimer);
  }, [autoLivePulse, isStreamPaused]);

  return (
    <SportsbookContext.Provider
      value={{
        activePage,
        selectedMatchId,
        selectedSport,
        setSelectedSport,
        selectedCompetition,
        setSelectedCompetition,
        globalSearch,
        setGlobalSearch,
        navigateTo,
        goBack,
        isLeftNavCollapsed,
        setIsLeftNavCollapsed,
        isSidePanelOpen,
        setIsSidePanelOpen,
        isMobileSlipOpen,
        setIsMobileSlipOpen,
        sidePanelTab,
        setSidePanelTab,
        viewportMode,
        setViewportMode,
        matches,
        currentMatch,
        oddsFlashMap,
        followedCompetitions,
        followedTeams,
        toggleFollowCompetition,
        toggleFollowTeam,
        usdtBalance,
        slipItems,
        isSelected,
        toggleSelection,
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
        communityBets,
        copyCommunityBet,
        shareBetToCommunity,
        applyStakeToAllSingles,
        autoAcceptOdds,
        setAutoAcceptOdds,
        notificationToast,
        triggerToast,
        simulateNothingLive,
        setSimulateNothingLive,
        simulateNextBetFail,
        setSimulateNextBetFail,
        isDemoSuspended,
        triggerOddsChangeDemo,
        toggleSuspendDemo,
        triggerBetFailedDemo,
        autoLivePulse,
        setAutoLivePulse,
        previewStake,
        setPreviewStake,
        showImpliedProb,
        setShowImpliedProb,
        proMatrixView,
        setProMatrixView,
        flashStakePreset,
        setFlashStakePreset,
        matrixExecMode,
        setMatrixExecMode,
        inlineTicketMatchId,
        inlineTicketSelectionId,
        closeInlineTicket,
        selectMatrixOdd,
        placeInstantSingle,
        pinnedMatchIds,
        togglePinMatch,
        liveStreamTickets,
        isStreamPaused,
        setIsStreamPaused,
        mirrorStreamTicket,
      }}
    >
      {children}
    </SportsbookContext.Provider>
  );
};

export const useSportsbook = () => {
  const ctx = useContext(SportsbookContext);
  if (!ctx) throw new Error('useSportsbook must be used within SportsbookProvider');
  return ctx;
};
