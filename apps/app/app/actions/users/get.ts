"use server";

import { getActiveOrganizationId } from "@repo/auth/server";
import { database } from "@repo/database";

const colors = [
  "var(--color-red-500)",
  "var(--color-orange-500)",
  "var(--color-amber-500)",
  "var(--color-yellow-500)",
  "var(--color-lime-500)",
  "var(--color-green-500)",
  "var(--color-emerald-500)",
  "var(--color-teal-500)",
  "var(--color-cyan-500)",
  "var(--color-sky-500)",
  "var(--color-blue-500)",
  "var(--color-indigo-500)",
  "var(--color-violet-500)",
  "var(--color-purple-500)",
  "var(--color-fuchsia-500)",
  "var(--color-pink-500)",
  "var(--color-rose-500)",
];

export const getUsers = async (
  userIds: string[]
): Promise<
  | {
      data: Liveblocks["UserMeta"]["info"][];
    }
  | {
      error: unknown;
    }
> => {
  try {
    const orgId = await getActiveOrganizationId();

    if (!orgId) {
      throw new Error("No active organization selected");
    }

    const members = await database.member.findMany({
      where: {
        organizationId: orgId,
        userId: { in: userIds },
      },
      include: {
        user: true,
      },
    });

    const data: Liveblocks["UserMeta"]["info"][] = members.map((member) => {
      // Deterministic color based on user ID
      const hash = member.user.id
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const colorIndex = hash % colors.length;

      return {
        name: member.user.name ?? "Unknown user",
        picture: member.user.image ?? "",
        color: colors[colorIndex],
      };
    });

    return { data };
  } catch (error) {
    return { error };
  }
};
