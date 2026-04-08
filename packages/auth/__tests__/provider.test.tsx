import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "../provider";

describe("AuthProvider", () => {
  it("renders children unchanged", () => {
    render(
      <AuthProvider>
        <div data-testid="child">Hello</div>
      </AuthProvider>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("accepts optional props without error", () => {
    render(
      <AuthProvider
        helpUrl="https://example.com/help"
        privacyUrl="https://example.com/privacy"
        termsUrl="https://example.com/terms"
      >
        <span>Content</span>
      </AuthProvider>
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <AuthProvider>
        <div data-testid="first">First</div>
        <div data-testid="second">Second</div>
      </AuthProvider>
    );

    expect(screen.getByTestId("first")).toBeInTheDocument();
    expect(screen.getByTestId("second")).toBeInTheDocument();
  });
});
