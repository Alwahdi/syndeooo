import "server-only";

import type { AppRole } from "@repo/database";
import { database } from "@repo/database";

/**
 * Get the primary role for a user.
 * Returns the first role found (priority: super_admin > admin > clinic > professional)
 */
export async function getUserRole(userId: string): Promise<AppRole | null> {
  const userRole = await database.userRole.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
  return userRole?.role ?? null;
}

/**
 * Check if user has a specific role.
 * Super admins are considered to have all roles.
 */
export async function hasRole(userId: string, role: AppRole): Promise<boolean> {
  const isSuperAdminUser = await isSuperAdmin(userId);
  if (isSuperAdminUser) {
    return true;
  }

  const userRole = await database.userRole.findFirst({
    where: { userId, role },
  });
  return !!userRole;
}

/**
 * Check if user is a super admin.
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  const userRole = await database.userRole.findFirst({
    where: { userId, role: "super_admin" },
  });
  return !!userRole;
}

/**
 * Assign a role to a user. Creates the role if it doesn't exist.
 */
export async function assignRole(userId: string, role: AppRole): Promise<void> {
  await database.userRole.upsert({
    where: { userId_role: { userId, role } },
    update: {},
    create: { userId, role },
  });
}
