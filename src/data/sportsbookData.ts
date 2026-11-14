export type SportId =
  | 'soccer'
  | 'tennis'
  | 'basketball'
  | 'baseball'
  | 'american-football'
  | 'ice-hockey'
  | 'esports';

export type PageId = 'home' | 'live' | 'football' | 'match' | 'mybets';

export type MarketGroupCategory =
  | 'popular'
  | 'goalscorers'
  | 'goals'
  | 'players'
  | 'halves'
  | 'handicaps'
  | 'corners-cards'
  | 'minutes'
  | 'specials'
  | 'all';

export interface OddSelection {
  id: string;
  matchId: string;
  matchTitle: string;
  competitionId: string;
  competitionName: string;
  sportId: SportId;
  marketId: string;
  marketName: string;
  label: string;
  shortLabel?: string;
  odds: number;
  prevOdds?: number;
  direction?: 'up' | 'down' | null;
  suspended?: boolean;
  isLive?: boolean;
  scoreText?: string;
  clockText?: string;
}

export interface MarketGroup {
  id: string;
  name: string;
  category: MarketGroupCategory[];
  suspended?: boolean;
  layout?: '3col' | '2col' | 'goalscorers' | 'list';
  selections: {
    id: string;
    label: string;
    shortLabel?: string;
    sublabel?: string;
    team?: 'home' | 'away';
    odds: number;
    prevOdds?: number;
    direction?: 'up' | 'down' | null;
    suspended?: boolean;
  }[];
}

export interface MatchItem {
  id: string;
  sportId: SportId;
  competitionId: string;
  competitionName: string;
  country: string;
  flag: string;
  homeTeam: {
    id: string;
    name: string;
    shortName: string;
    score?: number;
  };
  awayTeam: {
    id: string;
    name: string;
    shortName: string;
    score?: number;
  };
  isLive: boolean;
  clock?: string;
  minute?: number;
  startTime: string;
  startDate: string;
  startsInMinutes?: number;
  featured?: boolean;
  suspended?: boolean;
  totalMarketsCount: number;
  mainOdds: {
    home: number;
    draw?: number;
    away: number;
  };
  overUnderOdds?: {
    line: string;
    over: number;
    under: number;
  };
  bttsOdds?: {
    yes: number;
    no: number;
  };
  markets?: MarketGroup[];
}

export interface CompetitionInfo {
  id: string;
  name: string;
  country: string;
  flag: string;
  sportId: SportId;
  matchCount: number;
}

export interface PlacedBet {
  id: string;
  placedAt: string;
  placedTime: string;
  timestamp: number;
  selectionId: string;
  matchId: string;
  matchTitle: string;
  sportId: SportId;
  marketName: string;
  selectionLabel: string;
  odds: number;
  stake: number;
  potentialReturn: number;
  status: 'Open' | 'Won' | 'Lost' | 'Cashed Out';
  isLive?: boolean;
  liveClock?: string;
  liveScore?: string;
  cashOutOffer?: number;
  settledReturn?: number;
  copiedCount?: number;
  sharedToCommunity?: boolean;
}

export interface CommunityBet {
  id: string;
  playerHandle: string;
  playerBadge: 'WHALE' | 'VIP' | 'HOT STREAK' | 'PRO' | 'YOU';
  winRate: string;
  timeAgo: string;
  comment?: string;
  selection: OddSelection;
  stake: number;
  potentialReturn: number;
  copiedCount: number;
  copiedByMe?: boolean;
  category: ('trending' | 'high-roller' | 'live')[];
}

export const COMPETITIONS: CompetitionInfo[] = [
  {
    id: 'epl',
    name: 'Premier League',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    sportId: 'soccer',
    matchCount: 10,
  },
  {
    id: 'ucl',
    name: 'Champions League',
    country: 'Europe',
    flag: '🌍',
    sportId: 'soccer',
    matchCount: 4,
  },
  {
    id: 'laliga',
    name: 'LaLiga',
    country: 'Spain',
    flag: '🇪🇸',
    sportId: 'soccer',
    matchCount: 4,
  },
  {
    id: 'seriea',
    name: 'Serie A',
    country: 'Italy',
    flag: '🇮🇹',
    sportId: 'soccer',
    matchCount: 4,
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    country: 'Germany',
    flag: '🇩🇪',
    sportId: 'soccer',
    matchCount: 4,
  },
  {
    id: 'atp',
    name: 'ATP Masters 1000',
    country: 'International',
    flag: '🎾',
    sportId: 'tennis',
    matchCount: 4,
  },
  {
    id: 'wta',
    name: 'WTA Finals',
    country: 'International',
    flag: '🎾',
    sportId: 'tennis',
    matchCount: 2,
  },
  {
    id: 'nba',
    name: 'NBA',
    country: 'USA',
    flag: '🏀',
    sportId: 'basketball',
    matchCount: 4,
  },
  {
    id: 'mlb',
    name: 'MLB Playoffs',
    country: 'USA',
    flag: '⚾',
    sportId: 'baseball',
    matchCount: 3,
  },
  {
    id: 'nfl',
    name: 'NFL',
    country: 'USA',
    flag: '🏈',
    sportId: 'american-football',
    matchCount: 3,
  },
  {
    id: 'nhl',
    name: 'NHL',
    country: 'USA / Canada',
    flag: '🏒',
    sportId: 'ice-hockey',
    matchCount: 3,
  },
  {
    id: 'cs2',
    name: 'BLAST Premier CS2',
    country: 'International',
    flag: '🎮',
    sportId: 'esports',
    matchCount: 2,
  },
  {
    id: 'lol-worlds',
    name: 'LoL Worlds',
    country: 'International',
    flag: '🎮',
    sportId: 'esports',
    matchCount: 2,
  },
];

// Authentic star players per club for contextual Goalscorers & Player Props
export const TEAM_PLAYERS: Record<
  string,
  { name: string; pos: string; goalOdds: number; sotOdds: number }[]
