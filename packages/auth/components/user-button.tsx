"use client";

import { signOut, useSession } from "../client";
import { useRouter } from "next/navigation";

interface UserButtonProps {
  showName?: boolean;
  appearance?: {
    elements?: Record<string, string>;
  };
}

export const UserButton = ({ showName }: UserButtonProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0]?.toUpperCase() ?? "?";

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <div className="flex w-full items-center gap-2">
      <button
        className="group relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
        onClick={handleSignOut}
        type="button"
      >
        {user.image ? (
          <img
            alt={user.name ?? "User avatar"}
            className="h-8 w-8 shrink-0 rounded-full"
            src={user.image}
          />
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            {initials}
          </div>
        )}
        {showName && (
          <span className="truncate text-sm">{user.name ?? user.email}</span>
        )}
        <span className="sr-only">Sign out</span>
      </button>
    </div>
  );
};
