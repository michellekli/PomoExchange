// biome-ignore-all lint/style/noMagicNumbers: this is a test file

import { useLocation } from "react-router";
import { describe, expect, it, vi } from "vitest";
import type { RenderResult } from "vitest-browser-react";
import { renderWithProviders } from "~/__tests__/test-utils";
import type { AppState } from "~/state/types";
import Timer from "./timer";

function renderTimer(
	overrides: Partial<AppState> = {},
	routerOptions?: { initialEntries?: string[] },
): Promise<RenderResult> {
	return renderWithProviders(
		<>
			<Timer />
			<LocationDisplay />
		</>,
		{
			isSessionActive: true,
			sessionStartTime: Date.now(),
			durationMinutes: 25,
			...overrides,
		},
		routerOptions,
	);
}

function LocationDisplay(): React.ReactElement {
	return <div data-testid="location-display">{useLocation().pathname}</div>;
}

describe("Timer navigation guard", () => {
	it("redirects to / when no active session", async () => {
		const screen = await renderTimer(
			{ isSessionActive: false },
			{
				initialEntries: ["/timer"],
			},
		);
		await expect
			.element(screen.getByTestId("location-display"))
			.toHaveTextContent("/");
		await expect
			.element(screen.getByLabelText("Time remaining"))
			.not.toBeInTheDocument();
	});

	it("renders timer content when session is active", async () => {
		const screen = await renderTimer(undefined, {
			initialEntries: ["/timer"],
		});
		await expect.element(screen.getByLabelText("Time remaining")).toBeVisible();
	});
});

describe("Timer display", () => {
	it("renders countdown with full duration and progress indicator", async () => {
		const screen = await renderTimer();
		await expect.element(screen.getByText("25:00")).toBeVisible();
		await expect.element(screen.getByRole("progressbar")).toBeVisible();
	});

	it("shows End Session button", async () => {
		const screen = await renderTimer();
		await expect
			.element(screen.getByRole("button", { name: /end session/iu }))
			.toBeVisible();
	});
});

describe("Timer actions", () => {
	it("dispatches END_SESSION on button click", async () => {
		const screen = await renderTimer();
		await screen.getByRole("button", { name: /end session/iu }).click();
		await expect
			.element(screen.getByTestId("location-display"))
			.toHaveTextContent("/");
		await expect
			.element(screen.getByLabelText("Time remaining"))
			.not.toBeInTheDocument();
	});
});

describe("Timer completion screen", () => {
	it("shows completion alert on expiry without auto-ending session", async () => {
		const screen = await renderTimer({
			sessionStartTime: Date.now() - 61_000,
			durationMinutes: 1,
		});

		await vi.waitFor(
			() => expect(screen.getByText("Great Work!")).toBeVisible(),
			{ timeout: 5000 },
		);

		// Session is still active — End Session button remains
		await expect
			.element(screen.getByRole("button", { name: /end session/iu }))
			.toBeVisible();
	});

	it("shows overtime counter after session expires", async () => {
		const screen = await renderTimer({
			sessionStartTime: Date.now() - 90_000,
			durationMinutes: 1,
		});

		await vi.waitFor(
			() =>
				expect(screen.getByLabelText("Time remaining")).toHaveTextContent(
					/^\+\d{2}:\d{2}$/u,
				),
			{ timeout: 5000 },
		);
	});

	it("ends session when clicking End Session from completion state", async () => {
		const screen = await renderTimer({
			sessionStartTime: Date.now() - 61_000,
			durationMinutes: 1,
		});

		await vi.waitFor(
			() => expect(screen.getByText("Great Work!")).toBeVisible(),
			{ timeout: 5000 },
		);

		await screen.getByRole("button", { name: /end session/iu }).click();

		await vi.waitFor(
			() => {
				expect(screen.getByTestId("location-display")).toHaveTextContent("/");
				expect(screen.getByLabelText("Time remaining")).not.toBeInTheDocument();
			},
			{ timeout: 5000 },
		);
	});
});
