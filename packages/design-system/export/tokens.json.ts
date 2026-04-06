/**
 * ============================================================================
 * DESIGN SYSTEM EXPORT - Machine-Readable Tokens
 * ============================================================================
 *
 * Provides multiple export formats for design tokens:
 * - JSON: For tooling, AI agents, and documentation
 * - CSS Variables: For direct stylesheet integration
 * - Style Dictionary: For multi-platform token generation
 */

import { designTokens } from "../tokens";

/**
 * Generate a complete design system export with metadata
 */
export function generateDesignSystemExport() {
  return {
    $schema: designTokens.$schema,
    $version: designTokens.$version,
    $name: designTokens.$name,
    $description: designTokens.$description,
    meta: designTokens.meta,
    tokens: {
      primitives: designTokens.primitives,
      semantics: designTokens.semantics,
      components: designTokens.components,
    },
    componentGuide: {
      button: {
        usage: "Primary call-to-action. Use gradient-brand for hero sections.",
        sizes: ["sm (36px)", "default (44px)", "lg (48px)", "xl (56px)"],
        variants: [
          "default",
          "secondary",
          "outline",
          "ghost",
          "destructive",
        ],
        accessibility:
          "Min 44px touch target. Always include accessible label.",
      },
      card: {
        usage: "Container for grouped content. Hover effects for interactive cards.",
        padding: ["sm (16px)", "default (24px)", "lg (32px)"],
        accessibility: "Use appropriate heading level inside cards.",
      },
      badge: {
        usage: "Status indicators and labels.",
        variants: [
          "default",
          "secondary",
          "success",
          "warning",
          "destructive",
          "outline",
        ],
      },
      input: {
        usage: "Form inputs with consistent styling.",
        sizes: ["sm (36px)", "default (44px)", "lg (52px)"],
        accessibility:
          "Always pair with label. Use aria-describedby for hints/errors.",
      },
      toast: {
        usage: "Non-blocking feedback notifications.",
        variants: ["default", "success", "error", "warning"],
        accessibility: "Uses aria-live for screen reader announcements.",
      },
    },
    usageGuidelines: {
      spacing:
        "Use 4px grid system. Minimum touch target 44x44px (WCAG 2.2 AAA).",
      typography:
        "Geist Sans for English, Cairo for Arabic. Font sizes: xs(12px) to 6xl(60px).",
      colors:
        "Use semantic tokens (--primary, --accent) not raw values. All colors in OKLch format.",
      accessibility:
        "WCAG 2.2 AA minimum. 4.5:1 contrast for normal text, 3:1 for large text and UI.",
    },
  };
}

/**
 * Export tokens as a JSON string
 */
export function exportAsJSON(): string {
  return JSON.stringify(generateDesignSystemExport(), null, 2);
}

/**
 * Helper to check if a value is a design token (has $value property)
 */
function isToken(val: unknown): val is { $value: string } {
  return typeof val === "object" && val !== null && "$value" in val;
}

/**
 * Export tokens for Style Dictionary format
 */
export function exportForStyleDictionary() {
  const { primitives } = designTokens;

  return {
    color: {
      brand: {
        purple: Object.fromEntries(
          Object.entries(primitives.color.purple).map(([key, val]) => [
            key,
            { value: val.$value },
          ])
        ),
        teal: Object.fromEntries(
          Object.entries(primitives.color.teal).map(([key, val]) => [
            key,
            { value: val.$value },
          ])
        ),
      },
      neutral: Object.fromEntries(
        Object.entries(primitives.color.neutral).map(([key, val]) => [
          key,
          { value: val.$value },
        ])
      ),
      status: {
        red: Object.fromEntries(
          Object.entries(primitives.color.red).map(([key, val]) => [
            key,
            { value: val.$value },
          ])
        ),
        amber: Object.fromEntries(
          Object.entries(primitives.color.amber).map(([key, val]) => [
            key,
            { value: val.$value },
          ])
        ),
        emerald: Object.fromEntries(
          Object.entries(primitives.color.emerald).map(([key, val]) => [
            key,
            { value: val.$value },
          ])
        ),
        sky: Object.fromEntries(
          Object.entries(primitives.color.sky).map(([key, val]) => [
            key,
            { value: val.$value },
          ])
        ),
      },
    },
    spacing: Object.fromEntries(
      Object.entries(primitives.spacing)
        .filter(([, val]) => isToken(val))
        .map(([key, val]) => [key, { value: (val as { $value: string }).$value }])
    ),
    borderRadius: Object.fromEntries(
      Object.entries(primitives.borderRadius)
        .filter(([, val]) => isToken(val))
        .map(([key, val]) => [key, { value: (val as { $value: string }).$value }])
    ),
  };
}

/**
 * Export tokens as CSS custom properties
 */
export function exportAsCSSVariables(): string {
  const { primitives } = designTokens;
  const lines: string[] = [":root {"];

  // Brand colors
  for (const [shade, token] of Object.entries(primitives.color.purple)) {
    lines.push(`  --color-purple-${shade}: ${token.$value};`);
  }
  for (const [shade, token] of Object.entries(primitives.color.teal)) {
    lines.push(`  --color-teal-${shade}: ${token.$value};`);
  }

  // Neutral colors
  for (const [shade, token] of Object.entries(primitives.color.neutral)) {
    lines.push(`  --color-neutral-${shade}: ${token.$value};`);
  }

  // Spacing
  for (const [size, token] of Object.entries(primitives.spacing)) {
    if (isToken(token)) {
      lines.push(`  --spacing-${size}: ${token.$value};`);
    }
  }

  // Border radius
  for (const [size, token] of Object.entries(primitives.borderRadius)) {
    if (isToken(token)) {
      lines.push(`  --radius-${size}: ${token.$value};`);
    }
  }

  lines.push("}");
  return lines.join("\n");
}
