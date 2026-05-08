import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { AppStateProvider } from "../state/provider";
import Timer from "./timer";

describe("Timer navigation guard", () => {
	it("redirects to / when no active session", async () => {
		const screen = await render(
			<MemoryRouter initialEntries={["/timer"]}>
				<AppStateProvider>
					<Timer />
				</AppStateProvider>
			</MemoryRouter>,
		);
		await expect
			.element(screen.getByText("Timer placeholder"))
			.not.toBeInTheDocument();
	});

	it("renders timer content when session is active", async () => {
		const screen = await render(
			<MemoryRouter initialEntries={["/timer"]}>
				<AppStateProvider
					initialState={{ isSessionActive: true, sessionStartTime: Date.now() }}
				>
					<Timer />
				</AppStateProvider>
			</MemoryRouter>,
		);
		await expect.element(screen.getByText("Timer placeholder")).toBeVisible();
	});
});
