// biome-ignore-all lint/style/noMagicNumbers: test file
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { clampInt, useClampedInput } from "./use-clamped-input";

describe("clampInt", () => {
	it("returns the value when it is within range", () => {
		const value = "5";
		const min = 1;
		const max = 10;
		const defaultValue = 3;
		expect(clampInt(value, min, max, defaultValue)).toBe(5);
	});

	it("returns min when value is below range", () => {
		const value = "0";
		const min = 1;
		const max = 10;
		const defaultValue = 3;
		expect(clampInt(value, min, max, defaultValue)).toBe(1);
	});

	it("returns max when value is above range", () => {
		const value = "20";
		const min = 1;
		const max = 10;
		const defaultValue = 3;
		expect(clampInt(value, min, max, defaultValue)).toBe(10);
	});

	it("returns defaultValue when value is NaN", () => {
		const value = "abc";
		const min = 1;
		const max = 10;
		const defaultValue = 3;
		expect(clampInt(value, min, max, defaultValue)).toBe(3);
	});

	it("returns defaultValue when value is empty string", () => {
		const value = "";
		const min = 1;
		const max = 10;
		const defaultValue = 3;
		expect(clampInt(value, min, max, defaultValue)).toBe(3);
	});

	it("returns min when value equals min", () => {
		const value = "1";
		const min = 1;
		const max = 10;
		const defaultValue = 3;
		expect(clampInt(value, min, max, defaultValue)).toBe(1);
	});

	it("returns max when value equals max", () => {
		const value = "10";
		const min = 1;
		const max = 10;
		const defaultValue = 3;
		expect(clampInt(value, min, max, defaultValue)).toBe(10);
	});

	it("rounds decimal strings", () => {
		const value = "3.7";
		const min = 1;
		const max = 10;
		const defaultValue = 3;
		expect(clampInt(value, min, max, defaultValue)).toBe(4);
	});
});

describe("useClampedInput", () => {
	function ClampedInputFixture(props: {
		globalValue: number;
		min: number;
		max: number;
		defaultValue: number;
		onCommit?: (clamped: number) => void;
	}): React.ReactElement {
		const [value, onChange, onBlur] = useClampedInput({
			globalValue: props.globalValue,
			min: props.min,
			max: props.max,
			defaultValue: props.defaultValue,
			onCommit: props.onCommit ?? vi.fn(),
		});
		return (
			<>
				<input
					aria-label="clamped-input"
					type="text"
					value={value}
					onChange={onChange}
					onBlur={onBlur}
				/>
				{/* Clickable target to trigger onBlur on the input during tests */}
				<button aria-label="trigger-blur" type="button">
					blur
				</button>
			</>
		);
	}

	it("initializes with globalValue as string", async () => {
		const screen = await render(
			<ClampedInputFixture
				globalValue={30}
				min={1}
				max={60}
				defaultValue={25}
			/>,
		);
		const input = screen.getByLabelText("clamped-input");
		await expect.element(input).toHaveValue("30");
	});

	it("updates local state on change without clamping", async () => {
		const screen = await render(
			<ClampedInputFixture
				globalValue={30}
				min={1}
				max={60}
				defaultValue={25}
			/>,
		);
		const input = screen.getByLabelText("clamped-input");
		await expect.element(input).toHaveValue("30");
		await input.fill("999");
		await expect.element(input).toHaveValue("999");
	});

	it("clamps to max on blur", async () => {
		const onCommit = vi.fn();
		const screen = await render(
			<ClampedInputFixture
				globalValue={30}
				min={1}
				max={60}
				defaultValue={25}
				onCommit={onCommit}
			/>,
		);
		const input = screen.getByLabelText("clamped-input");
		await input.fill("999");
		await screen.getByLabelText("trigger-blur").click();
		await expect.element(input).toHaveValue("60");
		expect(onCommit).toHaveBeenCalledWith(60);
	});

	it("clamps to min on blur", async () => {
		const onCommit = vi.fn();
		const screen = await render(
			<ClampedInputFixture
				globalValue={30}
				min={1}
				max={60}
				defaultValue={25}
				onCommit={onCommit}
			/>,
		);
		const input = screen.getByLabelText("clamped-input");
		await input.fill("0");
		await screen.getByLabelText("trigger-blur").click();
		await expect.element(input).toHaveValue("1");
		expect(onCommit).toHaveBeenCalledWith(1);
	});

	it("rounds decimal strings on blur", async () => {
		const onCommit = vi.fn();
		const screen = await render(
			<ClampedInputFixture
				globalValue={30}
				min={1}
				max={60}
				defaultValue={25}
				onCommit={onCommit}
			/>,
		);
		const input = screen.getByLabelText("clamped-input");
		await input.fill("3.7");
		await screen.getByLabelText("trigger-blur").click();
		await expect.element(input).toHaveValue("4");
		expect(onCommit).toHaveBeenCalledWith(4);
	});

	it("falls back to defaultValue on NaN after blur", async () => {
		const onCommit = vi.fn();
		const screen = await render(
			<ClampedInputFixture
				globalValue={30}
				min={1}
				max={60}
				defaultValue={10}
				onCommit={onCommit}
			/>,
		);
		const input = screen.getByLabelText("clamped-input");
		await input.fill("abc");
		await screen.getByLabelText("trigger-blur").click();
		await expect.element(input).toHaveValue("10");
		expect(onCommit).toHaveBeenCalledWith(10);
	});

	it("re-syncs when globalValue changes externally", async () => {
		function ReSyncFixture(): React.ReactElement {
			const [globalValue, setGlobalValue] = useState(30);
			return (
				<>
					<ClampedInputFixture
						globalValue={globalValue}
						min={1}
						max={60}
						defaultValue={25}
					/>
					<button onClick={(): void => setGlobalValue(50)} type="button">
						update
					</button>
				</>
			);
		}
		const screen = await render(<ReSyncFixture />);
		const input = screen.getByLabelText("clamped-input");
		await expect.element(input).toHaveValue("30");

		await screen.getByRole("button", { name: "update" }).click();
		await expect.element(input).toHaveValue("50");
	});
});
