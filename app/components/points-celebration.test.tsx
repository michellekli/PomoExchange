// biome-ignore-all lint/style/noMagicNumbers: this is a test file

import confetti from "canvas-confetti";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "~/__tests__/test-utils";
import { POINTS } from "~/state/constants";
import PointsCelebration from "./points-celebration";

vi.mock("canvas-confetti");

afterEach(() => {
	vi.useRealTimers();
	vi.clearAllMocks();
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

	it("fires confetti with gold tones when at points cap", async () => {
		vi.useFakeTimers();
		await renderWithProviders(<PointsCelebration />, {
			lastSessionPoints: 1,
			pointsBalance: POINTS.CAP,
		});
		vi.advanceTimersByTime(100);
		const calls = vi.mocked(confetti).mock.calls;
		expect(calls.length).toBe(5);
		for (const [arg] of calls) {
			expect(arg?.colors).toEqual(["#ffd700", "#ffaa00", "#ff8800"]);
		}
	});

	it("fires confetti with rainbow palette when below cap", async () => {
		vi.useFakeTimers();
		await renderWithProviders(<PointsCelebration />, {
			lastSessionPoints: 1,
			pointsBalance: 0,
		});
		vi.advanceTimersByTime(100);
		const calls = vi.mocked(confetti).mock.calls;
		expect(calls.length).toBe(5);
		for (const [arg] of calls) {
			expect(arg?.colors).toEqual([
				"#6366f1",
				"#a855f7",
				"#ec4899",
				"#f59e0b",
				"#10b981",
			]);
		}
	});

	it("does not fire confetti when lastSessionPoints is null", async () => {
		await renderWithProviders(<PointsCelebration />, {
			lastSessionPoints: null,
		});
		expect(vi.mocked(confetti)).not.toHaveBeenCalled();
	});

	it("shows cap message without tick animation when at cap", async () => {
		const screen = await renderWithProviders(<PointsCelebration />, {
			lastSessionPoints: 0,
			pointsBalance: POINTS.CAP,
		});
		await expect
			.element(screen.getByText(/You've reached.*point maximum/iu))
			.toBeVisible();
		await expect.element(screen.getByText(/\+0\.00/iu)).not.toBeInTheDocument();
	});

	it("waits COUNT_DELAY_MS before starting the count animation", async () => {
		vi.useFakeTimers();
		const screen = await renderWithProviders(<PointsCelebration />, {
			lastSessionPoints: 5,
		});
		await vi.advanceTimersByTimeAsync(599);
		await expect.element(screen.getByText("+0.00")).toBeVisible();
		await vi.advanceTimersByTimeAsync(2);
		await expect.element(screen.getByText("+0.00")).not.toBeInTheDocument();
	});

	it("dispatches DISMISS_CELEBRATION and closes dialog on Escape key", async () => {
		const screen = await renderWithProviders(<PointsCelebration />, {
			lastSessionPoints: 1,
		});
		await expect.element(screen.getByText("Great Work!")).toBeVisible();
		document.dispatchEvent(
			new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
		);
		await expect
			.element(screen.getByText("Great Work!"))
			.not.toBeInTheDocument();
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
