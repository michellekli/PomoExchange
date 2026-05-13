// biome-ignore-all lint/style/noMagicNumbers: this is a test file
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "~/__tests__/test-utils";
import { REWARD_TIERS } from "~/state/constants";
import RewardCatalog from "./reward-catalog";

describe("RewardCatalog", () => {
	it("returns null when no sessions exist", async () => {
		const screen = await renderWithProviders(<RewardCatalog />, {
			pastSessions: [],
		});
		await expect
			.element(screen.getByText("Reward Catalog"))
			.not.toBeInTheDocument();
	});

	it("renders all tiers when sessions exist", async () => {
		const screen = await renderWithProviders(<RewardCatalog />, {
			pointsBalance: 5,
			pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
		});
		await Promise.all(
			REWARD_TIERS.map((tier) =>
				expect.element(screen.getByText(tier.label)).toBeVisible(),
			),
		);
	});

	it("shows Need X more points for unaffordable tier", async () => {
		const screen = await renderWithProviders(<RewardCatalog />, {
			pointsBalance: 0.5,
			pastSessions: [{ elapsedMinutes: 10, pointsEarned: 0.5, timestamp: 100 }],
		});
		await expect
			.element(screen.getByText(/need 0[.]50 more points/iu))
			.toBeVisible();
	});

	it("shows select button for affordable tier", async () => {
		const screen = await renderWithProviders(<RewardCatalog />, {
			pointsBalance: 1,
			pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
		});
		await expect
			.element(screen.getByRole("button", { name: /select small reward/iu }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("button", { name: /select medium reward/iu }))
			.not.toBeInTheDocument();
	});

	it("shows confirmation modal when affordable tier is clicked", async () => {
		const screen = await renderWithProviders(<RewardCatalog />, {
			pointsBalance: 1,
			pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
		});
		await screen
			.getByRole("button", { name: /select small reward/iu })
			.first()
			.click();
		await expect
			.element(
				screen
					.getByRole("dialog", { name: "Small Reward" })
					.getByRole("button", { name: "Confirm" }),
			)
			.toBeVisible();
	});

	it("dispatches REDEEM_REWARD when Confirm is clicked in modal", async () => {
		const screen = await renderWithProviders(<RewardCatalog />, {
			pointsBalance: 1,
			pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
		});
		await screen.getByRole("button", { name: /select small reward/iu }).click();
		const rewardDialog = screen.getByRole("dialog", { name: "Small Reward" });
		await expect.element(rewardDialog).toBeVisible();
		await rewardDialog.getByRole("button", { name: "Confirm" }).click();
		await expect
			.element(screen.getByRole("button", { name: /select small reward/iu }))
			.not.toBeInTheDocument();
	});

	it("closes modal without dispatching when Cancel is clicked", async () => {
		const screen = await renderWithProviders(<RewardCatalog />, {
			pointsBalance: 1,
			pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
		});
		await screen.getByRole("button", { name: /select small reward/iu }).click();
		await screen
			.getByRole("dialog", { name: "Small Reward" })
			.getByRole("button", { name: "Cancel" })
			.click();
		await expect
			.element(screen.getByRole("dialog", { name: "Small Reward" }))
			.not.toBeInTheDocument();
		await expect
			.element(screen.getByRole("button", { name: /select small reward/iu }))
			.toBeVisible();
	});

	it("displays tier duration, cost, and suggestions", async () => {
		const screen = await renderWithProviders(<RewardCatalog />, {
			pointsBalance: 5,
			pastSessions: [{ elapsedMinutes: 20, pointsEarned: 1, timestamp: 100 }],
		});
		await expect.element(screen.getByText(/5 min — 1 point/iu)).toBeVisible();
		await expect.element(screen.getByText(/stretching/iu)).toBeVisible();
	});
});
