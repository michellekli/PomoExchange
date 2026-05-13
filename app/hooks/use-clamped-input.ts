import { useEffect, useState } from "react";

/**
 * Parses and clamps a string to an integer within [min, max].
 * Falls back to defaultValue when the input is not a valid number.
 * Uses parseFloat + Math.round so decimal strings (e.g. "3.7") are rounded
 * rather than truncated by parseInt.
 */
export function clampInt(
	value: string,
	min: number,
	max: number,
	defaultValue: number,
): number {
	const raw = Math.round(parseFloat(value));
	const val = Number.isNaN(raw) ? defaultValue : raw;
	return Math.min(Math.max(val, min), max);
}

/**
 * Manages a numeric input field with blur-based clamping.
 *
 * Keeps local string state so the user can type freely without being
 * clamped on every keystroke.  The clamped value is committed (via
 * onCommit) and synced back to local state only on blur.
 *
 * When globalValue changes externally (e.g. state reset), the local
 * state is updated via useEffect to stay in sync.
 */
export function useClampedInput(options: {
	globalValue: number;
	min: number;
	max: number;
	defaultValue: number;
	onCommit: (clamped: number) => void;
}): [string, (e: React.ChangeEvent<HTMLInputElement>) => void, () => void] {
	const { globalValue, min, max, defaultValue, onCommit } = options;
	const [value, setValue] = useState(() => globalValue.toString());

	useEffect(() => {
		setValue(globalValue.toString());
	}, [globalValue]);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		setValue(e.target.value);
	};

	const onBlur = (): void => {
		const clamped = clampInt(value, min, max, defaultValue);
		onCommit(clamped);
		setValue(clamped.toString());
	};

	return [value, onChange, onBlur];
}
