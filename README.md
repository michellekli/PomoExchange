[![codecov](https://codecov.io/github/michellekli/PomoExchange/graph/badge.svg?token=PGHQ233HH8)](https://codecov.io/github/michellekli/PomoExchange)

# PomoExchange

Stay focused, earn breaks. PomoExchange replaces traditional Pomodoro's mandatory breaks with an earned reward system. Every minute you focus earns points to redeem activities you actually enjoy (a walk, a YouTube video, etc.).

No accounts. No backend. No persistence. Just a timer and a reason to stay focused.

## Quick start

Visit [PomoExchange](https://michellekli.github.io/PomoExchange/) to start using it immediately.
 
## How it works

1. **Configure:** Set your focus duration (default 25 min) and points rate (default 0.05 pts/min).
2. **Focus:** Start the timer and work until you're done. End early for pro-rated points if life happens.
3. **Earn:** Points earned = elapsed minutes * points per minute. A 25-minute session at default rate earns ~1.25 points.
4. **Redeem:** Spend points on one of three reward tiers.

   | Tier | Recommended Break | Cost | Examples |
   |---|---|---|---|
   | Small | 5 min | 1 pt | Stretch, grab a snack |
   | Medium | 10 min | 2 pts | Walk outside, watch a short video |
   | Large | 15 min | 3 pts | Half a TV show, quick nap |

5. **Repeat:** Track your balance, focus history, and reward history on the home screen. All data resets on page close.

## Development

**Prerequisites:** [Node.js](https://nodejs.org/) (LTS recommended)

```bash
npm install
npm run dev
```

Key scaffolding decisions (state management, build pipeline, testing, linting, CI/CD) are documented in [`architecture.md`](./architecture.md).

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally (Vite) |
| `npm run check` | Lint and format files (Biome) |
| `npm run test:run` | Run unit tests |
| `npm run test:browser:run` | Run browser tests (headless) |
| `npm run test:all` | Run both unit and browser tests |

### Project conventions

- **Linting & formatting:** [Biome](https://biomejs.dev/), run `npm run check` to fix issues automatically before committing.
- **Pre-commit hooks:** [Husky](https://typicode.github.io/husky/), runs lint-staged (Biome on staged files) and the full test suite on every commit. Ensure all tests pass before pushing.
- **Testing:** Unit tests use [Vitest](https://vitest.dev/); browser tests use Vitest + Playwright.

## License

[Apache License 2.0](./LICENSE)