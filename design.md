# PomoExchange Design Document

## 1. Executive Summary

PomoExchange addresses the challenge of sustaining focus in a world with increasing distractions. Existing time management tools focus on tracking time blocks, but few provide immediate, tangible rewards for maintaining focus. This creates a gap between the traditional Pomodoro technique (25-minute focus + 5-minute break) and user motivation.

Unlike passive time-tracking apps, PomoExchange replaces the passive break with earned rewards to turn passive breaks into earned reward activities.

PomoExchange gamifies time blocking by replacing the traditional break with point-earned rewards. Users stay focused to earn points, which they can redeem for reward activities like quick walks or stretches.

PomoExchange intentionally defaults to a tighter focus-to-reward ratio than traditional Pomodoro (4:1 vs 3.33:1), encouraging sustained focus beyond the standard 25-minute blocks. Rather than mandating breaks, users choose when and how to spend their earned reward time.

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
   - Points formula: `points = time_elapsed_minutes * points_per_minute`
   - Default points_per_minute = 0.05
   - User can set the number of points earned per minute elapsed
   - The points_per_minute setting persists across focus sessions within the same app session
   - Points are capped at 10,000
   - If earning points would exceed the cap, the user receives points only up to 10,000
   - User is notified before starting a focus session when at cap

4. Reward System
   - Three predefined reward tiers:
     - Small: 5 minutes (suggestions: stretching, getting a snack, getting up and walking around)
     - Medium: 10 minutes (suggestions: walking outside, a quick workout, a short YouTube video)
     - Large: 15 minutes (suggestions: watching half a TV show, a quick nap)
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

5. Intentionally default to a 4:1 focus-to-reward ratio to encourage sustained focus beyond traditional Pomodoro. Comparisons are normalized to 100 minutes of focus (equivalent to 4 traditional Pomodoros):
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

### 2.4 Definitions
1. App Session: The period from when a user loads the page in their browser until they close the tab or navigate away. All history (focus sessions and rewards) is scoped to a single app session and is lost when the session ends.

## 3. Architecture Overview

### 3.1 User Flow

```mermaid
flowchart TD
   %% Define styles
   classDef welcome fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
   classDef homeBase fill:#f5f5f5,stroke:#424242,stroke-width:2px
   classDef timer fill:#fff3e0,stroke:#f57c00,stroke-width:2px
   classDef homeExtended fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
   classDef action fill:#ffeb3b,stroke:#f9a825,stroke-width:2px

   %% Welcome Dialog
   Welcome[Welcome Dialog<br/>Explain time→points→rewards flow]:::welcome
   Welcome -->|Close| HomeBase

   %% Home Screen - Base
   HomeBase[Home Screen - Base<br/>Select duration & Points/Minute]:::homeBase
   HomeBase -->|Start Focus Session| Timer

   %% Timer Screen
   Timer[Timer Screen<br/>View time remaining]:::timer
   Timer -->|End Session| EndSession

   %% End Session
   EndSession[End Session<br/>Calculate points based on elapsed time]:::action
    EndSession -->|Points Earned| HomeExtended

   %% Home Screen - Extended
   HomeExtended[Home Screen - Extended<br/>View Points, Rewards & History<br/>Configure Duration & Points/Minute]:::homeExtended
   HomeExtended -->|Start Focus Session| Timer
   HomeExtended -->|View Available Rewards| RewardSelection

   %% Reward Selection Path
   RewardSelection[Select Reward from Catalog]:::action
   RewardSelection -->|Browse Catalog| RewardCatalog

   %% Reward Catalog
   RewardCatalog[Reward Catalog<br/>Small 1pt 5 min: stretch, snack, walk<br/>Medium 2pt 10 min: longer walk, workout, YouTube<br/>Large 3pt 15 min: TV show, nap<br/>Only affordable rewards selectable]:::homeExtended
   RewardCatalog -->|Choose Reward| RewardRedemption
   RewardCatalog -->|Back to Home| HomeExtended

   %% Reward Redemption Path
   RewardRedemption[Reward Redemption<br/>Proceed to Confirmation]:::action
   RewardRedemption -->|Confirm Points Deduction| RewardConfirmation

   %% Reward Confirmation Path
   RewardConfirmation[Reward Confirmation<br/>Deduct points & complete redemption]:::action
   RewardConfirmation -->|Deduct Points| HomeExtended

   %% Reward History
   HomeExtended -.->|Inline shape collection| RewardHistory
   HomeExtended -.->|View Focus History| FocusHistory

   %% Reward History
   RewardHistory[Reward History<br/>Tier-differentiated shapes (Small=triangle, Medium=square, Large=pentagon); hover/touch reveals redemption time, tier, cost]:::homeExtended

   %% Focus History
   FocusHistory[Focus History<br/>List completed focus sessions]:::homeExtended
   FocusHistory -->|View Details| FocusDetail
   FocusDetail[Focus Detail<br/>Show duration & points earned]:::homeExtended

```

#### Notes
| Category | Details |
|----------|---------|
| **State** | All state lost on page close/reload<br/>Points deducted on redemption<br/>No backend storage<br/>Client-side only |
| **Screen States** | HomeExtended includes all HomeBase functionality (duration and points_per_minute configuration) plus points display, reward catalog, and session history<br/>Home screen transitions from Base to Extended after first focus session |
| **Rewards** | Rewards require points to redeem<br/>Points deducted upon confirmation<br/>Reward history updated after redemption |
| **Affordability** | Checked at catalog display<br/>Only affordable rewards selectable<br/>No error screen needed |
| **Reward History** | Displayed inline on Extended Home after first reward redemption as a row of tier-differentiated shapes: Small=triangle, Medium=square, Large=pentagon. Hover (desktop) or tap (mobile) reveals redemption timestamp, tier, and points cost. Scoped to current app session only. |
| **Focus History** | Focus session history for only the current app session |

### 3.2 Technical Stack

| Component | Technology | Version | Rationale |
|-----------|------------|---------|-----------|
| Frontend Framework | React | TBD | Latest stable with full TypeScript support |
| Routing | React Router | TBD | Declarative routing with type safety |
| State Management | Context + useReducer | TBD | Global state for points/focus sessions without external dependencies |
| Build Tool | Vite | TBD | Fast HMR, optimized for React |
| CSS Framework | Tailwind CSS | TBD | Utility-first, consistent styling |
| Language | TypeScript | TBD | Type safety, better IDE support |
| Testing | Vitest | TBD | Fast, ESM-first, React integration |
| Deployment | GitHub Pages | - | Static hosting, free |

### 3.3 State Management Strategy
- Client-Only Application: All state is managed client-side without server storage
- Session State: User-configured minutes for focus session, minutes spent focusing (for current focus session), points balance, points earned per minute (persists within the current app session), reward history (for current app session only), focus session history (for current app session only)
- No backend storage

### 3.4 Design Constraints
- Client-Only Application: No backend, no API calls
- No Authentication: No user accounts, no login required
- No Server-Side Validation: All validation is client-side

