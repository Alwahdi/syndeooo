import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@repo/design-system": path.resolve(import.meta.dirname, "./"),
    },
  },
});
