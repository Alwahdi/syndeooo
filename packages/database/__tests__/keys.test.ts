import { describe, expect, it } from "vitest";

describe("Database Keys", () => {
  it("requires DATABASE_URL environment variable", async () => {
    // keys() uses t3-oss/env which validates at call time
    const originalEnv = process.env.DATABASE_URL;

    // With a valid URL, it should work
    process.env.DATABASE_URL = "postgresql://localhost:5432/test";
    const { keys } = await import("../keys");
    const env = keys();
    expect(env.DATABASE_URL).toBe("postgresql://localhost:5432/test");

    // Restore
    process.env.DATABASE_URL = originalEnv;
  });
});