> = {
  arsenal: [
    { name: 'Bukayo Saka', pos: 'Forward', goalOdds: 2.10, sotOdds: 1.72 },
    { name: 'Kai Havertz', pos: 'Forward', goalOdds: 2.35, sotOdds: 2.15 },
    { name: 'Leandro Trossard', pos: 'Forward', goalOdds: 2.75, sotOdds: 1.95 },
    { name: 'Gabriel Martinelli', pos: 'Winger', goalOdds: 2.90, sotOdds: 2.05 },
    { name: 'Martin Ødegaard', pos: 'Midfielder', goalOdds: 3.40, sotOdds: 2.20 },
    { name: 'Declan Rice', pos: 'Midfielder', goalOdds: 5.20, sotOdds: 2.05 },
  ],
  brighton: [
    { name: 'João Pedro', pos: 'Forward', goalOdds: 3.90, sotOdds: 1.85 },
    { name: 'Danny Welbeck', pos: 'Forward', goalOdds: 4.20, sotOdds: 1.90 },
    { name: 'Kaoru Mitoma', pos: 'Winger', goalOdds: 4.80, sotOdds: 1.65 },
  ],
  liverpool: [
    { name: 'Mohamed Salah', pos: 'Forward', goalOdds: 1.95, sotOdds: 1.55 },
    { name: 'Luis Díaz', pos: 'Winger', goalOdds: 2.50, sotOdds: 1.75 },
    { name: 'Darwin Núñez', pos: 'Forward', goalOdds: 2.40, sotOdds: 1.70 },
    { name: 'Dominik Szoboszlai', pos: 'Midfielder', goalOdds: 3.80, sotOdds: 2.10 },
  ],
  'man-utd': [
    { name: 'Bruno Fernandes', pos: 'Midfielder', goalOdds: 3.40, sotOdds: 1.90 },
    { name: 'Marcus Rashford', pos: 'Forward', goalOdds: 3.60, sotOdds: 1.95 },
    { name: 'Alejandro Garnacho', pos: 'Winger', goalOdds: 3.90, sotOdds: 2.05 },
    { name: 'Rasmus Højlund', pos: 'Forward', goalOdds: 3.25, sotOdds: 1.85 },
  ],
  'man-city': [
    { name: 'Erling Haaland', pos: 'Striker', goalOdds: 1.58, sotOdds: 1.36 },
    { name: 'Phil Foden', pos: 'Midfielder', goalOdds: 2.45, sotOdds: 1.72 },
    { name: 'Kevin De Bruyne', pos: 'Midfielder', goalOdds: 3.10, sotOdds: 1.88 },
    { name: 'Jérémy Doku', pos: 'Winger', goalOdds: 3.50, sotOdds: 2.05 },
  ],
  tottenham: [
    { name: 'Son Heung-min', pos: 'Forward', goalOdds: 2.65, sotOdds: 1.75 },
    { name: 'Dominic Solanke', pos: 'Striker', goalOdds: 2.90, sotOdds: 1.85 },
    { name: 'James Maddison', pos: 'Midfielder', goalOdds: 3.75, sotOdds: 2.10 },
  ],
  'real-madrid': [
    { name: 'Kylian Mbappé', pos: 'Forward', goalOdds: 1.85, sotOdds: 1.48 },
    { name: 'Vinícius Júnior', pos: 'Winger', goalOdds: 2.20, sotOdds: 1.65 },
    { name: 'Jude Bellingham', pos: 'Midfielder', goalOdds: 2.85, sotOdds: 1.85 },
    { name: 'Rodrygo', pos: 'Forward', goalOdds: 3.10, sotOdds: 1.95 },
  ],
  bayern: [
    { name: 'Harry Kane', pos: 'Striker', goalOdds: 1.95, sotOdds: 1.52 },
    { name: 'Jamal Musiala', pos: 'Midfielder', goalOdds: 2.90, sotOdds: 1.80 },
    { name: 'Michael Olise', pos: 'Winger', goalOdds: 3.40, sotOdds: 1.95 },
  ],
  barcelona: [
    { name: 'Robert Lewandowski', pos: 'Striker', goalOdds: 1.82, sotOdds: 1.45 },
    { name: 'Lamine Yamal', pos: 'Winger', goalOdds: 2.70, sotOdds: 1.72 },
    { name: 'Raphinha', pos: 'Forward', goalOdds: 2.55, sotOdds: 1.68 },
  ],
  psg: [
    { name: 'Ousmane Dembélé', pos: 'Winger', goalOdds: 2.95, sotOdds: 1.82 },
    { name: 'Bradley Barcola', pos: 'Forward', goalOdds: 2.80, sotOdds: 1.78 },
    { name: 'Achraf Hakimi', pos: 'Defender', goalOdds: 5.50, sotOdds: 2.40 },
  ],
  inter: [
    { name: 'Lautaro Martínez', pos: 'Striker', goalOdds: 2.60, sotOdds: 1.74 },
    { name: 'Marcus Thuram', pos: 'Forward', goalOdds: 2.95, sotOdds: 1.88 },
    { name: 'Hakan Çalhanoğlu', pos: 'Midfielder', goalOdds: 4.10, sotOdds: 2.25 },
  ],
};

export const ARSENAL_BRIGHTON_MARKETS: MarketGroup[] = [
  {
    id: 'mkt-1x2',
    name: 'Match result',
    category: ['popular', 'all'],
    layout: '3col',
    selections: [
      { id: 'ars-bha-1x2-home', label: 'Arsenal', shortLabel: 'Arsenal', odds: 1.30 },
      { id: 'ars-bha-1x2-draw', label: 'Draw', shortLabel: 'Draw', odds: 4.60 },
      { id: 'ars-bha-1x2-away', label: 'Brighton & Hove Albion', shortLabel: 'Brighton', odds: 11.00 },
    ],
  },
  {
    id: 'mkt-dc',
    name: 'Double chance',
    category: ['popular', 'all'],
    layout: '3col',
    selections: [
      { id: 'ars-bha-dc-1x', label: 'Arsenal or draw', shortLabel: 'Arsenal/Dr...', odds: 1.03 },
      { id: 'ars-bha-dc-12', label: 'Arsenal or Brighton & Hove Albion', shortLabel: 'Arsenal/Br...', odds: 1.18 },
      { id: 'ars-bha-dc-x2', label: 'Draw or Brighton & Hove Albion', shortLabel: 'Draw/Brig...', odds: 3.30 },
    ],
  },
  {
    id: 'mkt-tg-25',
    name: 'Total goals',
    category: ['popular', 'goals', 'all'],
    layout: '2col',
    selections: [
      { id: 'ars-bha-ou-o25', label: 'Over 2.5', odds: 2.73 },
      { id: 'ars-bha-ou-u25', label: 'Under 2.5', odds: 1.44 },
      { id: 'ars-bha-ou-o15', label: 'Over 1.5', odds: 1.24 },
      { id: 'ars-bha-ou-u15', label: 'Under 1.5', odds: 3.95 },
      { id: 'ars-bha-ou-o35', label: 'Over 3.5', odds: 5.40 },
      { id: 'ars-bha-ou-u35', label: 'Under 3.5', odds: 1.15 },
    ],
  },
  {
    id: 'mkt-btts',
    name: 'Both teams to score',
    category: ['popular', 'goals', 'all'],
    layout: '2col',
    selections: [
      { id: 'ars-bha-btts-yes', label: 'Yes', odds: 2.15 },
      { id: 'ars-bha-btts-no', label: 'No', odds: 1.68 },
    ],
  },
  {
    id: 'mkt-next-goal',
    name: 'Next goal (2nd goal)',
    category: ['popular', 'goals', 'minutes', 'all'],
    layout: '3col',
    selections: [
      { id: 'ars-bha-ng-1', label: 'Arsenal', odds: 1.52 },
      { id: 'ars-bha-ng-none', label: 'No goal', odds: 4.80 },
      { id: 'ars-bha-ng-2', label: 'Brighton & Hove Albion', shortLabel: 'Brighton', odds: 4.20 },
    ],
  },
  {
    id: 'mkt-goalscorers-anytime',
    name: 'Anytime goalscorer',
    category: ['popular', 'goalscorers', 'players', 'all'],
    layout: '2col',
    selections: [
      { id: 'ars-bha-gs-saka', label: 'Bukayo Saka', sublabel: 'Arsenal · Forward', team: 'home', odds: 2.10 },
      { id: 'ars-bha-gs-havertz', label: 'Kai Havertz', sublabel: 'Arsenal · Forward', team: 'home', odds: 2.35 },
      { id: 'ars-bha-gs-trossard', label: 'Leandro Trossard', sublabel: 'Arsenal · Forward', team: 'home', odds: 2.75 },
      { id: 'ars-bha-gs-martinelli', label: 'Gabriel Martinelli', sublabel: 'Arsenal · Winger', team: 'home', odds: 2.90 },
      { id: 'ars-bha-gs-odegaard', label: 'Martin Ødegaard', sublabel: 'Arsenal · Midfielder', team: 'home', odds: 3.40 },
      { id: 'ars-bha-gs-rice', label: 'Declan Rice', sublabel: 'Arsenal · Midfielder', team: 'home', odds: 5.20 },
      { id: 'ars-bha-gs-welbeck', label: 'Danny Welbeck', sublabel: 'Brighton · Forward', team: 'away', odds: 4.20 },
      { id: 'ars-bha-gs-mitoma', label: 'Kaoru Mitoma', sublabel: 'Brighton · Winger', team: 'away', odds: 4.80 },
      { id: 'ars-bha-gs-pedro', label: 'João Pedro', sublabel: 'Brighton · Forward', team: 'away', odds: 3.90 },
    ],
  },
  {
    id: 'mkt-handicap-asian',
    name: 'Asian handicap (Live 1–0)',
    category: ['popular', 'handicaps', 'all'],
    layout: '2col',
    selections: [
      { id: 'ars-bha-ah-h-05', label: 'Arsenal (-0.5)', odds: 1.55 },
      { id: 'ars-bha-ah-a+05', label: 'Brighton (+0.5)', odds: 2.40 },
      { id: 'ars-bha-ah-h-10', label: 'Arsenal (-1.0)', odds: 1.98 },
      { id: 'ars-bha-ah-a+10', label: 'Brighton (+1.0)', odds: 1.85 },
      { id: 'ars-bha-ah-h-15', label: 'Arsenal (-1.5)', odds: 2.65 },
      { id: 'ars-bha-ah-a+15', label: 'Brighton (+1.5)', odds: 1.47 },
    ],
  },
  {
    id: 'mkt-halves-2h',
    name: '2nd half result',
    category: ['halves', 'popular', 'all'],
    layout: '3col',
    selections: [
      { id: 'ars-bha-2h-1', label: 'Arsenal', odds: 1.72 },
      { id: 'ars-bha-2h-x', label: 'Draw', odds: 2.60 },
      { id: 'ars-bha-2h-2', label: 'Brighton', odds: 5.50 },
    ],
  },
  {
    id: 'mkt-halves-goals',
    name: '2nd half total goals',
    category: ['halves', 'goals', 'all'],
    layout: '2col',
    selections: [
      { id: 'ars-bha-2hg-o05', label: 'Over 0.5 (2nd Half)', odds: 1.25 },
      { id: 'ars-bha-2hg-u05', label: 'Under 0.5 (2nd Half)', odds: 3.80 },
      { id: 'ars-bha-2hg-o15', label: 'Over 1.5 (2nd Half)', odds: 2.45 },
      { id: 'ars-bha-2hg-u15', label: 'Under 1.5 (2nd Half)', odds: 1.52 },
    ],
  },
  {
    id: 'mkt-corners-total',
    name: 'Total corners',
    category: ['corners-cards', 'popular', 'all'],
    layout: '2col',
    selections: [
      { id: 'ars-bha-cor-o85', label: 'Over 8.5 Corners', odds: 1.48 },
      { id: 'ars-bha-cor-u85', label: 'Under 8.5 Corners', odds: 2.55 },
      { id: 'ars-bha-cor-o95', label: 'Over 9.5 Corners', odds: 1.88 },
      { id: 'ars-bha-cor-u95', label: 'Under 9.5 Corners', odds: 1.92 },
      { id: 'ars-bha-cor-o105', label: 'Over 10.5 Corners', odds: 2.60 },
      { id: 'ars-bha-cor-u105', label: 'Under 10.5 Corners', odds: 1.46 },
    ],
  },
  {
    id: 'mkt-cards-total',
    name: 'Total bookings (Cards)',
    category: ['corners-cards', 'all'],
    layout: '2col',
    selections: [
      { id: 'ars-bha-crd-o35', label: 'Over 3.5 Cards', odds: 1.78 },
      { id: 'ars-bha-crd-u35', label: 'Under 3.5 Cards', odds: 2.02 },
      { id: 'ars-bha-crd-o45', label: 'Over 4.5 Cards', odds: 2.65 },
      { id: 'ars-bha-crd-u45', label: 'Under 4.5 Cards', odds: 1.45 },
    ],
  },
  {
    id: 'mkt-players-sot',
    name: 'Player shots on target',
    category: ['players', 'specials', 'all'],
    layout: '2col',
    selections: [
      { id: 'ars-bha-sot-saka2', label: 'Bukayo Saka 2+ Shots on Target', odds: 1.72 },
      { id: 'ars-bha-sot-havertz2', label: 'Kai Havertz 2+ Shots on Target', odds: 2.15 },
      { id: 'ars-bha-sot-mitoma1', label: 'Kaoru Mitoma 1+ Shot on Target', odds: 1.65 },
      { id: 'ars-bha-sot-rice1', label: 'Declan Rice 1+ Shot on Target', odds: 2.05 },
    ],
  },
  {
    id: 'mkt-minutes-fast',
    name: 'Fast market: Goal between 50:00 – 59:59',
    category: ['minutes', 'specials', 'all'],
    layout: '2col',
    suspended: false,
    selections: [
      { id: 'ars-bha-min-yes', label: 'Yes — Goal in 50:00–59:59', odds: 3.40 },
      { id: 'ars-bha-min-no', label: 'No — Goal in 50:00–59:59', odds: 1.30 },
    ],
  },
];

