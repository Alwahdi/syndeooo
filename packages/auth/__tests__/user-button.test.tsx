import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
    back: vi.fn(),
    forward: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock the auth client
const mockSignOut = vi.fn();
const mockUseSession = vi.fn();
vi.mock("../client", () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
  useSession: () => mockUseSession(),
}));

const { UserButton } = await import("../components/user-button");

describe("UserButton component", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRefresh.mockClear();
    mockSignOut.mockClear();
    mockUseSession.mockReset();
  });

  it("renders nothing when no session exists", () => {
    mockUseSession.mockReturnValue({ data: null });
    const { container } = render(<UserButton />);

    expect(container.innerHTML).toBe("");
  });

  it("renders nothing when session has no user", () => {
    mockUseSession.mockReturnValue({ data: { session: {} } });
    const { container } = render(<UserButton />);

    expect(container.innerHTML).toBe("");
  });

  it("renders user initials when no image is provided", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: "1", name: "John Doe", email: "john@example.com" },
        session: {},
      },
    });

    render(<UserButton />);

    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders single initial for single-word name", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: "1", name: "John", email: "john@example.com" },
        session: {},
      },
    });

    render(<UserButton />);

    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("truncates initials to 2 characters for long names", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "1",
          name: "John Michael Doe",
          email: "john@example.com",
        },
        session: {},
      },
    });

    render(<UserButton />);

    expect(screen.getByText("JM")).toBeInTheDocument();
  });

  it("uses first letter of email when name is missing", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: "1", name: "", email: "test@example.com" },
        session: {},
      },
    });

    render(<UserButton />);

    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("renders user avatar image when available", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          image: "https://example.com/avatar.jpg",
        },
        session: {},
      },
    });

    render(<UserButton />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    expect(img).toHaveAttribute("alt", "John Doe");
  });

  it("uses fallback alt text when name is missing", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "1",
          name: null,
          email: "john@example.com",
          image: "https://example.com/avatar.jpg",
        },
        session: {},
      },
    });

    render(<UserButton />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "User avatar");
  });

  it("shows user name when showName prop is true", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: "1", name: "John Doe", email: "john@example.com" },
        session: {},
      },
    });

    render(<UserButton showName />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("shows email when showName is true but name is missing", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: "1", name: null, email: "john@example.com" },
        session: {},
      },
    });

    render(<UserButton showName />);

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("does not show name when showName is false/undefined", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: "1", name: "John Doe", email: "john@example.com" },
        session: {},
      },
    });

    render(<UserButton />);

    // The name should only appear in sr-only "Sign out" text
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("calls signOut and redirects on click", async () => {
    mockSignOut.mockResolvedValue(undefined);
    mockUseSession.mockReturnValue({
      data: {
        user: { id: "1", name: "John Doe", email: "john@example.com" },
        session: {},
      },
    });

    const user = userEvent.setup();
    render(<UserButton />);

    // First click opens the dropdown
    await user.click(screen.getByRole("button", { name: /User menu/ }));

    // Now click "Sign out" in the dropdown
    await user.click(screen.getByRole("menuitem", { name: "Sign out" }));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/sign-in");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("has accessible sign out label", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: "1", name: "John", email: "john@example.com" },
        session: {},
      },
    });

    const _user2 = userEvent.setup();
    const { container } = render(<UserButton />);

    // The sr-only "User menu" text should be present
    expect(screen.getByText("User menu")).toBeInTheDocument();
  });
});
