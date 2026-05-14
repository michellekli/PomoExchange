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
