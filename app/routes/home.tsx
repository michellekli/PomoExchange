import { useNavigate } from "react-router";
import PointsBalance from "~/components/points-balance";
import PointsCelebration from "~/components/points-celebration";
import RewardCatalog from "~/components/reward-catalog";
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
								value={durationMinutes}
								disabled={isSessionActive}
								onChange={(
									e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
								): void =>
									dispatch({
										type: "SET_DURATION",
										durationMinutes: parseInt(e.target.value, 10),
									})
								}
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
									value={pointsNumerator}
									disabled={isSessionActive}
									onChange={(
										e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
									): void =>
										dispatch({
											type: "SET_NUMERATOR",
											numerator: parseInt(e.target.value, 10),
										})
									}
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
									value={pointsDenominator}
									disabled={isSessionActive}
									onChange={(
										e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
									): void =>
										dispatch({
											type: "SET_DENOMINATOR",
											denominator: parseInt(e.target.value, 10),
										})
									}
								/>
							</Field>
						</div>
					</FieldSet>
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
			<RewardCatalog
				onSelectTier={(): void => {
					/* Do nothing. */
				}}
			/>
		</div>
	);
}
