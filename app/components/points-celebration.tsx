import confetti from "canvas-confetti";
import { useCallback, useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { POINTS } from "~/state/constants";
import { useAppDispatch, useAppState } from "~/state/provider";

const DISMISS_TIMEOUT_MS = 3000;
const COUNT_DELAY_MS = 600;
// 1200ms gives the ease-out quadratic animation room to
// decelerate naturally so it doesn't feel rushed, while still fitting
// comfortably inside DISMISS_TIMEOUT_MS with the COUNT_DELAY_MS delay.
const COUNT_DURATION_MS = 1200;

// Cap celebration: fewer particles but warmer gold tones (milestone moment).
// Normal celebration: more particles with a rainbow palette (general win).
const CONFETTI = {
	CAP: { count: 80, colors: ["#ffd700", "#ffaa00", "#ff8800"] },
	NORMAL: {
		count: 150,
		colors: ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#10b981"],
	},
	ORIGIN: { y: 0.55 },
	// Multiple bursts with varied spread/velocity/decay produce a richer,
	// more natural confetti effect than a single uniform burst.
	BURSTS: [
		{ particleCountRatio: 0.25, spread: 26, startVelocity: 55 },
		{ particleCountRatio: 0.2, spread: 60 },
		{ particleCountRatio: 0.35, spread: 100, decay: 0.91, scalar: 0.8 },
		{
			particleCountRatio: 0.1,
			spread: 120,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2,
		},
		{ particleCountRatio: 0.1, spread: 120, startVelocity: 45 },
	],
} as const;

// Fires layered confetti bursts each time a new session completes.
// `lastSessionPoints` in deps ensures re-fire on every new session (not just mount).
function useConfetti(isAtCap: boolean, lastSessionPoints: number | null): void {
	useEffect(() => {
		if (lastSessionPoints === null) {
			return;
		}

		const { count: baseCount, colors } = isAtCap
			? CONFETTI.CAP
			: CONFETTI.NORMAL;

		for (const { particleCountRatio, ...burst } of CONFETTI.BURSTS) {
			confetti({
				particleCount: Math.floor(baseCount * particleCountRatio),
				colors: [...colors], // Create a mutable copy to fix the readonly type error
				origin: CONFETTI.ORIGIN,
				...burst,
			});
		}
	}, [lastSessionPoints, isAtCap]);
}

// Animates a number from 0 → earnedPointsDisplay with a staged delay so confetti fires first.
// Returns [displayCount, isAnimating] — the boolean lets the UI apply a "ticking"
// CSS class only during the active animation phase (not during the initial delay).
function useCountUp(
	lastSessionPoints: number | null,
	earnedPointsDisplay: number,
): [displayCount: number, isAnimating: boolean] {
	const [displayCount, setDisplayCount] = useState(0);
	const [isCounting, setIsCounting] = useState(false);
	const reset = useCallback((): void => {
		setDisplayCount(0);
		setIsCounting(false);
	}, []);

	// Phase 1: reset and wait COUNT_DELAY_MS before starting the count.
	useEffect(() => {
		reset();

		if (lastSessionPoints === null) {
			return;
		}

		if (earnedPointsDisplay <= 0) {
			return;
		}

		const delayTimer = setTimeout(() => setIsCounting(true), COUNT_DELAY_MS);
		return (): void => clearTimeout(delayTimer);
	}, [reset, lastSessionPoints, earnedPointsDisplay]);

	// Phase 2: ease-out quadratic animation — starts fast, decelerates naturally.
	useEffect(() => {
		if (!isCounting || lastSessionPoints === null) {
			return;
		}

		const start = performance.now();

		function tick(now: number): void {
			const elapsed = now - start;
			const progress = Math.min(elapsed / COUNT_DURATION_MS, 1);
			const eased = 1 - (1 - progress) ** 2;
			setDisplayCount(eased * earnedPointsDisplay);
			if (progress < 1) {
				requestAnimationFrame(tick);
			}
		}

		const raf = requestAnimationFrame(tick);
		return (): void => cancelAnimationFrame(raf);
	}, [isCounting, earnedPointsDisplay, lastSessionPoints]);

	return [displayCount, isCounting && displayCount < earnedPointsDisplay];
}

// Auto-dismisses the celebration so it doesn't linger (the dialog has no close button).
// 3 s is long enough to read + enjoy the animation, short enough to not block the UI.
function useAutoDismiss(
	lastSessionPoints: number | null,
	dispatch: ReturnType<typeof useAppDispatch>,
): void {
	useEffect(() => {
		if (lastSessionPoints === null) {
			return;
		}
		const timer = setTimeout(() => {
			dispatch({ type: "DISMISS_CELEBRATION" });
		}, DISMISS_TIMEOUT_MS);
		return (): void => clearTimeout(timer);
	}, [lastSessionPoints, dispatch]);
}

export default function PointsCelebration(): React.ReactElement {
	const { lastSessionPoints, pointsBalance } = useAppState();
	const dispatch = useAppDispatch();

	const isAtCap = pointsBalance >= POINTS.CAP;
	// At cap the value is 0 so the counter stays at 0, showing "0 points"
	// instead of animating a deceptive number the user didn't actually earn.
	const earnedPointsDisplay = isAtCap ? 0 : (lastSessionPoints ?? 0);

	useConfetti(isAtCap, lastSessionPoints);

	const [displayCount, isAnimating] = useCountUp(
		lastSessionPoints,
		earnedPointsDisplay,
	);

	useAutoDismiss(lastSessionPoints, dispatch);

	return (
		<Dialog
			open={lastSessionPoints !== null}
			onOpenChange={(open: boolean): void => {
				if (!open) {
					dispatch({ type: "DISMISS_CELEBRATION" });
				}
			}}
		>
			<DialogContent
				// No close button — the celebration is either auto-dismissed or
				// dismissed by clicking outside. Keeps the UI clean and celebratory.
				showCloseButton={false}
				aria-label="Points earned celebration"
				className="celebration-spring-in"
			>
				<DialogHeader>
					<DialogTitle>
						{isAtCap
							? `Points Cap (${POINTS.CAP.toLocaleString()}) Reached`
							: "Great Work!"}
					</DialogTitle>
					<DialogDescription>
						{isAtCap ? (
							`You've reached the ${POINTS.CAP.toLocaleString()} point maximum. You earned 0 points for this session.`
						) : (
							<>
								You earned{" "}
								<span
									className={cn(
										"points-number",
										isAnimating && "ticking-number",
									)}
								>
									{`+${displayCount.toFixed(POINTS.DISPLAY_DECIMALS)}`}
								</span>{" "}
								points!
							</>
						)}
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
