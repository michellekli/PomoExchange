import { describe, it, expect } from 'vitest'
import { appReducer, createInitialState, calculatePoints } from './reducer'
import { POINTS, POINTS_RATE, SESSION } from './constants'
import type { AppState, RewardTier } from './types'

function buildState(overrides: Partial<AppState> = {}): AppState {
  return { ...createInitialState(), ...overrides }
}

describe('calculatePoints', () => {
  it('returns elapsed * numerator / denominator when under cap', () => {
    const elapsedMinutes = 20
    const numerator = 1
    const denominator = 20
    const balance = 0
    expect(calculatePoints(elapsedMinutes, numerator, denominator, balance)).toBe(1)
  })

  it('returns capRemaining when raw would exceed cap', () => {
    const elapsedMinutes = 10
    const numerator = 3
    const denominator = 1
    const balance = POINTS.CAP - 5
    expect(calculatePoints(elapsedMinutes, numerator, denominator, balance)).toBe(5)
  })

  it('returns 0 when balance is already at cap', () => {
    const elapsedMinutes = 1
    const numerator = 1
    const denominator = 1
    const balance = POINTS.CAP
    expect(calculatePoints(elapsedMinutes, numerator, denominator, balance)).toBe(0)
  })

  it('returns 0 for 0 elapsed minutes', () => {
    const elapsedMinutes = 0
    const numerator = 1
    const denominator = 20
    const balance = 0
    expect(calculatePoints(elapsedMinutes, numerator, denominator, balance)).toBe(0)
  })

  it('handles fractional rates correctly', () => {
    const elapsedMinutes = 1
    const numerator = 1
    const denominator = 20
    const balance = 0
    expect(calculatePoints(elapsedMinutes, numerator, denominator, balance)).toBe(0.05)
  })
})

describe('createInitialState', () => {
  it('returns defaults matching constants', () => {
    const state = createInitialState()
    expect(state).toEqual({
      pointsBalance: 0,
      pastSessions: [],
      pastRedemptions: [],
      lastSessionPoints: null,
      isSessionActive: false,
      sessionStartTime: null,
      durationMinutes: SESSION.DEFAULT_DURATION_MINUTES,
      pointsNumerator: POINTS_RATE.NUMERATOR.DEFAULT,
      pointsDenominator: POINTS_RATE.DENOMINATOR.DEFAULT,
      welcomeDismissed: false,
    })
  })
})

