import { BadgeCheck, Clock, XCircle } from "lucide-react";
import { cn } from "@repo/design-system/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

type VerificationStatus =
  | "pending"
  | "verified"
  | "rejected"
  | null
  | undefined;

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
  labels?: {
    verified?: string;
    pending?: string;
    rejected?: string;
  };
}

const VerificationBadge = ({
  status,
  size = "md",
  showLabel = false,
  className,
  labels,
}: VerificationBadgeProps) => {
  if (!status) return null;

  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const defaultLabels = {
    verified: labels?.verified ?? "Verified",
    pending: labels?.pending ?? "Pending",
    rejected: labels?.rejected ?? "Rejected",
  };

  const config = {
    verified: {
      icon: BadgeCheck,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      label: defaultLabels.verified,
    },
    pending: {
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      label: defaultLabels.pending,
    },
    rejected: {
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      label: defaultLabels.rejected,
    },
  };

  const {
    icon: Icon,
    color,
    bgColor,
    label,
  } = config[status];

  const badge = (
    <div
      className={cn(
        "inline-flex items-center gap-1.5",
        showLabel && `rounded-full px-2 py-0.5 ${bgColor}`,
        className
      )}
    >
      <Icon className={cn(sizeClasses[size], color)} />
      {showLabel && (
        <span className={cn(labelSizeClasses[size], color, "font-medium")}>
          {label}
        </span>
      )}
    </div>
  );

  if (showLabel) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { VerificationBadge, type VerificationBadgeProps, type VerificationStatus };
