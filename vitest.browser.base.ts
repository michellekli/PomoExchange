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
		setupFiles: ["./vitest.browser.setup.ts"],
		browser: {
			enabled: true,
			provider: playwright(),
			// https://vitest.dev/config/browser/playwright
			instances: [
				{ browser: "chromium" },
				{ browser: "firefox" },
				{ browser: "webkit" },
			],
		},
		coverage: {
			provider: "istanbul",
			reportsDirectory: "coverage/browser",
		},
	},
	define: {
		"process.env.CI": JSON.stringify(process.env.CI ?? false),
	},
});
