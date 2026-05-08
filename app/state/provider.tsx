import { createContext, type ReactNode, useContext, useReducer } from "react";
import { type AppAction, appReducer, createInitialState } from "./reducer";
import type { AppState } from "./types";

interface AppStateContextValue {
	state: AppState;
	dispatch: React.Dispatch<AppAction>;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(
		appReducer,
		undefined,
		createInitialState,
	);
	return (
		<AppStateContext.Provider value={{ state, dispatch }}>
			{children}
		</AppStateContext.Provider>
	);
}

export function useAppState() {
	const ctx = useContext(AppStateContext);
	if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
	return ctx.state;
}

export function useAppDispatch() {
	const ctx = useContext(AppStateContext);
	if (!ctx)
		throw new Error("useAppDispatch must be used within AppStateProvider");
	return ctx.dispatch;
}
