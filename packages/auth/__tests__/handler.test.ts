import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock better-auth/next-js
vi.mock("better-auth/next-js", () => ({
  toNextJsHandler: vi.fn(() => ({
    GET: vi.fn(),
    POST: vi.fn(),
  })),
}));

// Mock the auth module
vi.mock("../auth", () => ({
  auth: { id: "mock-auth-instance" },
}));

describe("handler", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("exports GET and POST handlers", async () => {
    const { GET, POST } = await import("../handler");

    expect(GET).toBeDefined();
    expect(typeof GET).toBe("function");
    expect(POST).toBeDefined();
    expect(typeof POST).toBe("function");
  });

  it("calls toNextJsHandler with auth instance", async () => {
    await import("../handler");
    const { toNextJsHandler } = await import("better-auth/next-js");
    const { auth } = await import("../auth");

    expect(toNextJsHandler).toHaveBeenCalledTimes(1);
    expect(toNextJsHandler).toHaveBeenCalledWith(auth);
  });
});
