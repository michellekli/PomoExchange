import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { AppStateProvider, useAppDispatch, useAppState } from "./provider";

describe("AppStateProvider", () => {
	it("renders children", async () => {
		const screen = await render(
			<AppStateProvider>
				<div>hello</div>
			</AppStateProvider>,
		);
		await expect.element(screen.getByText("hello")).toBeVisible();
	});
});

describe("useAppState", () => {
	it("returns current state", async () => {
		function Consumer() {
			const state = useAppState();
			return <div>{state.durationMinutes}</div>;
		}
		const screen = await render(
			<AppStateProvider>
				<Consumer />
			</AppStateProvider>,
		);
		await expect.element(screen.getByText("25")).toBeVisible();
	});

	it("throws when used outside provider", async () => {
		function Consumer() {
			useAppState();
			return null;
		}
		await expect(render(<Consumer />)).rejects.toThrow(
			"useAppState must be used within AppStateProvider",
		);
	});
});

describe("useAppDispatch", () => {
	it("dispatches actions that update state", async () => {
		function Consumer() {
			const state = useAppState();
			const dispatch = useAppDispatch();
			return (
				<button
					type="button"
					onClick={() => dispatch({ type: "DISMISS_WELCOME" })}
				>
					{state.welcomeDismissed ? "dismissed" : "shown"}
				</button>
			);
		}
		const screen = await render(
			<AppStateProvider>
				<Consumer />
			</AppStateProvider>,
		);
		await expect.element(screen.getByText("shown")).toBeVisible();
		await screen.getByRole("button").click();
		await expect.element(screen.getByText("dismissed")).toBeVisible();
	});

	it("throws when used outside provider", async () => {
		function Consumer() {
			useAppDispatch();
			return null;
		}
		await expect(render(<Consumer />)).rejects.toThrow(
			"useAppDispatch must be used within AppStateProvider",
		);
	});
});
