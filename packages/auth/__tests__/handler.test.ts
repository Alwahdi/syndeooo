import { describe, it, expect, vi } from "vitest";

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
  it("exports GET and POST handlers", async () => {
    const { GET, POST } = await import("../handler");

    expect(GET).toBeDefined();
    expect(typeof GET).toBe("function");
    expect(POST).toBeDefined();
    expect(typeof POST).toBe("function");
  });

  it("calls toNextJsHandler with auth instance", async () => {
    const { toNextJsHandler } = await import("better-auth/next-js");
    const { auth } = await import("../auth");

    // handler.ts was already imported and evaluated above
    await import("../handler");

    expect(toNextJsHandler).toHaveBeenCalled();
    expect(toNextJsHandler).toHaveBeenCalledWith(auth);
  });
});