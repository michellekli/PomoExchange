// biome-ignore-all lint/style/noMagicNumbers: this is a test file

import { Route, Routes } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "~/__tests__/test-utils";
import Home from "~/routes/home";
import Timer from "~/routes/timer";

afterEach(() => {
	vi.useRealTimers();
});

describe("Reward redemption flow", () => {
	it("redeems a reward and updates UI", async () => {
		vi.useFakeTimers();

		const screen = await renderWithProviders(
			<Routes>
				<Route index element={<Home />} />
				<Route path="timer" element={<Timer />} />
			</Routes>,
			{
				pointsBalance: 5,
				pastSessions: [{ elapsedMinutes: 20, pointsEarned: 5, timestamp: 1 }],
			},
			{ initialEntries: ["/"] },
		);

		// Dismiss welcome dialog
		await screen.getByRole("button", { name: /get started/iu }).click();

		// Reward history bar should not be visible
		await expect
			.element(screen.getByText("Reward History"))
			.not.toBeInTheDocument();

		// Ensure reward catalog is visible
		await expect.element(screen.getByText("Reward Catalog")).toBeVisible();

		// Verify initial points balance
		const balanceBefore = screen.getByLabelText(/Points Balance:/iu);
		await expect.element(balanceBefore).toHaveTextContent("5.00");

		// Open confirmation dialog for an affordable tier (Small)
		await screen.getByRole("button", { name: /select small reward/iu }).click();
		const dialog = screen.getByRole("dialog", { name: "Small Reward" });
		await expect.element(dialog).toBeVisible();

		// Confirm redemption
		await dialog.getByRole("button", { name: "Confirm" }).click();

		// Dialog should close
		await expect
			.element(screen.getByRole("dialog", { name: "Small Reward" }))
			.not.toBeInTheDocument();

		// Balance should be deducted by the tier cost (1 point)
		const balanceAfter = screen.getByLabelText(/Points Balance:/iu);
		await expect.element(balanceAfter).toHaveTextContent("4.00");

		// Reward history bar should now be rendered
		await expect.element(screen.getByText("Reward History")).toBeVisible();
		// The history entry should have an accessible label
		await expect
			.element(screen.getByLabelText(/small — 1 point/iu))
			.toBeVisible();
	});

	it("cancels redemption without changing state", async () => {
		vi.useFakeTimers();

		const screen = await renderWithProviders(
			<Routes>
				<Route index element={<Home />} />
				<Route path="timer" element={<Timer />} />
			</Routes>,
			{
				pointsBalance: 5,
				pastSessions: [{ elapsedMinutes: 20, pointsEarned: 5, timestamp: 1 }],
			},
			{ initialEntries: ["/"] },
		);

		// Dismiss welcome dialog
		await screen.getByRole("button", { name: /get started/iu }).click();

		// Reward history should be absent
		await expect
			.element(screen.getByText("Reward History"))
			.not.toBeInTheDocument();

		// Verify initial balance
		const balanceBefore = screen.getByLabelText(/Points Balance:/iu);
		await expect.element(balanceBefore).toHaveTextContent("5.00");

		// Open confirmation dialog
		await screen.getByRole("button", { name: /select small reward/iu }).click();
		const dialog = screen.getByRole("dialog", { name: "Small Reward" });
		await expect.element(dialog).toBeVisible();

		// Cancel redemption
		await dialog.getByRole("button", { name: "Cancel" }).click();

		// Dialog should close
		await expect
			.element(screen.getByRole("dialog", { name: "Small Reward" }))
			.not.toBeInTheDocument();

		// Balance should remain unchanged
		const balanceAfter = screen.getByLabelText(/Points Balance:/iu);
		await expect.element(balanceAfter).toHaveTextContent("5.00");

		// Reward history should still be absent
		await expect
			.element(screen.getByText("Reward History"))
			.not.toBeInTheDocument();
	});
});
