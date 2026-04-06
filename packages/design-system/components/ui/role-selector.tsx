"use client";

import * as React from "react";
import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@repo/design-system/lib/utils";

interface RoleOption {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

interface RoleSelectorProps {
  options: RoleOption[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  className?: string;
}

const RoleSelector = ({
  options,
  selectedId,
  onSelect,
  className,
}: RoleSelectorProps) => (
  <div className={cn("space-y-4", className)} role="radiogroup">
    {options.map((option, index) => {
      const isSelected = selectedId === option.id;
      const Icon = option.icon;

      return (
        <button
          key={option.id}
          type="button"
          onClick={() => onSelect(option.id)}
          role="radio"
          aria-checked={isSelected}
          className={cn(
            "w-full rounded-2xl border-2 p-6 text-start transition-all duration-200",
            "min-h-[80px]",
            "animate-in fade-in slide-in-from-bottom-2",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            !isSelected &&
              "border-border hover:border-primary/40 hover:bg-primary/5",
            isSelected && "border-primary bg-primary/5 shadow-lg"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start gap-5">
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
                "transition-transform duration-200",
                isSelected && "scale-110 shadow-lg",
                option.gradient
              )}
            >
              <Icon className="h-7 w-7 text-white" aria-hidden="true" />
            </div>

            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "text-lg font-semibold transition-colors",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {option.title}
                </h3>
                {isSelected && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary animate-in zoom-in duration-200">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {option.description}
              </p>
            </div>
          </div>
        </button>
      );
    })}
  </div>
);

export { RoleSelector, type RoleSelectorProps, type RoleOption };
