// biome-ignore-all lint/style/noMagicNumbers: test file
import axe from "axe-core";
import { Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { renderWithProviders } from "~/__tests__/test-utils";
import Home from "~/routes/home";
import Timer from "~/routes/timer";
import { POINTS } from "~/state/constants";

async function expectNoAxeViolations(container: HTMLElement): Promise<void> {
	const results = await axe.run(container);
	if (results.violations.length > 0) {
		throw new Error(
			results.violations
				.map((v) => `${v.help} (${v.id}) — ${v.nodes.length} node(s)`)
				.join("\n"),
		);
	}
}
describe("axe accessibility", () => {
	it("errors on violations", async () => {
		// biome-ignore lint/a11y/useAltText: Intentional accessibility violation
		const screen = await render(<img src="foo.jpg" />);
		await expect(expectNoAxeViolations(screen.container)).rejects.toThrow();
	});
	it("passes on no violations", async () => {
		const screen = await render(<img src="foo.jpg" alt="foo" />);
		await expectNoAxeViolations(screen.container);
	});
	it("Welcome Dialog", async () => {
		const screen = await renderWithProviders(<Home />, {
			welcomeDismissed: false,
		});
		await expectNoAxeViolations(screen.container);
	});
	it("Home Base screen", async () => {
		const screen = await renderWithProviders(<Home />, {
			welcomeDismissed: true,
		});
		await expectNoAxeViolations(screen.container);
	});
	it("Home Extended screen (all sections visible)", async () => {
		const screen = await renderWithProviders(<Home />, {
			welcomeDismissed: true,
			pointsBalance: 5,
			pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
			pastRedemptions: [{ tier: "small", pointsCost: 1, timestamp: 200 }],
		});
		await expectNoAxeViolations(screen.container);
	});
	it("Points Cap Warning", async () => {
		const screen = await renderWithProviders(<Home />, {
			welcomeDismissed: true,
			pointsBalance: POINTS.CAP,
		});
		await expectNoAxeViolations(screen.container);
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
		await expectNoAxeViolations(screen.container);
	});
	it("Reward Confirmation Dialog", async () => {
		const screen = await renderWithProviders(<Home />, {
			welcomeDismissed: true,
			pointsBalance: 5,
			pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
		});
		await screen.getByRole("button", { name: /select small reward/iu }).click();
		await expectNoAxeViolations(screen.container);
	});
});
