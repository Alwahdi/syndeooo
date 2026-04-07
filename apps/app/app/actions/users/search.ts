"use server";

import { getActiveOrganizationId } from "@repo/auth/server";
import { database } from "@repo/database";
import Fuse from "fuse.js";

export const searchUsers = async (
  query: string
): Promise<
  | {
      data: string[];
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
      },
      include: {
        user: true,
      },
    });

    const users = members.map((member) => ({
      id: member.userId,
      name: member.user.name ?? member.user.email,
      imageUrl: member.user.image,
    }));

    const fuse = new Fuse(users, {
      keys: ["name"],
      minMatchCharLength: 1,
      threshold: 0.3,
    });

    const results = fuse.search(query);
    const data = results.map((result) => result.item.id);

    return { data };
  } catch (error) {
    return { error };
  }
};