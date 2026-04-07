import { describe, expect, it, vi } from "vitest";

// Test that env.ts structure is valid
describe("Web App Environment", () => {
  it("env module exports an env object", async () => {
    // Mock all the key imports to avoid real env validation
    vi.mock("@repo/cms/keys", () => ({ keys: () => ({}) }));
    vi.mock("@repo/email/keys", () => ({ keys: () => ({}) }));
    vi.mock("@repo/feature-flags/keys", () => ({ keys: () => ({}) }));
    vi.mock("@repo/next-config/keys", () => ({ keys: () => ({}) }));
    vi.mock("@repo/observability/keys", () => ({ keys: () => ({}) }));
    vi.mock("@repo/rate-limit/keys", () => ({ keys: () => ({}) }));
    vi.mock("@repo/security/keys", () => ({ keys: () => ({}) }));
    vi.mock("@t3-oss/env-nextjs", () => ({
      createEnv: (config: unknown) => ({ __mocked: true }),
    }));

    const { env } = await import("../env");
    expect(env).toBeDefined();
  });
});
