"use server";

import { currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import { revalidatePath } from "next/cache";

interface CreateShiftInput {
  city: string;
  description?: string;
  endTime: string;
  hourlyRate: number;
  locationAddress: string;
  requiredCertifications?: string[];
  roleRequired: string;
  shiftDate: string;
  startTime: string;
  title: string;
}

export async function createShift(input: CreateShiftInput) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const clinic = await database.clinic.findUnique({
    where: { userId: user.id },
  });

  if (!clinic) {
    return { error: "Only clinics can create shifts" };
  }

  try {
    const shift = await database.shift.create({
      data: {
        clinicId: clinic.id,
        title: input.title,
        description: input.description,
        roleRequired: input.roleRequired,
        shiftDate: new Date(`${input.shiftDate}T00:00:00`),
        startTime: input.startTime,
        endTime: input.endTime,
        hourlyRate: input.hourlyRate,
        locationAddress: input.locationAddress,
        city: input.city,
        requiredCertifications: input.requiredCertifications ?? [],
        status: "open",
      },
    });

    revalidatePath("/shifts");
    return { success: true, shiftId: shift.id };
  } catch (error) {
    console.error("Create shift error:", error);
    return { error: "Failed to create shift" };
  }
}

export async function getShifts(filters?: {
  city?: string;
  role?: string;
  search?: string;
}) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized", shifts: [] };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const where: Record<string, unknown> = {
    status: "open",
    shiftDate: { gte: today },
  };

  if (filters?.city) {
    where.city = filters.city;
  }
  if (filters?.role) {
    where.roleRequired = filters.role;
  }
  if (filters?.search) {
    where.title = { contains: filters.search, mode: "insensitive" };
  }

  const shifts = await database.shift.findMany({
    where,
    include: {
      clinic: { select: { name: true, city: true, ratingAvg: true } },
      _count: { select: { bookings: true } },
    },
    orderBy: { shiftDate: "asc" },
    take: 50,
  });

  return { shifts };
}

export async function getMyShifts() {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized", shifts: [] };
  }

  const clinic = await database.clinic.findUnique({
    where: { userId: user.id },
  });

  if (!clinic) {
    return { error: "No clinic found", shifts: [] };
  }

  const shifts = await database.shift.findMany({
    where: { clinicId: clinic.id },
    include: {
      _count: { select: { bookings: true } },
    },
    orderBy: { shiftDate: "desc" },
    take: 50,
  });

  return { shifts };
}

export async function cancelShift(shiftId: string) {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const clinic = await database.clinic.findUnique({
    where: { userId: user.id },
  });

  if (!clinic) {
    return { error: "Unauthorized" };
  }

  const shift = await database.shift.findFirst({
    where: { id: shiftId, clinicId: clinic.id },
  });

  if (!shift) {
    return { error: "Shift not found" };
  }

  await database.$transaction([
    database.booking.updateMany({
      where: {
        shiftId,
        status: { in: ["requested", "accepted", "confirmed"] },
      },
      data: { status: "cancelled" },
    }),
    database.shift.update({
      where: { id: shiftId },
      data: { status: "cancelled" },
    }),
  ]);

  revalidatePath("/shifts");
  revalidatePath("/bookings");
  return { success: true };
}
