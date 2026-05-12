// biome-ignore-all lint/style/noMagicNumbers: this is a test file

import { Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import type { RenderResult } from "vitest-browser-react";
import { renderWithProviders } from "~/__tests__/test-utils";
import type { AppState } from "~/state/types";
import Home from "./home";
import Timer from "./timer";

describe("Home Base screen", () => {
	function renderHome(
		overrides: Partial<AppState> = {},
		options?: { initialEntries?: string[]; routes?: React.ReactNode },
	): Promise<RenderResult> {
		return renderWithProviders(
			options?.routes ? (
				<Routes>
					<Route index element={<Home />} />
					{options.routes}
				</Routes>
			) : (
				<Home />
			),
			{ welcomeDismissed: true, ...overrides },
			options,
		);
	}

	describe("renders layout", () => {
		it("renders duration input with default value", async () => {
			const screen = await renderHome();
			const input = screen.getByLabelText(/Duration \(minutes\)/iu);
			await expect.element(input).toBeVisible();
			await expect.element(input).toHaveValue(25);
		});

		it("renders numerator input with default value", async () => {
			const screen = await renderHome();
			const input = screen.getByLabelText(/points earned/iu);
			await expect.element(input).toBeVisible();
			await expect.element(input).toHaveValue(1);
		});

		it("renders denominator input with default value", async () => {
			const screen = await renderHome();
			const input = screen.getByLabelText(/minutes focused/iu);
			await expect.element(input).toBeVisible();
			await expect.element(input).toHaveValue(20);
		});

		it("renders start button", async () => {
			const screen = await renderHome();
			await expect
				.element(screen.getByRole("button", { name: /start focus session/iu }))
				.toBeVisible();
		});
	});

	describe("dispatches on triggers", () => {
		it("dispatches SET_DURATION on duration change", async () => {
			const screen = await renderHome({ durationMinutes: 25 });
			const input = screen.getByLabelText(/Duration \(minutes\)/iu);
			await expect.element(input).toHaveValue(25);
			await input.fill("30");
			await expect.element(input).toHaveValue(30);
		});

		it("dispatches SET_NUMERATOR on numerator change", async () => {
			const screen = await renderHome({ pointsNumerator: 1 });
			const input = screen.getByLabelText(/points earned/iu);
			await expect.element(input).toHaveValue(1);
			await input.fill("3");
			await expect.element(input).toHaveValue(3);
		});

		it("dispatches SET_DENOMINATOR on denominator change", async () => {
			const screen = await renderHome({ pointsDenominator: 5 });
			const input = screen.getByLabelText(/minutes focused/iu);
			await expect.element(input).toHaveValue(5);
			await input.fill("25");
			await expect.element(input).toHaveValue(25);
		});

		it("dispatches START_SESSION on button click", async () => {
			const screen = await renderHome({ isSessionActive: false });
			await screen
				.getByRole("button", { name: /start focus session/iu })
				.click();
			await expect
				.element(screen.getByRole("button", { name: /start focus session/iu }))
				.toBeDisabled();
		});

		it("navigates to /timer when Start Focus Session is clicked", async () => {
			const screen = await renderHome(
				{},
				{
					initialEntries: ["/"],
					routes: <Route path="timer" element={<Timer />} />,
				},
			);
			await screen
				.getByRole("button", { name: /start focus session/iu })
				.click();
			await expect
				.element(screen.getByLabelText("Time remaining"))
				.toBeVisible();
		});
	});

	it("shows WelcomeDialog on initial load", async () => {
		const screen = await renderHome({ welcomeDismissed: false });
		await expect
			.element(screen.getByLabelText("Welcome to PomoExchange"))
			.toBeVisible();
	});

	describe("Points Celebration overlay", () => {
		it("shows after session ends (lastSessionPoints is set)", async () => {
			const screen = await renderHome({ lastSessionPoints: 2.5 });
			await expect.element(screen.getByText("Great Work!")).toBeVisible();
		});

		it("shows cap message when at max points", async () => {
			const cap = 10_000;
			const screen = await renderHome({
				lastSessionPoints: 0,
				pointsBalance: cap,
			});
			await expect
				.element(
					screen.getByText(`Points Cap (${cap.toLocaleString()}) Reached`),
				)
				.toBeVisible();
		});

		it("is hidden when lastSessionPoints is null", async () => {
			const screen = await renderHome({ lastSessionPoints: null });
			await expect
				.element(screen.getByText("Great Work!"))
				.not.toBeInTheDocument();
		});
	});

	describe("Points Balance display", () => {
		it("is hidden before first session", async () => {
			const screen = await renderHome({
				pastSessions: [],
			});
			await expect
				.element(screen.getByText("Points Balance"))
				.not.toBeInTheDocument();
		});

		it("is visible after first session", async () => {
			const screen = await renderHome({
				pointsBalance: 1.5,
				pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 200 }],
			});
			await expect
				.element(screen.getByLabelText("Points Balance: 1.50"))
				.toBeVisible();
		});
	});

	describe("Reward Catalog display", () => {
		it("is hidden before first session", async () => {
			const screen = await renderHome({ pastSessions: [] });
			await expect
				.element(screen.getByText("Reward Catalog"))
				.not.toBeInTheDocument();
		});

		it("is visible after first session", async () => {
			const screen = await renderHome({
				pointsBalance: 5,
				pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 200 }],
			});
			await expect.element(screen.getByText("Reward Catalog")).toBeVisible();
		});
	});

	it("inputs and button are disabled when session is active", async () => {
		const screen = await renderHome({ isSessionActive: true });
		await expect
			.element(screen.getByLabelText(/Duration \(minutes\)/iu))
			.toBeDisabled();
		await expect
			.element(screen.getByRole("button", { name: /start focus session/iu }))
			.toBeDisabled();
	});
});
