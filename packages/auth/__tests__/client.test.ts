import { describe, expect, it, vi } from "vitest";

// Mock better-auth/react — vi.mock is hoisted, so use vi.hoisted for shared state
const { mockClient } = vi.hoisted(() => ({
  mockClient: {
    signIn: { email: vi.fn(), social: vi.fn() },
    signUp: { email: vi.fn() },
    signOut: vi.fn(),
    useSession: vi.fn(),
    getSession: vi.fn(),
    organization: {
      list: vi.fn(),
      setActive: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("better-auth/react", () => ({
  createAuthClient: vi.fn(() => mockClient),
}));

vi.mock("better-auth/client/plugins", () => ({
  organizationClient: vi.fn(() => ({})),
}));

import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import {
  getSession,
  organization,
  signIn,
  signOut,
  signUp,
  useSession,
} from "../client";

describe("Auth Client", () => {
  it("creates auth client with organization plugin", () => {
    expect(createAuthClient).toHaveBeenCalledWith({
      plugins: [expect.anything()],
    });
    expect(organizationClient).toHaveBeenCalled();
  });

  it("exports signIn from the auth client", () => {
    expect(signIn).toBe(mockClient.signIn);
  });

  it("exports signUp from the auth client", () => {
    expect(signUp).toBe(mockClient.signUp);
  });

  it("exports signOut from the auth client", () => {
    expect(signOut).toBe(mockClient.signOut);
  });

  it("exports useSession from the auth client", () => {
    expect(useSession).toBe(mockClient.useSession);
  });

  it("exports getSession from the auth client", () => {
    expect(getSession).toBe(mockClient.getSession);
  });

  it("exports organization from the auth client", () => {
    expect(organization).toBe(mockClient.organization);
  });
});
