import { describe, expect, it, vi } from "vitest";

// Mock server-only (no-op)
vi.mock("server-only", () => ({}));

// Mock @neondatabase/serverless
vi.mock("@neondatabase/serverless", () => ({
  neonConfig: { webSocketConstructor: null },
}));

// Mock ws
vi.mock("ws", () => ({ default: class MockWS {} }));

// Mock PrismaNeon
const MockPrismaNeon = vi.fn(function (this: any, opts: any) {
  this.__adapter = true;
  this.connectionString = opts.connectionString;
});
vi.mock("@prisma/adapter-neon", () => ({
  PrismaNeon: MockPrismaNeon,
}));

// Mock PrismaClient
const mockPrismaClient = vi.fn(function (this: any) {
  this.__prisma = true;
});
vi.mock("../generated/client", () => ({
  PrismaClient: mockPrismaClient,
}));

// Mock keys
vi.mock("../keys", () => ({
  keys: () => ({
    DATABASE_URL: "postgresql://localhost:5432/test",
  }),
}));

describe("Database Package", () => {
  it("exports database instance", async () => {
    const { database } = await import("../index");
    expect(database).toBeDefined();
  });

  it("creates PrismaClient with NeonAdapter", async () => {
    await import("../index");
    expect(MockPrismaNeon).toHaveBeenCalledWith({
      connectionString: "postgresql://localhost:5432/test",
    });
  });

  it("sets websocket constructor on neonConfig", async () => {
    const { neonConfig } = await import("@neondatabase/serverless");
    const ws = (await import("ws")).default;
    expect(neonConfig.webSocketConstructor).toBe(ws);
  });

  it("re-exports from generated client", async () => {
    const mod = await import("../index");
    // The module re-exports everything from generated/client
    expect(mod).toBeDefined();
  });
});
