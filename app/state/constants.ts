import { type RewardTierInfo } from "./types";

export const POINTS = {
	CAP: 10_000,
} as const;

export const POINTS_RATE = {
	NUMERATOR: {
		DEFAULT: 1,
		MIN: 1,
		MAX: 3,
	},
	DENOMINATOR: {
		DEFAULT: 20,
		MIN: 1,
		MAX: 75,
	},
} as const;

export const SESSION = {
	DURATION: {
		DEFAULT: 25,
		MIN: 1,
		MAX: 75,
	},
} as const;

export const REWARD_TIERS: RewardTierInfo[] = [
	{
		tier: "small",
		label: "Small",
		durationMinutes: 5,
		cost: 1,
		suggestions: ["Stretching", "Get a snack", "Walk around"],
	},
	{
		tier: "medium",
		label: "Medium",
		durationMinutes: 10,
		cost: 2,
		suggestions: ["Walk outside", "Quick workout", "YouTube video"],
	},
	{
		tier: "large",
		label: "Large",
		durationMinutes: 15,
		cost: 3,
		suggestions: ["Watching half a TV show", "Quick nap"],
	},
];
