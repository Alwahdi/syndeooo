import { currentUser } from "@repo/auth/server";
import { database } from "@repo/database";
import type { Metadata } from "next";
import { Header } from "../components/header";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Profile — SyndeoCare",
  description: "Manage your profile",
};

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userRole = await database.userRole.findFirst({
    where: { userId: user.id },
  });

  const isClinic = userRole?.role === "clinic";

  const profile = await database.profile.findUnique({
    where: { userId: user.id },
    include: { jobRole: true },
  });

  const clinic = isClinic
    ? await database.clinic.findUnique({ where: { userId: user.id } })
    : null;

  const jobRoles = await database.jobRole.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Header page="Profile" pages={["SyndeoCare"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ProfileForm
          clinic={clinic ? JSON.parse(JSON.stringify(clinic)) : null}
          isClinic={isClinic}
          jobRoles={JSON.parse(JSON.stringify(jobRoles))}
          profile={profile ? JSON.parse(JSON.stringify(profile)) : null}
          user={JSON.parse(JSON.stringify(user))}
        />
      </div>
    </>
  );
}
