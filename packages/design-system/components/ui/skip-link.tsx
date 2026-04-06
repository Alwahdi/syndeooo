import * as React from "react";
import { cn } from "@repo/design-system/lib/utils";

interface SkipLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId?: string;
  children?: React.ReactNode;
}

const SkipLink = React.forwardRef<HTMLAnchorElement, SkipLinkProps>(
  (
    {
      className,
      targetId = "main-content",
      children = "Skip to content",
      ...props
    },
    ref
  ) => (
    <a
      ref={ref}
      href={`#${targetId}`}
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4 focus:z-[9999]",
        "focus:inline-flex focus:items-center focus:justify-center",
        "focus:px-6 focus:py-3",
        "focus:bg-primary focus:text-primary-foreground",
        "focus:rounded-xl focus:shadow-lg",
        "focus:text-sm focus:font-semibold",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
);
SkipLink.displayName = "SkipLink";

export { SkipLink };
