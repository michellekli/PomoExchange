import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vitest.browser.base";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			include: ["app/**/*.mobile.test.tsx"],
			browser: {
				viewport: {
					width: 390,
					height: 844,
				},
			},
		},
	}),
);
