"use server";

import { currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import { revalidatePath } from "next/cache";

interface ProfessionalOnboardingInput {
  bio: string;
  city: string;
  jobRoleId: string;
  licenseNumber?: string;
  phone: string;
  yearsOfExperience: number;
}

export async function completeProfessionalOnboarding(
  input: ProfessionalOnboardingInput
) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await database.$transaction(async (tx) => {
      // Update profile
      await tx.profile.upsert({
        where: { userId: user.id },
        update: {
          phone: input.phone,
          bio: input.bio,
          city: input.city,
          yearsOfExperience: input.yearsOfExperience,
          jobRoleId: input.jobRoleId,
          licenseNumber: input.licenseNumber,
          onboardingCompleted: true,
        },
        create: {
          userId: user.id,
          phone: input.phone,
          bio: input.bio,
          city: input.city,
          yearsOfExperience: input.yearsOfExperience,
          jobRoleId: input.jobRoleId,
          licenseNumber: input.licenseNumber,
          onboardingCompleted: true,
        },
      });
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Professional onboarding error:", error);
    return { error: "Failed to complete onboarding" };
  }
}
