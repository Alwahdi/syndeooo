import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock @t3-oss/env-nextjs to avoid client/server env access restrictions in tests
vi.mock("@t3-oss/env-nextjs", () => ({
  createEnv: ({ server, runtimeEnv }: any) => {
    // Simple validation: just return the runtime env values
    return { ...runtimeEnv };
  },
}));

describe("keys - environment validation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("accepts valid environment variables", async () => {
    process.env.BETTER_AUTH_SECRET =
      "a-very-long-secret-that-has-at-least-32-characters";
    process.env.BETTER_AUTH_URL = "http://localhost:3000";
    process.env.BETTER_AUTH_TRUSTED_ORIGINS = "http://localhost:3000";
    process.env.GOOGLE_CLIENT_ID = "google-id";
    process.env.GOOGLE_CLIENT_SECRET = "google-secret";
    process.env.GITHUB_CLIENT_ID = "github-id";
    process.env.GITHUB_CLIENT_SECRET = "github-secret";

    const { keys } = await import("../keys");
    const env = keys();

    expect(env.BETTER_AUTH_SECRET).toBe(
      "a-very-long-secret-that-has-at-least-32-characters"
    );
    expect(env.BETTER_AUTH_URL).toBe("http://localhost:3000");
    expect(env.BETTER_AUTH_TRUSTED_ORIGINS).toBe("http://localhost:3000");
    expect(env.GOOGLE_CLIENT_ID).toBe("google-id");
    expect(env.GOOGLE_CLIENT_SECRET).toBe("google-secret");
    expect(env.GITHUB_CLIENT_ID).toBe("github-id");
    expect(env.GITHUB_CLIENT_SECRET).toBe("github-secret");
  });

  it("allows all variables to be optional/undefined", async () => {
    delete process.env.BETTER_AUTH_SECRET;
    delete process.env.BETTER_AUTH_URL;
    delete process.env.BETTER_AUTH_TRUSTED_ORIGINS;
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.GITHUB_CLIENT_ID;
    delete process.env.GITHUB_CLIENT_SECRET;

    const { keys } = await import("../keys");
    const env = keys();

    expect(env.BETTER_AUTH_SECRET).toBeUndefined();
    expect(env.BETTER_AUTH_URL).toBeUndefined();
  });

  it("passes through all configured server env key names", async () => {
    const { keys } = await import("../keys");
    const env = keys();

    // Verify the expected keys are present (even if undefined)
    const envKeys = Object.keys(env);
    expect(envKeys).toContain("BETTER_AUTH_SECRET");
    expect(envKeys).toContain("BETTER_AUTH_URL");
    expect(envKeys).toContain("BETTER_AUTH_TRUSTED_ORIGINS");
    expect(envKeys).toContain("GOOGLE_CLIENT_ID");
    expect(envKeys).toContain("GOOGLE_CLIENT_SECRET");
    expect(envKeys).toContain("GITHUB_CLIENT_ID");
    expect(envKeys).toContain("GITHUB_CLIENT_SECRET");
  });
});