// Contextual Market Generator for ANY Match (Soccer, Tennis, Basketball, Baseball, NFL, Esports)
export function getMarketsForMatch(match: MatchItem): MarketGroup[] {
  if (match.markets && match.markets.length > 0) {
    return match.markets;
  }

  const hName = match.homeTeam.name;
  const aName = match.awayTeam.name;
  const hShort = match.homeTeam.shortName;
  const aShort = match.awayTeam.shortName;

  // Non-soccer sports (Tennis, Basketball, Baseball, NFL, Esports)
  if (match.sportId === 'tennis') {
    return [
      {
        id: 'mkt-1x2',
        name: 'Match winner',
        category: ['popular', 'all'],
        layout: '2col',
        selections: [
          { id: `${match.id}-1x2-home`, label: hName, shortLabel: hShort, odds: match.mainOdds.home },
          { id: `${match.id}-1x2-away`, label: aName, shortLabel: aShort, odds: match.mainOdds.away },
        ],
      },
      {
        id: 'mkt-set-winner',
        name: 'Current set winner',
        category: ['popular', 'halves', 'all'],
        layout: '2col',
        selections: [
          { id: `${match.id}-set-h`, label: `${hName} (Current Set)`, odds: Number((match.mainOdds.home * 0.96).toFixed(2)) },
          { id: `${match.id}-set-a`, label: `${aName} (Current Set)`, odds: Number((match.mainOdds.away * 0.98).toFixed(2)) },
        ],
      },
      {
        id: 'mkt-total-games',
        name: 'Total games',
        category: ['popular', 'goals', 'all'],
        layout: '2col',
        selections: [
          { id: `${match.id}-tg-o225`, label: 'Over 22.5 Games', odds: 1.85 },
          { id: `${match.id}-tg-u225`, label: 'Under 22.5 Games', odds: 1.95 },
          { id: `${match.id}-tg-o245`, label: 'Over 24.5 Games', odds: 2.25 },
          { id: `${match.id}-tg-u245`, label: 'Under 24.5 Games', odds: 1.62 },
        ],
      },
      {
        id: 'mkt-game-hcp',
        name: 'Game handicap',
        category: ['popular', 'handicaps', 'all'],
        layout: '2col',
        selections: [
          { id: `${match.id}-gh-h`, label: `${hName} (-2.5 Games)`, odds: 1.90 },
          { id: `${match.id}-gh-a`, label: `${aName} (+2.5 Games)`, odds: 1.90 },
        ],
      },
      {
        id: 'mkt-aces',
        name: 'Player total aces',
        category: ['players', 'specials', 'all'],
        layout: '2col',
        selections: [
          { id: `${match.id}-ace-h`, label: `${hName} Over 8.5 Aces`, odds: 1.80 },
          { id: `${match.id}-ace-a`, label: `${aName} Over 9.5 Aces`, odds: 1.88 },
        ],
      },
    ];
  }

  if (
    match.sportId === 'basketball' ||
    match.sportId === 'american-football' ||
    match.sportId === 'baseball' ||
    match.sportId === 'ice-hockey' ||
    match.sportId === 'esports'
  ) {
    const isBball = match.sportId === 'basketball';
    const isHockey = match.sportId === 'ice-hockey';
    const isBaseball = match.sportId === 'baseball';
    const isNfl = match.sportId === 'american-football';
    const isEsports = match.sportId === 'esports';

    const totalLine =
      match.overUnderOdds?.line ||
      (isBball
        ? '224.5'
        : isNfl
        ? '47.5'
        : isBaseball
        ? '8.5'
        : isHockey
        ? '5.5'
        : '2.5 Maps');
    const spreadLine = isBball ? '4.5' : isNfl ? '3.5' : '1.5';
    const spreadTitle = isHockey
      ? 'Puck line'
      : isBaseball
      ? 'Run line'
      : isEsports
      ? 'Map handicap'
      : 'Point spread';

    return [
      {
        id: 'mkt-1x2',
        name: isEsports ? 'Match winner' : 'Moneyline (Incl. OT)',
        category: ['popular', 'all'],
        layout: '2col',
        suspended: match.suspended,
        selections: [
          {
            id: `${match.id}-1x2-home`,
            label: hName,
            shortLabel: hShort,
            odds: match.mainOdds.home,
          },
          {
            id: `${match.id}-1x2-away`,
            label: aName,
            shortLabel: aShort,
            odds: match.mainOdds.away,
          },
        ],
      },
      {
        id: 'mkt-spread',
        name: spreadTitle,
        category: ['popular', 'handicaps', 'all'],
        layout: '2col',
        selections: [
          { id: `${match.id}-sp-h`, label: `${hName} (-${spreadLine})`, odds: 1.91 },
          { id: `${match.id}-sp-a`, label: `${aName} (+${spreadLine})`, odds: 1.91 },
        ],
      },
      {
        id: 'mkt-totals',
        name: `Total (${totalLine})`,
        category: ['popular', 'goals', 'all'],
        layout: '2col',
        selections: [
          {
            id: `${match.id}-tot-o`,
            label: `Over ${totalLine}`,
            odds: match.overUnderOdds?.over ?? 1.88,
          },
          {
            id: `${match.id}-tot-u`,
            label: `Under ${totalLine}`,
            odds: match.overUnderOdds?.under ?? 1.92,
          },
        ],
      },
      {
        id: 'mkt-period-1',
        name: isEsports
          ? 'Map 1 winner'
          : isHockey
          ? '1st Period winner'
          : isBaseball
          ? 'First 5 innings winner'
          : '1st Half winner',
        category: ['popular', 'halves', 'all'],
        layout: '2col',
        selections: [
          { id: `${match.id}-p1-h`, label: hName, odds: 1.84 },
          { id: `${match.id}-p1-a`, label: aName, odds: 1.96 },
        ],
      },
      {
        id: 'mkt-player-props',
        name: isEsports ? 'Match specials' : 'Team & player props',
        category: ['popular', 'players', 'specials', 'all'],
        layout: '2col',
        selections:
          match.id === 'lal-gsw'
            ? [
                { id: `${match.id}-pp-1`, label: 'LeBron James Over 25.5 Pts', odds: 1.85 },
                { id: `${match.id}-pp-2`, label: 'Stephen Curry Over 4.5 Threes', odds: 1.78 },
                { id: `${match.id}-pp-3`, label: 'Anthony Davis Over 11.5 Reb', odds: 1.82 },
                { id: `${match.id}-pp-4`, label: 'Draymond Green Over 6.5 Ast', odds: 1.95 },
              ]
            : [
                { id: `${match.id}-pp-1`, label: `${hName} Highest Scoring Star`, odds: 1.76 },
                { id: `${match.id}-pp-2`, label: `${aName} Highest Scoring Star`, odds: 2.04 },
                { id: `${match.id}-pp-3`, label: `${hName} First to Score`, odds: 1.82 },
                { id: `${match.id}-pp-4`, label: `${aName} First to Score`, odds: 1.98 },
              ],
      },
    ];
  }

  // Contextual Soccer Markets with authentic club players
  const homePlayers = TEAM_PLAYERS[match.homeTeam.id] || [
    { name: `${hShort} Striker #9`, pos: 'Forward', goalOdds: 2.35, sotOdds: 1.75 },
    { name: `${hShort} Winger #7`, pos: 'Winger', goalOdds: 2.85, sotOdds: 1.90 },
    { name: `${hShort} Playmaker #10`, pos: 'Midfielder', goalOdds: 3.40, sotOdds: 2.05 },
  ];
  const awayPlayers = TEAM_PLAYERS[match.awayTeam.id] || [
    { name: `${aShort} Striker #9`, pos: 'Forward', goalOdds: 3.10, sotOdds: 1.85 },
    { name: `${aShort} Winger #11`, pos: 'Winger', goalOdds: 3.60, sotOdds: 1.95 },
  ];

  const ouOver = match.overUnderOdds?.over ?? 1.85;
  const ouUnder = match.overUnderOdds?.under ?? 1.95;
  const bttsYes = match.bttsOdds?.yes ?? 1.72;
  const bttsNo = match.bttsOdds?.no ?? 2.08;

  return [
    {
      id: 'mkt-1x2',
      name: 'Match result',
      category: ['popular', 'all'],
      layout: '3col',
      suspended: match.suspended,
      selections: [
        { id: `${match.id}-1x2-home`, label: hName, shortLabel: hShort, odds: match.mainOdds.home },
        { id: `${match.id}-1x2-draw`, label: 'Draw', shortLabel: 'Draw', odds: match.mainOdds.draw ?? 3.50 },
        { id: `${match.id}-1x2-away`, label: aName, shortLabel: aShort, odds: match.mainOdds.away },
      ],
    },
    {
      id: 'mkt-dc',
      name: 'Double chance',
      category: ['popular', 'all'],
      layout: '3col',
      selections: [
        {
          id: `${match.id}-dc-1x`,
          label: `${hName} or draw`,
          shortLabel: `${hShort}/Draw`,
          odds: Number(Math.max(1.04, match.mainOdds.home * 0.68).toFixed(2)),
        },
        {
          id: `${match.id}-dc-12`,
          label: `${hName} or ${aName}`,
          shortLabel: `${hShort}/${aShort}`,
          odds: 1.24,
        },
        {
          id: `${match.id}-dc-x2`,
          label: `Draw or ${aName}`,
          shortLabel: `Draw/${aShort}`,
          odds: Number(Math.max(1.18, match.mainOdds.away * 0.56).toFixed(2)),
        },
      ],
    },
    {
      id: 'mkt-tg-25',
      name: 'Total goals',
      category: ['popular', 'goals', 'all'],
      layout: '2col',
      selections: [
        { id: `${match.id}-ou-o25`, label: 'Over 2.5', odds: ouOver },
        { id: `${match.id}-ou-u25`, label: 'Under 2.5', odds: ouUnder },
        { id: `${match.id}-ou-o15`, label: 'Over 1.5', odds: 1.26 },
        { id: `${match.id}-ou-u15`, label: 'Under 1.5', odds: 3.75 },
        { id: `${match.id}-ou-o35`, label: 'Over 3.5', odds: 2.95 },
        { id: `${match.id}-ou-u35`, label: 'Under 3.5', odds: 1.38 },
      ],
    },
    {
      id: 'mkt-btts',
      name: 'Both teams to score',
      category: ['popular', 'goals', 'all'],
      layout: '2col',
      selections: [
        { id: `${match.id}-btts-yes`, label: 'Yes', odds: bttsYes },
        { id: `${match.id}-btts-no`, label: 'No', odds: bttsNo },
      ],
    },
    {
      id: 'mkt-goalscorers-anytime',
      name: 'Anytime goalscorer',
      category: ['popular', 'goalscorers', 'players', 'all'],
      layout: '2col',
      selections: [
        ...homePlayers.map((p, idx) => ({
          id: `${match.id}-gs-h-${idx}`,
          label: p.name,
          sublabel: `${hShort} · ${p.pos}`,
          team: 'home' as const,
          odds: p.goalOdds,
        })),
        ...awayPlayers.map((p, idx) => ({
          id: `${match.id}-gs-a-${idx}`,
          label: p.name,
          sublabel: `${aShort} · ${p.pos}`,
          team: 'away' as const,
          odds: p.goalOdds,
        })),
      ],
    },
    {
      id: 'mkt-handicap-asian',
      name: 'Asian handicap',
      category: ['popular', 'handicaps', 'all'],
      layout: '2col',
      selections: [
        { id: `${match.id}-ah-h-05`, label: `${hName} (-0.5)`, odds: match.mainOdds.home },
        { id: `${match.id}-ah-a+05`, label: `${aName} (+0.5)`, odds: Number(Math.max(1.35, match.mainOdds.away * 0.62).toFixed(2)) },
        { id: `${match.id}-ah-h-15`, label: `${hName} (-1.5)`, odds: Number((match.mainOdds.home * 1.48).toFixed(2)) },
        { id: `${match.id}-ah-a+15`, label: `${aName} (+1.5)`, odds: 1.42 },
      ],
    },
    {
      id: 'mkt-halves-1h',
      name: 'Half-time / 2nd half result',
      category: ['halves', 'all'],
      layout: '3col',
      selections: [
        { id: `${match.id}-ht-1`, label: hName, shortLabel: hShort, odds: Number((match.mainOdds.home * 1.25).toFixed(2)) },
        { id: `${match.id}-ht-x`, label: 'Draw', shortLabel: 'Draw', odds: 2.35 },
        { id: `${match.id}-ht-2`, label: aName, shortLabel: aShort, odds: Number((match.mainOdds.away * 1.15).toFixed(2)) },
      ],
    },
    {
      id: 'mkt-corners-total',
      name: 'Total corners & cards',
      category: ['corners-cards', 'all'],
      layout: '2col',
      selections: [
        { id: `${match.id}-cor-o95`, label: 'Over 9.5 Corners', odds: 1.85 },
        { id: `${match.id}-cor-u95`, label: 'Under 9.5 Corners', odds: 1.95 },
        { id: `${match.id}-crd-o35`, label: 'Over 3.5 Cards', odds: 1.80 },
        { id: `${match.id}-crd-u35`, label: 'Under 3.5 Cards', odds: 2.00 },
      ],
    },
    {
      id: 'mkt-players-sot',
      name: 'Player shots on target',
      category: ['players', 'specials', 'all'],
      layout: '2col',
      selections: [
        ...homePlayers.slice(0, 2).map((p, idx) => ({
          id: `${match.id}-sot-h-${idx}`,
          label: `${p.name} 2+ Shots on Target`,
          odds: p.sotOdds,
        })),
        ...awayPlayers.slice(0, 2).map((p, idx) => ({
          id: `${match.id}-sot-a-${idx}`,
          label: `${p.name} 1+ Shot on Target`,
          odds: p.sotOdds,
        })),
      ],
    },
  ];
}

