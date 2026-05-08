import { createContext, type ReactNode, useContext, useReducer } from "react";
import { type AppAction, appReducer, createInitialState } from "./reducer";
import { type AppState } from "./types";

interface AppStateContextValue {
	state: AppState;
	dispatch: React.Dispatch<AppAction>;
}

const APP_STATE_CONTEXT = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({
	children,
	initialState: preloadedState,
}: {
	children: ReactNode;
	initialState?: Partial<AppState>;
}): React.ReactElement {
	const [state, dispatch] = useReducer(
		appReducer,
		(preloadedState as AppState) ?? undefined,
		(override?: AppState) => ({ ...createInitialState(), ...override }),
	);
	return (
		<APP_STATE_CONTEXT.Provider value={{ state, dispatch }}>
			{children}
		</APP_STATE_CONTEXT.Provider>
	);
}

export function useAppState(): AppState {
	const ctx = useContext(APP_STATE_CONTEXT);
	if (!ctx) {
		throw new Error("useAppState must be used within AppStateProvider");
	}
	return ctx.state;
}

export function useAppDispatch(): React.Dispatch<AppAction> {
	const ctx = useContext(APP_STATE_CONTEXT);
	if (!ctx) {
		throw new Error("useAppDispatch must be used within AppStateProvider");
	}
	return ctx.dispatch;
}
