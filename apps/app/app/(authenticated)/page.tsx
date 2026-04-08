import { getUserRole } from "@repo/auth/roles";
import { currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import {
  AlertCircleIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { Header } from "./components/header";

const title = "Dashboard";
const description = "SyndeoCare Dashboard";

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const role = (await getUserRole(user.id)) ?? "professional";

  // Fetch stats based on role
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  if (role === "clinic") {
    const [activeShifts, totalBookings, pendingBookings] = await Promise.all([
      database.shift.count({
        where: {
          clinic: { userId: user.id },
          shiftDate: { gte: startOfDay },
          status: "open",
        },
      }),
      database.booking.count({
        where: {
          shift: { clinic: { userId: user.id } },
        },
      }),
      database.booking.count({
        where: {
          shift: { clinic: { userId: user.id } },
          status: "requested",
        },
      }),
    ]);

    return (
      <>
        <Header page="Dashboard" pages={["SyndeoCare"]}>
          <div className="pr-4 text-muted-foreground text-sm">
            Welcome back, {user.name}
          </div>
        </Header>
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              accent="primary"
              icon={<BriefcaseIcon className="h-4 w-4" />}
              label="Active Shifts"
              value={activeShifts}
            />
            <StatCard
              accent="accent"
              icon={<CalendarIcon className="h-4 w-4" />}
              label="Total Bookings"
              value={totalBookings}
            />
            <StatCard
              accent="warning"
              icon={<AlertCircleIcon className="h-4 w-4" />}
              label="Pending Review"
              value={pendingBookings}
            />
          </div>
          <div className="flex-1 rounded-xl border bg-card p-6">
            <h2 className="mb-4 font-semibold text-lg">Quick Actions</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <QuickAction
                description="Create a shift listing for healthcare professionals"
                href="/shifts"
                title="Post a New Shift"
              />
              <QuickAction
                description="Review and manage pending booking requests"
                href="/bookings"
                title="Review Bookings"
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  // Professional dashboard (default)
  const [upcomingShifts, completedShifts, profile] = await Promise.all([
    database.booking.count({
      where: {
        professional: { userId: user.id },
        status: { in: ["confirmed", "accepted"] },
        shift: { shiftDate: { gte: startOfDay } },
      },
    }),
    database.booking.count({
      where: {
        professional: { userId: user.id },
        status: "completed",
      },
    }),
    database.profile.findUnique({
      where: { userId: user.id },
    }),
  ]);

  return (
    <>
      <Header page="Dashboard" pages={["SyndeoCare"]}>
        <div className="pr-4 text-muted-foreground text-sm">
          Welcome back, {user.name}
        </div>
      </Header>
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            accent="primary"
            icon={<CalendarIcon className="h-4 w-4" />}
            label="Upcoming Shifts"
            value={upcomingShifts}
          />
          <StatCard
            accent="accent"
            icon={<ClockIcon className="h-4 w-4" />}
            label="Completed Shifts"
            value={completedShifts}
          />
          <StatCard
            accent="warning"
            icon={<StarIcon className="h-4 w-4" />}
            label="Rating"
            value={
              profile?.ratingAvg != null
                ? `${Number(profile.ratingAvg).toFixed(1)}`
                : "N/A"
            }
          />
        </div>
        <div className="flex-1 rounded-xl border bg-card p-6">
          <h2 className="mb-4 font-semibold text-lg">Quick Actions</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <QuickAction
              description="Browse available shifts near you"
              href="/shifts"
              title="Find Shifts"
            />
            <QuickAction
              description="Keep your qualifications and documents up to date"
              href="/profile"
              title="Update Profile"
            />
          </div>
        </div>
      </div>
    </>
  );
};

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent: "primary" | "accent" | "warning";
}) {
  const accentClasses = {
    primary: "text-primary",
    accent: "text-accent",
    warning: "text-amber-500",
  };

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className={`mt-2 font-bold text-3xl ${accentClasses[accent]}`}>
        {value}
      </div>
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a
      className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
      href={href}
    >
      <div className="font-medium">{title}</div>
      <div className="mt-1 text-muted-foreground text-sm">{description}</div>
    </a>
  );
}

export default App;