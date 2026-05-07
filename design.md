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

## 3. User Flow & Design Constraints

### 3.1 User Flow

```mermaid
flowchart TD
   Welcome[Welcome Dialog<br/>Explain time → points → rewards flow]
   Welcome -->|Close| HomeBase

   HomeBase[Home Screen, Base<br/>Select duration & points/minute]
   HomeBase -->|Start Focus Session| Timer

   Timer[Timer Screen<br/>View time remaining]
   Timer -->|End Session| PointsCalc

   PointsCalc[🎉 Points Earned!<br/>Celebration Overlay]
   PointsCalc -.->|auto-dismiss| HomeExtended

   HomeExtended[Home Screen, Extended<br/>View points, rewards & history]
   HomeExtended -->|Start Focus Session| Timer
   HomeExtended -->|Select Reward| Confirmation

   Confirmation[Reward Confirmation Modal]
   Confirmation -->|Confirm - Deduct Points| HomeExtended
   Confirmation -->|Cancel| HomeExtended
```

#### Notes
| Category | Details |
|----------|---------|
| **State** | All state lost on page close/reload. Points deducted on redemption. No backend storage. Client-side only. |
| **Welcome Dismissal** | Welcome dismissal is scoped to the current app session only. No cross-session persistence per Non-Goal #2. |
| **Screen States** | After the first focus session, the home screen expands to show points balance, reward catalog, and focus session history. Reward history appears after the first reward redemption. |
| **Rewards** | Rewards require points to redeem. Points deducted upon confirmation. Reward history updated after redemption. |
| **Affordability** | Checked at catalog display. Only affordable rewards selectable. No error screen needed. |
| **Reward History Bar** | Displayed inline on the home screen after first reward redemption as a row of tier-differentiated shapes. Hover (desktop) or tap (mobile) reveals redemption timestamp, tier, and points cost. Scoped to current app session only. |
| **Focus History List** | Focus session history for only the current app session. |
| **History Sections** | Reward History Bar and Focus History List are inline sections of the Home Extended screen, not separate navigable views or pages. |
| **Reward Confirmation** | Triggered when selecting an affordable reward from the inline reward catalog. Implemented as a confirmation modal overlay on the home screen. Confirming deducts points and returns to the home screen; canceling closes the modal with no changes. |
| **Points Cap Warning** | Persistent inline warning displayed near the "Start Focus Session" button on Home Screen (Base/Extended) when `pointsBalance >= POINTS_CAP`. No dismiss option; hidden automatically when points drop below `POINTS_CAP` (via reward redemption). Informs user they will earn 0 points for focus sessions while at cap. |
| **Navigation Away** | Navigating away from `/timer` during an active session (browser back/forward, manual URL change within the app) ends the session and awards points based on elapsed time, identical to the End Session button. No confirmation dialog. |
| **Points Celebration Overlay** | Center-screen congratulations card over a full-screen backdrop. Shows points earned with a celebratory animation (points counter + confetti). Auto-dismisses after ~3 seconds, revealing Home Extended. |

### 3.2 State Management
- All state held in memory via React Context + useReducer (§4.4)
- Lost on page close/reload — no persistence (localStorage, cookies, or server)

### 3.3 Design Constraints

**Architecture**
- Pure client-side SPA: no backend, no API calls, no database
- All state in memory; lost on page close/reload
- No authentication or user accounts
- Active focus session ends when user navigates away from `/timer` (SPA route transitions only); points calculated identically to manual end

**Platform & Browser Support**
- Target: modern Chromium, Firefox, WebKit (Safari) — latest major version
- No legacy browser support (IE11, older Safari)
- Deployed as static site to GitHub Pages

**Device & Responsiveness**
- Primary target: mobile (iPhone 12 viewport: 390×844)
- Responsive: single-column mobile layout → multi-column on wider screens
- Touch targets ≥44×44px per WCAG 2.1 AA

**Accessibility**
- WCAG 2.1 AA for all interactive components
- Validated via @axe-core/playwright only — no snapshot testing (§7.2)

**Testing Constraints**
- Red-green-refactor TDD for all feature work (§6.1)
- ~80% Tier 3 branch coverage; 100% user flow path coverage (§7.4)

## 4. Detailed Design

### 4.1 Screen Hierarchy

The app has two screens: **Home** and **Timer**.

**Home screen** contains:
- Onboarding explanation (shown on first load only of each app session)
- Session configuration (duration, points per minute, start action)
- Points display (hidden until first session)
- Reward catalog (three predefined tiers: Small / Medium / Large)
- Reward history bar (hidden until first redemption)
- Focus history list (hidden until first session)

**Timer screen** contains:
- Time remaining display with progress indicator
- End session action
- Redirects to Home when no active session; ending session on navigation away

### 4.2 Screen Section Responsibilities

