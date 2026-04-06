"use client";

import * as React from "react";
import { Check, Eye, EyeOff, Lock, X } from "lucide-react";
import { cn } from "@repo/design-system/lib/utils";
import { Input } from "./input";

interface PasswordInputProps extends React.ComponentProps<"input"> {
  showStrength?: boolean;
  value?: string;
  strengthLabels?: {
    minLength?: string;
    hasNumber?: string;
    hasUppercase?: string;
    strengthLabel?: string;
    showPassword?: string;
    hidePassword?: string;
  };
}

interface StrengthCheck {
  label: string;
  valid: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      showStrength = false,
      value = "",
      className,
      strengthLabels,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const labels = {
      minLength: strengthLabels?.minLength ?? "At least 8 characters",
      hasNumber: strengthLabels?.hasNumber ?? "Contains a number",
      hasUppercase: strengthLabels?.hasUppercase ?? "Contains uppercase",
      strengthLabel: strengthLabels?.strengthLabel ?? "Password strength",
      showPassword: strengthLabels?.showPassword ?? "Show password",
      hidePassword: strengthLabels?.hidePassword ?? "Hide password",
    };

    const strengthChecks: StrengthCheck[] = React.useMemo(
      () => [
        { label: labels.minLength, valid: value.length >= 8 },
        { label: labels.hasNumber, valid: /\d/.test(value) },
        { label: labels.hasUppercase, valid: /[A-Z]/.test(value) },
      ],
      [value, labels.minLength, labels.hasNumber, labels.hasUppercase]
    );

    const strength = strengthChecks.filter((c) => c.valid).length;
    const strengthPercent = (strength / strengthChecks.length) * 100;
    const strengthColor =
      strengthPercent >= 100
        ? "bg-success"
        : strengthPercent >= 66
          ? "bg-warning"
          : strengthPercent >= 33
            ? "bg-destructive/70"
            : "bg-destructive";

    return (
      <div className="space-y-2">
        <div className="relative">
          <Lock
            className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={cn("pe-12 ps-12", className)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={cn(
              "absolute end-4 top-1/2 -translate-y-1/2",
              "text-muted-foreground transition-colors hover:text-foreground",
              "-me-2 flex min-h-[44px] min-w-[44px] items-center justify-center"
            )}
            aria-label={
              showPassword ? labels.hidePassword : labels.showPassword
            }
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {showStrength && isFocused && value.length > 0 && (
          <div
            className="animate-in fade-in slide-in-from-top-1 space-y-2 rounded-lg bg-secondary/50 p-3 duration-200"
            role="status"
            aria-label={labels.strengthLabel}
          >
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full transition-all duration-300",
                  strengthColor
                )}
                style={{ width: `${strengthPercent}%` }}
              />
            </div>

            <ul className="space-y-1">
              {strengthChecks.map((check) => (
                <li
                  key={check.label}
                  className={cn(
                    "flex items-center gap-2 text-xs transition-colors",
                    check.valid
                      ? "text-success"
                      : "text-muted-foreground"
                  )}
                >
                  {check.valid ? (
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{check.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput, type PasswordInputProps };
