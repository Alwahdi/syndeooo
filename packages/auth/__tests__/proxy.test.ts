import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/server before importing the module under test
const mockRedirect = vi.fn();
const mockNext = vi.fn(() => new Response("next"));

vi.mock("next/server", () => {
  class MockNextRequest {
    nextUrl: { pathname: string };
    url: string;
    cookies: {
      get: (name: string) => { value: string } | undefined;
    };

    constructor(url: string, options?: { cookies?: Record<string, string> }) {
      const parsed = new URL(url);
      this.nextUrl = { pathname: parsed.pathname };
      this.url = url;
      const cookieStore = options?.cookies ?? {};
      this.cookies = {
        get: (name: string) => {
          const value = cookieStore[name];
          return value ? { value } : undefined;
        },
      };
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      redirect: (url: URL) => {
        mockRedirect(url.toString());
        return new Response(null, {
          status: 302,
          headers: { Location: url.toString() },
        });
      },
      next: () => {
        mockNext();
        return new Response("next");
      },
    },
  };
});

// We need to construct requests manually since we're mocking next/server
function createRequest(
  path: string,
  cookies: Record<string, string> = {}
): any {
  const url = `http://localhost:3000${path}`;
  const parsed = new URL(url);
  return {
    nextUrl: { pathname: parsed.pathname },
    url,
    cookies: {
      get: (name: string) => {
        const value = cookies[name];
        return value ? { value } : undefined;
      },
    },
  };
}

// Import after mocks are set up
const { authMiddleware } = await import("../proxy");

describe("authMiddleware", () => {
  beforeEach(() => {
    mockRedirect.mockClear();
    mockNext.mockClear();
  });

  describe("public paths", () => {
    const publicPaths = [
      "/sign-in",
      "/sign-up",
      "/api/auth",
      "/api/auth/callback/google",
      "/_next/static/chunk.js",
      "/favicon.ico",
    ];

    for (const path of publicPaths) {
      it(`allows access to ${path} without auth`, async () => {
        const middleware = authMiddleware();
        const request = createRequest(path);

        await middleware(request);

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalled();
      });
    }

    it("runs callback on public paths", async () => {
      const callback = vi.fn();
      const middleware = authMiddleware(callback);
      const request = createRequest("/sign-in");

      await middleware(request);

      expect(callback).toHaveBeenCalledWith(request);
    });

    it("returns callback response on public paths if provided", async () => {
      const customResponse = new Response("custom");
      const callback = vi.fn(() => customResponse);
      const middleware = authMiddleware(callback);
      const request = createRequest("/sign-in");

      const result = await middleware(request);

      expect(result).toBe(customResponse);
    });
  });

  describe("protected paths", () => {
    it("redirects to sign-in when no session cookie exists", async () => {
      const middleware = authMiddleware();
      const request = createRequest("/dashboard");

      await middleware(request);

      expect(mockRedirect).toHaveBeenCalledWith(
        "http://localhost:3000/sign-in?callbackUrl=%2Fdashboard"
      );
    });

    it("includes original path as callbackUrl in redirect", async () => {
      const middleware = authMiddleware();
      const request = createRequest("/settings/profile");

      await middleware(request);

      expect(mockRedirect).toHaveBeenCalledWith(
        "http://localhost:3000/sign-in?callbackUrl=%2Fsettings%2Fprofile"
      );
    });

    it("allows access with better-auth.session_token cookie", async () => {
      const middleware = authMiddleware();
      const request = createRequest("/dashboard", {
        "better-auth.session_token": "valid-token-123",
      });

      await middleware(request);

      expect(mockRedirect).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it("allows access with __Secure-better-auth.session_token cookie", async () => {
      const middleware = authMiddleware();
      const request = createRequest("/dashboard", {
        "__Secure-better-auth.session_token": "secure-token-456",
      });

      await middleware(request);

      expect(mockRedirect).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it("runs callback on authenticated protected paths", async () => {
      const callback = vi.fn();
      const middleware = authMiddleware(callback);
      const request = createRequest("/dashboard", {
        "better-auth.session_token": "valid-token",
      });

      await middleware(request);

      expect(callback).toHaveBeenCalledWith(request);
      expect(mockNext).toHaveBeenCalled();
    });

    it("returns callback response on protected paths if provided", async () => {
      const customResponse = new Response("custom protected");
      const callback = vi.fn(() => customResponse);
      const middleware = authMiddleware(callback);
      const request = createRequest("/dashboard", {
        "better-auth.session_token": "valid-token",
      });

      const result = await middleware(request);

      expect(result).toBe(customResponse);
    });

    it("redirects when cookie value is empty", async () => {
      const middleware = authMiddleware();
      const request = createRequest("/dashboard");
      // Override to return an object with empty value
      request.cookies.get = (name: string) => {
        if (name === "better-auth.session_token") return { value: "" };
        return undefined;
      };

      await middleware(request);

      expect(mockRedirect).toHaveBeenCalled();
    });
  });

  describe("middleware composition", () => {
    it("works without callback", async () => {
      const middleware = authMiddleware();
      const request = createRequest("/sign-in");

      const result = await middleware(request);

      expect(result).toBeDefined();
    });

    it("handles async callback", async () => {
      const callback = vi.fn(async () => {
        return new Response("async response");
      });
      const middleware = authMiddleware(callback);
      const request = createRequest("/dashboard", {
        "better-auth.session_token": "valid-token",
      });

      const result = await middleware(request);

      expect(callback).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Response);
    });

    it("handles callback that returns void", async () => {
      const callback = vi.fn(() => undefined);
      const middleware = authMiddleware(callback);
      const request = createRequest("/dashboard", {
        "better-auth.session_token": "valid-token",
      });

      await middleware(request);

      expect(callback).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
