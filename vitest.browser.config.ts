import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vitest.browser.base";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			include: [
				"app/**/*.test.tsx",
				"!app/**/*.mobile.test.tsx", // exclude mobile viewport tests
			],
			browser: {
				viewport: {
					width: 390,
					height: 844,
				},
			},
		},
	}),
);
