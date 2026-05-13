// biome-ignore-all lint/style/noMagicNumbers: this is a test file
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "~/__tests__/test-utils";
import PointsBalance from "./points-balance";

describe("PointsBalance", () => {
	it("returns null when no sessions exist", async () => {
		const screen = await renderWithProviders(<PointsBalance />, {
			pastSessions: [],
		});
		await expect
			.element(screen.getByText("Points Balance"))
			.not.toBeInTheDocument();
	});

	it("renders balance when sessions exist", async () => {
		const screen = await renderWithProviders(<PointsBalance />, {
			pointsBalance: 3.5,
			pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
		});
		await expect.element(screen.getByText("Points Balance")).toBeVisible();
		await expect.element(screen.getByText("3.50")).toBeVisible();
	});

	it("displays balance rounded to 2 decimal places", async () => {
		const screen = await renderWithProviders(<PointsBalance />, {
			pointsBalance: 1.33333,
			pastSessions: [
				{ elapsedMinutes: 20, pointsEarned: 1.33333, timestamp: 100 },
			],
		});
		await expect.element(screen.getByText("1.33")).toBeVisible();
	});
});
