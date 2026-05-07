# PomoExchange Design Document

## 1. Executive Summary

PomoExchange addresses the challenge of sustaining focus in a world with increasing distractions. Existing time management tools focus on tracking time blocks, but few provide immediate, tangible rewards for maintaining focus. This creates a gap between the traditional Pomodoro technique (25-minute focus + 5-minute break) and user motivation.

Unlike passive time-tracking apps, PomoExchange replaces the mandatory break structure and gamifies time blocking with optional earned rewards to turn passive breaks into earned reward activities. Users stay focused to earn points, which they can redeem for reward activities like quick walks or stretches.

PomoExchange intentionally defaults to a tighter focus-to-reward ratio than traditional Pomodoro (4:1 vs 3.33:1), encouraging more time spent focusing while providing flexibility on when to take breaks. Rather than mandating breaks, users choose when and how to spend their earned reward time.

## 2. Requirements & Goals

### 2.1 Functional Requirements

1. Onboarding
   - Explanation of app is the first thing user sees

2. Focus Session Management
   - User can begin and end a focus session
   - User can set the length of time for the focus session
   - User can end a focus session at any time (early or at completion)
   - Points are based purely on elapsed time — no penalty for ending early, no bonus for completing
   - This gives users flexibility for real-world interruptions without creating pressure to optimize around the timer

3. Points Calculation
  - User receives points when ending a focus session
  - Points formula: `points = elapsedMinutes * (pointsNumerator / pointsDenominator)`
  - Default: `pointsNumerator = 1`, `pointsDenominator = 20` (yields 0.05 points/minute)
  - User sets points per minute via two integer-only numeric inputs: numerator and denominator (pointsPerMinute = numerator / denominator)
  - `pointsNumerator` min=1, max=3; enforced via HTML input `min`/`max` attributes (no extra JS validation)
  - `pointsDenominator` min=1, max=75; enforced via HTML input `min`/`max` attributes (no extra JS validation)
  - `pointsNumerator` and `pointsDenominator` settings persist across focus sessions within the same app session
  - Points are capped at 10,000
  - If earning points would exceed the cap, the user receives points only up to 10,000
  - User is notified before starting a focus session when at cap

4. Reward System
   - Three predefined reward tiers:
   - Small: 5 minutes (suggestions: Stretching, Get a snack, Walk around)
   - Medium: 10 minutes (suggestions: Walk outside, Quick workout, YouTube video)
   - Large: 15 minutes (suggestions: Watching half a TV show, Quick nap)
   - Each tier displays suggested duration and example activities
   - User self-selects how to reward themselves within the chosen tier
   - Reward costs:
      - Small: 1 point (20 min focus at default rate)
      - Medium: 2 points (40 min focus at default rate)
      - Large: 3 points (60 min focus at default rate)
   - User can redeem a reward using earned points
   - Unaffordable rewards are disabled/grayed out with insufficient points message
   - Focus session history for the current app session is viewable through Home Screen after first focus session
   - Reward history for the current app session is visible on Home Screen after first reward redemption

5. Intentionally default to a 4:1 focus-to-reward ratio to encourage more time spent focusing than traditional Pomodoro. Comparisons are normalized to 100 minutes of focus (equivalent to 4 traditional Pomodoros):
   - Traditional Pomodoro: 4 × 25 min = 100 min focus. Breaks = 3 × 5 min short + 1 long break (15–30 min) = 30–45 min total break → ratio 3.33:1 to 2.22:1
   - PomoExchange: 100 min focus × 0.05 pts/min = 5 points = 25 min total reward time → ratio 4:1
   
   | Approach | Focus | Break | Ratio |
   |----------|-------|-------|-------|
   | Traditional Pomodoro (15-min long break) | 100 min | 30 min | 3.33:1 |
   | Traditional Pomodoro (30-min long break) | 100 min | 45 min | 2.22:1 |
   | PomoExchange | 100 min | 25 min | 4:1 |


### 2.2 Non-Functional Requirements

1. User Experience
   - UI should be minimal to prevent distractions during focus session
   - Animations should guide user through key actions
   - Timer should display time remaining during focus session
   - Accessibility: All interactive components meet WCAG 2.1 AA standards, validated via Playwright-only automated tests with no snapshot testing (Section 7.2)

2. Data Persistence
   - All state is lost on page close/reload

