import { currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import { Header } from "../components/header";
import { BookingsList } from "./bookings-list";

export const metadata: Metadata = {
  title: "Bookings — SyndeoCare",
  description: "View and manage your bookings",
};

export default async function BookingsPage() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const clinicRole = await database.userRole.findFirst({
    where: { userId: user.id, role: "clinic" },
  });

  const isClinic = !!clinicRole;

  const bookings = isClinic
    ? await database.booking.findMany({
        where: { shift: { clinic: { userId: user.id } } },
        include: {
          shift: true,
          professional: {
            select: { fullName: true, email: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : await (async () => {
        const profile = await database.profile.findUnique({
          where: { userId: user.id },
        });
        if (!profile) {
          return [];
        }
        return database.booking.findMany({
          where: { professionalId: profile.id },
          include: {
            shift: {
              include: {
                clinic: { select: { name: true, city: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 50,
        });
      })();

  return (
    <>
      <Header page="Bookings" pages={["SyndeoCare"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <BookingsList
          bookings={JSON.parse(JSON.stringify(bookings))}
          isClinic={isClinic}
        />
      </div>
    </>
  );
}