export const INITIAL_MATCHES: MatchItem[] = [
  // PREMIER LEAGUE
  {
    id: 'ars-bha',
    sportId: 'soccer',
    competitionId: 'epl',
    competitionName: 'Premier League',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    homeTeam: { id: 'arsenal', name: 'Arsenal', shortName: 'Arsenal', score: 1 },
    awayTeam: { id: 'brighton', name: 'Brighton & Hove Albion', shortName: 'Brighton', score: 0 },
    isLive: true,
    clock: "52'",
    minute: 52,
    startTime: '15:00',
    startDate: 'Today',
    featured: true,
    suspended: false,
    totalMarketsCount: 115,
    mainOdds: { home: 1.30, draw: 4.60, away: 11.00 },
    overUnderOdds: { line: '2.5', over: 2.73, under: 1.44 },
    bttsOdds: { yes: 2.15, no: 1.68 },
    markets: ARSENAL_BRIGHTON_MARKETS,
  },
  {
    id: 'avl-ful',
    sportId: 'soccer',
    competitionId: 'epl',
    competitionName: 'Premier League',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    homeTeam: { id: 'aston-villa', name: 'Aston Villa', shortName: 'Villa', score: 0 },
    awayTeam: { id: 'fulham', name: 'Fulham', shortName: 'Fulham', score: 0 },
    isLive: true,
    clock: 'HT',
    minute: 45,
    startTime: '15:00',
    startDate: 'Today',
    featured: false,
    suspended: false,
    totalMarketsCount: 7,
    mainOdds: { home: 2.25, draw: 2.90, away: 3.60 },
    overUnderOdds: { line: '1.5', over: 1.62, under: 2.25 },
    bttsOdds: { yes: 2.30, no: 1.58 },
  },
  {
    id: 'new-eve',
    sportId: 'soccer',
    competitionId: 'epl',
    competitionName: 'Premier League',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    homeTeam: { id: 'newcastle', name: 'Newcastle United', shortName: 'Newcastle', score: 2 },
    awayTeam: { id: 'everton', name: 'Everton', shortName: 'Everton', score: 1 },
    isLive: true,
    clock: "58'",
    minute: 58,
    startTime: '15:00',
    startDate: 'Today',
    featured: false,
    suspended: true,
    totalMarketsCount: 6,
    mainOdds: { home: 1.42, draw: 4.30, away: 7.50 },
    overUnderOdds: { line: '3.5', over: 1.75, under: 2.05 },
    bttsOdds: { yes: 1.12, no: 5.80 },
  },
  {
    id: 'liv-mun',
    sportId: 'soccer',
    competitionId: 'epl',
    competitionName: 'Premier League',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    homeTeam: { id: 'liverpool', name: 'Liverpool', shortName: 'Liverpool' },
    awayTeam: { id: 'man-utd', name: 'Manchester United', shortName: 'Man Utd' },
    isLive: false,
    startTime: '16:30',
    startDate: 'Sun, Oct 18',
    startsInMinutes: 18,
    featured: true,
    suspended: false,
    totalMarketsCount: 10,
    mainOdds: { home: 1.65, draw: 4.00, away: 4.33 },
    overUnderOdds: { line: '2.5', over: 1.60, under: 2.30 },
    bttsOdds: { yes: 1.57, no: 2.35 },
  },
  {
    id: 'mci-tot',
    sportId: 'soccer',
    competitionId: 'epl',
    competitionName: 'Premier League',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    homeTeam: { id: 'man-city', name: 'Manchester City', shortName: 'Man City' },
    awayTeam: { id: 'tottenham', name: 'Tottenham Hotspur', shortName: 'Spurs' },
    isLive: false,
    startTime: '14:00',
    startDate: 'Sun, Oct 18',
    startsInMinutes: 45,
    featured: true,
    suspended: false,
    totalMarketsCount: 92,
    mainOdds: { home: 1.50, draw: 4.50, away: 5.25 },
    overUnderOdds: { line: '3.5', over: 1.95, under: 1.85 },
    bttsOdds: { yes: 1.52, no: 2.45 },
  },

  // CHAMPIONS LEAGUE
  {
    id: 'ars-int',
    sportId: 'soccer',
    competitionId: 'ucl',
    competitionName: 'Champions League',
    country: 'Europe',
    flag: '🌍',
    homeTeam: { id: 'arsenal', name: 'Arsenal', shortName: 'Arsenal' },
    awayTeam: { id: 'inter', name: 'Inter', shortName: 'Inter' },
    isLive: false,
    startTime: '20:00',
    startDate: 'Tue, Oct 20',
    startsInMinutes: 120,
    featured: false,
    suspended: false,
    totalMarketsCount: 8,
    mainOdds: { home: 1.95, draw: 3.50, away: 4.00 },
    overUnderOdds: { line: '2.5', over: 1.90, under: 1.90 },
    bttsOdds: { yes: 1.75, no: 2.05 },
  },
  {
    id: 'rma-bay',
    sportId: 'soccer',
    competitionId: 'ucl',
    competitionName: 'Champions League',
    country: 'Europe',
    flag: '🌍',
    homeTeam: { id: 'real-madrid', name: 'Real Madrid', shortName: 'Real Madrid' },
    awayTeam: { id: 'bayern', name: 'Bayern Munich', shortName: 'Bayern' },
    isLive: false,
    startTime: '20:00',
    startDate: 'Tue, Oct 20',
    startsInMinutes: 120,
    featured: true,
    suspended: false,
    totalMarketsCount: 9,
    mainOdds: { home: 2.20, draw: 3.70, away: 2.90 },
    overUnderOdds: { line: '2.5', over: 1.58, under: 2.38 },
    bttsOdds: { yes: 1.50, no: 2.50 },
  },
  {
    id: 'bar-psg',
    sportId: 'soccer',
    competitionId: 'ucl',
    competitionName: 'Champions League',
    country: 'Europe',
    flag: '🌍',
    homeTeam: { id: 'barcelona', name: 'Barcelona', shortName: 'Barcelona' },
    awayTeam: { id: 'psg', name: 'Paris Saint-Germain', shortName: 'PSG' },
    isLive: false,
    startTime: '20:00',
    startDate: 'Wed, Oct 21',
    startsInMinutes: 240,
    featured: false,
    suspended: false,
    totalMarketsCount: 8,
    mainOdds: { home: 2.05, draw: 3.80, away: 3.30 },
    overUnderOdds: { line: '2.5', over: 1.55, under: 2.42 },
    bttsOdds: { yes: 1.48, no: 2.55 },
  },

  // LALIGA
  {
    id: 'atm-sev',
    sportId: 'soccer',
    competitionId: 'laliga',
    competitionName: 'LaLiga',
    country: 'Spain',
    flag: '🇪🇸',
    homeTeam: { id: 'atletico', name: 'Atlético Madrid', shortName: 'Atlético', score: 1 },
    awayTeam: { id: 'sevilla', name: 'Sevilla', shortName: 'Sevilla', score: 0 },
    isLive: true,
    clock: "37'",
    minute: 37,
    startTime: '16:00',
    startDate: 'Today',
    featured: false,
    suspended: true,
    totalMarketsCount: 8,
    mainOdds: { home: 1.35, draw: 4.50, away: 9.00 },
    overUnderOdds: { line: '2.5', over: 2.05, under: 1.78 },
    bttsOdds: { yes: 2.10, no: 1.70 },
  },
  {
    id: 'rma-vil',
    sportId: 'soccer',
    competitionId: 'laliga',
    competitionName: 'LaLiga',
    country: 'Spain',
    flag: '🇪🇸',
    homeTeam: { id: 'real-madrid', name: 'Real Madrid', shortName: 'Real Madrid' },
    awayTeam: { id: 'villarreal', name: 'Villarreal', shortName: 'Villarreal' },
    isLive: false,
    startTime: '21:00',
    startDate: 'Sat, Oct 24',
    startsInMinutes: 95,
    featured: false,
    suspended: false,
    totalMarketsCount: 64,
    mainOdds: { home: 1.38, draw: 5.10, away: 7.20 },
    overUnderOdds: { line: '2.5', over: 1.50, under: 2.55 },
    bttsOdds: { yes: 1.66, no: 2.15 },
  },

  // SERIE A
  {
    id: 'juv-rom',
    sportId: 'soccer',
    competitionId: 'seriea',
    competitionName: 'Serie A',
    country: 'Italy',
    flag: '🇮🇹',
    homeTeam: { id: 'juventus', name: 'Juventus', shortName: 'Juventus', score: 1 },
    awayTeam: { id: 'roma', name: 'Roma', shortName: 'Roma', score: 1 },
    isLive: true,
    clock: "49'",
    minute: 49,
    startTime: '15:30',
    startDate: 'Today',
    featured: false,
    suspended: false,
    totalMarketsCount: 6,
    mainOdds: { home: 2.40, draw: 3.10, away: 3.20 },
    overUnderOdds: { line: '2.5', over: 1.52, under: 2.48 },
    bttsOdds: { yes: 1.05, no: 8.50 },
  },
  {
    id: 'nap-mil',
    sportId: 'soccer',
    competitionId: 'seriea',
    competitionName: 'Serie A',
    country: 'Italy',
    flag: '🇮🇹',
    homeTeam: { id: 'napoli', name: 'Napoli', shortName: 'Napoli' },
    awayTeam: { id: 'milan', name: 'AC Milan', shortName: 'Milan' },
    isLive: false,
    startTime: '17:00',
    startDate: 'Today',
    startsInMinutes: 12,
    featured: false,
    suspended: false,
    totalMarketsCount: 74,
    mainOdds: { home: 2.10, draw: 3.40, away: 3.50 },
    overUnderOdds: { line: '2.5', over: 1.85, under: 1.95 },
    bttsOdds: { yes: 1.70, no: 2.10 },
  },

  // BUNDESLIGA
  {
    id: 'lev-stu',
    sportId: 'soccer',
    competitionId: 'bundesliga',
    competitionName: 'Bundesliga',
    country: 'Germany',
    flag: '🇩🇪',
    homeTeam: { id: 'leverkusen', name: 'Bayer Leverkusen', shortName: 'Leverkusen', score: 2 },
    awayTeam: { id: 'stuttgart', name: 'VfB Stuttgart', shortName: 'Stuttgart', score: 1 },
    isLive: true,
    clock: "64'",
    minute: 64,
    startTime: '15:30',
    startDate: 'Today',
    featured: false,
    suspended: false,
    totalMarketsCount: 14,
    mainOdds: { home: 1.36, draw: 4.80, away: 8.20 },
    overUnderOdds: { line: '3.5', over: 1.65, under: 2.20 },
    bttsOdds: { yes: 1.08, no: 7.00 },
  },
  {
    id: 'bvb-rbl',
    sportId: 'soccer',
    competitionId: 'bundesliga',
    competitionName: 'Bundesliga',
    country: 'Germany',
    flag: '🇩🇪',
    homeTeam: { id: 'dortmund', name: 'Borussia Dortmund', shortName: 'Dortmund' },
    awayTeam: { id: 'leipzig', name: 'RB Leipzig', shortName: 'RB Leipzig' },
    isLive: false,
    startTime: '18:30',
    startDate: 'Today',
    startsInMinutes: 28,
    featured: false,
    suspended: false,
    totalMarketsCount: 68,
    mainOdds: { home: 2.25, draw: 3.60, away: 2.95 },
    overUnderOdds: { line: '2.5', over: 1.54, under: 2.45 },
    bttsOdds: { yes: 1.46, no: 2.60 },
  },

  // TENNIS (LIVE)
  {
    id: 'alc-sin',
    sportId: 'tennis',
    competitionId: 'atp',
    competitionName: 'ATP Masters 1000',
    country: 'International',
    flag: '🎾',
    homeTeam: { id: 'alcaraz', name: 'Carlos Alcaraz', shortName: 'Alcaraz', score: 1 },
    awayTeam: { id: 'sinner', name: 'Jannik Sinner', shortName: 'Sinner', score: 1 },
    isLive: true,
    clock: 'Set 3 · 4-3',
    minute: 112,
    startTime: '15:00',
    startDate: 'Today',
    featured: false,
    suspended: false,
    totalMarketsCount: 24,
    mainOdds: { home: 1.75, away: 2.08 },
  },
  {
    id: 'djo-zve',
    sportId: 'tennis',
    competitionId: 'atp',
    competitionName: 'ATP Masters 1000',
    country: 'International',
    flag: '🎾',
    homeTeam: { id: 'djokovic', name: 'Novak Djokovic', shortName: 'Djokovic', score: 1 },
    awayTeam: { id: 'zverev', name: 'Alexander Zverev', shortName: 'Zverev', score: 0 },
    isLive: true,
    clock: 'Set 2 · 2-2',
    minute: 68,
    startTime: '16:00',
    startDate: 'Today',
    featured: false,
    suspended: false,
    totalMarketsCount: 19,
    mainOdds: { home: 1.40, away: 2.95 },
  },
  {
    id: 'med-rub',
    sportId: 'tennis',
    competitionId: 'atp',
    competitionName: 'ATP Masters 1000',
    country: 'International',
    flag: '🎾',
    homeTeam: { id: 'medvedev', name: 'Daniil Medvedev', shortName: 'Medvedev', score: 0 },
    awayTeam: { id: 'rublev', name: 'Andrey Rublev', shortName: 'Rublev', score: 1 },
    isLive: true,
    clock: 'Set 2 · 5-4',
    minute: 74,
    startTime: '16:15',
    startDate: 'Today',
    featured: false,
    suspended: false,
    totalMarketsCount: 16,
    mainOdds: { home: 2.50, away: 1.54 },
  },

  // BASKETBALL (LIVE)
  {
    id: 'lal-gsw',
    sportId: 'basketball',
    competitionId: 'nba',
    competitionName: 'NBA',
    country: 'USA',
    flag: '🏀',
    homeTeam: { id: 'lakers', name: 'LA Lakers', shortName: 'Lakers', score: 88 },
    awayTeam: { id: 'warriors', name: 'Golden State Warriors', shortName: 'Warriors', score: 84 },
    isLive: true,
    clock: 'Q3 · 04:12',
    minute: 32,
    startTime: '16:00',
    startDate: 'Today',
    featured: false,
    suspended: false,
    totalMarketsCount: 42,
    mainOdds: { home: 1.62, away: 2.32 },
  },

  // BASEBALL (LIVE)
  {
    id: 'lad-nyy',
    sportId: 'baseball',
    competitionId: 'mlb',
    competitionName: 'MLB Playoffs',
    country: 'USA',
    flag: '⚾',
    homeTeam: { id: 'dodgers', name: 'LA Dodgers', shortName: 'Dodgers', score: 4 },
    awayTeam: { id: 'yankees', name: 'NY Yankees', shortName: 'Yankees', score: 3 },
    isLive: true,
    clock: 'Bot 7th',
    minute: 7,
    startTime: '16:00',
    startDate: 'Today',
    featured: false,
    suspended: false,
    totalMarketsCount: 28,
    mainOdds: { home: 1.45, away: 2.75 },
  },

  // AMERICAN FOOTBALL (LIVE)
  {
    id: 'kc-buf',
    sportId: 'american-football',
    competitionId: 'nfl',
    competitionName: 'NFL',
    country: 'USA',
    flag: '🏈',
    homeTeam: { id: 'chiefs', name: 'Kansas City Chiefs', shortName: 'Chiefs', score: 21 },
    awayTeam: { id: 'bills', name: 'Buffalo Bills', shortName: 'Bills', score: 17 },
    isLive: true,
    clock: 'Q3 · 08:45',
    minute: 37,
    startTime: '16:00',
    startDate: 'Today',
    featured: false,
    suspended: false,
    totalMarketsCount: 35,
    mainOdds: { home: 1.58, away: 2.42 },
  },

  // ESPORTS (LIVE)
  {
    id: 'navi-faze',
    sportId: 'esports',
    competitionId: 'cs2',
    competitionName: 'BLAST Premier CS2',
    country: 'International',
    flag: '🎮',
    homeTeam: { id: 'navi', name: 'Natus Vincere', shortName: 'NAVI', score: 1 },
    awayTeam: { id: 'faze', name: 'FaZe Clan', shortName: 'FaZe', score: 0 },
    isLive: true,
    clock: 'Map 2 · 10-8',
    minute: 40,
    startTime: '16:00',
    startDate: 'Today',
    featured: false,
    suspended: false,
    totalMarketsCount: 15,
    mainOdds: { home: 1.32, away: 3.40 },
  },

  // ADDITIONAL MULTI-SPORT FIXTURES (Tennis, Basketball, Baseball, NFL, Ice Hockey, Esports)
  {
    id: 'sab-iga',
    sportId: 'tennis',
    competitionId: 'wta',
    competitionName: 'WTA Finals',
    country: 'International',
    flag: '🎾',
    homeTeam: { id: 'sabalenka', name: 'Aryna Sabalenka', shortName: 'Sabalenka' },
    awayTeam: { id: 'swiatek', name: 'Iga Świątek', shortName: 'Swiatek' },
    isLive: false,
    startTime: '19:30',
    startDate: 'Today',
    startsInMinutes: 45,
    featured: false,
    suspended: false,
    totalMarketsCount: 22,
    mainOdds: { home: 1.82, away: 1.98 },
  },
  {
    id: 'fri-run',
    sportId: 'tennis',
    competitionId: 'atp',
    competitionName: 'ATP Masters 1000',
    country: 'International',
    flag: '🎾',
    homeTeam: { id: 'fritz', name: 'Taylor Fritz', shortName: 'Fritz' },
    awayTeam: { id: 'rune', name: 'Holger Rune', shortName: 'Rune' },
    isLive: false,
    startTime: '21:00',
    startDate: 'Today',
    startsInMinutes: 110,
    featured: false,
    suspended: false,
    totalMarketsCount: 18,
    mainOdds: { home: 1.68, away: 2.20 },
  },
  {
    id: 'bos-den',
    sportId: 'basketball',
    competitionId: 'nba',
    competitionName: 'NBA',
    country: 'USA',
    flag: '🏀',
    homeTeam: { id: 'celtics', name: 'Boston Celtics', shortName: 'Celtics' },
    awayTeam: { id: 'nuggets', name: 'Denver Nuggets', shortName: 'Nuggets' },
    isLive: false,
    startTime: '20:30',
    startDate: 'Today',
    startsInMinutes: 65,
    featured: true,
    suspended: false,
    totalMarketsCount: 48,
    mainOdds: { home: 1.56, away: 2.45 },
    overUnderOdds: { line: '224.5', over: 1.90, under: 1.90 },
  },
  {
    id: 'nyk-mil',
    sportId: 'basketball',
    competitionId: 'nba',
    competitionName: 'NBA',
    country: 'USA',
    flag: '🏀',
    homeTeam: { id: 'knicks', name: 'New York Knicks', shortName: 'Knicks' },
    awayTeam: { id: 'bucks', name: 'Milwaukee Bucks', shortName: 'Bucks' },
    isLive: false,
    startTime: '22:00',
    startDate: 'Today',
    startsInMinutes: 150,
    featured: false,
    suspended: false,
    totalMarketsCount: 40,
    mainOdds: { home: 1.78, away: 2.05 },
    overUnderOdds: { line: '219.5', over: 1.88, under: 1.92 },
  },
  {
    id: 'nym-phi',
    sportId: 'baseball',
    competitionId: 'mlb',
    competitionName: 'MLB Playoffs',
    country: 'USA',
    flag: '⚾',
    homeTeam: { id: 'mets', name: 'NY Mets', shortName: 'Mets' },
    awayTeam: { id: 'phillies', name: 'Philadelphia Phillies', shortName: 'Phillies' },
    isLive: false,
    startTime: '20:05',
    startDate: 'Today',
    startsInMinutes: 55,
    featured: false,
    suspended: false,
    totalMarketsCount: 31,
    mainOdds: { home: 2.05, away: 1.80 },
    overUnderOdds: { line: '7.5', over: 1.85, under: 1.95 },
  },
  {
    id: 'bal-cin',
    sportId: 'american-football',
    competitionId: 'nfl',
    competitionName: 'NFL',
    country: 'USA',
    flag: '🏈',
    homeTeam: { id: 'ravens', name: 'Baltimore Ravens', shortName: 'Ravens' },
    awayTeam: { id: 'bengals', name: 'Cincinnati Bengals', shortName: 'Bengals' },
    isLive: false,
    startTime: '20:15',
    startDate: 'Sun, Oct 18',
    startsInMinutes: 85,
    featured: false,
    suspended: false,
    totalMarketsCount: 44,
    mainOdds: { home: 1.48, away: 2.68 },
    overUnderOdds: { line: '49.5', over: 1.91, under: 1.91 },
  },
  {
    id: 'edm-nyr',
    sportId: 'ice-hockey',
    competitionId: 'nhl',
    competitionName: 'NHL',
    country: 'USA / Canada',
    flag: '🏒',
    homeTeam: { id: 'oilers', name: 'Edmonton Oilers', shortName: 'Oilers', score: 2 },
    awayTeam: { id: 'rangers', name: 'New York Rangers', shortName: 'Rangers', score: 2 },
    isLive: true,
    clock: 'P3 · 11:20',
    minute: 49,
    startTime: '19:00',
    startDate: 'Today',
    featured: false,
    suspended: false,
    totalMarketsCount: 29,
    mainOdds: { home: 1.85, away: 1.95 },
    overUnderOdds: { line: '5.5', over: 1.72, under: 2.12 },
  },
  {
    id: 'tor-bos-nhl',
    sportId: 'ice-hockey',
    competitionId: 'nhl',
    competitionName: 'NHL',
    country: 'USA / Canada',
    flag: '🏒',
    homeTeam: { id: 'leafs', name: 'Toronto Maple Leafs', shortName: 'Maple Leafs' },
    awayTeam: { id: 'bruins', name: 'Boston Bruins', shortName: 'Bruins' },
    isLive: false,
    startTime: '21:30',
    startDate: 'Today',
    startsInMinutes: 90,
    featured: false,
    suspended: false,
    totalMarketsCount: 26,
    mainOdds: { home: 1.76, away: 2.08 },
    overUnderOdds: { line: '6.5', over: 1.95, under: 1.85 },
  },
  {
    id: 't1-geng',
    sportId: 'esports',
    competitionId: 'lol-worlds',
    competitionName: 'LoL Worlds',
    country: 'International',
    flag: '🎮',
    homeTeam: { id: 't1', name: 'T1', shortName: 'T1', score: 1 },
    awayTeam: { id: 'geng', name: 'Gen.G', shortName: 'Gen.G', score: 1 },
    isLive: true,
    clock: 'Game 3 · 24m',
    minute: 24,
    startTime: '15:00',
    startDate: 'Today',
    featured: false,
    suspended: false,
    totalMarketsCount: 19,
    mainOdds: { home: 1.92, away: 1.88 },
  },
  {
    id: 'vit-g2',
    sportId: 'esports',
    competitionId: 'cs2',
    competitionName: 'BLAST Premier CS2',
    country: 'International',
    flag: '🎮',
    homeTeam: { id: 'vitality', name: 'Team Vitality', shortName: 'Vitality' },
    awayTeam: { id: 'g2', name: 'G2 Esports', shortName: 'G2' },
    isLive: false,
    startTime: '20:00',
    startDate: 'Today',
    startsInMinutes: 60,
    featured: false,
    suspended: false,
    totalMarketsCount: 16,
    mainOdds: { home: 1.64, away: 2.25 },
  },
];

