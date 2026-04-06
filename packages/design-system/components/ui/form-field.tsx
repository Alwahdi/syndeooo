import * as React from "react";
import { cn } from "@repo/design-system/lib/utils";
import { Label } from "./label";
import type { LucideIcon } from "lucide-react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField = ({
  label,
  htmlFor,
  error,
  required,
  hint,
  children,
  className,
}: FormFieldProps) => {
  const errorId = error ? `${htmlFor}-error` : undefined;
  const hintId = hint ? `${htmlFor}-hint` : undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && (
          <span className="ms-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
        {required && <span className="sr-only">(required)</span>}
      </Label>

      {React.isValidElement(children)
        ? React.cloneElement(
            children as React.ReactElement<Record<string, unknown>>,
            {
              "aria-invalid": error ? true : undefined,
              "aria-describedby":
                [errorId, hintId].filter(Boolean).join(" ") || undefined,
            }
          )
        : children}

      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="flex items-center gap-1 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */

interface InputWithIconProps {
  icon: LucideIcon;
  iconPosition?: "start" | "end";
  children: React.ReactNode;
  className?: string;
}

const InputWithIcon = ({
  icon: Icon,
  iconPosition = "start",
  children,
  className,
}: InputWithIconProps) => (
  <div className={cn("relative", className)}>
    <Icon
      className={cn(
        "pointer-events-none absolute top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground",
        iconPosition === "start" ? "start-4" : "end-4"
      )}
      aria-hidden="true"
    />
    {React.isValidElement(children)
      ? React.cloneElement(
          children as React.ReactElement<{ className?: string }>,
          {
            className: cn(
              (children as React.ReactElement<{ className?: string }>).props
                .className,
              iconPosition === "start" ? "ps-12" : "pe-12"
            ),
          }
        )
      : children}
  </div>
);

export { FormField, InputWithIcon, type FormFieldProps };
