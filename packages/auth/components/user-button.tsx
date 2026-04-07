"use client";

import { signOut, useSession } from "../client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserButtonProps {
  showName?: boolean;
}

export const UserButton = ({ showName }: UserButtonProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

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
    setOpen(false);
    await signOut();
    router.push("/sign-in");
    router.refresh();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSignOut();
    }
  };

  return (
    <div className="relative flex w-full items-center gap-2">
      <button
        className="group relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
        onClick={() => setOpen(!open)}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
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
        <span className="sr-only">User menu</span>
      </button>
      {open && (
        <div
          className="absolute bottom-full left-0 z-50 mb-1 w-48 rounded-md border bg-popover p-1 shadow-md"
          role="menu"
          onKeyDown={handleKeyDown}
        >
          <button
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
            onClick={handleSignOut}
            type="button"
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};