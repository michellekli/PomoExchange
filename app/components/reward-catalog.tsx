import { useState } from "react";
import RewardConfirmationDialog from "~/components/reward-confirmation-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { POINTS, REWARD_TIERS } from "~/state/constants";
import { useAppDispatch, useAppState } from "~/state/provider";

export default function RewardCatalog(): React.ReactElement | null {
	const { pointsBalance, pastSessions } = useAppState();
	const dispatch = useAppDispatch();
	const [pendingTier, setPendingTier] = useState<
		(typeof REWARD_TIERS)[number] | null
	>(null);

	if (pastSessions.length === 0) {
		// Don't show if there haven't been any completed focus sessions
		return null;
	}

	return (
		<>
			<div className="space-y-3 m-4 lg:m-0 max-w-md mx-auto lg:max-w-none">
				<h2 className="text-sm font-medium">Reward Catalog</h2>
				{REWARD_TIERS.map((tier) => {
					const affordable = pointsBalance >= tier.cost;
					return (
						<Card
							key={tier.tier}
							className={`p-4 ${affordable ? "" : "opacity-50"}`}
						>
							<CardHeader>
								<CardTitle>{tier.label}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									{tier.durationMinutes} min — {tier.cost} point
									{tier.cost === 1 ? "" : "s"}
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									{tier.suggestions.join(" · ")}
								</p>
								{affordable ? (
									<Button
										type="button"
										size="sm"
										className="mt-3"
										onClick={(): void => {
											setPendingTier(tier);
										}}
										aria-label={`Select ${tier.label} reward`}
									>
										Select
									</Button>
								) : (
									<p className="text-xs text-destructive mt-2">
										Need{" "}
										{(tier.cost - pointsBalance).toFixed(
											POINTS.DISPLAY_DECIMALS,
										)}{" "}
										more points
									</p>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>
			{pendingTier && (
				<RewardConfirmationDialog
					tier={pendingTier}
					open={true}
					onConfirm={(): void => {
						dispatch({ type: "REDEEM_REWARD", tier: pendingTier.tier });
						setPendingTier(null);
					}}
					onCancel={(): void => {
						setPendingTier(null);
					}}
				/>
			)}
		</>
	);
}
