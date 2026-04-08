import "server-only";

import type { AppRole } from "@repo/database";
import { database } from "@repo/database";

/**
 * Get the primary role for a user.
 * Returns the first role found (priority: super_admin > admin > clinic > professional)
 */
export async function getUserRole(userId: string): Promise<AppRole | null> {
  const userRoles = await database.userRole.findMany({
    where: { userId },
  });

  if (userRoles.length === 0) {
    return null;
  }

  // Priority order: super_admin > admin > clinic > professional
  const priority: AppRole[] = ["super_admin", "admin", "clinic", "professional"];

  for (const priorityRole of priority) {
    const foundRole = userRoles.find((ur) => ur.role === priorityRole);
    if (foundRole) {
      return foundRole.role;
    }
  }

  return userRoles[0]?.role ?? null;
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