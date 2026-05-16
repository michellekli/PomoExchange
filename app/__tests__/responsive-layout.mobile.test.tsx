// biome-ignore-all lint/style/noMagicNumbers: this is a test file

import { Route, Routes } from "react-router";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import {
	checkHorizontalOverflow,
	renderWithProviders,
} from "~/__tests__/test-utils";
import Home from "~/routes/home";
import Timer from "~/routes/timer";

describe("Responsive layout for mobile viewport", () => {
	it("errors on overflow", async () => {
		// Overflowing content must be within a container to be detected
		const screen = await render(
			<div>
				<div
					style={{
						width: "391px",
						background: "red",
					}}
				>
					This content overflows!
				</div>
			</div>,
		);
		expect(() => checkHorizontalOverflow(screen.container)).toThrow(
			/DIV scrollWidth 391px/iu,
		);
	});

	it("doesn't error without overflow", async () => {
		// Overflowing content must be within a container to be detected
		const screen = await render(
			<div>
				<div
					style={{
						width: "390px",
						background: "red",
					}}
				>
					This content doesn't overflow.
				</div>
			</div>,
		);
		expect(() => checkHorizontalOverflow(screen.container)).not.toThrow();
	});

	it("Initial screen has no overflow", async () => {
		const screen = await renderWithProviders(<Home />, {
			welcomeDismissed: false,
		});
		expect(() => checkHorizontalOverflow(screen.container)).not.toThrow();
	});

	it("Home Base screen has no overflow", async () => {
		const screen = await renderWithProviders(<Home />, {
			welcomeDismissed: true,
		});
		expect(() => checkHorizontalOverflow(screen.container)).not.toThrow();
	});

	it("Home Extended screen (all sections visible) has no overflow", async () => {
		const screen = await renderWithProviders(<Home />, {
			welcomeDismissed: true,
			pointsBalance: 5,
			pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
			pastRedemptions: [{ tier: "small", pointsCost: 1, timestamp: 200 }],
		});
		expect(() => checkHorizontalOverflow(screen.container)).not.toThrow();
	});

	it("Timer screen has no overflow", async () => {
		const screen = await renderWithProviders(
			<Routes>
				<Route path="timer" element={<Timer />} />
			</Routes>,
			{
				isSessionActive: true,
				sessionStartTime: Date.now(),
				durationMinutes: 75, // longest duration
			},
			{ initialEntries: ["/timer"] },
		);
		expect(() => checkHorizontalOverflow(screen.container)).not.toThrow();
	});
});
