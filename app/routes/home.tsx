import { useNavigate } from "react-router";
import FocusHistoryList from "~/components/focus-history-list";
import PointsBalance from "~/components/points-balance";
import PointsCapWarning from "~/components/points-cap-warning";
import PointsCelebration from "~/components/points-celebration";
import RewardCatalog from "~/components/reward-catalog";
import RewardHistoryBar from "~/components/reward-history-bar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import WelcomeDialog from "~/components/welcome-dialog";
import { useClampedInput } from "~/hooks/use-clamped-input";
import { POINTS_RATE, SESSION } from "~/state/constants";
import { useAppDispatch, useAppState } from "~/state/provider";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs): object[] {
	return [
		{ title: "PomoExchange" },
		{
			name: "description",
			content: "Focus, earn points, and redeem rewards with PomoExchange.",
		},
	];
}

export default function Home(): React.ReactElement {
	const {
		durationMinutes,
		pointsNumerator,
		pointsDenominator,
		isSessionActive,
	} = useAppState();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [durationInput, onDurationChange, onDurationBlur] = useClampedInput({
		globalValue: durationMinutes,
		min: SESSION.DURATION.MIN,
		max: SESSION.DURATION.MAX,
		defaultValue: SESSION.DURATION.DEFAULT,
		onCommit: (clamped: number) => {
			dispatch({ type: "SET_DURATION", durationMinutes: clamped });
		},
	});

	const [numeratorInput, onNumeratorChange, onNumeratorBlur] = useClampedInput({
		globalValue: pointsNumerator,
		min: POINTS_RATE.NUMERATOR.MIN,
		max: POINTS_RATE.NUMERATOR.MAX,
		defaultValue: POINTS_RATE.NUMERATOR.DEFAULT,
		onCommit: (clamped: number) => {
			dispatch({ type: "SET_NUMERATOR", numerator: clamped });
		},
	});

	const [denominatorInput, onDenominatorChange, onDenominatorBlur] =
		useClampedInput({
			globalValue: pointsDenominator,
			min: POINTS_RATE.DENOMINATOR.MIN,
			max: POINTS_RATE.DENOMINATOR.MAX,
			defaultValue: POINTS_RATE.DENOMINATOR.DEFAULT,
			onCommit: (clamped: number) => {
				dispatch({ type: "SET_DENOMINATOR", denominator: clamped });
			},
		});

	return (
		<div>
			<WelcomeDialog />
			<PointsCelebration />
			<PointsBalance />
			<Card className="p-6 m-4 max-w-md mx-auto">
				<div className="space-y-4">
					<FieldSet>
						<FieldLegend>Session Duration</FieldLegend>
						<FieldDescription>
							Set the length of your focus session.
						</FieldDescription>
						<Field>
							<FieldLabel htmlFor="duration">Duration (minutes)</FieldLabel>
							<Input
								id="duration"
								type="number"
								min={SESSION.DURATION.MIN}
								max={SESSION.DURATION.MAX}
								value={durationInput}
								disabled={isSessionActive}
								onChange={onDurationChange}
								onBlur={onDurationBlur}
							/>
						</Field>
					</FieldSet>
					<FieldSet>
						<FieldLegend>Earning Rate</FieldLegend>
						<FieldDescription>
							{pointsNumerator} {pointsNumerator === 1 ? "point" : "points"}{" "}
							earned every {pointsDenominator}{" "}
							{pointsDenominator === 1 ? "minute" : "minutes"}.
						</FieldDescription>
						<div className="flex items-end gap-3">
							<Field className="flex-1">
								<FieldLabel htmlFor="numerator">Points Earned</FieldLabel>
								<Input
									id="numerator"
									type="number"
									min={POINTS_RATE.NUMERATOR.MIN}
									max={POINTS_RATE.NUMERATOR.MAX}
									value={numeratorInput}
									disabled={isSessionActive}
									onChange={onNumeratorChange}
									onBlur={onNumeratorBlur}
								/>
							</Field>
							<span className="pb-2.5 text-lg text-muted-foreground">:</span>
							<Field className="flex-1">
								<FieldLabel htmlFor="denominator">Minutes Focused</FieldLabel>
								<Input
									id="denominator"
									type="number"
									min={POINTS_RATE.DENOMINATOR.MIN}
									max={POINTS_RATE.DENOMINATOR.MAX}
									value={denominatorInput}
									disabled={isSessionActive}
									onChange={onDenominatorChange}
									onBlur={onDenominatorBlur}
								/>
							</Field>
						</div>
					</FieldSet>
					<PointsCapWarning />
					<Button
						type="button"
						disabled={isSessionActive}
						onClick={async (): Promise<void> => {
							dispatch({ type: "START_SESSION" });
							await navigate("/timer");
						}}
					>
						Start Focus Session
					</Button>
				</div>
			</Card>
			<RewardCatalog />
			<RewardHistoryBar />
			<FocusHistoryList />
		</div>
	);
}
