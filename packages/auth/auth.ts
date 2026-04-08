import "server-only";

import { database } from "@repo/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";
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
    google:
      env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
        ? {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          }
        : undefined,
    github:
      env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
        ? {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
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
        .map((o) => o.trim())
        .filter(Boolean)
    : [],

  user: {
    additionalFields: {
      selectedRole: {
        type: "string",
        required: false,
        input: true,
        fieldName: "selectedRole",
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const role =
            (user.selectedRole as "professional" | "clinic") || "professional";

          // Create user role
          await database.userRole.create({
            data: { userId: user.id, role },
          });

          // Create empty profile or clinic record
          if (role === "professional") {
            await database.profile.create({
              data: {
                userId: user.id,
                email: user.email,
                fullName: user.name,
                specialties: [],
                qualifications: [],
              },
            });
          } else if (role === "clinic") {
            await database.clinic.create({
              data: {
                userId: user.id,
                email: user.email,
                name: user.name,
                specialties: [],
              },
            });
          }

          // Create default user preferences
          await database.userPreferences.create({
            data: { userId: user.id },
          });
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
