"use server";

import { currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import { revalidatePath } from "next/cache";

export async function applyForShift(shiftId: string) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const userRole = await database.userRole.findFirst({
    where: { userId: user.id, role: "professional" },
  });

  if (!userRole) {
    return { error: "Only professionals can apply for shifts" };
  }

  const profile = await database.profile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    return { error: "Complete your profile first" };
  }

  const shift = await database.shift.findFirst({
    where: { id: shiftId, status: "open" },
  });

  if (!shift) {
    return { error: "Shift not available" };
  }

  const existing = await database.booking.findFirst({
    where: {
      shiftId,
      professionalId: profile.id,
      status: { notIn: ["cancelled", "declined"] },
    },
  });

  if (existing) {
    return { error: "Already applied for this shift" };
  }

  try {
    await database.booking.create({
      data: {
        shiftId,
        professionalId: profile.id,
        clinicId: shift.clinicId,
        status: "requested",
      },
    });

    revalidatePath("/shifts");
    revalidatePath("/bookings");
    return { success: true };
  } catch (error) {
    console.error("Apply for shift error:", error);
    return { error: "Failed to apply" };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: "accepted" | "declined" | "confirmed" | "cancelled"
) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const booking = await database.booking.findUnique({
    where: { id: bookingId },
    include: { shift: { include: { clinic: true } } },
  });

  if (!booking) {
    return { error: "Booking not found" };
  }

  const isClinicOwner = booking.shift.clinic.userId === user.id;

  const profile = await database.profile.findUnique({
    where: { userId: user.id },
  });
  const isProfessional = profile?.id === booking.professionalId;

  if (
    (["accepted", "declined"].includes(status) && !isClinicOwner) ||
    (["confirmed", "cancelled"].includes(status) && !isProfessional)
  ) {
    return { error: "Not authorized for this action" };
  }

  try {
    await database.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    revalidatePath("/bookings");
    return { success: true };
  } catch (error) {
    console.error("Update booking status error:", error);
    return { error: "Failed to update booking" };
  }
}
