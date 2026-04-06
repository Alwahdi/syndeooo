import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./__tests__/setup.ts"],
  },
  resolve: {
    alias: {
      "@repo/database": path.resolve(
        import.meta.dirname,
        "../database/index.ts"
      ),
      // Stub server-only for tests
      "server-only": path.resolve(
        import.meta.dirname,
        "./__tests__/stubs/server-only.ts"
      ),
    },
  },
});
