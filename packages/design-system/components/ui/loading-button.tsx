"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@repo/design-system/lib/utils";
import { Button } from "./button";

type ButtonProps = React.ComponentProps<typeof Button>;

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  isSuccess?: boolean;
  loadingText?: string;
  successText?: string;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      children,
      isLoading,
      isSuccess,
      loadingText,
      successText,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const [showSuccess, setShowSuccess] = React.useState(false);

    React.useEffect(() => {
      if (isSuccess) {
        setShowSuccess(true);
        const timer = setTimeout(() => setShowSuccess(false), 2000);
        return () => clearTimeout(timer);
      }
    }, [isSuccess]);

    const displayState = showSuccess
      ? "success"
      : isLoading
        ? "loading"
        : "idle";

    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "relative transition-all duration-300",
          showSuccess && "bg-success hover:bg-success",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "flex items-center gap-2 transition-opacity duration-200",
            displayState === "loading"
              ? "opacity-100"
              : "opacity-0 absolute"
          )}
          aria-hidden={displayState !== "loading"}
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText && <span>{loadingText}</span>}
        </span>

        <span
          className={cn(
            "flex items-center gap-2 transition-opacity duration-200",
            displayState === "success"
              ? "opacity-100"
              : "opacity-0 absolute"
          )}
          aria-hidden={displayState !== "success"}
        >
          <Check className="h-4 w-4" />
          {successText && <span>{successText}</span>}
        </span>

        <span
          className={cn(
            "flex items-center gap-2 transition-opacity duration-200",
            displayState === "idle" ? "opacity-100" : "opacity-0 absolute"
          )}
          aria-hidden={displayState !== "idle"}
        >
          {children}
        </span>

        <span className="sr-only" role="status" aria-live="polite">
          {displayState === "loading" && (loadingText || "Loading...")}
          {displayState === "success" && (successText || "Success!")}
        </span>
      </Button>
    );
  }
);
LoadingButton.displayName = "LoadingButton";

export { LoadingButton, type LoadingButtonProps };
