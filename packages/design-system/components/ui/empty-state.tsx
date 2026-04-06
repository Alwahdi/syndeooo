import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@repo/design-system/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  variant?: "default" | "compact";
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) => {
  const isCompact = variant === "compact";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card text-center shadow-card",
        isCompact ? "p-6" : "p-8 md:p-12",
        className
      )}
      role="region"
      aria-label={title}
    >
      <div
        className={cn(
          "mx-auto mb-4 flex items-center justify-center rounded-full bg-muted",
          isCompact ? "h-12 w-12" : "h-16 w-16"
        )}
        aria-hidden="true"
      >
        <Icon
          className={cn(
            "text-muted-foreground",
            isCompact ? "h-6 w-6" : "h-8 w-8"
          )}
        />
      </div>

      <h3
        className={cn(
          "mb-2 font-semibold text-foreground",
          isCompact ? "text-base" : "text-lg"
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            "mx-auto max-w-sm text-muted-foreground",
            isCompact ? "mb-4 text-sm" : "mb-6 text-base"
          )}
        >
          {description}
        </p>
      )}

      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};

/* -------------------------------------------------------------------------- */

const InlineEmptyState = ({
  icon: Icon,
  message,
  className,
}: {
  icon: LucideIcon;
  message: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center justify-center gap-2 p-4 text-muted-foreground",
      className
    )}
  >
    <Icon className="h-4 w-4" aria-hidden="true" />
    <span className="text-sm">{message}</span>
  </div>
);

export { EmptyState, InlineEmptyState, type EmptyStateProps };
