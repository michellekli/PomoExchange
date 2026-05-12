// biome-ignore-all lint/style/noMagicNumbers: this is a test file
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "~/__tests__/test-utils";
import { REWARD_TIERS } from "~/state/constants";
import RewardCatalog from "./reward-catalog";

describe("RewardCatalog", () => {
	it("returns null when no sessions exist", async () => {
		const screen = await renderWithProviders(
			<RewardCatalog
				onSelectTier={(): void => {
					/* Do nothing. */
				}}
			/>,
			{ pastSessions: [] },
		);
		await expect
			.element(screen.getByText("Reward Catalog"))
			.not.toBeInTheDocument();
	});

	it("renders all tiers when sessions exist", async () => {
		const screen = await renderWithProviders(
			<RewardCatalog onSelectTier={vi.fn()} />,
			{
				pointsBalance: 5,
				pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
			},
		);
		await Promise.all(
			REWARD_TIERS.map((tier) =>
				expect.element(screen.getByText(tier.label)).toBeVisible(),
			),
		);
	});

	it("shows Need X more points for unaffordable tier", async () => {
		const screen = await renderWithProviders(
			<RewardCatalog onSelectTier={vi.fn()} />,
			{
				pointsBalance: 0.5,
				pastSessions: [
					{ elapsedMinutes: 10, pointsEarned: 0.5, timestamp: 100 },
				],
			},
		);
		await expect
			.element(screen.getByText(/need 0[.]50 more points/iu))
			.toBeVisible();
	});

	it("shows select button for affordable tier", async () => {
		const screen = await renderWithProviders(
			<RewardCatalog onSelectTier={vi.fn()} />,
			{
				pointsBalance: 1,
				pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
			},
		);
		await expect
			.element(screen.getByRole("button", { name: /select small reward/iu }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("button", { name: /select medium reward/iu }))
			.not.toBeInTheDocument();
	});

	it("fires onSelectTier when affordable tier is clicked", async () => {
		const onSelect = vi.fn();
		const screen = await renderWithProviders(
			<RewardCatalog onSelectTier={onSelect} />,
			{
				pointsBalance: 5,
				pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
			},
		);
		await screen
			.getByRole("button", { name: /select small reward/iu })
			.first()
			.click();
		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect).toHaveBeenCalledWith(
			expect.objectContaining({ tier: "small" }),
		);
	});

	it("displays tier duration, cost, and suggestions", async () => {
		const screen = await renderWithProviders(
			<RewardCatalog onSelectTier={vi.fn()} />,
			{
				pointsBalance: 5,
				pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
			},
		);
		await expect.element(screen.getByText(/5 min — 1 point/iu)).toBeVisible();
		await expect.element(screen.getByText(/stretching/iu)).toBeVisible();
	});
});
