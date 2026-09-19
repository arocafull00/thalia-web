import path from "path";

import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "server-only": path.resolve(__dirname, "./src/tests/server-only-stub.ts"),
    },
  },
  test: {
    environment: "jsdom",
    exclude: [
      ...configDefaults.exclude,
      "**/src/tests/e2e/**",
      "**/.codex-worktrees/**",
    ],
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    mockReset: true,
  },
});
