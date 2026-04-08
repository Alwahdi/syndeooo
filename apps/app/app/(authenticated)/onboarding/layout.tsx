import { currentUser } from "@repo/auth/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface OnboardingLayoutProps {
  readonly children: ReactNode;
}

const OnboardingLayout = async ({ children }: OnboardingLayoutProps) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  );
};

export default OnboardingLayout;
