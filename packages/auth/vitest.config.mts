import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./__tests__/setup.ts"],
  },
  resolve: {
    alias: {
      "@repo/database": path.resolve(__dirname, "../database/index.ts"),
      // Stub server-only for tests
      "server-only": path.resolve(
        __dirname,
        "./__tests__/stubs/server-only.ts"
      ),
    },
  },
});