# Housebets Sportsbook — Interactive Prototype Suite

[![Live Demo — Trading Desk](https://img.shields.io/badge/Live_Demo_1-Trading_Desk-2CE5F6?style=for-the-badge&logo=cloudflare&logoColor=06181F)](https://housebets-desk.pages.dev)
[![Live Demo — Pro Matrix](https://img.shields.io/badge/Live_Demo_2-Pro_Matrix-B9F6EC?style=for-the-badge&logo=cloudflare&logoColor=06181F)](https://housebets-matrix.pages.dev)
[![Live Demo — Live Arena](https://img.shields.io/badge/Live_Demo_3-Live_Arena-2CE5F6?style=for-the-badge&logo=cloudflare&logoColor=06181F)](https://housebets-arena.pages.dev)

A front-end clickable sportsbook prototype engineered natively inside the **Housebets** dark-teal & cyan brand shell (`1440px` desktop & `390px` mobile). Built for crypto-native **USDT singles betting** with complete edge-case state coverage—from live moving odds and market suspensions to explicit odds-change acceptance, failed-bet recovery, and instant cash-out.

---

## 🌐 Live Public Prototypes

Each link opens directly without login and runs as a standalone locked architecture on Cloudflare Pages:

| Edition | Public URL | Big Idea & UX Focus |
| :--- | :--- | :--- |
| **1. Implied-Odds Trading Desk** | **[housebets-desk.pages.dev](https://housebets-desk.pages.dev)** | Treats sports betting like a crypto trading terminal—featuring a global **Decimal ↔ Implied Probability (`%`)** toggle, live odds sparkline charts, and precision USDT single execution. |
| **2. Pro Multi-Market Matrix** | **[housebets-matrix.pages.dev](https://housebets-matrix.pages.dev)** | High-density pro sportsbook grid displaying **3 simultaneous markets (`1X2 · HDP · O/U` — 9 odds per row)** paired with **⚡ Flash Singles** for 1-click zero-drawer USDT betting. |
| **3. Multi-Match Live Arena** | **[housebets-arena.pages.dev](https://housebets-arena.pages.dev)** | Built for high-tempo in-play action—combining a **4-Match Picture-in-Picture Live Dock** with a real-time **Community Bet-Stream** for 1-click single copy-betting. |

---

## 📱 Core 5-Page Architecture

All five core sportsbook surfaces are interconnected within the authentic Housebets shell (**Top Bar**, **Left Navigation**, **Collapsible Side Panel** on desktop, and a **Persistent Bottom Bet Slip Bar + Drawer** on mobile):

1. **Sports Home**
   - *Live Now* carousel & *Starting Soon* fixtures
   - *Top Competitions* quick-ribbons & full *Sports Navigation*
   - Instant multi-entity search across **teams, players, competitions, and markets**
2. **Live (In-Play Hub)**
   - Real-time in-play scoreboard rows with live scores and ticking match clocks
   - Multi-sport & competition filters
   - Graceful **Empty Live Fallback** (*"Nothing live right now"* → automatically surfaces *Starting Soon* fixtures)
3. **Football**
   - Dedicated coverage for **Premier League, Champions League, LaLiga, Serie A, and Bundesliga**
   - Full-time result (`1X2`) odds on every fixture row
   - Interactive **`★ Follow`** system for both **teams** and **competitions** with personalized filtering
4. **Match Page** *(e.g., Arsenal v Brighton — Live)*
   - Live match header with club crests, real-time score, match minute, and quick match switcher
   - Complete market groups: **Popular, Goals, Halves, Handicaps, Goalscorers, and Corners & Cards**
   - Market pinning, instant market search, collapsible groups, live odds movement flashes, and suspended market locks
5. **Bet Slip + My Bets** *(Unified Single Page & Side Panel)*
   - **Singles Only** architecture (strictly no multis, accumulators, boosts, or free bets)
   - **USDT** stake inputs with quick-stake presets, decimal odds, and transparent potential return math
   - Shared **My Bets** view with **Open** and **Settled** tabs plus 2-step **Instant Cash Out**

---

## ⚡ Edge-Case & State Coverage

Every critical sportsbook state is implemented and interactively testable directly in the UI (including via the built-in **State Simulator / QA Controls**):

- **Moving Odds:** Real-time green/red directional price ticks with smooth visual feedback.
- **Odds Changed in Slip:** Blocks accidental placement when prices shift and prompts the player with **`Accept Odds Changes`** before submitting.
- **Suspended Markets & Selections:** Clearly locks individual selections or entire market groups (`SUSPENDED`) and excludes locked legs from placement.
- **Bet Placed & Bet Failed:** Full placement lifecycle with loading states, confirmed USDT bet receipts, and actionable **Bet Failed** error recovery (*Retry* / *Dismiss*).
- **Responsive Viewport Switcher:** Native responsive layout for `390px` mobile and `1440px+` desktop, plus an optional header toggle to preview phone framing on desktop screens.

---

## 🛠️ Tech Stack & Project Structure

- **Framework:** React 18 + TypeScript + Vite 5
- **Styling & Motion:** Tailwind CSS + Framer Motion + Lucide Icons
- **Deployment:** Cloudflare Pages (`*.pages.dev`)

```text
housebet-ui/
├── public/
│   ├── brand/                 # Housebets brand assets & icons
│   └── crests/                # Sample club & team crests (SVG/PNG)
├── src/
│   ├── components/            # Shared Housebets shell, OddsButton, BetSlip & MyBets, QA Orb
│   ├── config/                # Standalone edition resolver (desk | matrix | arena)
│   ├── context/               # Central sportsbook state, live odds ticker, slip & cash-out engine
│   ├── data/                  # Sample fixtures, competitions, and deep match market generators
│   ├── editions/
│   │   ├── matrix/            # Edition 2: 9-Odds Matrix table & Flash Singles toolbar
│   │   └── arena/             # Edition 3: Multi-Match Live Dock & Community Bet-Stream
│   └── pages/                 # Edition 1 & core 5 pages (Home, Live, Football, Match)
└── package.json
```

---

## 🚀 Local Development & Build

### Prerequisites
- Node.js `18+` and `npm`

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Start local dev server (http://localhost:5173)
# Switch editions dynamically in dev mode via query string:
#   http://localhost:5173/?edition=desk
#   http://localhost:5173/?edition=matrix
#   http://localhost:5173/?edition=arena
npm run dev

# 3. Type-check
npx tsc --noEmit

# 4. Build standalone locked production bundles
npm run build:sub1   # Edition 1 (Trading Desk) -> dist-sub1/
npm run build:sub2   # Edition 2 (Pro Matrix)   -> dist-sub2/
npm run build:sub3   # Edition 3 (Live Arena)   -> dist-sub3/
```

---

## 📌 Scope & Prototype Notice

- **Front-End Prototype Only:** Uses simulated sample match data, synthetic live odds ticks, and mock USDT balances (`0` real money / `0` real player data).
- **Singles Only:** Engineered strictly around fast, transparent single-bet execution and cash-out workflows.
