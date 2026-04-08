import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock @repo/design-system/components/mode-toggle
vi.mock("@repo/design-system/components/mode-toggle", () => ({
  ModeToggle: () => (
    <button data-testid="mode-toggle" type="button">
      Toggle
    </button>
  ),
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  HeartPulseIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="heart-pulse-icon" {...props} />
  ),
}));

import AuthLayout from "../app/(unauthenticated)/layout";

const syndeocareRegex = /syndeocare has transformed/i;

describe("Unauthenticated Layout", () => {
  it("renders children", () => {
    render(
      <AuthLayout>
        <div data-testid="child">Test child</div>
      </AuthLayout>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders SyndeoCare branding", () => {
    render(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    );
    expect(screen.getByText("SyndeoCare")).toBeInTheDocument();
  });

  it("renders the heart pulse icon", () => {
    render(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    );
    expect(screen.getByTestId("heart-pulse-icon")).toBeInTheDocument();
  });

  it("renders the mode toggle", () => {
    render(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    );
    expect(screen.getByTestId("mode-toggle")).toBeInTheDocument();
  });

  it("renders the testimonial quote", () => {
    render(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    );
    expect(screen.getByText(syndeocareRegex)).toBeInTheDocument();
    expect(screen.getByText("Healthcare Professional")).toBeInTheDocument();
  });

  it("uses a two-column grid layout", () => {
    const { container } = render(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    );
    const grid = container.querySelector(".lg\\:grid-cols-2");
    expect(grid).toBeInTheDocument();
  });
});