3. Motivation & Engagement
   - Reward history motivates users by visually displaying redeemed rewards
   - Focus session history provides transparency into user progress
   - Points system creates tangible incentive for focus

### 2.3 Goals

1. Gamify time blocking by replacing passive breaks with point-earned rewards
2. Create immediate, tangible rewards for maintaining focus
3. Bridge the gap between traditional Pomodoro technique and user motivation
4. Encourage sustained focus through tangible, self-selected reward incentives

### 2.4 Non-Goals
1. No user accounts or authentication — no login, no profiles, no multi-user support
2. No persistent storage — all state is scoped to a single browser session; no localStorage or server-side storage
3. No social features — no sharing, leaderboards, or community challenges
4. No custom rewards — reward tiers (Small, Medium, Large) are predefined and not user-configurable
5. No calendar integrations — no syncing with Google Calendar, Outlook, or other scheduling tools
6. No push notifications or reminders — the app does not prompt users to start sessions
7. No analytics or progress tracking across sessions — no dashboards, reports, or trend visualization
8. No offline support beyond a loaded page — the app requires an initial page load and internet connection

### 2.5 Definitions
1. App Session: The period from when a user loads the page in their browser until they close the tab or navigate away. All history (focus sessions and rewards) is scoped to a single app session and is lost when the session ends.

## 3. Architecture Overview

### 3.1 User Flow

```mermaid
flowchart TD
   %% Define styles
   classDef welcome fill:#1565c0,stroke:#1976d2,stroke-width:2px,color:#fff,text-align:left
   classDef homeBase fill:#616161,stroke:#9e9e9e,stroke-width:2px,color:#fff,text-align:left
   classDef timer fill:#e65100,stroke:#f57c00,stroke-width:2px,color:#fff,text-align:left
   classDef homeExtended fill:#2e7d32,stroke:#388e3c,stroke-width:2px,color:#fff,text-align:left
   classDef action fill:#f57f17,stroke:#f9a825,stroke-width:2px,color:#fff,text-align:left

   %% Welcome Dialog
   Welcome[Welcome Dialog<br/>Explain time→points→rewards flow]:::welcome
   Welcome -->|Close| HomeBase

   %% Home Screen - Base
   HomeBase[Home Screen - Base<br/>Select duration & points/minute]:::homeBase
   HomeBase -->|Start Focus Session| Timer

   %% Timer Screen
   Timer[Timer Screen<br/>View time remaining]:::timer
   Timer -->|End Session| EndSession

   %% End Session
   EndSession[End Session<br/>Calculate points based on elapsed time]:::action
   EndSession -->|Points Earned| HomeExtended

   %% Home Screen - Extended
   HomeExtended[Home Screen - Extended<br/>- View Points, Rewards & History<br/>- Configure Duration & Points/Minute<br/>- Inline Reward History Bar, Focus History List & Reward Catalog]:::homeExtended
   HomeExtended -->|Start Focus Session| Timer

```

#### Notes
| Category | Details |
|----------|---------|
| **State** | All state lost on page close/reload<br/>Points deducted on redemption<br/>No backend storage<br/>Client-side only |
| **Welcome Dismissal** | WelcomeDialog dismissal is scoped to the current app session only; no cross-session persistence per Non-Goal #2. |
| **Screen States** | HomeExtended includes all HomeBase functionality (duration and pointsPerMinute configuration) plus points display, reward catalog, and focus session history; reward history appears conditionally after the first reward redemption<br/>Home screen transitions from Base to Extended after first focus session |
| **Rewards** | Rewards require points to redeem<br/>Points deducted upon confirmation<br/>Reward history updated after redemption |
| **Affordability** | Checked at catalog display<br/>Only affordable rewards selectable<br/>No error screen needed |
| **Reward History Bar** | Displayed inline on Extended Home after first reward redemption as a row of tier-differentiated shapes: Small=triangle, Medium=square, Large=pentagon. Hover (desktop) or tap (mobile) reveals redemption timestamp, tier, and points cost. Scoped to current app session only. |
| **Focus History List** | Focus session history for only the current app session |
| **History Sections** | Reward History Bar and Focus History List are inline sections of the Home Extended screen, not separate navigable views or pages. |
| **Reward Confirmation** | Triggered when selecting an affordable reward from the inline Reward Catalog. Implemented as `RewardConfirmationModal` (modal overlay on Home Screen), not a separate screen. Confirming deducts points and returns to Home Extended; canceling closes modal with no changes. |
| **Points Cap Warning** | Persistent inline warning displayed near the "Start Focus Session" button on Home Screen (Base/Extended) when `pointsBalance >= 10000`. No dismiss option; hidden automatically when points drop below 10k (via reward redemption). Informs user they will earn 0 points for focus sessions while at cap. |
| **Route Guards** | `/timer` route is protected by `ProtectedRoute` wrapper. If user navigates to `/timer` when `!isSessionActive` (e.g., direct URL access, page reload), they are automatically redirected to `/` (Home Screen). |

