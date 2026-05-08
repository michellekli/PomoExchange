# PomoExchange Architecture

## Scaffolding decisions

| Concern | Choice | Rationale |
|---|---|---|
| **State management** | React context + `useReducer` | App state is small and page-local; avoids external dependency |
| **Build pipeline** | [Vite](https://vitejs.dev/) via [React Router](https://reactrouter.com/) (v7 framework mode) | Fast HMR, file-convention routing, ESM-native dev server |
| **Testing** | [Vitest](https://vitest.dev/) (unit) + Vitest + [Playwright](https://playwright.dev/) (browser) | Single runner, same assertion API, real-browser E2E for WCAG validation |
| **Linting & formatting** | [Biome](https://biomejs.dev/) via Husky + lint-staged | Unified linter + formatter, faster than ESLint + Prettier, runs on pre-commit |
| **CI/CD** | GitHub Actions (`.github/workflows/`) | Lint + test on every push and PR; deploy to GitHub Pages on push to `main` |
| **Deploy config** | Vite `base: '/PomoExchange/'`, GitHub Actions via actions/deploy-pages | Required for GitHub Pages sub-path hosting; no server-side runtime |
| **README** | `README.md` | Project overview, quick start, command reference, conventions |
| **Boilerplate removal** | React Router template stripped down | Removed default React Router branding, unused assets; only keeps what the app needs |

> Design decisions (component hierarchy, state model, user flows) are documented in [`design.md`](./design.md).
