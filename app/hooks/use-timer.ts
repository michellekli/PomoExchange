import { useEffect, useState } from "react";

const MILLISECONDS_PER_SECOND = 1000;
const MAX_PROGRESS_PERCENT = 100;

/**
 * Counts elapsed time from sessionStart and derives display values,
 * completion status, and progress percentage.
 */
export function useTimer(
	sessionStartTime: number | null,
	durationMinutes: number,
): {
	elapsedSeconds: number;
	display: string;
	isComplete: boolean;
	isOvertime: boolean;
	progress: number;
} {
	// Elapsed seconds since session started, updated every 1s
	const [elapsedSeconds, setElapsedSeconds] = useState(0);

	useEffect(() => {
		if (sessionStartTime == null) {
			return;
		}
		const interval = setInterval(() => {
			setElapsedSeconds(
				Math.floor((Date.now() - sessionStartTime) / MILLISECONDS_PER_SECOND),
			);
		}, MILLISECONDS_PER_SECOND);
		return (): void => clearInterval(interval);
	}, [sessionStartTime]);

	// Derived values from elapsed time and duration
	const totalSeconds = durationMinutes * 60;
	const remainingSeconds = totalSeconds - elapsedSeconds;
	const isOvertime = remainingSeconds < 0;
	const isComplete = remainingSeconds <= 0 && totalSeconds > 0;
	const progress = Math.min(
		(elapsedSeconds / totalSeconds) * MAX_PROGRESS_PERCENT,
		MAX_PROGRESS_PERCENT,
	);

	// Format as MM:SS, prefix "+" if overtime
	const displayMinutes = Math.floor(Math.abs(remainingSeconds) / 60);
	const displaySeconds = Math.abs(remainingSeconds) % 60;
	const displayFormat = `${displayMinutes.toString().padStart(2, "0")}:${displaySeconds.toString().padStart(2, "0")}`;
	const display = isOvertime ? `+${displayFormat}` : displayFormat;

	return { elapsedSeconds, display, isComplete, isOvertime, progress };
}
