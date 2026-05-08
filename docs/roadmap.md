# PomoExchange Roadmap

Phased implementation plan with each phase delivering a working, tested slice of the app.

> **TDD:** Every step below follows test driven development. Write the tests for a component, then implement it. Only integration/E2E steps (1.6, 2.7, 3.4, 4.5) are post-hoc since they exercise the full phase.

---

## Phase 1: Core Focus Loop

Dependency order: state layer exists → components consume it.

| Step | Task | Depends On |
|------|------|------------|
| 1.1 | Build Welcome/Onboarding Dialog | — |
| 1.2 | Build Home Base screen | 1.1 |
| 1.3 | Build Timer screen | — |
| 1.4 | Build Points Celebration overlay | 1.2, 1.3 |
| 1.5 | Wire end-session flow | 1.2, 1.3, 1.4 |
| 1.6 | Write E2E browser test for full flow | 1.1–1.5 |

**Definition of done:**
- All unit + browser tests pass
- Welcome appears on first load, disappears on dismiss, doesn't reappear until reload
- Starting a session from Home navigates to Timer
- Timer shows countdown with progress indicator
- Ending session (early or full) shows celebration overlay
- Celebration overlay auto-dismisses after ~3s
- Direct `/timer` URL redirects to `/` when no active session

---

## Phase 2: Extended Home & Rewards

| Step | Task | Depends On |
|------|------|------------|
| 2.1 | Build points balance display | Phase 1 |
| 2.2 | Build reward catalog | — |
| 2.3 | Build reward confirmation modal | 2.2 |
| 2.4 | Build collapsible focus history list | — |
| 2.5 | Build reward history bar with tooltip | — |
| 2.6 | Integrate extended sections into Home screen | 2.1–2.5 |
| 2.7 | Write E2E browser test for redeem flow | 2.1–2.6 |

**Definition of done:**
- All unit + browser tests pass
- Points balance visible after first session
- Reward catalog shows Small/Medium/Large tiers; unaffordable ones disabled with "Need X more points" message
- Selecting affordable tier → confirmation modal → confirm deducts / cancel no-ops
- Reward history bar appears after first redemption; hover/tap reveals timestamp, tier, cost
- Focus history list expandable/collapsible, collapsed by default; shows elapsed minutes + points earned
- All extended sections hidden until their first trigger event

---

## Phase 3: Edge Cases & Navigation

| Step | Task | Depends On |
|------|------|------------|
| 3.1 | Build points cap warning component | Phase 2 |
| 3.2 | Integrate cap warning into Home screen | 3.1 |
| 3.3 | Implement navigation-away-from-timer → end session + award points | Phase 1 |
| 3.4 | Write tests for cap warning and navigation-away | 3.1–3.3 |

**Definition of done:**
- All unit + browser tests pass
- Cap warning shows inline near start button when balance ≥ 10,000
- Cap warning hides when balance drops below 10,000 (after redemption)
- Navigating away from `/timer` during active session ends session and awards points
- Celebration overlay fires with "0 points earned, at max cap" message when at cap

---

## Phase 4: Responsive & Accessibility

| Step | Task | Depends On |
|------|------|------------|
| 4.1 | Ensure single-column layout renders without overflow at 390×844 | Phase 3 |
| 4.2 | Add multi-column breakpoints | 4.1 |
| 4.3 | Ensure all touch targets ≥44×44px | 4.1 |
| 4.4 | Write automated axe accessibility tests | 4.1–4.3 |
| 4.5 | Fix violations until all axe tests pass | 4.4 |

**Definition of done:**
- All unit + browser tests pass
- Layout works at 390×844 with no overflow/horizontal scroll
- Multi-column layout activates at breakpoint for wider screens
- All buttons, inputs, links have ≥44×44px touch targets
- Automated axe checks pass on all interactive components (zero violations)
