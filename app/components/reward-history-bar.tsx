import { useState } from "react";
import { Card } from "~/components/ui/card";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";
import { REWARD_TIERS } from "~/state/constants";
import { useAppState } from "~/state/provider";

const tierStyles: Record<string, string> = {
	small: "bg-amber-400 [clip-path:polygon(50%_0%,0%_100%,100%_100%)]", // triangle
	medium: "bg-amber-600", // square by default
	large:
		"bg-amber-800 [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)]", // pentagon
};

function formatTimestamp(ts: number): string {
	return new Date(ts).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function RewardHistoryBar(): React.ReactElement | null {
	const { pastRedemptions } = useAppState();
	// Controlled open state per card so clicks toggle reliably
	// While hovering, the first click re-opens the card but subsequent
	// clicks don't open it and the card is no longer visible
	const [openCards, setOpenCards] = useState<Record<number, boolean>>({});

	if (pastRedemptions.length === 0) {
		// Don't show RewardHistoryBar if no rewards have been redemeed
		return null;
	}

	const tierLabel = (tier: string): string =>
		REWARD_TIERS.find((t) => t.tier === tier)?.label ?? tier;

	return (
		<Card className="p-4 m-4 lg:m-0 max-w-md mx-auto lg:max-w-none">
			<h2 className="text-sm font-medium mb-3">Reward History</h2>
			<div className="flex items-end gap-2">
				{pastRedemptions.map((r) => (
					<HoverCard
						key={r.timestamp}
						open={openCards[r.timestamp] ?? false}
						onOpenChange={(isOpen: boolean): void =>
							// Synchronise controlled state with card state
							setOpenCards((prev) => ({ ...prev, [r.timestamp]: isOpen }))
						}
						openDelay={
							100 /* Delay to avoid triggering on unintentional mouseovers */
						}
					>
						<HoverCardTrigger asChild>
							<button
								type="button"
								className={`cursor-pointer  size-11 min-w-11 ${tierStyles[r.tier] ?? "rounded-full bg-primary"}`}
								aria-label={`${tierLabel(r.tier)} — ${r.pointsCost} point${r.pointsCost === 1 ? "" : "s"}`}
								onClick={(): void =>
									setOpenCards((prev) => ({
										...prev,
										[r.timestamp]: !(prev[r.timestamp] ?? false),
									}))
								}
							/>
						</HoverCardTrigger>
						<HoverCardContent>
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground">
									{formatTimestamp(r.timestamp)}
								</p>
								<p className="text-sm font-medium">{tierLabel(r.tier)}</p>
								<p className="text-xs text-muted-foreground">
									{r.pointsCost} point{r.pointsCost === 1 ? "" : "s"}
								</p>
							</div>
						</HoverCardContent>
					</HoverCard>
				))}
			</div>
		</Card>
	);
}
