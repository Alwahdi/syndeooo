import { currentUser } from "@repo/auth/server";
import type { Metadata } from "next";
import { Header } from "../components/header";

export const metadata: Metadata = {
  title: "Settings — SyndeoCare",
  description: "App settings and preferences",
};

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  return (
    <>
      <Header page="Settings" pages={["SyndeoCare"]} />
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="max-w-2xl space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold text-lg">Account</h2>
            <p className="mt-1 text-muted-foreground text-sm">
              Manage your account settings
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Name</p>
                  <p className="text-muted-foreground text-sm">
                    {user.name ?? "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold text-lg">Notifications</h2>
            <p className="mt-1 text-muted-foreground text-sm">
              Configure how you receive notifications
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-muted-foreground text-sm">
                    Receive updates about shifts and bookings
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-muted-foreground text-sm">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
