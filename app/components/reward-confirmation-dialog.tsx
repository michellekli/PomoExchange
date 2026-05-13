import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import type { RewardTierInfo } from "~/state/types";

interface RewardConfirmationDialogProps {
	tier: RewardTierInfo;
	open: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function RewardConfirmationDialog({
	tier,
	open,
	onConfirm,
	onCancel,
}: RewardConfirmationDialogProps): React.ReactElement {
	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen: boolean): void => {
				if (!nextOpen) {
					onCancel();
				}
			}}
		>
			<DialogContent
				showCloseButton={false}
				aria-label="Confirm reward selection"
			>
				<DialogHeader>
					<DialogTitle>{tier.label} Reward</DialogTitle>
					<DialogDescription>
						{tier.durationMinutes} min — {tier.cost} point
						{tier.cost === 1 ? "" : "s"}
					</DialogDescription>
				</DialogHeader>
				<ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
					{tier.suggestions.map((suggestion: string) => (
						<li key={suggestion}>{suggestion}</li>
					))}
				</ul>
				<div className="flex justify-end gap-2">
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</DialogClose>
					<Button type="button" onClick={onConfirm}>
						Confirm
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
