import { AlertIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { POINTS } from "~/state/constants";
import { useAppState } from "~/state/provider";

export default function PointsCapWarning(): React.ReactElement | null {
	const { pointsBalance } = useAppState();
	const isAtCap = pointsBalance >= POINTS.CAP;
	if (!isAtCap) {
		// Don't show if not at or above points cap
		return null;
	}
	return (
		<Alert>
			<HugeiconsIcon icon={AlertIcon} className="h-4 w-4" />
			<AlertTitle>Points Cap Reached</AlertTitle>
			<AlertDescription>
				You have reached the 10,000 point maximum. You will not earn points for
				new focus sessions until you redeem rewards.
			</AlertDescription>
		</Alert>
	);
}
