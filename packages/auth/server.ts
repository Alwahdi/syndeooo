import "server-only";

import { headers } from "next/headers";
import { auth, type Session, type User } from "./auth";

export { auth } from "./auth";
export type { Session, User } from "./auth";

/**
 * Get the current session on the server side.
 * Returns the session and user, or null values if not authenticated.
 */
export const getSession = async () => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  return session;
};

/**
 * Get the current authenticated user.
 * Returns null if not authenticated.
 */
export const currentUser = async (): Promise<User | null> => {
  const session = await getSession();
  return session?.user ?? null;
};

/**
 * Get the current active organization ID.
 * Returns null if no organization is active.
 */
export const getActiveOrganizationId = async (): Promise<string | null> => {
  const session = await getSession();
  return session?.session?.activeOrganizationId ?? null;
};
