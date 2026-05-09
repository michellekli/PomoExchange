// biome-ignore-all lint/style/noMagicNumbers: this is a test file

import { describe, expect, it } from "vitest";
import { type RenderResult, render } from "vitest-browser-react";
import { AppStateProvider } from "~/state/provider";
import { type AppState } from "~/state/types";
import Home from "./home";

describe("Home Base screen", () => {
	function renderHome(
		overrides: Partial<AppState> = {},
	): Promise<RenderResult> {
		return render(
			<AppStateProvider initialState={{ welcomeDismissed: true, ...overrides }}>
				<Home />
			</AppStateProvider>,
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
	});

	it("shows WelcomeDialog on initial load", async () => {
		const screen = await render(
			<AppStateProvider>
				<Home />
			</AppStateProvider>,
		);
		await expect
			.element(screen.getByLabelText("Welcome to PomoExchange"))
			.toBeVisible();
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
