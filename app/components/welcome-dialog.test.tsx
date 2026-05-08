import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { AppStateProvider } from "~/state/provider";
import WelcomeDialog from "./welcome-dialog";

describe("WelcomeDialog", () => {
	it("renders when not dismissed", async () => {
		const screen = await render(
			<AppStateProvider initialState={{ welcomeDismissed: false }}>
				<WelcomeDialog />
			</AppStateProvider>,
		);
		await expect
			.element(screen.getByLabelText("Welcome to PomoExchange"))
			.toBeVisible();
	});

	it("does not render when dismissed", async () => {
		const screen = await render(
			<AppStateProvider initialState={{ welcomeDismissed: true }}>
				<WelcomeDialog />
			</AppStateProvider>,
		);
		await expect
			.element(screen.getByLabelText("Welcome to PomoExchange"))
			.not.toBeInTheDocument();
	});

	it("dispatches DISMISS_WELCOME on button click", async () => {
		const screen = await render(
			<AppStateProvider initialState={{ welcomeDismissed: false }}>
				<WelcomeDialog />
			</AppStateProvider>,
		);
		await screen.getByRole("button", { name: /get started/i }).click();
		await expect
			.element(screen.getByLabelText("Welcome to PomoExchange"))
			.not.toBeInTheDocument();
	});
});
