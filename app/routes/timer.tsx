import { Navigate } from "react-router";
import SessionCompleteAlert from "~/components/session-complete-alert";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { useTimer } from "~/hooks/use-timer";
import { useAppDispatch, useAppState } from "~/state/provider";

const MAX_PROGRESS = 100;

/**
 * Timer page — rendered only when a session is active.
 * Redirects to "/" if no session exists.
 */
export default function Timer(): React.ReactElement {
	const { durationMinutes, sessionStartTime, isSessionActive } = useAppState();
	const dispatch = useAppDispatch();
	const { elapsedSeconds, display, isComplete, progress } = useTimer(
		sessionStartTime,
		durationMinutes,
	);

	if (!isSessionActive) {
		return <Navigate to="/" replace />;
	}

	/**
	 * Ends the current session and dispatches elapsed time.
	 * `elapsedMinutes` is kept as a fractional value so the reducer
	 * can compute proportional points (e.g. 30s → 0.5 min → half the
	 * per-minute rate).
	 */
	const handleEndSession = (): void => {
		dispatch({
			type: "END_SESSION",
			elapsedMinutes: elapsedSeconds / 60,
		});
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			{isComplete && <SessionCompleteAlert />}
			<TimeRemaining display={display} isComplete={isComplete} />
			<ProgressBar value={isComplete ? MAX_PROGRESS : progress} />
			<EndSessionButton onClick={handleEndSession} />
		</div>
	);
}

function TimeRemaining({
	display,
	isComplete,
}: {
	display: string;
	isComplete: boolean;
}): React.ReactElement {
	return (
		<div
			role="timer"
			aria-live="polite"
			aria-label="Time remaining"
			className={`font-mono font-bold ${isComplete ? "text-6xl mt-8 text-muted-foreground" : "text-8xl"}`}
		>
			{display}
		</div>
	);
}

function ProgressBar({ value }: { value: number }): React.ReactElement {
	return (
		<Progress
			value={value}
			className="w-full max-w-sm mt-6"
			aria-label="Session progress"
		/>
	);
}

function EndSessionButton({
	onClick,
}: {
	onClick: () => void;
}): React.ReactElement {
	return (
		<div className="flex gap-4 mt-8">
			<Button variant="destructive" size="lg" onClick={onClick}>
				End Session
			</Button>
		</div>
	);
}
