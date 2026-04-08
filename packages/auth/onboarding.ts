import "server-only";

import type { AppRole } from "@repo/database";
import { database } from "@repo/database";

/**
 * Check if a user has completed their onboarding based on role.
 */
export async function isOnboardingComplete(
  userId: string,
  role: AppRole
): Promise<boolean> {
  if (role === "professional") {
    const profile = await database.profile.findUnique({
      where: { userId },
      select: { onboardingCompleted: true },
    });
    return profile?.onboardingCompleted ?? false;
  }

  if (role === "clinic") {
    const clinic = await database.clinic.findUnique({
      where: { userId },
      select: { onboardingCompleted: true },
    });
    return clinic?.onboardingCompleted ?? false;
  }

  // Admins don't need onboarding
  return true;
}

/**
 * Mark onboarding as complete for a user.
 */
export async function markOnboardingComplete(
  userId: string,
  role: AppRole
): Promise<void> {
  if (role === "professional") {
    await database.profile.update({
      where: { userId },
      data: { onboardingCompleted: true },
    });
  } else if (role === "clinic") {
    await database.clinic.update({
      where: { userId },
      data: { onboardingCompleted: true },
    });
  }
}

/**
 * Get the redirect path based on user role and onboarding status.
 */
export async function getAuthRedirectPath(
  userId: string,
  role: AppRole
): Promise<string> {
  const onboarded = await isOnboardingComplete(userId, role);

  if (!onboarded) {
    if (role === "professional") {
      return "/onboarding/professional";
    }
    if (role === "clinic") {
      return "/onboarding/clinic";
    }
  }

  switch (role) {
    case "professional":
      return "/dashboard/professional";
    case "clinic":
      return "/dashboard/clinic";
    case "admin":
    case "super_admin":
      return "/dashboard/admin";
    default:
      return "/";
  }
}
