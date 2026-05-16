// biome-ignore-all lint/style/noMagicNumbers: this is a test file

import { describe, expect, it } from "vitest";
import { renderWithProviders } from "~/__tests__/test-utils";
import { POINTS } from "~/state/constants";
import PointsCapWarning from "./points-cap-warning";

describe("PointsCapWarning", () => {
	it("does not render when below cap", async () => {
		const screen = await renderWithProviders(<PointsCapWarning />, {
			pointsBalance: POINTS.CAP - 1,
		});
		expect(screen.getByText(/Points Cap Reached/iu)).not.toBeInTheDocument();
	});
	it("renders when at cap", async () => {
		const screen = await renderWithProviders(<PointsCapWarning />, {
			pointsBalance: POINTS.CAP,
		});
		expect(screen.getByText(/Points Cap Reached/iu)).toBeInTheDocument();
	});
	it("renders when above cap", async () => {
		const screen = await renderWithProviders(<PointsCapWarning />, {
			pointsBalance: POINTS.CAP + 1,
		});
		expect(screen.getByText(/Points Cap Reached/iu)).toBeInTheDocument();
	});
});
