import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock database
const mockCreate = vi.fn();
const mockDelete = vi.fn();
vi.mock("@repo/database", () => ({
  database: {
    page: {
      create: (args: unknown) => mockCreate(args),
      delete: (args: unknown) => mockDelete(args),
    },
  },
}));

import { GET } from "../app/cron/keep-alive/route";

describe("Keep-Alive Cron Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({ id: 42, name: "cron-temp" });
    mockDelete.mockResolvedValue({ id: 42, name: "cron-temp" });
  });

  it("creates and deletes a temp page to keep DB alive", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("OK");

    expect(mockCreate).toHaveBeenCalledWith({
      data: { name: "cron-temp" },
    });
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: 42 },
    });
  });

  it("uses the created page id for deletion", async () => {
    mockCreate.mockResolvedValue({ id: 99, name: "cron-temp" });

    await GET();

    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: 99 },
    });
  });
});