> **Flow Path Reference**: The 9 enumerated paths above map to the "user flow logic path coverage" metric in Section 6.5/7.4.

### 3.2 Technical Stack

| Component | Technology | Version | Rationale |
|-----------|------------|---------|-----------|
| Frontend Framework | React | TBD | Latest stable with full TypeScript support |
| Routing | React Router | TBD | Declarative routing with type safety |
| State Management | Context + useReducer | TBD | Global state for points/focus sessions without external dependencies |
| Build Tool | Vite | TBD | Fast HMR, optimized for React |
| CSS Framework | Tailwind CSS | TBD | Utility-first, consistent styling |
| Language | TypeScript | TBD | Type safety, better IDE support |
| Testing | Vitest (Node + Browser Mode) | TBD | Fast, ESM-first, unit tests in Node, component/integration in real browsers |
| Deployment | GitHub Pages | - | Static hosting, free |

### 3.3 State Management Strategy
- Client-Only Application: All state is managed client-side without server storage
- Session State (persists within the current app session only): user-configured minutes for focus session, active session start time (for elapsed time calculation), points balance, pointsNumerator, pointsDenominator, reward history, focus session history
- No backend storage

### 3.4 Design Constraints
- Client-Only Application: No backend, no API calls
- No Authentication: No user accounts, no login required
- No Server-Side Validation: All validation is client-side

## 4. Detailed Design

### 4.1 Component Hierarchy

```
App
├── HomeScreen
│   ├── WelcomeDialog (conditional: shown on initial page load of each app session per Section 2.5)
│   ├── SessionConfig (duration input, points/minute selector)
│   ├── PointsDisplay
│   ├── FocusHistorySection
│   │   ├── FocusHistoryHeader (expand/collapse toggle)
│   │   └── FocusHistoryList (collapsible)
│   │       └── FocusSessionItem
│   ├── RewardHistoryBar
│   │   └── RewardShape
│   └── RewardCatalog
│       ├── RewardTierCard (Small, Medium, Large)
│       └── RewardConfirmationModal
└── ProtectedRoute
    └── TimerScreen
        ├── TimerDisplay
        └── EndSessionButton
```

### 4.2 Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `WelcomeDialog` | Shown once per app session (on initial page load of each app session per Section 2.5); explains time → points → rewards flow. Resets to un-dismissed on page reload/navigation away per Section 2.2 NFR #2 (no persistent storage). |
| `SessionConfig` | Duration input (minutes) and two integer-only numeric inputs for points numerator/denominator (side-by-side); inputs disabled during active session. Contains "Start Focus Session" button. Conditionally renders a persistent inline cap warning near the Start button when `state.pointsBalance >= 10000`: *"You've reached the 10,000 points cap! Focus sessions will earn 0 points until you redeem rewards."* |
| `PointsDisplay` | Shows current point balance; hidden until first session completed |
| `FocusHistorySection` | Expandable section for focus history; collapsed by default |
| `FocusHistoryHeader` | Shows section title and expand/collapse toggle |
| `FocusHistoryList` | Renders list of completed focus sessions for current app session; hidden when collapsed |
| `FocusSessionItem` | Single session entry showing elapsed minutes and points earned |
| `RewardHistoryBar` | Inline row of tier-differentiated shapes; hidden until first redemption |
| `RewardShape` | Triangle/square/pentagon; hover/tap reveals timestamp, tier, cost |
| `RewardCatalog` | Lists three tiers; disables unaffordable rewards |
| `RewardTierCard` | Displays tier name, duration, cost, example activities |
| `RewardConfirmationModal` | Shows cost and asks for confirmation before deducting points |
| `TimerScreen` | Displays countdown timer; handles session end |
| `TimerDisplay` | Large time-remaining display with visual progress indicator |
| `EndSessionButton` | Ends session early or at completion; triggers points calculation |
| `ProtectedRoute` | Wrapper component that reads `isSessionActive` from `AppStateContext`. If `true`, renders child component (`TimerScreen`). If `false`, redirects to `/` (Home Screen) via React Router `Navigate` component. |

