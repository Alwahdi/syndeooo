"use server";

import { currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import { revalidatePath } from "next/cache";

interface ClinicOnboardingInput {
  address: string;
  city: string;
  clinicName: string;
  description: string;
  licenseNumber?: string;
  phone: string;
  specialties: string[];
}

export async function completeClinicOnboarding(input: ClinicOnboardingInput) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    await database.$transaction(async (tx) => {
      // Update clinic
      await tx.clinic.upsert({
        where: { userId: user.id },
        update: {
          name: input.clinicName,
          phone: input.phone,
          address: input.address,
          city: input.city,
          description: input.description,
          specialties: input.specialties,
          licenseNumber: input.licenseNumber,
          onboardingCompleted: true,
        },
        create: {
          userId: user.id,
          name: input.clinicName,
          phone: input.phone,
          address: input.address,
          city: input.city,
          description: input.description,
          specialties: input.specialties,
          licenseNumber: input.licenseNumber,
          onboardingCompleted: true,
        },
      });
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Clinic onboarding error:", error);
    return { error: "Failed to complete onboarding" };
  }
}
