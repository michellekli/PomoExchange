import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	test: {
		include: ["app/**/*.test.ts"],
		coverage: {
			provider: "v8",
			reportsDirectory: "coverage/unit",
		},
	},
});
