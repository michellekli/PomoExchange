import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { POINTS } from "~/state/constants";
import { useAppState } from "~/state/provider";

export default function PointsBalance(): React.ReactElement | null {
	const { pointsBalance, pastSessions } = useAppState();

	if (pastSessions.length === 0) {
		return null;
	}

	return (
		<Card className="p-4 m-4 lg:m-0 max-w-md mx-auto lg:max-w-none">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium">Points Balance</span>
				<Badge
					variant="secondary"
					className="text-base"
					aria-label={`Points Balance: ${pointsBalance.toFixed(POINTS.DISPLAY_DECIMALS)}`}
				>
					{pointsBalance.toFixed(POINTS.DISPLAY_DECIMALS)}
				</Badge>
			</div>
		</Card>
	);
}
