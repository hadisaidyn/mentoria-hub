# Mentoria Hub 🎓

> **Working MVP — Hackathon Round 1 (Mentoria "Working MVP Challenge")**

One platform that combines a **unified Educational Opportunity Catalog** with an
**asynchronous, self-paced Learning Platform** — so students in grades 8–11 can
discover competitions, scholarships and summer schools *and* keep learning, even
when they can't attend live classes.

**Core question answered:** _How can Mentoria use technology to make
opportunities and quality learning accessible to more students, even when they
can't attend live sessions?_

---

## ✨ Features

### Mandatory MVP
| Area | What's built |
| --- | --- |
| **Landing page** | Value prop, CTAs, "how it works", live recommendation preview |
| **Opportunity catalog** | 12 high-fidelity opportunities · live filters (direction, grade, format) · search · sort by match/deadline · **save/bookmark** · deadline countdowns · Apply |
| **Async courses** | 3 full courses · split-screen **course player** (syllabus tree + video placeholder + tabbed materials + interactive auto-graded **mini-quiz**) · animated **progress bars** |
| **Student dashboard** | Personalized greeting, level/XP, streak, enrolled-course progress, saved opportunities (quick-remove), **urgent deadlines** ticker, recommendations |
| **Recommendation engine** | Onboarding captures grade/country/interests/goals → weighted scoring ranks opportunities & courses |
| **Admin suite** | Real-time **CRUD** for opportunities & courses, **add lessons**, stats overview, student list — all without a rebuild |

### Bonus / "wow" features
- 🤖 **AI College Counselor** — profile-aware chat drawer that builds a prioritized roadmap
- 🏆 **Gamification** — XP, daily streaks, leaderboard with podium
- 🗺️ **Grade 9–12 Roadmap builder** — checkable milestone timeline (SAT windows, portfolio, rec letters)
- 🌍 **Trilingual** — English / Русский / Қазақша toggle
- 🌓 **Dark / light mode**
- ✈️ **Simulated Telegram webhook** — "Link Telegram bot" → toast demoing automated deadline alerts
- 📱 Fully responsive

---

## 🧱 Tech stack

- **Next.js 14** (App Router) · **React 18** · **TypeScript**
- **Tailwind CSS** (custom "Premium Academic Minimalist" design system)
- **Framer Motion** (transitions, micro-interactions)
- **lucide-react** (icons)
- **Client state**: React Context + `localStorage` persistence layer (`src/lib/store.tsx`) — mirrors a real DB schema so it's drop-in replaceable with Supabase/Postgres.

### What's mock vs real
- **Mock data**: opportunities & course content live in `src/lib/data.ts`. The admin panel mutates the live in-memory store (persisted to `localStorage`), proving the editable-content workflow.
- **Real & working**: all navigation, filtering, search, saving, enrollment, quiz grading, XP/streak logic, recommendations, i18n, theming, and admin CRUD.
- **Next step to productionize**: swap the `store` data source for Supabase (auth + Postgres) — the typed schema in `src/lib/types.ts` already matches.

---

## 🚀 Run locally

```bash
npm install
npm run dev        # http://localhost:3000
# build check:
npm run build
```

## 📁 Structure

```
src/
  app/
    page.tsx                # Landing
    catalog/                # Opportunity catalog + filters
    courses/                # Course list
    courses/[id]/           # Split-screen course player + quiz
    dashboard/              # Student cabinet (XP, saved, deadlines)
    roadmap/                # Grade 9–12 milestone builder
    leaderboard/            # Gamified ranking
    admin/                  # CRUD control suite
  components/               # Navbar, OnboardingModal, AICounselor, cards, Toaster…
  lib/
    store.tsx               # Global state + localStorage + XP/streak engine
    data.ts                 # High-fidelity mock data
    recommend.ts            # Scoring + simulated AI counselor
    i18n.tsx                # EN / RU / KK dictionaries
    types.ts                # Shared schema
```

## 🤝 AI usage disclosure
AI tooling was used to accelerate scaffolding and boilerplate. The product design,
feature set, recommendation logic, data model and UX decisions are our own — see
`PITCH.md` for the full breakdown.
