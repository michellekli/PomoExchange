export type RewardTier = 'small' | 'medium' | 'large'

export interface FocusSession {
  elapsedMinutes: number
  pointsEarned: number
  timestamp: number
}

export interface RewardRedemption {
  tier: RewardTier
  pointsCost: number
  timestamp: number
}

export interface RewardTierInfo {
  tier: RewardTier
  label: string
  durationMinutes: number
  cost: number
  suggestions: string[]
}

export interface AppState {
  pointsBalance: number
  pastSessions: FocusSession[]
  pastRedemptions: RewardRedemption[]
  lastSessionPoints: number | null
  isSessionActive: boolean
  sessionStartTime: number | null
  durationMinutes: number
  pointsNumerator: number
  pointsDenominator: number
  welcomeDismissed: boolean
}
