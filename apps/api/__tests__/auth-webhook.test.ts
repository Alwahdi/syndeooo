import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock analytics
const mockIdentify = vi.fn();
const mockCapture = vi.fn();
const mockShutdown = vi.fn();
vi.mock("@repo/analytics/server", () => ({
  analytics: {
    identify: (args: unknown) => mockIdentify(args),
    capture: (args: unknown) => mockCapture(args),
    shutdown: () => mockShutdown(),
  },
}));

// Mock observability
vi.mock("@repo/observability/log", () => ({
  log: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

import { POST } from "../app/webhooks/auth/route";

describe("Auth Webhook Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles user.created event", async () => {
    const payload = {
      event: "user.created",
      data: {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        image: "https://example.com/avatar.png",
      },
    };

    const request = new Request("http://localhost/webhooks/auth", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ ok: true });

    expect(mockIdentify).toHaveBeenCalledWith({
      distinctId: "user-123",
      properties: expect.objectContaining({
        email: "test@example.com",
        name: "Test User",
        avatar: "https://example.com/avatar.png",
      }),
    });
    expect(mockCapture).toHaveBeenCalledWith({
      event: "User Created",
      distinctId: "user-123",
    });
    expect(mockShutdown).toHaveBeenCalled();
  });

  it("handles user.updated event", async () => {
    const payload = {
      event: "user.updated",
      data: {
        id: "user-123",
        email: "updated@example.com",
        name: "Updated Name",
        image: null,
      },
    };

    const request = new Request("http://localhost/webhooks/auth", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    expect(mockCapture).toHaveBeenCalledWith({
      event: "User Updated",
      distinctId: "user-123",
    });
  });

  it("handles unknown events gracefully", async () => {
    const payload = {
      event: "user.deleted",
      data: { id: "user-123" },
    };

    const request = new Request("http://localhost/webhooks/auth", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ ok: true });
  });

  it("handles events without an id in data", async () => {
    const payload = {
      event: "user.created",
      data: { email: "no-id@example.com" },
    };

    const request = new Request("http://localhost/webhooks/auth", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    // Should NOT call identify/capture without an id
    expect(mockIdentify).not.toHaveBeenCalled();
    expect(mockCapture).not.toHaveBeenCalled();
  });

  it("returns 500 on invalid JSON", async () => {
    const request = new Request("http://localhost/webhooks/auth", {
      method: "POST",
      body: "not json",
      headers: { "Content-Type": "application/json" },
    });

    const response = await POST(request);
    expect(response.status).toBe(500);

    const body = await response.json();
    expect(body).toEqual({ error: "Webhook processing failed" });
  });

  it("calls analytics.shutdown after processing", async () => {
    const payload = {
      event: "user.created",
      data: { id: "user-1", email: "test@test.com" },
    };

    const request = new Request("http://localhost/webhooks/auth", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    await POST(request);
    expect(mockShutdown).toHaveBeenCalledTimes(1);
  });
});