export const INITIAL_MY_BETS: PlacedBet[] = [
  {
    id: 'hb-open-101',
    placedAt: 'Oct 17',
    placedTime: '14:58',
    timestamp: Date.now() - 1000 * 60 * 35,
    selectionId: 'ars-bha-1x2-home',
    matchId: 'ars-bha',
    matchTitle: 'Arsenal v Brighton & Hove Albion',
    sportId: 'soccer',
    marketName: 'Match result',
    selectionLabel: 'Arsenal',
    odds: 1.80,
    stake: 20.00,
    potentialReturn: 36.00,
    status: 'Open',
    isLive: true,
    liveClock: "52'",
    liveScore: '1–0',
    cashOutOffer: 27.60,
  },
  {
    id: 'hb-set-099',
    placedAt: 'Oct 17',
    placedTime: '12:30',
    timestamp: Date.now() - 1000 * 60 * 60 * 4,
    selectionId: 'tot-whu-home',
    matchId: 'tot-whu',
    matchTitle: 'Tottenham Hotspur v West Ham',
    sportId: 'soccer',
    marketName: 'Match result',
    selectionLabel: 'Tottenham Hotspur',
    odds: 1.55,
    stake: 50.00,
    potentialReturn: 77.50,
    settledReturn: 77.50,
    status: 'Won',
  },
  {
    id: 'hb-set-098',
    placedAt: 'Oct 16',
    placedTime: '21:45',
    timestamp: Date.now() - 1000 * 60 * 60 * 22,
    selectionId: 'rma-cel-o25',
    matchId: 'rma-cel',
    matchTitle: 'Celta Vigo v Real Madrid',
    sportId: 'soccer',
    marketName: 'Total goals',
    selectionLabel: 'Over 2.5',
    odds: 1.72,
    stake: 25.00,
    potentialReturn: 43.00,
    settledReturn: 43.00,
    status: 'Won',
  },
  {
    id: 'hb-set-097',
    placedAt: 'Oct 15',
    placedTime: '19:10',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    selectionId: 'alc-ruu-1',
    matchId: 'alc-ruu',
    matchTitle: 'Carlos Alcaraz v Casper Ruud',
    sportId: 'tennis',
    marketName: 'Match winner',
    selectionLabel: 'Carlos Alcaraz',
    odds: 1.40,
    stake: 40.00,
    potentialReturn: 56.00,
    settledReturn: 51.20,
    status: 'Cashed Out',
  },
  {
    id: 'hb-set-096',
    placedAt: 'Oct 14',
    placedTime: '20:00',
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    selectionId: 'psg-str-btts',
    matchId: 'psg-str',
    matchTitle: 'PSG v Strasbourg',
    sportId: 'soccer',
    marketName: 'Both teams to score',
    selectionLabel: 'No',
    odds: 2.10,
    stake: 15.00,
    potentialReturn: 31.50,
    settledReturn: 0,
    status: 'Lost',
  },
  {
    id: 'hb-set-095',
    placedAt: 'Oct 12',
    placedTime: '16:15',
    timestamp: Date.now() - 1000 * 60 * 60 * 120,
    selectionId: 'bos-nyk-1',
    matchId: 'bos-nyk',
    matchTitle: 'Boston Celtics v NY Knicks',
    sportId: 'basketball',
    marketName: 'Moneyline',
    selectionLabel: 'Boston Celtics',
    odds: 1.62,
    stake: 30.00,
    potentialReturn: 48.60,
    settledReturn: 48.60,
    status: 'Won',
  },
  {
    id: 'hb-set-094',
    placedAt: 'Oct 08',
    placedTime: '18:00',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10,
    selectionId: 'bay-fra-o35',
    matchId: 'bay-fra',
    matchTitle: 'Eintracht Frankfurt v Bayern Munich',
    sportId: 'soccer',
    marketName: 'Total goals',
    selectionLabel: 'Over 3.5',
    odds: 2.05,
    stake: 20.00,
    potentialReturn: 41.00,
    settledReturn: 41.00,
    status: 'Won',
  },
  {
    id: 'hb-set-093',
    placedAt: 'Oct 04',
    placedTime: '15:00',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 18,
    selectionId: 'ars-sou-h',
    matchId: 'ars-sou',
    matchTitle: 'Arsenal v Southampton',
    sportId: 'soccer',
    marketName: 'Asian handicap',
    selectionLabel: 'Arsenal (-1.5)',
    odds: 1.85,
    stake: 35.00,
    potentialReturn: 64.75,
    settledReturn: 64.75,
    status: 'Won',
  },
];

