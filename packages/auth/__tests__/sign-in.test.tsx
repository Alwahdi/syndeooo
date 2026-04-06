import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock next/navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();
const mockSearchParamsGet = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
    back: vi.fn(),
    forward: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: mockSearchParamsGet,
  }),
}));

// Mock the auth client
const mockSignInEmail = vi.fn();
const mockSignInSocial = vi.fn();
vi.mock("../client", () => ({
  signIn: {
    email: (...args: unknown[]) => mockSignInEmail(...args),
    social: (...args: unknown[]) => mockSignInSocial(...args),
  },
}));

const { SignIn } = await import("../components/sign-in");

describe("SignIn component", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRefresh.mockClear();
    mockSignInEmail.mockClear();
    mockSignInSocial.mockClear();
    mockSearchParamsGet.mockReturnValue(null);
  });

  it("renders the sign-in form with email and password fields", () => {
    render(<SignIn />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign in" })
    ).toBeInTheDocument();
  });

  it("renders social sign-in buttons", () => {
    render(<SignIn />);

    expect(
      screen.getByRole("button", { name: "GitHub" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Google" })
    ).toBeInTheDocument();
  });

  it("renders 'Or continue with' separator", () => {
    render(<SignIn />);

    expect(screen.getByText("Or continue with")).toBeInTheDocument();
  });

  it("updates email and password fields", async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("calls signIn.email on form submit and redirects on success", async () => {
    mockSignInEmail.mockResolvedValue({ data: { user: { id: "1" } } });
    const user = userEvent.setup();
    render(<SignIn />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(mockSignInEmail).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("displays error message on sign-in failure", async () => {
    mockSignInEmail.mockResolvedValue({
      error: { message: "Invalid credentials" },
    });
    const user = userEvent.setup();
    render(<SignIn />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("displays generic error on exception", async () => {
    mockSignInEmail.mockRejectedValue(new Error("Network error"));
    const user = userEvent.setup();
    render(<SignIn />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(
        screen.getByText("An unexpected error occurred")
      ).toBeInTheDocument();
    });
  });

  it("shows loading state during submission", async () => {
    let resolveSignIn: (value: unknown) => void;
    mockSignInEmail.mockReturnValue(
      new Promise((resolve) => {
        resolveSignIn = resolve;
      })
    );

    const user = userEvent.setup();
    render(<SignIn />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(screen.getByText("Signing in...")).toBeInTheDocument();
    });

    // Button should be disabled during loading
    const button = screen.getByRole("button", { name: "Signing in..." });
    expect(button).toBeDisabled();

    // Resolve to clean up
    resolveSignIn!({ data: { user: { id: "1" } } });
  });

  it("calls signIn.social with github provider", async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    await user.click(screen.getByRole("button", { name: "GitHub" }));

    expect(mockSignInSocial).toHaveBeenCalledWith({
      provider: "github",
      callbackURL: "/",
    });
  });

  it("calls signIn.social with google provider", async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    await user.click(screen.getByRole("button", { name: "Google" }));

    expect(mockSignInSocial).toHaveBeenCalledWith({
      provider: "google",
      callbackURL: "/",
    });
  });

  it("has required fields for email and password", () => {
    render(<SignIn />);

    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Password")).toBeRequired();
  });

  it("uses correct input types", () => {
    render(<SignIn />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("displays fallback error when error.message is undefined", async () => {
    mockSignInEmail.mockResolvedValue({
      error: { message: undefined },
    });
    const user = userEvent.setup();
    render(<SignIn />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(screen.getByText("Sign in failed")).toBeInTheDocument();
    });
  });

  it("uses callbackUrl from search params after successful sign-in", async () => {
    mockSearchParamsGet.mockReturnValue("/dashboard");
    mockSignInEmail.mockResolvedValue({ data: { user: { id: "1" } } });
    const user = userEvent.setup();
    render(<SignIn />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("passes callbackUrl to social sign-in", async () => {
    mockSearchParamsGet.mockReturnValue("/settings");
    const user = userEvent.setup();
    render(<SignIn />);

    await user.click(screen.getByRole("button", { name: "GitHub" }));

    expect(mockSignInSocial).toHaveBeenCalledWith({
      provider: "github",
      callbackURL: "/settings",
    });
  });

  it("defaults to / when no callbackUrl", async () => {
    mockSearchParamsGet.mockReturnValue(null);
    mockSignInEmail.mockResolvedValue({ data: { user: { id: "1" } } });
    const user = userEvent.setup();
    render(<SignIn />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
