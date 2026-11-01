# Schengen Visa Calculator (90/180 Rule) 🇪🇺✈️

An open-source, privacy-first mobile-friendly web app and PWA for tracking and planning Schengen area stays according to the official **90 days within any 180-day period** rule (EU Regulation 2016/399).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ Features

- **Accurate 90/180 Calculation:** Full compliance with the official EU Schengen Border Code calculation logic.
- **Trip History Management:** Add, edit, and organize past and planned trips with date validation.
- **Next Trip Planner:** Calculate maximum allowable stay length for future dates or find the earliest date you can enter for a desired duration.
- **Visual Status & Timeline:** Clear indicators of remaining days, active 180-day windows, and overstay alerts.
- **Offline & Local-First:** All data is stored securely on your device with zero tracking.
- **Data Export & Import:** Backup and restore your trip records as JSON anytime.
- **Cross-Platform:** Works on mobile and desktop browsers as a PWA, ready for native packaging (Capacitor/Android APK).
- **Free Cloudflare Deployment:** Ready for one-click deployment on Cloudflare Pages.

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Lucide Icons
- **Storage:** Local-first IndexedDB / LocalStorage with persistent storage API
- **Deployment:** Cloudflare Pages
- **Mobile wrapper:** PWA / Capacitor

## 🌿 GitFlow Branching Model

This project follows GitFlow:
- `main` — Production-ready releases (tagged as `v1.0.0`, etc.)
- `develop` — Main development branch
- `feature/*` — Feature branches for new functionality
- `hotfix/*` — Urgent fixes for production

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm (v9 or newer)

### Installation

```bash
git clone https://github.com/Naykitin/schengen-visa-calculator.git
cd schengen-visa-calculator
npm install
```

### Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).
