// biome-ignore-all lint/style/noMagicNumbers: this is a test file
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "~/__tests__/test-utils";
import FocusHistoryList from "./focus-history-list";

describe("FocusHistoryList", () => {
	it("returns null when no sessions exist", async () => {
		const screen = await renderWithProviders(<FocusHistoryList />, {
			pastSessions: [],
		});
		await expect
			.element(screen.getByText("Focus History"))
			.not.toBeInTheDocument();
	});

	it("renders when sessions exist", async () => {
		const screen = await renderWithProviders(<FocusHistoryList />, {
			pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
		});
		await expect.element(screen.getByText("Focus History")).toBeVisible();
	});

	it("expands on trigger click", async () => {
		const screen = await renderWithProviders(<FocusHistoryList />, {
			pastSessions: [{ elapsedMinutes: 20.5, pointsEarned: 1, timestamp: 100 }],
		});
		await screen.getByRole("button", { name: /focus history/iu }).click();
		await expect.element(screen.getByText(/20m 30s/iu)).toBeVisible();
	});

	it("displays elapsed minutes and points for each session", async () => {
		const screen = await renderWithProviders(<FocusHistoryList />, {
			pastSessions: [{ elapsedMinutes: 20.5, pointsEarned: 1, timestamp: 100 }],
		});
		await screen.getByRole("button", { name: /focus history/iu }).click();
		await expect.element(screen.getByText(/20m 30s/iu)).toBeVisible();
		await expect.element(screen.getByText(/\+1[.]00 pts/iu)).toBeVisible();
	});

	it("displays points rounded to 2 decimal places", async () => {
		const screen = await renderWithProviders(<FocusHistoryList />, {
			pastSessions: [
				{ elapsedMinutes: 1, pointsEarned: 0.05333, timestamp: 100 },
			],
		});
		await screen.getByRole("button", { name: /focus history/iu }).click();
		await expect.element(screen.getByText(/\+0[.]05 pts/iu)).toBeVisible();
	});

	it("renders multiple session entries", async () => {
		const screen = await renderWithProviders(<FocusHistoryList />, {
			pastSessions: [
				{ elapsedMinutes: 20.5, pointsEarned: 1, timestamp: 100 },
				{ elapsedMinutes: 40, pointsEarned: 2, timestamp: 200 },
				{ elapsedMinutes: 25, pointsEarned: 1.25, timestamp: 300 },
			],
		});
		await expect.element(screen.getByText(/20m 30s/iu)).not.toBeInTheDocument();
		await screen.getByRole("button", { name: /focus history/iu }).click();
		await expect.element(screen.getByText(/20m 30s/iu)).toBeVisible();
		await expect.element(screen.getByText(/40m 0s/iu)).toBeVisible();
		await expect.element(screen.getByText(/25m 0s/iu)).toBeVisible();
		await expect.element(screen.getByText(/\+2[.]00 pts/iu)).toBeVisible();
	});
});
