# Project: SkillRock Student Ambassador Program (SSAP) Revamp

## Architecture
- **System Overview**: Full-stack web application comprising a React + Vite + TypeScript + Tailwind CSS frontend and a Node.js + Express + TypeScript + Mongoose backend.
- **Visual Branding System**: Clean, modern, bright Google-inspired aesthetic derived from `geministudentambassador.com`. Features Google Sans typography, primary Gemini Blue (`#346BF1`), Google 4-color accents (`#EA4335`, `#FBBC04`, `#34A853`), pastel background tints (`#E8F0FE`, `#F4F7FB`, `#F8FAFC`), and rounded card surfaces (`rounded-2xl`, `rounded-[2rem]`).
- **Incentives System**: Pure digital incentives architecture eliminating all physical items (welcome kits, gift boxes, vouchers, stipends, merchandise). Centered around a verified 4-month digital completion certificate and an automated 4-tier digital badge progression: "The Explorer" (200 pts), "The Trailblazer" (600 pts), "The Changemaker" (1,200 pts), and "SkillRock Champ" (2,000+ pts).
- **Scoring & Leaderboard Engine**: Uncapped, event-driven competitive scoring model awarding activity points for campus workshops, peer mentorship, technical content, study jams, and hackathons. Dynamic ranking calculated in real time with tie-breaking logic, indexed queries, and flexible filtering by university, state, and badge tier.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Google-Inspired Design System | Google Sans typography, Gemini Blue (#346BF1), Google 4-color accents, rounded cards, clean bright palette | M2 | Survey / geministudentambassador.com |
| 2 | Student Leadership Messaging | 4-Persona leadership framework (Tech Explorer, Creative Thinker, Communicator, Impact Maker), peer learning & skill-building copy | M2 | R1 / Survey |
| 3 | Physical Rewards Elimination | Complete removal of welcome kits, gift boxes, swag, vouchers, referral stipends across pages, forms, and terms | M2 | R2 / Survey |
| 4 | Verified Digital Certificate | 4-month program completion digital certificate UI, criteria definition, verification ID lookup | M2, M1 | R2 / Survey |
| 5 | Tiered Digital Badges Definition | Badge system including "The Explorer" and "SkillRock Champ" with qualifying point thresholds and visual assets | M1, M3 | R2 / Survey |
| 6 | Uncapped Backend Scoring Engine | Event-driven points model removing the 1,600-point ceiling, tracking activity logs, calculating total points | M1 | R3 / Survey |
| 7 | Dynamic Leaderboard API | REST endpoints `GET /api/leaderboard`, `GET /api/leaderboard/stats`, `GET /api/leaderboard/:id` with sorting, search, filtering | M1 | R3 / Survey |
| 8 | Dynamic Leaderboard Frontend Page | Dedicated `/leaderboard` route, Top-3 podium, ranked searchable table, active tier badges, college/state filters | M3 | R3 / Survey |
| 9 | Homepage Leaderboard Preview | Compact interactive leaderboard preview on homepage with CTA to full leaderboard | M3 | R3 / Survey |
| 10 | Seed Data & Database Readiness | Realistic student ambassador seed script with Indian universities, diverse points, and badge distributions | M1 | M1 / Survey |
| 11 | Backend Automated Testing Suite | Jest/Supertest suite verifying scoring calculations, leaderboard ranking order, tie-breakers, and badge tiering | M1 | R3 / Survey |
| 12 | Opaque-Box E2E Testing Suite | Requirement-driven test harness and test cases covering Tiers 1-4 across all acceptance criteria | M4 | Dual Track / E2E Track |
| 13 | Adversarial Coverage Hardening | White-box stress tests, edge cases, and robustness hardening (Tier 5) | M5 | Project Pattern |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Backend Scoring, Leaderboard & Badges | Mongoose models (`Ambassador`, `ActivityLog`), uncapped scoring engine, dynamic leaderboard REST APIs, certificate verification, seed data, Jest unit tests | none | PLANNED |
| M2 | Frontend Visual Redesign & Physical Elimination | Tailwind config, Google Sans typography, Google palette, clean bright UI, 4-persona student leadership copy, complete elimination of physical perks, digital certificate showcase | none | PLANNED |
| M3 | Frontend Dynamic Leaderboard & Badges Integration | Dedicated `/leaderboard` page, Top-3 podium, dynamic table, badge filters, homepage preview, API client with resilient mock fallback, navbar route | M1, M2 | PLANNED |
| M4 | Requirement-Driven E2E Test Suite | E2E test harness and test cases (Tiers 1-4) covering visual design checks, reward elimination assertions, API responses, and leaderboard workflows; publishes `TEST_READY.md` | none | PLANNED |
| M5 | Final E2E Pass & Adversarial Hardening | Pass 100% of E2E test suite (Tiers 1-4), followed by adversarial Tier 5 stress testing with Challenger -> Worker -> Reviewer loop, final forensic audit | M1, M2, M3, M4 | PLANNED |

## Interface Contracts
### Backend ↔ Frontend API Contract

#### 1. `GET /api/leaderboard`
Query Parameters:
- `page`: integer (default: 1)
- `limit`: integer (default: 20)
- `search`: string (optional, searches name, college, city)
- `college`: string (optional filter)
- `badge`: string (optional filter: 'The Explorer', 'The Trailblazer', 'The Changemaker', 'SkillRock Champ')
- `sortBy`: 'points' | 'rank' | 'recent' (default: 'points')

Response (200 OK):
```json
{
  "success": true,
  "data": {
    "ambassadors": [
      {
        "id": "string",
        "rank": 1,
        "name": "string",
        "avatar": "string",
        "college": "string",
        "city": "string",
        "state": "string",
        "totalPoints": 2450,
        "badgeTier": "SkillRock Champ",
        "badges": ["The Explorer", "The Trailblazer", "The Changemaker", "SkillRock Champ"],
        "activitiesCount": 18,
        "recentActivity": "Hosted Campus AI Study Jam"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalAmbassadors": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### 2. `GET /api/leaderboard/stats`
Response (200 OK):
```json
{
  "success": true,
  "data": {
    "totalAmbassadors": 128,
    "totalPointsAwarded": 142500,
    "totalEventsHosted": 340,
    "topBadgeHolders": {
      "skillRockChamp": 14,
      "theChangemaker": 32,
      "theTrailblazer": 48,
      "theExplorer": 85
    }
  }
}
```

#### 3. `GET /api/certificates/verify/:certId`
Response (200 OK):
```json
{
  "success": true,
  "data": {
    "certificateId": "SSAP-2026-CERT-001",
    "ambassadorName": "string",
    "college": "string",
    "issueDate": "2026-04-15",
    "programDuration": "4 Months",
    "status": "VERIFIED",
    "tierAchieved": "SkillRock Champ",
    "totalPoints": 2450
  }
}
```

## Code Layout
### Backend (`backend/`)
- `src/models/Ambassador.ts`: Ambassador Mongoose model with points, rank, badges, tier.
- `src/models/ActivityLog.ts`: Activity events Mongoose model.
- `src/services/scoringService.ts`: Uncapped point calculation, rank computation, badge tier qualification.
- `src/controllers/leaderboardController.ts`: Controller handlers for leaderboard and stats.
- `src/routes/leaderboard.ts`: Mounted at `/api/leaderboard`.
- `src/routes/certificates.ts`: Mounted at `/api/certificates`.
- `src/config/seedLeaderboard.ts`: Seed script populating ambassadors.
- `src/tests/`: Jest test files (`leaderboard.test.ts`, `scoring.test.ts`).

### Frontend (`frontend/`)
- `tailwind.config.js`: Google-inspired theme tokens (`#346BF1`, Google accents, fonts).
- `src/index.css`: Google Sans font import, custom utility classes.
- `src/pages/HomePage.tsx`: Clean Google-inspired redesign, 4-persona leadership framework, digital incentives showcase, leaderboard preview.
- `src/pages/TermsPage.tsx`: Terms updated with digital incentive rules; zero physical perks.
- `src/pages/LeaderboardPage.tsx`: Dedicated full leaderboard view with podium, search, table.
- `src/components/leaderboard/TopPodium.tsx`: 1st, 2nd, 3rd place podium cards.
- `src/components/leaderboard/LeaderboardTable.tsx`: Responsive ranked table with badge pills.
- `src/components/rewards/CertificateCard.tsx`: 4-month verified digital certificate showcase.
- `src/components/rewards/BadgeShowcase.tsx`: Tiered digital badges display with criteria.
- `src/components/layout/Navbar.tsx`: Header navigation including Leaderboard link.
- `src/api/leaderboardApi.ts`: Frontend client calling `/api/leaderboard` with mock fallback.
