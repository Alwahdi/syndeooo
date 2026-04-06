import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
  plugins: [organizationClient()],
});

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;
export const getSession = authClient.getSession;
export const organization = authClient.organization;
