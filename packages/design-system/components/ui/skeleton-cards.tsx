import { cn } from "@repo/design-system/lib/utils";
import { Skeleton } from "./skeleton";

interface SkeletonCardProps {
  className?: string;
}

const ShiftCardSkeleton = ({ className }: SkeletonCardProps) => (
  <div
    className={cn(
      "animate-pulse rounded-2xl border border-border bg-card p-4 shadow-card",
      className
    )}
  >
    <div className="flex items-start gap-4">
      <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24" />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
  </div>
);

const StatsCardSkeleton = ({ className }: SkeletonCardProps) => (
  <div
    className={cn(
      "animate-pulse rounded-2xl border border-border bg-card p-4 shadow-card",
      className
    )}
  >
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  </div>
);

const ProfileCardSkeleton = ({ className }: SkeletonCardProps) => (
  <div
    className={cn(
      "animate-pulse rounded-2xl border border-border bg-card p-6 shadow-card",
      className
    )}
  >
    <div className="flex flex-col items-start gap-6 sm:flex-row">
      <Skeleton className="h-24 w-24 shrink-0 rounded-full" />
      <div className="w-full flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
    <div className="my-6">
      <Skeleton className="h-px w-full" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <div className="mt-6 space-y-3">
      <Skeleton className="h-5 w-28" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

const ProfileSidebarSkeleton = ({ className }: SkeletonCardProps) => (
  <div
    className={cn(
      "animate-pulse rounded-2xl border border-border bg-card p-6 shadow-card",
      className
    )}
  >
    <Skeleton className="mb-6 h-5 w-28" />
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={`sidebar-skeleton-${i}`} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DocumentCardSkeleton = ({ className }: SkeletonCardProps) => (
  <div
    className={cn(
      "animate-pulse rounded-2xl border border-border bg-card p-4 shadow-card",
      className
    )}
  >
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

const ListItemSkeleton = ({ className }: SkeletonCardProps) => (
  <div
    className={cn(
      "flex animate-pulse items-center justify-between rounded-xl bg-secondary/50 p-3",
      className
    )}
  >
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="h-6 w-16 rounded-full" />
  </div>
);

const SkeletonGrid = ({
  count = 4,
  columns = "grid-cols-1",
  children,
  CardComponent,
}: {
  count?: number;
  columns?: string;
  children?: React.ReactNode;
  CardComponent?: React.ComponentType<SkeletonCardProps>;
}) => (
  <div className={cn("grid gap-4", columns)}>
    {Array.from({ length: count }).map((_, i) =>
      children ? (
        <div key={`skeleton-grid-${i}`}>{children}</div>
      ) : CardComponent ? (
        <CardComponent key={`skeleton-grid-${i}`} />
      ) : (
        <StatsCardSkeleton key={`skeleton-grid-${i}`} />
      )
    )}
  </div>
);

export {
  ShiftCardSkeleton,
  StatsCardSkeleton,
  ProfileCardSkeleton,
  ProfileSidebarSkeleton,
  DocumentCardSkeleton,
  ListItemSkeleton,
  SkeletonGrid,
  type SkeletonCardProps,
};
