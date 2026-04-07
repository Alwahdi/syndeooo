import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock next/dynamic
vi.mock("next/dynamic", () => ({
  default: () => {
    const Comp = () => <div data-testid="sign-up-component" />;
    Comp.displayName = "MockSignUp";
    return Comp;
  },
}));

// Mock @repo/seo/metadata
vi.mock("@repo/seo/metadata", () => ({
  createMetadata: (meta: { title: string; description: string }) => meta,
}));

import Page from "../app/(unauthenticated)/sign-up/[[...sign-up]]/page";

describe("Sign-Up Page", () => {
  it("renders the page container", () => {
    const { container } = render(<Page />);
    expect(container).toBeDefined();
  });

  it("renders the sign-up heading", () => {
    const { container } = render(<Page />);
    const heading = container.querySelector("h1");
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toBe("Create an account");
  });

  it("renders the description text", () => {
    const { container } = render(<Page />);
    expect(container.textContent).toContain(
      "Enter your details to get started"
    );
  });

  it("renders the sign-up component", () => {
    render(<Page />);
    expect(screen.getByTestId("sign-up-component")).toBeInTheDocument();
  });

  it("renders link to sign-in page", () => {
    const { container } = render(<Page />);
    const links = container.querySelectorAll('a[href="/sign-in"]');
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].textContent).toBe("Sign in");
  });

  it("shows 'Already have an account?' text", () => {
    const { container } = render(<Page />);
    expect(container.textContent).toContain("Already have an account?");
  });
});
