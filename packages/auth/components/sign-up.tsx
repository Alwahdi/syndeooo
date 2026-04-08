"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "../client";

type SelectedRole = "professional" | "clinic";

export const SignUp = () => {
  const [step, setStep] = useState<"role" | "form">("role");
  const [selectedRole, setSelectedRole] = useState<SelectedRole | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleSelect = (role: SelectedRole) => {
    setSelectedRole(role);
    setStep("form");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const redirectPath =
        selectedRole === "professional"
          ? "/onboarding/professional"
          : "/onboarding/clinic";

      const result = await signUp.email({
        name,
        email,
        password,
        callbackURL: redirectPath,
      });

      if (result.error) {
        setError(result.error.message ?? "Sign up failed");
      } else {
        router.push(redirectPath);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (step === "role") {
    return (
      <div className="grid gap-6">
        <div className="grid gap-2 text-center">
          <p className="text-muted-foreground text-sm">
            How would you like to use SyndeoCare?
          </p>
        </div>
        <div className="grid gap-3">
          <button
            className="flex flex-col items-center gap-3 rounded-lg border-2 border-input bg-background p-6 text-left transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => handleRoleSelect("professional")}
            type="button"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="text-primary"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="text-center">
              <div className="font-semibold">Healthcare Professional</div>
              <div className="text-muted-foreground text-sm">
                Find shifts and connect with clinics
              </div>
            </div>
          </button>
          <button
            className="flex flex-col items-center gap-3 rounded-lg border-2 border-input bg-background p-6 text-left transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => handleRoleSelect("clinic")}
            type="button"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="text-primary"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                <path d="M12 12v6" />
                <path d="M9 15h6" />
              </svg>
            </div>
            <div className="text-center">
              <div className="font-semibold">Clinic / Facility</div>
              <div className="text-muted-foreground text-sm">
                Post shifts and find qualified professionals
              </div>
            </div>
          </button>
        </div>
        {error && (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-2">
        <button
          aria-label="Go back to role selection"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-sm hover:bg-accent"
          onClick={() => {
            setStep("role");
            setError("");
          }}
          type="button"
        >
          <svg
            fill="none"
            height="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <span className="text-muted-foreground text-sm">
          Signing up as{" "}
          <span className="font-medium text-foreground">
            {selectedRole === "professional"
              ? "Healthcare Professional"
              : "Clinic / Facility"}
          </span>
        </span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="font-medium text-sm" htmlFor="name">
              {selectedRole === "clinic" ? "Clinic Name" : "Full Name"}
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder={
                selectedRole === "clinic" ? "Your clinic name" : "Your name"
              }
              required
              type="text"
              value={name}
            />
          </div>
          <div className="grid gap-2">
            <label className="font-medium text-sm" htmlFor="email">
              Email
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div className="grid gap-2">
            <label className="font-medium text-sm" htmlFor="password">
              Password
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              type="password"
              value={password}
            />
            <p className="text-muted-foreground text-xs">
              Must be at least 8 characters
            </p>
          </div>
          <div className="grid gap-2">
            <label className="font-medium text-sm" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
              id="confirmPassword"
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              type="password"
              value={confirmPassword}
            />
          </div>
          {error && (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          )}
          <button
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </div>
      </form>
    </div>
  );
};
