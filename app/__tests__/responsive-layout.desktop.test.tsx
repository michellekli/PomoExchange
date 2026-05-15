// biome-ignore-all lint/style/noMagicNumbers: test file
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import {
	checkHorizontalOverflow,
	renderWithProviders,
} from "~/__tests__/test-utils";
import Home from "~/routes/home";

describe("Responsive layout for desktop viewport", () => {
	it("errors on overflow", async () => {
		// Overflowing content must be within a container to be detected
		const screen = await render(
			<div>
				<div
					style={{
						width: "1025px",
						background: "red",
					}}
				>
					This content overflows!
				</div>
			</div>,
		);
		expect(() => checkHorizontalOverflow(screen.container)).toThrow(
			"DIV scrollWidth 1025px > clientWidth 1024px",
		);
	});

	it("doesn't error without overflow", async () => {
		// Overflowing content must be within a container to be detected
		const screen = await render(
			<div>
				<div
					style={{
						width: "1024px",
						background: "red",
					}}
				>
					This content doesn't overflow.
				</div>
			</div>,
		);
		expect(() => checkHorizontalOverflow(screen.container)).not.toThrow();
	});

	it("Home Base screen has no overflow at desktop", async () => {
		const screen = await renderWithProviders(<Home />, {
			welcomeDismissed: true,
		});
		expect(() => checkHorizontalOverflow(screen.container)).not.toThrow();
	});

	it("Home Extended screen (all sections visible) has no overflow at desktop", async () => {
		const screen = await renderWithProviders(<Home />, {
			welcomeDismissed: true,
			pointsBalance: 5,
			pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
			pastRedemptions: [{ tier: "small", pointsCost: 1, timestamp: 200 }],
		});
		expect(() => checkHorizontalOverflow(screen.container)).not.toThrow();
	});
});