| Section | Responsibility |
|---------|---------------|
| Onboarding explanation | Explains time→points→rewards flow. Shown once per app session; resets on reload. |
| Session configuration | Duration input, points numerator/denominator, start action, cap warning. Disabled during active session. |
| Points display | Shows current point balance. Hidden until first session. |
| Focus history | Expandable list of completed sessions for current app session; collapsed by default. Each entry shows elapsed minutes and points earned. |
| Reward history bar | Inline row of tier-differentiated shapes. Hidden until first redemption. Hover/tap reveals timestamp, tier, cost. Scoped to current session only. |
| Reward catalog | Lists three tiers with duration, cost, and example activities. Unaffordable rewards are disabled with "Need X more points" message. Selecting an affordable reward shows a confirmation step before deducting points. |
| Timer | Countdown timer with progress indicator. End action triggers points calculation. |
| Points celebration | Full-screen overlay showing points earned with celebratory animation. Auto-dismisses after a brief timeout. |

### 4.3 Data Concepts

**FocusSession**: elapsed minutes, points earned, timestamp

**RewardRedemption**: tier redeemed, points cost, timestamp

**App state**:
- points balance
- list of past focus sessions
- list of past reward redemptions
- last session's points earned (cleared after celebration dismissed)
- whether a focus session is currently active, with its start time
- session configuration: duration minutes, points numerator, points denominator
- whether the welcome onboarding has been dismissed this app session

**Constants**:
- Points cap: 10,000
- Default points rate: 1/20 per minute (numerator=1, denominator=20)
- Numerator range: 1–3
- Denominator range: 1–75
- Three reward tiers:

| Tier | Duration | Cost (points) | Example suggestions |
|------|----------|---------------|--------------------|
| Small | 5 min | 1 | Stretching, Get a snack, Walk around |
| Medium | 10 min | 2 | Walk outside, Quick workout, YouTube video |
| Large | 15 min | 3 | Watching half a TV show, Quick nap |

### 4.4 State Transitions

All state is held in memory and lost on page close/reload.

| Trigger | Effect |
|---------|--------|
| Dismiss welcome | Welcome no longer shown for remainder of app session |
| Change duration | Duration updated; ignored during active session |
| Change numerator | Points numerator updated; ignored during active session |
| Change denominator | Points denominator updated; ignored during active session |
| Start session | Session becomes active; start time recorded |
| End session | Points calculated from elapsed time (capped at 10,000 total balance), added to balance; session appended to history; session deactivated |
| Redeem reward | Points deducted if balance ≥ cost; redemption appended to history |
| Dismiss celebration | Clears last session points earned |

### 4.5 Screen Layouts

| Screen | Key Elements | Notes |
|--------|-------------|-------|
| Home (Base) | Duration input, points numerator/denominator, start action, cap warning | Shown before first session |
| Home (Extended) | Points balance, reward catalog, reward history bar, collapsible focus history | After first session |
| Timer | Full-screen, MM:SS countdown, progress indicator, end action | Redirects to Home when no active session |
| Points celebration | Full-screen backdrop, centered card with point total and congratulations | Overlaid on Home Extended; auto-dismisses |

### 4.6 Key Algorithms

**Points calculation:**
```
pointsPerMinute = numerator / denominator
pointsEarned = min(elapsedMinutes × pointsPerMinute, POINTS_CAP − currentBalance)
```
- No bonus for completing full duration
- No penalty for ending early
- Capped at 10,000 total points
- Maximum 3 points per minute (enforced by numerator ≤ 3 and denominator ≥ 1)

**Reward affordability check:**
```
isAffordable = currentBalance >= tierCost
```
- Unaffordable rewards are disabled with "Need X more points" message

### 4.7 Navigation

| View | Behavior |
|------|----------|
| Home | Default view; shows onboarding on first load of each app session |
| Timer | Active focus session only; navigating here when no session is active redirects to Home; navigating away from Timer during a session ends the session |

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
This section defines the testing strategy, tooling, scope, and validation criteria for PomoExchange, complementing the TDD methodology outlined in Section 6.1. All testing aligns with the project's Functional Requirements (Section 2.1), Non-Functional Requirements (Section 2.2).

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
- Points Celebration: shown vs dismissed

**User Flow Logic Path Coverage (100%)** — 9 enumerated paths in Section 3.1:
1. Welcome → HomeBase (initial load → dismiss → Home Screen Base)
2. HomeBase → Timer (start focus session → active Timer Screen)
3. Timer → EndSession (end session → calculate points)
4. EndSession → PointsCelebration → (auto-dismiss) → HomeExtended (points earned → Home Screen Extended)
5. HomeExtended → Timer (start new session → repeat flow)
6. HomeExtended → Reward Redemption → Confirm (select reward → confirm → return)
7. HomeExtended → Reward Redemption → Cancel (select reward → cancel → stay on HomeExtended)
8. Protected Route Redirect (direct `/timer` URL → redirect to `/`)
9. Points Cap Warning (`pointsBalance >= POINTS_CAP` → show inline warning)

**E2E Journey Coverage (100%)** — Single test validating full flow:
1. Welcome → dismiss → HomeBase
2. Start focus session → TimerScreen
3. End session → PointsCelebration overlay → auto-dismiss → HomeExtended
4. Redeem reward → confirm → points deducted
5. Repeat partial flow to verify state persistence

**Exclusions**: Third-party deps, type definitions, Tier 1/2 components.

### 7.5 Validation & QA
- Full test suite run + automated cross-browser validation (Chromium, Firefox, WebKit/Safari via Playwright)
- Regression: All tests re-run after each milestone; no new tests in M5