export const INITIAL_COMMUNITY_BETS: CommunityBet[] = [
  {
    id: 'cb-1',
    playerHandle: 'alex_k',
    playerBadge: 'HOT STREAK',
    winRate: '8 Wins Streak',
    timeAgo: '42s ago',
    comment: 'Saka on penalties & corners, 4 shots already today.',
    selection: {
      id: 'ars-bha-fgs-saka',
      matchId: 'ars-bha',
      matchTitle: 'Arsenal v Brighton & Hove Albion',
      competitionId: 'epl',
      competitionName: 'Premier League',
      sportId: 'soccer',
      marketId: 'mkt-fgs',
      marketName: 'Next goalscorer',
      label: 'Bukayo Saka',
      shortLabel: 'B. Saka',
      odds: 2.10,
      isLive: true,
      scoreText: '1–0',
      clockText: "52'",
    },
    stake: 120.0,
    potentialReturn: 252.0,
    copiedCount: 318,
    category: ['trending', 'live'],
  },
  {
    id: 'cb-2',
    playerHandle: '0x8f...3a9',
    playerBadge: 'WHALE',
    winRate: '74% W/R',
    timeAgo: '1m ago',
    comment: 'Salah scoring record against United is unreal, Anytime Goalscorer value.',
    selection: {
      id: 'liv-mun-gs-h-0',
      matchId: 'liv-mun',
      matchTitle: 'Liverpool v Manchester United',
      competitionId: 'epl',
      competitionName: 'Premier League',
      sportId: 'soccer',
      marketId: 'mkt-goalscorers-anytime',
      marketName: 'Anytime goalscorer',
      label: 'Mohamed Salah',
      shortLabel: 'M. Salah',
      odds: 2.20,
      isLive: false,
    },
    stake: 500.0,
    potentialReturn: 1100.0,
    copiedCount: 246,
    category: ['trending', 'high-roller'],
  },
  {
    id: 'cb-3',
    playerHandle: 's_berg',
    playerBadge: 'WHALE',
    winRate: '68% W/R',
    timeAgo: '3m ago',
    comment: 'Curry heating up from deep in Q3, Over 4.5 Threes looks prime.',
    selection: {
      id: 'lal-gsw-pp-2',
      matchId: 'lal-gsw',
      matchTitle: 'LA Lakers v Golden State Warriors',
      competitionId: 'nba',
      competitionName: 'NBA',
      sportId: 'basketball',
      marketId: 'mkt-player-props',
      marketName: 'Player threes',
      label: 'Stephen Curry Over 4.5 Threes',
      shortLabel: 'Curry O4.5 3PT',
      odds: 1.78,
      isLive: true,
      scoreText: '84–79',
      clockText: 'Q3 04:12',
    },
    stake: 600.0,
    potentialReturn: 1068.0,
    copiedCount: 194,
    category: ['trending', 'high-roller', 'live'],
  },
  {
    id: 'cb-4',
    playerHandle: 't_martin',
    playerBadge: 'HOT STREAK',
    winRate: '6 Wins Streak',
    timeAgo: '5m ago',
    comment: 'Fast indoor court in Paris/Turin — Sinner serving bombs in deciding set.',
    selection: {
      id: 'alc-sin-ace-a',
      matchId: 'alc-sin',
      matchTitle: 'Carlos Alcaraz v Jannik Sinner',
      competitionId: 'atp',
      competitionName: 'ATP Masters 1000',
      sportId: 'tennis',
      marketId: 'mkt-aces',
      marketName: 'Player total aces',
      label: 'Jannik Sinner Over 9.5 Aces',
      shortLabel: 'Sinner O9.5 Aces',
      odds: 1.88,
      isLive: true,
      scoreText: '1–1',
      clockText: 'Set 3 · 4-3',
    },
    stake: 400.0,
    potentialReturn: 752.0,
    copiedCount: 141,
    category: ['high-roller', 'live'],
  },
  {
    id: 'cb-5',
    playerHandle: 'm_silva',
    playerBadge: 'VIP',
    winRate: '69% W/R',
    timeAgo: '6m ago',
    comment: 'UCL classic! Mbappé under the Bernabéu lights against Bayern high line.',
    selection: {
      id: 'rma-bay-gs-h-0',
      matchId: 'rma-bay',
      matchTitle: 'Real Madrid v Bayern Munich',
      competitionId: 'ucl',
      competitionName: 'Champions League',
      sportId: 'soccer',
      marketId: 'mkt-goalscorers-anytime',
      marketName: 'Anytime goalscorer',
      label: 'Kylian Mbappé',
      shortLabel: 'K. Mbappé',
      odds: 2.05,
      isLive: false,
    },
    stake: 350.0,
    potentialReturn: 717.5,
    copiedCount: 189,
    category: ['trending', 'high-roller'],
  },
];
