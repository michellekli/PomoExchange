import { POINTS, POINTS_RATE, REWARD_TIERS, SESSION } from "./constants";
import {
	type AppState,
	type FocusSession,
	type RewardRedemption,
	type RewardTier,
} from "./types";

export function calculatePoints(
	elapsedMinutes: number,
	numerator: number,
	denominator: number,
	balance: number,
): number {
	// multiply first to keep precision before the single division
	const raw = (elapsedMinutes * numerator) / denominator;
	const capRemaining = Math.max(0, POINTS.CAP - balance);
	return Math.min(raw, capRemaining);
}

export type AppAction =
	| { type: "DISMISS_WELCOME" }
	| { type: "SET_DURATION"; durationMinutes: number }
	| { type: "SET_NUMERATOR"; numerator: number }
	| { type: "SET_DENOMINATOR"; denominator: number }
	| { type: "START_SESSION" }
	| { type: "END_SESSION"; elapsedMinutes: number }
	| { type: "REDEEM_REWARD"; tier: RewardTier }
	| { type: "DISMISS_CELEBRATION" };

export function createInitialState(): AppState {
	return {
		pointsBalance: 0,
		pastSessions: [],
		pastRedemptions: [],
		lastSessionPoints: null,
		isSessionActive: false,
		sessionStartTime: null,
		durationMinutes: SESSION.DURATION.DEFAULT,
		pointsNumerator: POINTS_RATE.NUMERATOR.DEFAULT,
		pointsDenominator: POINTS_RATE.DENOMINATOR.DEFAULT,
		welcomeDismissed: false,
	};
}

export function appReducer(state: AppState, action: AppAction): AppState {
	switch (action.type) {
		case "DISMISS_WELCOME":
			return { ...state, welcomeDismissed: true };

		case "SET_DURATION":
			if (state.isSessionActive) {
				return state;
			}
			return { ...state, durationMinutes: action.durationMinutes };

		case "SET_NUMERATOR":
			if (state.isSessionActive) {
				return state;
			}
			return { ...state, pointsNumerator: action.numerator };

		case "SET_DENOMINATOR":
			if (state.isSessionActive) {
				return state;
			}
			return { ...state, pointsDenominator: action.denominator };

		case "START_SESSION":
			return {
				...state,
				isSessionActive: true,
				sessionStartTime: Date.now(),
			};

		case "END_SESSION": {
			const pointsEarned = calculatePoints(
				action.elapsedMinutes,
				state.pointsNumerator,
				state.pointsDenominator,
				state.pointsBalance,
			);
			const session: FocusSession = {
				elapsedMinutes: action.elapsedMinutes,
				pointsEarned,
				timestamp: Date.now(),
			};
			return {
				...state,
				pointsBalance: Math.min(state.pointsBalance + pointsEarned, POINTS.CAP),
				pastSessions: [...state.pastSessions, session],
				isSessionActive: false,
				sessionStartTime: null,
				lastSessionPoints: pointsEarned,
			};
		}

		case "REDEEM_REWARD": {
			const tierInfo = REWARD_TIERS.find((t) => t.tier === action.tier);
			if (!tierInfo || state.pointsBalance < tierInfo.cost) {
				return state;
			}
			const redemption: RewardRedemption = {
				tier: action.tier,
				pointsCost: tierInfo.cost,
				timestamp: Date.now(),
			};
			return {
				...state,
				pointsBalance: state.pointsBalance - tierInfo.cost,
				pastRedemptions: [...state.pastRedemptions, redemption],
			};
		}

		case "DISMISS_CELEBRATION":
			return { ...state, lastSessionPoints: null };

		default:
			return state;
	}
}
