// biome-ignore-all lint/style/noMagicNumbers: this is a test file
import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import { useTimer } from "./use-timer";

afterEach(() => {
	vi.useRealTimers();
});

describe("useTimer", () => {
	it("returns initial values without starting interval when sessionStartTime is null", async () => {
		const { result } = await renderHook(() => useTimer(null, 25));
		expect(result.current.elapsedSeconds).toBe(0);
		expect(result.current.display).toBe("25:00");
		expect(result.current.isComplete).toBe(false);
		expect(result.current.isOvertime).toBe(false);
		expect(result.current.progress).toBe(0);
	});
	it("updates elapsedSeconds over time", async () => {
		vi.useFakeTimers();
		const now = Date.now();
		vi.setSystemTime(now);
		const { result } = await renderHook(() => useTimer(now, 25));
		// Advance time and force React to flush the batched state update,
		// otherwise setElapsedSeconds will not run before elapsedSeconds is
		// checked by expect.
		await act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(result.current.elapsedSeconds).toBe(1);
		expect(result.current.display).toBe("24:59");
		expect(result.current.isComplete).toBe(false);
		expect(result.current.isOvertime).toBe(false);
	});
});
