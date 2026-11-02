# Schengen Visa Calculator (90/180 Rule) 🇪🇺✈️

An open-source, privacy-first web application and PWA for tracking, calculating, and planning Schengen area stays (90/180 rule) and Pan-European EU tax residency (183-day rule & Directive 2003/109/EC permanent residence).

> 🌐 **Live Web Application:** [https://schengen-visa-calculator.pages.dev](https://schengen-visa-calculator.pages.dev/)

[![Live App](https://img.shields.io/badge/Live_App-schengen--visa--calculator.pages.dev-22c55e.svg?style=flat-square)](https://schengen-visa-calculator.pages.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![CI Tests](https://github.com/Naykitin/schengen-visa-calculator/actions/workflows/ci.yml/badge.svg?style=flat-square)](https://github.com/Naykitin/schengen-visa-calculator/actions)
[![Deploy with Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-f38020.svg?style=flat-square)](https://pages.cloudflare.com/)

---

## 🌟 Key Features

- **Pan-European Dual-Engine:**
  - **Schengen Visitor Mode (90/180):** Strict compliance with the official Schengen Border Code calculation logic ([EU Regulation 2016/399](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0399)). Both entry and exit dates count as full days of stay within any sliding 180-day window.
  - **EU Resident & Tax Mode:** Built-in tracker for residents of all 27 EU member states (Spain, Germany, France, Portugal, Italy, Poland, etc.) monitoring the **183-day annual tax residency rule** and **EU Directive 2003/109/EC 5-year permanent residence absence limits** (max 10 months / 300 days total, max 6 months per trip).
- **Live Trip Tracker ("Currently Abroad / Returned"):**
  - 1-click active stay tracking without needing to set a return date in advance.
  - Live pulsing dashboard banner with real-time day counter and safe allowance projections.
  - 1-click `I returned today` / `I departed today` button to instantly close trips and sync.
- **Real-Time Status Dashboard:**
  - Days remaining out of the 90-day allowance.
  - Active presence status ("Currently in Schengen" / "Outside Schengen" / "Currently Abroad").
  - Visual 90-day quota and 183-day tax milestone progress bars.
  - Day recovery timeline (dates when older trips drop out of the 180-day window and restore allowance).
- **Smart Trip Planner:**
  - *“When can I travel for N days?”* — Automatically discovers the earliest legal entry date for your desired trip length.
  - *“Check trip dates”* — Validates proposed future trips and flags exact overstay dates if a limit is exceeded.
- **Interactive Calendar:** Visual month-by-month view with touch swipe navigation between months, color-coded markers for completed trips, planned trips, and overstay warnings.
- **Multi-Profile & Multi-Passport Support:** Track multiple passports, family members, or residence permits with separate color tags and isolated trip calculations.
- **Multi-Device Cloud Sync (Cloudflare D1):**
  - Instant pairing between phone and laptop via a high-entropy secret sync key or 1-click URL (`?sync=...`).
  - Anti-bruteforce progressive cooldown and client debounce protection.
  - Zero-Knowledge approach: No accounts, no emails, no passwords.
  - Powered by serverless Cloudflare Pages Functions and Cloudflare D1 SQLite database.
- **Multi-Device Responsive Architecture:**
  - **Mobile Smartphones (< 640px):** Bottom Navigation, native-like Bottom Sheets with swipe gestures, and Safe Area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`) for iPhone notch, Dynamic Island, and Home bar.
  - **Dual-Screen & Foldables (Duo / Galaxy Fold):** CSS dual-screen media query support (`@media (horizontal-viewport-segments: 2)`), splitting trip history and interactive planner across both screens with seam protection.
  - **Tablets & iPad:** Adaptive dual-column layout with support for iPad Split View and Stage Manager.
  - **Desktops (> 1024px):** 2-panel workstation layout with keyboard shortcuts (`N` for new trip, `Esc` to dismiss, `1`/`2`/`3` for views).
- **Offline & Local-First Privacy:**
  - Powered by **IndexedDB** with `localStorage` fallback.
  - Full PWA Service Worker caching (`/sw.js`) allowing 100% offline usage.
  - Automatically requests browser **Persistent Storage** (`navigator.storage.persist()`) to prevent cache purges.
  - Zero third-party trackers, zero cookies, zero external telemetry. All calculations run client-side.
- **1-Click Backup & Restore:** Export and import trip records to/from JSON files at any time.
- **5 European Languages:** Full native translations and localized date formats for English 🇬🇧, German 🇩🇪, French 🇫🇷, Polish 🇵🇱, and Russian 🇷🇺.

---

## 🛠️ Tech Stack

- **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Backend / Serverless:** Cloudflare Pages Functions
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (Serverless SQLite)
- **Date Utilities:** [date-fns](https://date-fns.org/)
- **Storage:** [idb-keyval](https://github.com/jakearchibald/idb-keyval) (IndexedDB wrapper)
- **Unit Testing:** [Vitest](https://vitest.dev/)
- **Hosting & CDN:** [Cloudflare Pages](https://pages.cloudflare.com/) (100% Free Tier)
- **Continuous Integration:** GitHub Actions

---

## 🌿 GitFlow Branching Model

This project adheres to the standard **GitFlow** branching workflow:
- `main` — Production-ready releases (tagged as `v1.0.0`, `v1.1.0`, etc.).
- `develop` — Active development trunk where feature branches are integrated.
- `feature/*` — Feature branches branched off `develop` and merged back via pull requests.
- `hotfix/*` — Urgent production fixes branched directly off `main`.

---

## 🚀 Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer; v20+ recommended)
- [npm](https://www.npmjs.com/) (v9 or newer)

### Installation

```bash
# Clone repository
git clone https://github.com/Naykitin/schengen-visa-calculator.git
cd schengen-visa-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running Tests

```bash
# Run unit test suite (Vitest)
npm test
```

### Building for Production

```bash
# Typecheck and produce static bundle in dist/
npm run build
```

---

## ☁️ Deploy to Cloudflare Pages & D1 (Free Tier)

### 1. Deploy Frontend to Cloudflare Pages

1. Sign in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** -> **Create application** -> select the **Pages** tab.
3. Click **Connect to Git** and authorize your GitHub account.
4. Select repository: `Naykitin/schengen-visa-calculator`.
5. Configure build settings:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Production branch:** `main`
6. Click **Save and Deploy**.

### 2. Enable Cloudflare D1 Cloud Sync

In your Cloudflare dashboard (or using Wrangler CLI):

```bash
# 1. Create your serverless SQLite D1 database
npx wrangler d1 create schengen-db

# 2. Run initial database migration
npx wrangler d1 execute schengen-db --file=./migrations/0001_initial_schema.sql
```

3. In the Cloudflare Dashboard under your Pages project:
   - Go to **Settings** -> **Functions** -> **D1 database bindings**.
   - Add a binding named **`DB`** connected to your `schengen-db`.
   - Now any device can pair and sync in real time!

---

## 📄 License

This project is licensed under the terms of the **[MIT License](LICENSE)**. Anyone is free to download, use, fork, modify, and distribute this software without restriction.
