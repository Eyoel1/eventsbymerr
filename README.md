# Muscle Coach PWA 🏋️‍♂️💪

A mobile-first Progressive Web App (PWA) that acts as a personal hypertrophy and muscle-building training coach. Built for a single user with **100% on-device local persistence** (no login, no cloud, no database server, no external AI API calls).

All coaching decisions — program generation, double progression overload, deload detection, plateau analysis, and reviews — are powered by a rule-based engine encoded in TypeScript.

---

## 🔥 Key Features

- **📱 Mobile-First PWA:** Installable directly to your home screen via Chrome/Safari for mid-workout gym logging. Fully offline capable with Service Worker caching.
- **🌱 Onboarding & Program Generation:** Multi-step wizard generating Phase 1 hypertrophy programs based on frequency, equipment access, and injury limitations.
- **⚡ Double Progression Overload Engine:** Automatically calculates suggested weights/reps per exercise based on previous session performance and RIR.
- **🔁 Mid-Workout Exercise Swapping:** Swap any exercise on-the-fly with 1 of 2–4 valid pre-tagged substitute exercises.
- **⚠️ Deload & Plateau Detection:** Rule-based triggers flagging accumulated fatigue or stalled exercises with micro-adjustment recommendations.
- **📊 Progress Hub:** Recharts bodyweight trend area charts, per-exercise strength progression graphs, photo gallery stored as Blobs in IndexedDB, and weekly streak tracking.
- **💾 100% Local Sovereignty & Backup:** IndexedDB persistence with single-click JSON Export/Restore.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Custom HSL Hues, Glassmorphic UI
- **Database:** IndexedDB via [Dexie.js](https://dexie.org/)
- **Charts & Animations:** Recharts, Framer Motion
- **Icons:** Lucide React

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```
