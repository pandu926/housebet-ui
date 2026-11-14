# Housebets Sportsbook — Interactive UI/UX Portfolio

Interactive sportsbook prototypes engineered for the **Housebets Sportsbook Design Contest**, featuring three distinct standalone sportsbook architectures built with React 18, TypeScript, Vite, Tailwind CSS, and Framer Motion.

## 🌐 Live Deployments (Cloudflare Pages)

| Edition | Live URL | Core UX Architecture |
| :--- | :--- | :--- |
| **Submission #1 — Trading Desk** | [https://housebets-desk.pages.dev](https://housebets-desk.pages.dev) | **Implied-Odds Trading Desk** — Implied probability vs. decimal toggle, live odds sparklines, dynamic staking & cash-out slip |
| **Submission #2 — Pro Matrix** | [https://housebets-matrix.pages.dev](https://housebets-matrix.pages.dev) | **Pro 9-Odds Multi-Market Matrix** — Simultaneous `1X2 · HDP · O/U` grid with zero-drawer Flash Singles USDT execution |
| **Submission #3 — Live Arena** | [https://housebets-arena.pages.dev](https://housebets-arena.pages.dev) | **Multi-Match Live Dock & Casino Bet-Stream** — Picture-in-Picture 4-match live radar & social bet-stream copy-betting |

## ✨ Key Highlights

- **Complete Sportsbook Journey:** Sports Home, Live In-Play Hub, Football Competition Browser, Deep Match Center (1X2, Asian Handicap, Totals, BTTS, Player Props, Bet Builder), Bet Slip (Singles & Multiples), and My Bets with instant Cash Out.
- **Responsive Desktop & Mobile UX:** Built natively for desktop (`1440px+`) and mobile (`390px`) viewports, plus an instant Desktop/Phone viewport preview switcher in the top header.
- **Crypto-Native USDT Experience:** Instant USDT stake presets, transparent potential payout math, and real-time simulated odds movement ticks (green/red flash indicators).

## 🚀 Local Development & Standalone Builds

```bash
# Install dependencies
npm install

# Start development server (supports ?edition=desk | ?edition=matrix | ?edition=arena)
npm run dev

# Build standalone locked editions
npm run build:sub1   # Outputs Submission #1 (Desk)   -> dist-sub1/
npm run build:sub2   # Outputs Submission #2 (Matrix) -> dist-sub2/
npm run build:sub3   # Outputs Submission #3 (Arena)  -> dist-sub3/
```
