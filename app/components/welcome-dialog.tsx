import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { useAppDispatch, useAppState } from "~/state/provider";

export default function WelcomeDialog(): React.ReactElement {
	const { welcomeDismissed } = useAppState();
	const dispatch = useAppDispatch();

	return (
		<Dialog
			open={!welcomeDismissed}
			onOpenChange={(open: boolean): void => {
				if (!open) {
					dispatch({
						type: "DISMISS_WELCOME",
					});
				}
			}}
		>
			<DialogContent
				showCloseButton={false}
				aria-label="Welcome to PomoExchange"
			>
				<DialogHeader>
					<DialogTitle>Welcome to PomoExchange!</DialogTitle>
					<DialogDescription>
						Turn your focus time into rewards.
					</DialogDescription>
				</DialogHeader>
				<ol>
					<li>1. Set a focus timer and start working.</li>
					<li>2. Earn points for every minute you stay focused.</li>
					<li>3. Redeem your points for breaks you choose.</li>
				</ol>
				<DialogClose asChild>
					<Button type="button">Get Started</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
