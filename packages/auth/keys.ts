import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return createEnv({
    server: {
      BETTER_AUTH_SECRET: isProduction
        ? z.string().min(32)
        : z.string().min(32).default("dev-secret-key-minimum-32-chars-long"),
      BETTER_AUTH_URL: z.string().url().optional(),
      BETTER_AUTH_TRUSTED_ORIGINS: z.string().optional(),
      GOOGLE_CLIENT_ID: z.string().optional(),
      GOOGLE_CLIENT_SECRET: z.string().optional(),
      GITHUB_CLIENT_ID: z.string().optional(),
      GITHUB_CLIENT_SECRET: z.string().optional(),
    },
    client: {},
    runtimeEnv: {
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
      BETTER_AUTH_TRUSTED_ORIGINS: process.env.BETTER_AUTH_TRUSTED_ORIGINS,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    },
  });
};