describe('appReducer', () => {
  describe('DISMISS_WELCOME', () => {
    it('sets welcomeDismissed to true', () => {
      const state = buildState({ welcomeDismissed: false })
      const next = appReducer(state, { type: 'DISMISS_WELCOME' })
      expect(next.welcomeDismissed).toBe(true)
    })
  })

  describe('SET_DURATION', () => {
    it('updates durationMinutes when session is not active', () => {
      const state = buildState({ durationMinutes: 25 })
      const next = appReducer(state, { type: 'SET_DURATION', durationMinutes: 30 })
      expect(next.durationMinutes).toBe(30)
    })

    it('returns state unchanged when session is active', () => {
      const state = buildState({ isSessionActive: true, durationMinutes: 25 })
      const next = appReducer(state, { type: 'SET_DURATION', durationMinutes: 30 })
      expect(next.durationMinutes).toBe(25)
      expect(next).toBe(state)
    })
  })

  describe('SET_NUMERATOR', () => {
    it('updates numerator when session is not active', () => {
      const state = buildState({ pointsNumerator:1 })
      const next = appReducer(state, { type: 'SET_NUMERATOR', numerator: 3 })
      expect(next.pointsNumerator).toBe(3)
    })

    it('ignored when session is active', () => {
      const state = buildState({ isSessionActive: true, pointsNumerator: 1 })
      const next = appReducer(state, { type: 'SET_NUMERATOR', numerator: 3 })
      expect(next.pointsNumerator).toBe(1)
      expect(next).toBe(state)
    })
  })

  describe('SET_DENOMINATOR', () => {
    it('updates denominator when session is not active', () => {
      const state = buildState({ pointsDenominator: 1 })
      const next = appReducer(state, { type: 'SET_DENOMINATOR', denominator: 30 })
      expect(next.pointsDenominator).toBe(30)
    })

    it('ignored when session is active', () => {
      const state = buildState({ isSessionActive: true, pointsDenominator: 20 })
      const next = appReducer(state, { type: 'SET_DENOMINATOR', denominator: 30 })
      expect(next.pointsDenominator).toBe(20)
      expect(next).toBe(state)
    })
  })

  describe('START_SESSION', () => {
    it('activates session and records start time', () => {
      const state = buildState({ isSessionActive: false, sessionStartTime: null })
      const next = appReducer(state, { type: 'START_SESSION' })
      expect(next.isSessionActive).toBe(true)
      expect(next.sessionStartTime).toBeGreaterThan(0)
    })
  })

  describe('END_SESSION', () => {
    it('calculates points, adds to balance, appends session to history', () => {
      const state = buildState({ pointsNumerator: 1, pointsDenominator: 20, pointsBalance: 0, pastSessions: [] })
      const next = appReducer(state, { type: 'END_SESSION', elapsedMinutes: 20 })
      expect(next.pointsBalance).toBeCloseTo(1)
      expect(next.pastSessions).toHaveLength(1)
      expect(next.pastSessions[0].elapsedMinutes).toBe(20)
      expect(next.pastSessions[0].pointsEarned).toBeCloseTo(1)
    })

    it('caps at POINTS.CAP when near limit', () => {
      const state = buildState({ pointsBalance: POINTS.CAP - 1, pointsNumerator: 3, pointsDenominator: 1 })
      const next = appReducer(state, { type: 'END_SESSION', elapsedMinutes: 10 })
      expect(next.pointsBalance).toBe(POINTS.CAP)
      expect(next.pastSessions[0].pointsEarned).toBe(1)
    })

    it('earns 0 when already at cap', () => {
      const state = buildState({ pointsBalance: POINTS.CAP })
      const next = appReducer(state, { type: 'END_SESSION', elapsedMinutes: 10 })
      expect(next.pointsBalance).toBe(POINTS.CAP)
      expect(next.pastSessions[0].pointsEarned).toBe(0)
    })

    it('deactivates session and clears start time', () => {
      const state = buildState({ isSessionActive: true, sessionStartTime: 999 })
      const next = appReducer(state, { type: 'END_SESSION', elapsedMinutes: 10 })
      expect(next.isSessionActive).toBe(false)
      expect(next.sessionStartTime).toBeNull()
    })

    it('sets lastSessionPoints to earned amount', () => {
      const state = buildState({ pointsNumerator: 1, pointsDenominator: 20, lastSessionPoints: null })
      const next = appReducer(state, { type: 'END_SESSION', elapsedMinutes: 20 })
      expect(next.lastSessionPoints).toBeCloseTo(1)
    })

    it('accumulates multiple sessions', () => {
      const state = buildState({ pointsNumerator: 1, pointsDenominator: 20, pointsBalance: 0, pastSessions: [] })
      const first = appReducer(state, { type: 'END_SESSION', elapsedMinutes: 20 })
      const second = appReducer(first, { type: 'END_SESSION', elapsedMinutes: 40 })
      expect(second.pastSessions).toHaveLength(2)
      expect(second.pointsBalance).toBeCloseTo(3)
    })
  })

  describe('REDEEM_REWARD', () => {
    it('deducts points and appends redemption when affordable', () => {
      const state = buildState({ pointsBalance: 5, pastRedemptions: [] })
      const next = appReducer(state, { type: 'REDEEM_REWARD', tier: 'small' })
      expect(next.pointsBalance).toBe(4)
      expect(next.pastRedemptions).toHaveLength(1)
      expect(next.pastRedemptions[0].tier).toBe('small')
      expect(next.pastRedemptions[0].pointsCost).toBe(1)
    })

    it('no-op when points are insufficient', () => {
      const state = buildState({ pointsBalance: 0, pastRedemptions: [] })
      const next = appReducer(state, { type: 'REDEEM_REWARD', tier: 'medium' })
      expect(next).toBe(state)
    })

    it('no-op for unknown tier', () => {
      const state = buildState({ pointsBalance: 5, pastRedemptions: [] })
      const next = appReducer(state, { type: 'REDEEM_REWARD', tier: 'nonexistent' as RewardTier })
      expect(next).toBe(state)
    })
  })

  describe('DISMISS_CELEBRATION', () => {
    it('clears lastSessionPoints', () => {
      const state = buildState({ lastSessionPoints: 2.5 })
      const next = appReducer(state, { type: 'DISMISS_CELEBRATION' })
      expect(next.lastSessionPoints).toBeNull()
    })
  })

  describe('unknown action', () => {
    it('returns state unchanged', () => {
      const state = buildState()
      // @ts-expect-error
      const next = appReducer(state, { type: 'UNKNOWN' })
      expect(next).toEqual(state)
    })
  })
})
