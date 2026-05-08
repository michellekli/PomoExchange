import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { AppState } from './types'
import { appReducer, createInitialState, type AppAction } from './reducer'

interface AppStateContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, createInitialState)
  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx.state
}

export function useAppDispatch() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppDispatch must be used within AppStateProvider')
  return ctx.dispatch
}
