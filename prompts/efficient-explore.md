# Exploring the codebase
1. First, check `components.json` and `app-xml/` — it mirrors the `app/` directory structure. Each file (e.g. `app-xml/app/routes/home.tsx.xml`) declares the corresponding implementation file's Structure (exported functions, their args/return types, and internal calls), Uses (imported components with sources like `~/components/ui/dialog`), Consumes (context hooks like `useAppState` from `~/state/provider`), Types (interfaces/type aliases), and Constants.
2. Start with `app-xml/app/routes.xml` to see the route tree, then find the route's `.xml` to learn what it uses. Follow the `Uses` imports to find dependent components/hooks/state files and their `.xml` mirrors.
3. Use the XML's `<Call name="..." from="..." />` entries to understand function dependencies, and `<Component name="..." from="..." />` to identify what UI primitives a module expects.
4. Only search the broader `app/` source tree if the relevant context isn't documented in `app-xml/`.
