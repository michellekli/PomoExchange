import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { POINTS } from "~/state/constants";
import { useAppState } from "~/state/provider";

function formatMinutes(minutes: number): string {
	const totalSeconds = Math.round(minutes * 60);
	const m = Math.floor(totalSeconds / 60);
	const s = totalSeconds % 60;
	return `${m}m ${s}s`;
}

export default function FocusHistoryList(): React.ReactElement | null {
	const { pastSessions } = useAppState();

	if (pastSessions.length === 0) {
		// Don't show FocusHistoryList if no focus sessions have been completed.
		return null;
	}

	return (
		<Card className="p-4 m-4 lg:m-0 max-w-md mx-auto lg:max-w-none">
			<Collapsible defaultOpen={false}>
				<CollapsibleTrigger
					className="flex w-full min-h-11 items-center justify-between cursor-pointer"
					aria-label={`Focus History, ${pastSessions.length} session${pastSessions.length === 1 ? "" : "s"}`}
				>
					<span className="text-sm font-medium">Focus History</span>
					<Badge variant="secondary" className="text-xs">
						{pastSessions.length}
					</Badge>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<ScrollArea className="max-h-60 mt-3">
						<div className="space-y-1">
							{pastSessions.map((session, index) => (
								<div key={session.timestamp}>
									{index > 0 && <Separator className="my-2" />}
									<div className="flex items-center justify-between text-sm">
										<span>{formatMinutes(session.elapsedMinutes)}</span>
										<span className="text-muted-foreground">
											+{session.pointsEarned.toFixed(POINTS.DISPLAY_DECIMALS)}{" "}
											pts
										</span>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	);
}
