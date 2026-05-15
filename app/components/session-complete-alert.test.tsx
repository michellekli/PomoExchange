// biome-ignore-all lint/style/noMagicNumbers: this is a test file
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "~/__tests__/test-utils";
import SessionCompleteAlert from "./session-complete-alert";

describe("SessionCompleteAlert", () => {
	it("renders the completion title", async () => {
		const screen = await renderWithProviders(<SessionCompleteAlert />);
		await expect.element(screen.getByText("Great work!")).toBeVisible();
	});
	it("renders the completion description", async () => {
		const screen = await renderWithProviders(<SessionCompleteAlert />);
		await expect
			.element(
				screen.getByText("You've completed your scheduled focus time.", {
					exact: false,
				}),
			)
			.toBeVisible();
	});
	it("renders the prompt to end the session", async () => {
		const screen = await renderWithProviders(<SessionCompleteAlert />);
		await expect
			.element(
				screen.getByText("End the session when you're done focusing.", {
					exact: false,
				}),
			)
			.toBeVisible();
	});
});
