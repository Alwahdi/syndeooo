import { type NextRequest, NextResponse } from "next/server";

const publicPaths = [
  "/sign-in",
  "/sign-up",
  "/api/auth",
  "/_next",
  "/favicon.ico",
];

const isPublicPath = (pathname: string) =>
  publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

/**
 * Auth middleware that checks for a session cookie.
 * Redirects unauthenticated users to sign-in for protected routes.
 * Passes through to a callback for additional middleware composition.
 */
export const authMiddleware = (
  callback?: (
    request: NextRequest
  ) => Response | void | undefined | Promise<Response | void | undefined>
) => {
  return async (request: NextRequest) => {
    const { pathname } = request.nextUrl;

    // Skip auth check for public paths
    if (isPublicPath(pathname)) {
      if (callback) {
        const result = await callback(request);
        if (result !== undefined) {
          return result;
        }
      }
      return NextResponse.next();
    }

    // Check for session cookie (better-auth uses "better-auth.session_token")
    const sessionCookie =
      request.cookies.get("better-auth.session_token") ??
      request.cookies.get("__Secure-better-auth.session_token");

    if (!sessionCookie?.value) {
      const signInUrl = new URL("/sign-in", request.url);
      const callbackUrl = pathname + request.nextUrl.search;
      signInUrl.searchParams.set("callbackUrl", callbackUrl);
      return NextResponse.redirect(signInUrl);
    }

    // Run additional middleware if provided
    if (callback) {
      const result = await callback(request);
      if (result !== undefined) {
        return result;
      }
    }

    return NextResponse.next();
  };
};