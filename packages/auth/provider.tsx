"use client";

import type { ReactNode } from "react";

interface AuthProviderProperties {
  children: ReactNode;
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
}

/**
 * Auth provider for the application.
 * Better Auth manages sessions via cookies automatically,
 * so no explicit provider wrapping is needed.
 * This component is kept for API compatibility with the design system.
 */
export const AuthProvider = ({ children }: AuthProviderProperties) => {
  return <>{children}</>;
};
