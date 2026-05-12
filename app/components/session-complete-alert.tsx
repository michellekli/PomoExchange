import { PartyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export default function SessionCompleteAlert(): React.ReactElement {
	return (
		<Alert className="w-full max-w-md border-2 border-green-500 bg-green-50 dark:bg-green-950 p-8">
			<div className="flex flex-col items-center">
				<div className="flex gap-6 items-center">
					<HugeiconsIcon
						icon={PartyIcon}
						className="size-16 text-green-600 mx-auto"
					/>
					<AlertTitle className="text-4xl font-bold text-center text-green-800 dark:text-green-200">
						Great work!
					</AlertTitle>
				</div>
				<AlertDescription className="text-lg text-green-700 dark:text-green-300 mt-2 text-center">
					You've completed your scheduled focus time.
					<br />
					End the session when you're done focusing.
				</AlertDescription>
			</div>
		</Alert>
	);
}
