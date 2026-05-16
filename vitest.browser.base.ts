import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tailwindcss(), react()],
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		exclude: ["**/__screenshots__/**/*", ".vitest-attachments/*"],
		setupFiles: ["./vitest.browser.setup.ts"],
		browser: {
			enabled: true,
			provider: playwright(),
			// https://vitest.dev/config/browser/playwright
			instances: [
				{ browser: "chromium" },
				// Remove firefox and webkit because not supported by v8 and
				// want to use v8 for coverage instead of istanbul because
				// test results can differ between the two providers.
				// v8 (v3.2.0 +) is faster to run than istanbul and has
				// identical coverage reports to istanbul.
				// { browser: "firefox" },
				// { browser: "webkit" },
			],
		},
		coverage: {
			provider: "v8",
			reportsDirectory: "coverage/browser",
		},
	},
	define: {
		"process.env.CI": JSON.stringify(process.env.CI ?? false),
	},
});
