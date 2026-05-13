// biome-ignore-all lint/style/noMagicNumbers: this is a test file
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { REWARD_TIERS } from "~/state/constants";
import RewardConfirmationDialog from "./reward-confirmation-dialog";

describe("RewardConfirmationDialog", () => {
	const smallTier = REWARD_TIERS[0];

	it("is hidden when open is false", async () => {
		const screen = await render(
			<RewardConfirmationDialog
				tier={smallTier}
				open={false}
				onConfirm={vi.fn()}
				onCancel={vi.fn()}
			/>,
		);
		await expect
			.element(screen.getByRole("dialog", { name: smallTier.label }))
			.not.toBeInTheDocument();
	});

	it("shows tier info when open is true", async () => {
		const screen = await render(
			<RewardConfirmationDialog
				tier={smallTier}
				open={true}
				onConfirm={vi.fn()}
				onCancel={vi.fn()}
			/>,
		);
		const rewardDialog = screen.getByRole("dialog", { name: smallTier.label });
		await expect.element(rewardDialog.getByText("Small Reward")).toBeVisible();
		await expect
			.element(rewardDialog.getByText(/5 min — 1 point/iu))
			.toBeVisible();
		await expect.element(rewardDialog.getByText("Stretching")).toBeVisible();
	});

	it("calls onConfirm when Confirm is clicked", async () => {
		const onConfirm = vi.fn();
		const screen = await render(
			<RewardConfirmationDialog
				tier={smallTier}
				open={true}
				onConfirm={onConfirm}
				onCancel={vi.fn()}
			/>,
		);
		await screen
			.getByRole("dialog", { name: smallTier.label })
			.getByRole("button", { name: "Confirm" })
			.click();
		expect(onConfirm).toHaveBeenCalledTimes(1);
	});

	it("calls onCancel when Cancel is clicked", async () => {
		const onCancel = vi.fn();
		const screen = await render(
			<RewardConfirmationDialog
				tier={smallTier}
				open={true}
				onConfirm={vi.fn()}
				onCancel={onCancel}
			/>,
		);
		await screen
			.getByRole("dialog", { name: smallTier.label })
			.getByRole("button", { name: "Cancel" })
			.click();
		expect(onCancel).toHaveBeenCalledTimes(1);
	});
});
