import * as React from "react";
import { cn } from "@repo/design-system/lib/utils";

/* ============================================================================
   Section Components - Consistent page section layout primitives
   ============================================================================ */

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "secondary" | "muted" | "gradient";
  spacing?: "default" | "compact" | "hero" | "none";
}

const sectionVariants = {
  default: "bg-background",
  secondary: "bg-secondary",
  muted: "bg-muted",
  gradient: "gradient-hero",
};

const spacingVariants = {
  default: "py-16 md:py-24 lg:py-32",
  compact: "py-12 md:py-16 lg:py-20",
  hero: "pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32",
  none: "",
};

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      variant = "default",
      spacing = "default",
      children,
      ...props
    },
    ref
  ) => (
    <section
      ref={ref}
      className={cn(
        sectionVariants[variant],
        spacingVariants[spacing],
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
);
Section.displayName = "Section";

/* -------------------------------------------------------------------------- */

interface SectionContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide" | "full";
}

const containerSizes = {
  default: "container mx-auto px-4 sm:px-6",
  narrow: "container mx-auto max-w-4xl px-4 sm:px-6",
  wide: "container mx-auto max-w-7xl px-4 sm:px-6",
  full: "w-full px-4 sm:px-6",
};

const SectionContainer = React.forwardRef<
  HTMLDivElement,
  SectionContainerProps
>(({ className, size = "default", children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(containerSizes[size], className)}
    {...props}
  >
    {children}
  </div>
));
SectionContainer.displayName = "SectionContainer";

/* -------------------------------------------------------------------------- */

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: "center" | "left" | "right";
}

const alignmentClasses = {
  center: "text-center mx-auto",
  left: "text-start",
  right: "text-end ms-auto",
};

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ title, subtitle, align = "center", className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mb-12 max-w-3xl md:mb-16 lg:mb-20",
        alignmentClasses[align],
        className
      )}
      {...props}
    >
      <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:mb-5 md:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="px-4 text-base leading-relaxed text-muted-foreground md:px-0 md:text-lg lg:text-xl">
          {subtitle}
        </p>
      )}
    </div>
  )
);
SectionHeader.displayName = "SectionHeader";

export { Section, SectionContainer, SectionHeader };
