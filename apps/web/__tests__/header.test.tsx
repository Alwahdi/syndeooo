import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

// Mock env
vi.mock("@/env", () => ({
  env: {
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    NEXT_PUBLIC_DOCS_URL: "http://localhost:3004",
  },
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: any) =>
    React.createElement("a", { href }, children),
}));

// Mock design-system components
vi.mock("@repo/design-system/components/mode-toggle", () => ({
  ModeToggle: () =>
    React.createElement("button", { "data-testid": "mode-toggle" }, "Toggle"),
}));

vi.mock("@repo/design-system/components/ui/button", () => ({
  Button: ({ children, ...props }: any) =>
    React.createElement("button", props, children),
}));

vi.mock("@repo/design-system/components/ui/navigation-menu", () => ({
  NavigationMenu: ({ children }: any) =>
    React.createElement("nav", null, children),
  NavigationMenuContent: ({ children }: any) =>
    React.createElement("div", null, children),
  NavigationMenuItem: ({ children }: any) =>
    React.createElement("div", null, children),
  NavigationMenuLink: ({ children }: any) =>
    React.createElement("a", null, children),
  NavigationMenuList: ({ children }: any) =>
    React.createElement("ul", null, children),
  NavigationMenuTrigger: ({ children }: any) =>
    React.createElement("button", null, children),
}));

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Menu: () => React.createElement("span", { "data-testid": "menu-icon" }),
  MoveRight: () =>
    React.createElement("span", { "data-testid": "move-right-icon" }),
  X: () => React.createElement("span", { "data-testid": "x-icon" }),
}));

// Mock language switcher
vi.mock("../app/[locale]/components/header/language-switcher", () => ({
  LanguageSwitcher: () =>
    React.createElement(
      "div",
      { "data-testid": "language-switcher" },
      "Lang Switcher"
    ),
}));

import { Header } from "../app/[locale]/components/header";

const mockDictionary = {
  web: {
    header: {
      home: "Home",
      blog: "Blog",
      docs: "Docs",
      product: {
        title: "Product",
        description: "Our product suite",
        pricing: "Pricing",
      },
      signIn: "Sign in",
      getStarted: "Get started",
    },
    home: { meta: { title: "Home", description: "Home page" } },
    global: { primaryCta: "Get started" },
  },
} as any;

describe("Web Header Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Header dictionary={mockDictionary} />);
    expect(container).toBeDefined();
  });

  it("renders home navigation item", () => {
    render(<Header dictionary={mockDictionary} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("renders product navigation item", () => {
    render(<Header dictionary={mockDictionary} />);
    expect(screen.getAllByText("Product").length).toBeGreaterThan(0);
  });

  it("renders blog navigation item", () => {
    render(<Header dictionary={mockDictionary} />);
    expect(screen.getByText("Blog")).toBeInTheDocument();
  });

  it("renders mode toggle", () => {
    render(<Header dictionary={mockDictionary} />);
    expect(screen.getByTestId("mode-toggle")).toBeInTheDocument();
  });

  it("renders language switcher", () => {
    render(<Header dictionary={mockDictionary} />);
    expect(screen.getByTestId("language-switcher")).toBeInTheDocument();
  });

  it("has sign-in button text", () => {
    render(<Header dictionary={mockDictionary} />);
    expect(screen.getAllByText("Sign in").length).toBeGreaterThan(0);
  });

  it("has get-started button text", () => {
    render(<Header dictionary={mockDictionary} />);
    expect(screen.getAllByText("Get started").length).toBeGreaterThan(0);
  });
});
