// biome-ignore-all lint/style/noMagicNumbers: test file
import { Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { renderWithProviders } from "~/__tests__/test-utils";
import Home from "~/routes/home";
import Timer from "~/routes/timer";

function expectTouchTargets(element: HTMLElement): void {
	const interactive = element.querySelectorAll("button, input");
	for (const el of interactive) {
		const rect = el.getBoundingClientRect();
		expect(
			rect.width,
			`${el.tagName}${el.getAttribute("aria-label") ? `[aria-label="${el.getAttribute("aria-label")}"]` : ""} width ${rect.width}px < 44px`,
		).toBeGreaterThanOrEqual(44);
		expect(
			rect.height,
			`${el.tagName}${el.getAttribute("aria-label") ? `[aria-label="${el.getAttribute("aria-label")}"]` : ""} height ${rect.height}px < 44px`,
		).toBeGreaterThanOrEqual(44);
	}
}
describe("Touch targets ≥ 44×44px", () => {
	it("errors when button is too small", async () => {
		const screen = await render(
			<button
				type="button"
				style={{
					width: "11px",
				}}
			/>,
		);
		expect(() => expectTouchTargets(screen.container)).toThrow(
			/BUTTON width 11px < 44px/iu,
		);
	});

	it("errors when input is too small", async () => {
		const screen = await render(
			<input
				style={{
					width: "11px",
				}}
			/>,
		);
		expect(() => expectTouchTargets(screen.container)).toThrow(
			/INPUT width 11px < 44px/iu,
		);
	});

	it("doesn't error when button is big enough", async () => {
		const screen = await render(
			<button
				type="button"
				style={{
					width: "44px",
					height: "44px",
				}}
			/>,
		);
		expectTouchTargets(screen.container);
	});

	it("Home Base screen", async () => {
		const screen = await renderWithProviders(<Home />, {
			welcomeDismissed: true,
		});
		expectTouchTargets(screen.container);
	});

	it("Home Extended screen (all sections visible)", async () => {
		const screen = await renderWithProviders(<Home />, {
			welcomeDismissed: true,
			pointsBalance: 5,
			pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
			pastRedemptions: [{ tier: "small", pointsCost: 1, timestamp: 200 }],
		});
		expectTouchTargets(screen.container);
	});

	it("Timer screen with active session", async () => {
		const screen = await renderWithProviders(
			<Routes>
				<Route path="timer" element={<Timer />} />
			</Routes>,
			{
				isSessionActive: true,
				sessionStartTime: Date.now(),
				durationMinutes: 25,
			},
			{ initialEntries: ["/timer"] },
		);
		expectTouchTargets(screen.container);
	});

	it("Welcome Dialog", async () => {
		const screen = await renderWithProviders(<Home />, {
			welcomeDismissed: false,
		});
		expectTouchTargets(screen.container);
	});

	it("Reward Confirmation Dialog", async () => {
		const screen = await renderWithProviders(<Home />, {
			welcomeDismissed: true,
			pointsBalance: 5,
			pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
		});
		// Open confirmation by finding and clicking "Select" button
		await screen.getByRole("button", { name: /select small reward/iu }).click();
		expectTouchTargets(screen.container);
	});
});
