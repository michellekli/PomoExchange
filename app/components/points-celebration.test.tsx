// biome-ignore-all lint/style/noMagicNumbers: this is a test file

import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "~/__tests__/test-utils";
import { POINTS } from "~/state/constants";
import PointsCelebration from "./points-celebration";

afterEach(() => {
	vi.useRealTimers();
});

describe("PointsCelebration", () => {
	it("renders with points when lastSessionPoints is set", async () => {
		const screen = await renderWithProviders(<PointsCelebration />, {
			lastSessionPoints: 2.5,
		});
		await expect.element(screen.getByText("Great Work!")).toBeVisible();
	});

	it("does not render when lastSessionPoints is null", async () => {
		const screen = await renderWithProviders(<PointsCelebration />, {
			lastSessionPoints: null,
		});
		await expect
			.element(screen.getByText("Great Work!"))
			.not.toBeInTheDocument();
	});

	it("shows cap message when balance is at cap", async () => {
		const screen = await renderWithProviders(<PointsCelebration />, {
			lastSessionPoints: 0,
			pointsBalance: POINTS.CAP,
		});
		await expect
			.element(
				screen.getByText(`Points Cap (${POINTS.CAP.toLocaleString()}) Reached`),
			)
			.toBeVisible();
	});

	it("auto-dismisses after 3 seconds", async () => {
		vi.useFakeTimers();
		const screen = await renderWithProviders(<PointsCelebration />, {
			lastSessionPoints: 1,
		});
		await expect.element(screen.getByText("Great Work!")).toBeVisible();
		vi.advanceTimersByTime(3000);
		await expect
			.element(screen.getByText("Great Work!"))
			.not.toBeInTheDocument();
	});

	it("counts up to the correct earned points value", async () => {
		vi.useFakeTimers();
		const screen = await renderWithProviders(<PointsCelebration />, {
			lastSessionPoints: 2.5,
		});

		// React batches setState as microtasks — advanceTimersByTimeAsync
		// yields between timer ticks so phase 2 can schedule rAF.
		await vi.advanceTimersByTimeAsync(600);
		// Advance through the full count duration (1200ms) plus buffer so
		// rAF completes the easing.
		await vi.advanceTimersByTimeAsync(1300);

		await expect.element(screen.getByText("+2.50")).toBeVisible();
	});
});
