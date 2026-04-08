import { currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import { Header } from "../components/header";
import { ShiftsList } from "./shifts-list";

export const metadata: Metadata = {
  title: "Shifts — SyndeoCare",
  description: "Browse and manage shifts",
};

export default async function ShiftsPage() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userRole = await database.userRole.findFirst({
    where: { userId: user.id },
  });

  const isClinic = userRole?.role === "clinic";

  // Fetch shifts
  const now = new Date();
  const shifts = isClinic
    ? await database.shift.findMany({
        where: {
          clinic: { userId: user.id },
        },
        include: {
          _count: { select: { bookings: true } },
        },
        orderBy: { shiftDate: "desc" },
        take: 50,
      })
    : await database.shift.findMany({
        where: {
          status: "open",
          shiftDate: { gte: now },
        },
        include: {
          clinic: { select: { name: true } },
          _count: { select: { bookings: true } },
        },
        orderBy: { shiftDate: "asc" },
        take: 50,
      });

  return (
    <>
      <Header
        page={isClinic ? "Manage Shifts" : "Find Shifts"}
        pages={["SyndeoCare"]}
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ShiftsList
          isClinic={isClinic}
          shifts={JSON.parse(JSON.stringify(shifts))}
          userId={user.id}
        />
      </div>
    </>
  );
}
