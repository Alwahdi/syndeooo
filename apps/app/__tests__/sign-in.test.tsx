import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock next/dynamic to render the underlying component synchronously
vi.mock("next/dynamic", () => ({
  default: () => {
    const Comp = () => <div data-testid="sign-in-component" />;
    Comp.displayName = "MockSignIn";
    return Comp;
  },
}));

// Mock @repo/seo/metadata
vi.mock("@repo/seo/metadata", () => ({
  createMetadata: (meta: { title: string; description: string }) => meta,
}));

import Page from "../app/(unauthenticated)/sign-in/[[...sign-in]]/page";

describe("Sign-In Page", () => {
  it("renders the page container", () => {
    const { container } = render(<Page />);
    expect(container).toBeDefined();
  });

  it("renders the sign-in heading", () => {
    const { container } = render(<Page />);
    const heading = container.querySelector("h1");
    expect(heading).not.toBeNull();
    expect(heading?.textContent).toBe("Welcome back");
  });

  it("renders the description text", () => {
    const { container } = render(<Page />);
    expect(container.textContent).toContain("Enter your details to sign in");
  });

  it("renders the sign-in component", () => {
    render(<Page />);
    expect(screen.getByTestId("sign-in-component")).toBeInTheDocument();
  });

  it("renders link to sign-up page", () => {
    const { container } = render(<Page />);
    const links = container.querySelectorAll('a[href="/sign-up"]');
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].textContent).toBe("Sign up");
  });

  it("shows 'Don't have an account?' text", () => {
    const { container } = render(<Page />);
    expect(container.textContent).toContain("Don't have an account?");
  });
});