### 4.3 Data Types

```typescript
type RewardTier = 'small' | 'medium' | 'large';

interface FocusSession {
  id: string;
  elapsedMinutes: number;
  pointsEarned: number;
  endedAt: Date;
}

interface RewardRedemption {
  id: string;
  tier: RewardTier;
  pointsCost: number;
  redeemedAt: Date;
}

interface AppState {
  pointsBalance: number;
  focusSessions: FocusSession[];
  rewardHistory: RewardRedemption[];
  isSessionActive: boolean;
  sessionStartTime: Date | null;
  sessionConfig: {
    durationMinutes: number;
    pointsNumerator: number;
    pointsDenominator: number;
  };
  welcomeDismissed: boolean;
}

const POINTS_CAP = 10000;
const DEFAULT_POINTS_NUMERATOR = 1;
const DEFAULT_POINTS_DENOMINATOR = 20; // Yields 0.05 points/minute (1/20)
const MAX_POINTS_PER_MINUTE = 3;

const REWARD_TIERS = {
  small:  { duration: 5,  cost: 1, suggestions: ['Stretching', 'Get a snack', 'Walk around'] },
  medium: { duration: 10, cost: 2, suggestions: ['Walk outside', 'Quick workout', 'YouTube video'] },
  large:  { duration: 15, cost: 3, suggestions: ['Watching half a TV show', 'Quick nap'] },
} as const;
```

### 4.4 State Management

**Context structure:**

```typescript
interface AppStateContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

type AppAction =
  | { type: 'DISMISS_WELCOME' }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_POINTS_NUMERATOR'; payload: number }
  | { type: 'SET_POINTS_DENOMINATOR'; payload: number }
  | { type: 'START_SESSION'; payload?: { startTime?: Date } }
  | { type: 'END_SESSION'; payload?: { endTime?: Date } }
  | { type: 'REDEEM_REWARD'; payload: { tier: RewardTier } };
```

**Initial state:**

```typescript
const initialState: AppState = {
  pointsBalance: 0,
  focusSessions: [],
  rewardHistory: [],
  isSessionActive: false,
  sessionStartTime: null,
  sessionConfig: {
    durationMinutes: 25,
    pointsNumerator: DEFAULT_POINTS_NUMERATOR,
    pointsDenominator: DEFAULT_POINTS_DENOMINATOR,
  },
  welcomeDismissed: false,
};
```

