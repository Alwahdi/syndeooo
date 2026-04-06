import { analytics } from "@repo/analytics/server";
import { getSession } from "@repo/auth/server";
import { flag } from "flags/next";

export const createFlag = (key: string) =>
  flag({
    key,
    defaultValue: false,
    async decide() {
      const session = await getSession();
      const userId = session?.user?.id;

      if (!userId) {
        return this.defaultValue as boolean;
      }

      if (!analytics) {
        return this.defaultValue as boolean;
      }

      const isEnabled = await analytics.isFeatureEnabled(key, userId);

      return isEnabled ?? (this.defaultValue as boolean);
    },
  });
