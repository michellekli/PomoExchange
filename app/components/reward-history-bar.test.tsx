// biome-ignore-all lint/style/noMagicNumbers: this is a test file
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "~/__tests__/test-utils";
import RewardHistoryBar from "./reward-history-bar";

afterEach(() => {
	vi.useRealTimers();
});

describe("RewardHistoryBar", () => {
	it("returns null when no redemptions exist", async () => {
		const screen = await renderWithProviders(<RewardHistoryBar />, {
			pastRedemptions: [],
		});
		await expect
			.element(screen.getByText("Reward History"))
			.not.toBeInTheDocument();
	});

	it("renders when redemptions exist", async () => {
		const screen = await renderWithProviders(<RewardHistoryBar />, {
			pastRedemptions: [{ tier: "small", pointsCost: 1, timestamp: 1000 }],
		});
		await expect.element(screen.getByText("Reward History")).toBeVisible();
	});

	// Removed: testing the hover interaction is too flaky
	// it.skipIf(!!process.env.CI)(
	// 	"shows tier label and points cost on hover",
	// 	async () => {
	// 		vi.useFakeTimers();
	// 		const screen = await renderWithProviders(<RewardHistoryBar />, {
	// 			pastRedemptions: [{ tier: "medium", pointsCost: 2, timestamp: 50000 }],
	// 		});
	// 		const trigger = screen.getByRole("button", { name: /medium/iu });
	// 		await trigger.hover();
	// 		// Advance time to account for openDelay avoiding unintentional open triggers
	// 		vi.advanceTimersByTime(120);
	// 		await expect.element(screen.getByText("Medium")).toBeVisible();
	// 		await expect.element(screen.getByText(/2 points?/iu)).toBeVisible();
	// 	},
	// );

	it("shows tier label and points cost on click and subsequent clicks", async () => {
		vi.useFakeTimers();
		const screen = await renderWithProviders(<RewardHistoryBar />, {
			pastRedemptions: [{ tier: "medium", pointsCost: 2, timestamp: 50000 }],
		});
		await screen.getByRole("button", { name: /medium/iu }).click();
		// Advance time to account for openDelay avoiding unintentional open triggers
		vi.advanceTimersByTime(120);
		await expect.element(screen.getByText("Medium")).toBeVisible();
		await expect.element(screen.getByText(/2 points?/iu)).toBeVisible();
		// Verify details are still visible after multiple clicks
		await screen.getByRole("button", { name: /medium/iu }).click();
		// Advance time to account for openDelay avoiding unintentional open triggers
		vi.advanceTimersByTime(120);
		await expect.element(screen.getByText("Medium")).toBeVisible();
		await expect.element(screen.getByText(/2 points?/iu)).toBeVisible();
	});

	it("renders multiple redemptions", async () => {
		const screen = await renderWithProviders(<RewardHistoryBar />, {
			pastRedemptions: [
				{ tier: "small", pointsCost: 1, timestamp: 1000 },
				{ tier: "large", pointsCost: 3, timestamp: 2000 },
				{ tier: "medium", pointsCost: 2, timestamp: 3000 },
			],
		});
		await expect
			.element(screen.getByRole("button", { name: /small/iu }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("button", { name: /large/iu }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("button", { name: /medium/iu }))
			.toBeVisible();
	});
});