**Reducer cases:**
- `DISMISS_WELCOME`: Sets `welcomeDismissed: true` for the current app session; resets to false on page reload (new app session) due to no persistent storage (Section 2.4 Non-Goal #2).
- `SET_DURATION`: Updates `sessionConfig.durationMinutes`; ignored if `isSessionActive: true`
- `SET_POINTS_NUMERATOR`: Updates `sessionConfig.pointsNumerator` to payload (integer ≥1, clamped via HTML input min/max); ignored if `isSessionActive: true`
- `SET_POINTS_DENOMINATOR`: Updates `sessionConfig.pointsDenominator` to payload (integer ≥1, clamped via HTML input min/max); ignored if `isSessionActive: true`
- `START_SESSION`: Sets `isSessionActive: true`, `sessionStartTime: action.payload?.startTime ?? new Date()`
- `END_SESSION`: Extracts `endTime = action.payload?.endTime ?? new Date()`. Calculates `elapsedMinutes` as `(endTime.getTime() - state.sessionStartTime!.getTime()) / 60000` (retain fractional values, uses `calculateElapsedMinutes` helper from Section 4.6). Calculates `pointsPerMinute` as `state.sessionConfig.pointsNumerator / state.sessionConfig.pointsDenominator` (denominator ≥1 enforced by input min=1). Calculates `pointsEarned` as `elapsedMinutes * pointsPerMinute`, capped to ensure `state.pointsBalance + pointsEarned` does not exceed `POINTS_CAP` (10,000) per Section 2.1. Appends new `FocusSession` entry with `elapsedMinutes` set to the calculated value and `pointsEarned` set to the capped value. Sets `isSessionActive: false`, `sessionStartTime: null`. (Matches Section 4.6 algorithm)
- `REDEEM_REWARD`: Checks affordability, deducts points, appends to `rewardHistory`

### 4.5 Screen Layouts

**Home Screen (Base):**
- Centered vertically
- Duration input field
- Two integer-only numeric inputs: Points Numerator, Points Denominator (side-by-side)
- "Start Focus Session" button
- Persistent inline points cap warning (displayed near Start Focus Session button when pointsBalance >= 10000)

**Home Screen (Extended):**
- Points balance at top
- Duration and points numerator/denominator config (same as Base)
- "Start Focus Session" button
- Persistent inline points cap warning (displayed near Start Focus Session button when pointsBalance >= 10000)
- Reward history bar (conditional, after first redemption)
- Reward catalog section (responsive: 3-column grid on desktop, single column on mobile; suggestions shown on tap on mobile)
- Focus history list at bottom (collapsible, collapsed by default): shows each session's elapsed minutes and points earned

**Timer Screen:**
- Full-screen layout
- Large countdown timer (MM:SS)
- Visual progress ring or bar
- "End Session" button

### 4.6 Key Algorithms

**Points calculation:**
Derived `pointsPerMinute = state.sessionConfig.pointsNumerator / state.sessionConfig.pointsDenominator` (denominator ≥1 enforced by input min=1)
```
pointsEarned = min(elapsedMinutes * pointsPerMinute, POINTS_CAP - state.pointsBalance)
```
- No bonus for completing full duration
- No penalty for ending early
- Capped at 10,000 total points
- Maximum 3 points/minute enforced via numerator input max = 3 * denominator (HTML input attribute)

**Reward affordability check:**
```
isAffordable = state.pointsBalance >= REWARD_TIERS[tier].cost
```
- Unaffordable rewards are grayed out with "Need X more points" message

### 4.7 Routing

| Route | Component | Notes |
|-------|-----------|-------|
| `/` | HomeScreen | Default route; shows WelcomeDialog on initial page load of each app session per Section 2.5; dismissed state resets on page reload per Section 2.2 NFR #2 |
| `/timer` | ProtectedRoute → TimerScreen | Active focus session only; wrapped with `ProtectedRoute` that redirects to `/` if `!isSessionActive` |

## 5. Alternatives Considered
I evaluated the following alternatives to the chosen design and technical decisions, weighing tradeoffs against the project's stated goals (Section 2.3) and non-goals (Section 2.4).

### 5.1 Technical Stack Alternatives
| Decision Area | Alternative | Pros | Cons | Rejected Because |
|---------------|-------------|------|------|------------------|
| State Management | Zustand / Redux Toolkit | Scalable for large apps, built-in devtools | Overkill for small client-only state scope, adds external dependencies | Context + useReducer handles points, sessions, and rewards with no third-party libraries |
| CSS Framework | CSS Modules / styled-components | Scoped styles, no utility class learning curve | More boilerplate for responsive design, less consistent cross-component styling | Tailwind's utility-first approach supports rapid, minimal UI development |
| Build Tool | Create React App (CRA) | Familiar to many React developers | Deprecated, no longer maintained, slower HMR than Vite | Vite offers faster development experience and better ESM support |
| Deployment | Vercel / Netlify | Built-in CI/CD, additional deployment features | Requires account setup, GitHub Pages meets all static hosting needs | No need for extra features, GitHub Pages is free and integrated with the repo |

### 5.2 Product Design Alternatives
| Decision Area | Alternative | Pros | Cons | Rejected Because |
|---------------|-------------|------|------|------------------|
| State Persistence | localStorage for cross-session history | Users retain progress across page reloads/closes | Triggers privacy compliance requirements for persistent client-side storage, violates Non-Goal #2 (no persistent storage), adds session cleanup complexity | Avoids privacy compliance overhead; all state is explicitly scoped to a single app session |
| Reward Structure | User-customizable reward tiers | More personalization for end users | Violates Non-Goal #4, adds UI complexity for custom tier creation; without cross-session state persistence, users lose custom rewards on page reload and must re-specify them each app session | Predefined tiers simplify onboarding, align with "immediate tangible rewards" goal, and avoid forcing users to re-enter custom rewards every app session due to no persistent storage |
| Points System | Bonus points for full session completion, penalty for early end | Encourages completing 25-minute blocks | Creates timer optimization pressure, violates FR2 (flexibility for interruptions) | Linear points system prioritizes user flexibility over rigid session rules |
| Focus-to-Reward Ratio | Traditional Pomodoro 3.33:1 (100min focus / 30min break for 4 Pomodoros including long break) | Familiar to existing Pomodoro users | Passive mandatory breaks instead of earned rewards, less incentive for sustained focus | Project goal is to encourage longer focus sessions via 4:1 earned reward ratio |
| Authentication | Optional user accounts for cross-device sync | Cross-device progress tracking | Violates Non-Goal #1, requires backend/storage infrastructure | App is explicitly client-only with no backend or user accounts |
| Reward Redemption | No points deduction (unlimited redemptions) | Higher initial user engagement | Breaks earn-spend gamification loop, no incentive to earn more points | Points deduction is critical to the core gamification value proposition |

## 6. Implementation Plan

### 6.1 Approach
Red-green-refactor TDD for all feature work (M2-M4). Tests written alongside code, not deferred.
1. **Red**: Write failing unit/component tests for the target functionality first
2. **Green**: Implement minimal code to make tests pass
3. **Refactor**: Clean up code while keeping tests passing

### 6.2 Milestones
| Milestone | Description | Duration | Deps |
|-----------|-------------|----------|------|
| M1: Scaffolding & Test Setup | Init React Router + TS project, configure Tailwind + Vitest Browser Mode (Playwright), create folder structure per §4.1, define core types per §4.3 | 2-3d | None |
| M2: Core Focus Logic (TDD) | Reducer, TimerScreen, TimerDisplay, EndSessionButton, ProtectedRoute, SessionConfig | 4-5d | M1 |
| M3: Points & Reward System (TDD) | PointsDisplay, FocusHistorySection, RewardCatalog, TierCard, ConfirmationModal, RewardHistoryBar, RewardShape | 4-5d | M2 |
| M4: Onboarding & UI Polish (TDD) | WelcomeDialog, responsive layouts, animations | 3-4d | M3 |
| M5: Deployment & QA | Full suite pass, GitHub Pages deploy, cross-browser QA (Chromium/Firefox/WebKit) | 2-3d | M4 |

### 6.3 Build Phase Details

**M1: Scaffolding & Test Setup**
- Scaffold React Router + TypeScript project (uses Vite under the hood)
- Add Tailwind CSS, Vitest, `@vitest/browser` (Playwright provider), `@axe-core/playwright`
- Configure Vitest Browser Mode and coverage output
- Define `AppState`, `AppAction`, `FocusSession`, `RewardRedemption` (§4.3, 4.4)
- Create project folders
- Wire up npm scripts: unit tests (Node Mode), component/integration tests (Browser Mode)
- Smoke test: verify React renders + router works

**M2: Core Focus Session Logic (TDD)**
- Reducer tests (Node Mode)
- Component tests (Browser Mode)

**M3: Points & Reward System (TDD)**
- PointsDisplay, FocusHistorySection/FocusSessionItem rendering
- RewardCatalog affordability logic, RewardTierCard, RewardConfirmationModal points deduction
- RewardHistoryBar + RewardShape hover/tap interactions

**M4: Onboarding & UI Polish (TDD)**
- WelcomeDialog rendering + dismiss
- Responsive reward grid (3-col → 1-col), TimerScreen distraction-free layout, animations

**M5: Deployment & Final QA**
- Full suite pass, verify ~80% Tier 3 line/branch coverage, 100% user flow path coverage (§3.1)
- Configure GitHub Pages
- CI matrix (Chromium, Firefox, WebKit); no new tests written in M5

### 6.4 Dependencies & Risks
- Finalize stack versions before M1
- All state client-side (§2.4); no external state deps
- Validate Vitest Browser Mode + Playwright provider on target browsers
- Enforce red-green-refactor; no skipping tests for UI

### 6.5 Success Criteria
- TDD cycle followed for M2-M4
- All §2.1 FRs and §2.2 NFRs implemented and tested
- ~80% Tier 3 line/branch coverage; 100% user flow path coverage (verified in CI)
- Successful production build, no console errors
- Public GitHub Pages deployment passes QA
- No standalone testing phase

## 7. Testing
This section defines the testing strategy, tooling, scope, and validation criteria for PomoExchange, complementing the TDD methodology outlined in Section 6.1. All testing aligns with the project's Functional Requirements (Section 2.1), Non-Functional Requirements (Section 2.2), and Technical Stack (Section 3.2).

### 7.1 Testing Scope

| Tier | Criteria | Testing Approach | Examples |
|------|----------|------------------|----------|
| **Tier 1: Pure Presentational** | No logic, no interactions, no state | **No tests** | Static divs, simple icons |
| **Tier 2: Data Display** | Renders prop data, has `data-testid`/`aria-label`, no interactions | **Integration only** | `TimerDisplay`, `FocusSessionItem` |
| **Tier 3: Business Logic** | User interactions, conditional rendering, calculations, route protection | **Full testing** (unit + component + integration) | `RewardCatalog`, `SessionConfig`, reducer |

**Coverage impact**: Only Tier 3 code counts toward ~80% coverage target. Tier 1/2 excluded.

**State Reset Tests**: Explicitly excluded (Non-Goal #2). All state resets on reload by design.

**Timer drift** (background tab, system sleep, setInterval) explicitly excluded per user request.

### 7.2 Test Types

| Test Type | Target | Scope | File Location |
|-----------|--------|-------|---------------|
| Unit | Tier 3: Reducer, points calculation, affordability | Vitest Node Mode, no React rendering | `src/context/*.test.ts` |
| Component | Tier 3: UI components with business logic | Vitest Browser Mode, mocked context/router | `src/components/**/*.test.tsx` |
| Integration | Tier 2 + Tier 3: Multi-component flows, route protection | Vitest Browser Mode, full app state | `src/__tests__/` |
| E2E Journey | Full end-to-end user flow | Vitest Browser Mode + Playwright, full app state, no mocks except for timer mocks | `src/__tests__/e2e-full-journey.test.ts` |

**Cross-Browser Automation**: Vitest Browser Mode uses Playwright provider, configured to run integration/E2E tests across Chromium, Firefox, WebKit (Safari).

**Accessibility**: `@axe-core/playwright` exclusively, snapshot testing prohibited.

**Mobile**: iPhone 12 Viewport Size = width: 390, height: 844. WCAG 2.1 AA touch targets ≥44×44px.

**Deterministic Timing**: Unit tests use fixed payload times. Integration tests use timer mocks.

**Exclusive Scope Principle**: No behavior tested in both component and integration suites. Component tests = isolated single component + mocked deps. Integration tests = multi-component flows + full app state.

### 7.3 Test Configuration

- **TDD**: Tests written before implementation (red-green-refactor), enforced for M2-M4.
- **Files**: `src/context/*.test.ts` (unit), `src/components/**/*.test.tsx` (component), `src/__tests__/` (integration).
- **State Reset**: Performed before each test.
- **CI**: All suites run on push/PR via GitHub Actions with cross-browser matrix (Chromium, Firefox, WebKit) for integration/E2E tests. Coverage uploaded to Codecov.
- **Browsers**: Chromium, Firefox, WebKit/Safari via Playwright.

### 7.4 Coverage Requirements

**Tier 3 Branch Coverage (~80%)** — all decision point branches:
- Welcome Dialog: shown vs dismissed
- End Session: early vs full duration
- Points: under cap vs hits/exceeds cap
- Reward: affordable vs unaffordable
- Protected Route: active session vs redirect

**User Flow Logic Path Coverage (100%)** — 9 enumerated paths in Section 3.1:
1. Welcome → HomeBase (initial load → dismiss → Home Screen Base)
2. HomeBase → Timer (start focus session → active Timer Screen)
3. Timer → EndSession (end session → calculate points)
4. EndSession → HomeExtended (points earned → Home Screen Extended)
5. HomeExtended → Timer (start new session → repeat flow)
6. HomeExtended → Reward Redemption → Confirm (select reward → confirm → return)
7. HomeExtended → Reward Redemption → Cancel (select reward → cancel → stay on HomeExtended)
8. Protected Route Redirect (direct `/timer` URL → redirect to `/`)
9. Points Cap Warning (`pointsBalance >= 10000` → show inline warning)

**E2E Journey Coverage (100%)** — Single test validating full flow:
1. Welcome → dismiss → HomeBase
2. Start focus session → TimerScreen
3. End session → points calculated → HomeExtended
4. Redeem reward → confirm → points deducted
5. Repeat partial flow to verify state persistence

**Exclusions**: Third-party deps, type definitions, Tier 1/2 components.

### 7.5 Validation & QA
- Full test suite run + automated cross-browser validation (Chromium, Firefox, WebKit/Safari via Playwright)
- Regression: All tests re-run after each milestone; no new tests in M5
