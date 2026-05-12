// biome-ignore-all lint/style/noMagicNumbers: this is a test file

import { Route, Routes } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "~/__tests__/test-utils";
import Home from "~/routes/home";
import Timer from "~/routes/timer";

vi.mock("canvas-confetti");

afterEach(() => {
	vi.useRealTimers();
});

describe("Full E2E flow", () => {
	it("walks through welcome → session → timer → end → celebration → auto-dismiss → repeat", async () => {
		vi.useFakeTimers();

		const screen = await renderWithProviders(
			<Routes>
				<Route index element={<Home />} />
				<Route path="timer" element={<Timer />} />
			</Routes>,
			{ pointsNumerator: 3 },
			{ initialEntries: ["/"] },
		);

		// 1. Welcome appears on first load
		await expect
			.element(screen.getByLabelText("Welcome to PomoExchange"))
			.toBeVisible();

		// 2. Dismiss welcome — gone until reload
		await screen.getByRole("button", { name: /get started/iu }).click();
		await expect
			.element(screen.getByLabelText("Welcome to PomoExchange"))
			.not.toBeInTheDocument();

		// Modify pointsNumerator from initial value to test state persistence
		const initialInput = screen.getByLabelText(/points earned/iu);
		const persistedValue = 2;
		await expect.element(initialInput).toHaveValue(3);
		await initialInput.fill("2");
		await expect.element(initialInput).toHaveValue(persistedValue);

		// 3. Start focus session → navigate to /timer
		await screen.getByRole("button", { name: /start focus session/iu }).click();
		await expect.element(screen.getByLabelText("Time remaining")).toBeVisible();
		await expect.element(screen.getByText("25:00")).toBeVisible();
		await expect.element(screen.getByRole("progressbar")).toBeVisible();

		// Advance time so elapsed > 0 for realistic points
		vi.advanceTimersByTime(2000);

		// 4. End session → celebration overlay
		await screen.getByRole("button", { name: /end session/iu }).click();
		await expect.element(screen.getByText("Great Work!")).toBeVisible();

		// 5. Auto-dismiss after ~3s → back to Home
		vi.advanceTimersByTime(3000);
		await expect
			.element(screen.getByText("Great Work!"))
			.not.toBeInTheDocument();

		// 6. Repeat — start another session to verify state persistence
		await screen.getByRole("button", { name: /start focus session/iu }).click();
		await expect.element(screen.getByLabelText("Time remaining")).toBeVisible();

		vi.advanceTimersByTime(1000);
		await screen.getByRole("button", { name: /end session/iu }).click();
		await expect.element(screen.getByText("Great Work!")).toBeVisible();

		// Verify pointsNumerator is still the filled value
		const persistedInput = screen.getByLabelText(/points earned/iu);
		await expect.element(persistedInput).toHaveValue(persistedValue);
	});
});

describe("Timer redirect", () => {
	it("redirects /timer to / when no active session", async () => {
		const screen = await renderWithProviders(
			<Routes>
				<Route index element={<Home />} />
				<Route path="timer" element={<Timer />} />
			</Routes>,
			{ isSessionActive: false },
			{ initialEntries: ["/timer"] },
		);

		// Home is rendered, not Timer
		await expect
			.element(screen.getByLabelText("Duration (minutes)"))
			.toBeVisible();
		await expect
			.element(screen.getByLabelText("Time remaining"))
			.not.toBeInTheDocument();
	});
});
