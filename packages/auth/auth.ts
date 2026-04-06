import "server-only";

import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { database } from "@repo/database";
import { keys } from "./keys";

const env = keys();

export const auth = betterAuth({
  database: prismaAdapter(database, {
    provider: "postgresql",
  }),

  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: env.GOOGLE_CLIENT_ID
      ? {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET!,
        }
      : undefined,
    github: env.GITHUB_CLIENT_ID
      ? {
          clientId: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET!,
        }
      : undefined,
  },

  plugins: [
    organization({
      allowUserToCreateOrganization: true,
    }),
  ],

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  trustedOrigins: env.BETTER_AUTH_TRUSTED_ORIGINS
    ? env.BETTER_AUTH_TRUSTED_ORIGINS.split(",")
    : [],
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
