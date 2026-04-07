import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { HeartPulseIcon } from "lucide-react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  readonly children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="container relative grid h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
      <div className="absolute inset-0 bg-primary/10" />
      <div className="relative z-20 flex items-center font-medium text-lg text-primary">
        <HeartPulseIcon className="mr-2 h-6 w-6" />
        SyndeoCare
      </div>
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="relative z-20 mt-auto text-primary">
        <blockquote className="space-y-2">
          <p className="text-lg">
            &ldquo;SyndeoCare has transformed how we manage patient care
            coordination, making our workflows seamless and efficient.&rdquo;
          </p>
          <footer className="text-sm">Healthcare Professional</footer>
        </blockquote>
      </div>
    </div>
    <div className="lg:p-8">
      <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center space-y-6">
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
