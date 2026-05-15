import { MemoryRouter } from "react-router";
import type { RenderResult } from "vitest-browser-react";
import { render } from "vitest-browser-react";
import { AppStateProvider } from "~/state/provider";
import type { AppState } from "~/state/types";

export function renderWithProviders(
	ui: React.ReactElement,
	overrides: Partial<AppState> = {},
	options?: { initialEntries?: string[] },
): Promise<RenderResult> {
	return render(
		<MemoryRouter initialEntries={options?.initialEntries}>
			<AppStateProvider initialState={{ ...overrides }}>{ui}</AppStateProvider>
		</MemoryRouter>,
	);
}

export function checkHorizontalOverflow(container: HTMLElement): void {
	// Check every element for horizontal overflow.
	// Takes less than 1 second to run all mobile tests, but
	// may not be a good idea if the app gets bigger.
	container.querySelectorAll("*").forEach((el) => {
		if (el.scrollWidth > el.clientWidth) {
			throw new Error(
				`${el.tagName}${el.getAttribute("aria-label") ? `[aria-label="${el.getAttribute("aria-label")}"]` : ""} scrollWidth ${el.scrollWidth}px > clientWidth ${el.clientWidth}px`,
			);
		}
	});
}
