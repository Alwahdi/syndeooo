import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
const mockSignUpEmail = vi.fn();
vi.mock("../client", () => ({
  signUp: {
    email: (...args: unknown[]) => mockSignUpEmail(...args),
  },
}));

const { SignUp } = await import("../components/sign-up");

describe("SignUp component", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockRefresh.mockClear();
    mockSignUpEmail.mockClear();
  });

  it("renders the sign-up form with name, email, and password fields", () => {
    render(<SignUp />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create account" })
    ).toBeInTheDocument();
  });

  it("updates form fields", async () => {
    const user = userEvent.setup();
    render(<SignUp />);

    await user.type(screen.getByLabelText("Name"), "John Doe");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.type(screen.getByLabelText("Password"), "securepass");

    expect(screen.getByLabelText("Name")).toHaveValue("John Doe");
    expect(screen.getByLabelText("Email")).toHaveValue("john@example.com");
    expect(screen.getByLabelText("Password")).toHaveValue("securepass");
  });

  it("calls signUp.email on form submit and redirects on success", async () => {
    mockSignUpEmail.mockResolvedValue({ data: { user: { id: "1" } } });
    const user = userEvent.setup();
    render(<SignUp />);

    await user.type(screen.getByLabelText("Name"), "John Doe");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.type(screen.getByLabelText("Password"), "securepass");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(mockSignUpEmail).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "securepass",
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it("displays error message on sign-up failure", async () => {
    mockSignUpEmail.mockResolvedValue({
      error: { message: "Email already exists" },
    });
    const user = userEvent.setup();
    render(<SignUp />);

    await user.type(screen.getByLabelText("Name"), "John");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("displays generic error on exception", async () => {
    mockSignUpEmail.mockRejectedValue(new Error("Network error"));
    const user = userEvent.setup();
    render(<SignUp />);

    await user.type(screen.getByLabelText("Name"), "John");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(
        screen.getByText("An unexpected error occurred")
      ).toBeInTheDocument();
    });
  });

  it("shows loading state during submission", async () => {
    let resolveSignUp: (value: unknown) => void;
    mockSignUpEmail.mockReturnValue(
      new Promise((resolve) => {
        resolveSignUp = resolve;
      })
    );

    const user = userEvent.setup();
    render(<SignUp />);

    await user.type(screen.getByLabelText("Name"), "John");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(screen.getByText("Creating account...")).toBeInTheDocument();
    });

    const button = screen.getByRole("button", { name: "Creating account..." });
    expect(button).toBeDisabled();

    resolveSignUp!({ data: { user: { id: "1" } } });
  });

  it("has required fields", () => {
    render(<SignUp />);

    expect(screen.getByLabelText("Name")).toBeRequired();
    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Password")).toBeRequired();
  });

  it("uses correct input types", () => {
    render(<SignUp />);

    expect(screen.getByLabelText("Name")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("displays fallback error message when error.message is undefined", async () => {
    mockSignUpEmail.mockResolvedValue({
      error: { message: undefined },
    });
    const user = userEvent.setup();
    render(<SignUp />);

    await user.type(screen.getByLabelText("Name"), "John");
    await user.type(screen.getByLabelText("Email"), "john@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(screen.getByText("Sign up failed")).toBeInTheDocument();
    });
  });

  it("uses proper placeholders", () => {
    render(<SignUp />);

    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("name@example.com")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Create a password")
    ).toBeInTheDocument();
  });

  it("rejects password shorter than 8 characters", async () => {
    const user = userEvent.setup();
    render(<SignUp />);

    await user.type(screen.getByLabelText("Name"), "Test User");
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 8 characters")
      ).toBeInTheDocument();
    });

    // Should NOT have called the API
    expect(mockSignUpEmail).not.toHaveBeenCalled();
  });

  it("allows password of exactly 8 characters", async () => {
    mockSignUpEmail.mockResolvedValue({ data: { user: { id: "1" } } });
    const user = userEvent.setup();
    render(<SignUp />);

    await user.type(screen.getByLabelText("Name"), "Test User");
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "12345678");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(mockSignUpEmail).toHaveBeenCalled();
    });
  });
});
