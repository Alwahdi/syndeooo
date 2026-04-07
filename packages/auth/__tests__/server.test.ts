import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/headers
const mockHeaders = vi.fn();
vi.mock("next/headers", () => ({
  headers: () => mockHeaders(),
}));

// Mock the auth module
const mockGetSession = vi.fn();
vi.mock("../auth", () => ({
  auth: {
    api: {
      getSession: mockGetSession,
    },
  },
}));

const { getSession, currentUser, getActiveOrganizationId } = await import(
  "../server"
);

describe("server auth utilities", () => {
  beforeEach(() => {
    mockHeaders.mockReset();
    mockGetSession.mockReset();
  });

  describe("getSession", () => {
    it("calls auth.api.getSession with request headers", async () => {
      const fakeHeaders = new Headers({ cookie: "session=abc" });
      mockHeaders.mockResolvedValue(fakeHeaders);
      mockGetSession.mockResolvedValue({
        session: { id: "sess-1", activeOrganizationId: null },
        user: { id: "user-1", name: "Test", email: "test@test.com" },
      });

      const result = await getSession();

      expect(mockGetSession).toHaveBeenCalledWith({ headers: fakeHeaders });
      expect(result).toEqual({
        session: { id: "sess-1", activeOrganizationId: null },
        user: { id: "user-1", name: "Test", email: "test@test.com" },
      });
    });

    it("returns null when no session exists", async () => {
      mockHeaders.mockResolvedValue(new Headers());
      mockGetSession.mockResolvedValue(null);

      const result = await getSession();

      expect(result).toBeNull();
    });
  });

  describe("currentUser", () => {
    it("returns user when session exists", async () => {
      const user = {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
      };
      mockHeaders.mockResolvedValue(new Headers());
      mockGetSession.mockResolvedValue({
        session: { id: "sess-1" },
        user,
      });

      const result = await currentUser();

      expect(result).toEqual(user);
    });

    it("returns null when session is null", async () => {
      mockHeaders.mockResolvedValue(new Headers());
      mockGetSession.mockResolvedValue(null);

      const result = await currentUser();

      expect(result).toBeNull();
    });

    it("returns null when session has no user", async () => {
      mockHeaders.mockResolvedValue(new Headers());
      mockGetSession.mockResolvedValue({
        session: { id: "sess-1" },
        user: undefined,
      });

      const result = await currentUser();

      expect(result).toBeNull();
    });
  });

  describe("getActiveOrganizationId", () => {
    it("returns organization ID when set", async () => {
      mockHeaders.mockResolvedValue(new Headers());
      mockGetSession.mockResolvedValue({
        session: { id: "sess-1", activeOrganizationId: "org-123" },
        user: { id: "user-1" },
      });

      const result = await getActiveOrganizationId();

      expect(result).toBe("org-123");
    });

    it("returns null when no active organization", async () => {
      mockHeaders.mockResolvedValue(new Headers());
      mockGetSession.mockResolvedValue({
        session: { id: "sess-1", activeOrganizationId: null },
        user: { id: "user-1" },
      });

      const result = await getActiveOrganizationId();

      expect(result).toBeNull();
    });

    it("returns null when session is null", async () => {
      mockHeaders.mockResolvedValue(new Headers());
      mockGetSession.mockResolvedValue(null);

      const result = await getActiveOrganizationId();

      expect(result).toBeNull();
    });

    it("returns null when session object missing activeOrganizationId", async () => {
      mockHeaders.mockResolvedValue(new Headers());
      mockGetSession.mockResolvedValue({
        session: { id: "sess-1" },
        user: { id: "user-1" },
      });

      const result = await getActiveOrganizationId();

      expect(result).toBeNull();
    });
  });
});
