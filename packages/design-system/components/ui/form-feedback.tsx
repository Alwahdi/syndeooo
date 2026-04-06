"use client";

import * as React from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import { cn } from "@repo/design-system/lib/utils";

type FeedbackVariant = "success" | "error" | "warning" | "info";

interface FormFeedbackProps {
  variant: FeedbackVariant;
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const variants = {
  success: {
    icon: CheckCircle2,
    bg: "bg-success/10 border-success/20",
    iconColor: "text-success",
    titleColor: "text-success",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-destructive/10 border-destructive/20",
    iconColor: "text-destructive",
    titleColor: "text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-warning/10 border-warning/20",
    iconColor: "text-warning",
    titleColor: "text-warning",
  },
  info: {
    icon: Info,
    bg: "bg-primary/10 border-primary/20",
    iconColor: "text-primary",
    titleColor: "text-primary",
  },
};

const FormFeedback = ({
  variant,
  title,
  message,
  onDismiss,
  className,
}: FormFeedbackProps) => {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4",
        "animate-in fade-in slide-in-from-top-1 duration-200",
        config.bg,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon
        className={cn("mt-0.5 h-5 w-5 shrink-0", config.iconColor)}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        {title && (
          <p className={cn("mb-0.5 text-sm font-semibold", config.titleColor)}>
            {title}
          </p>
        )}
        <p className="text-sm text-foreground/80">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            "-m-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-1",
            "transition-colors hover:bg-foreground/10"
          )}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
    </div>
  );
};

export { FormFeedback, type FormFeedbackProps, type FeedbackVariant };
