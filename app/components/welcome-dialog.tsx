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

export default function WelcomeDialog() {
	const { welcomeDismissed } = useAppState();
	const dispatch = useAppDispatch();

	return (
		<Dialog
			open={!welcomeDismissed}
			onOpenChange={(open) => {
				if (!open) dispatch({ type: "DISMISS_WELCOME" });
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
					<li>Set a focus timer and start working</li>
					<li>Earn points for every minute you stay focused</li>
					<li>Redeem your points for breaks you choose</li>
				</ol>
				<DialogClose asChild>
					<Button type="button">Get Started</Button>
				</DialogClose>
			</DialogContent>
		</Dialog>
	);
}
