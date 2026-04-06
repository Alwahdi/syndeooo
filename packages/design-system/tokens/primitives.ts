/**
 * ============================================================================
 * DESIGN TOKENS - PRIMITIVES LAYER (DTCG Standard)
 * ============================================================================
 *
 * Raw design values with no semantic meaning.
 * These are the foundational building blocks of the design system.
 *
 * Standard: W3C Design Tokens Community Group (DTCG)
 * Format: Design Tokens Format Module (DTF)
 *
 * Brand: SyndeoCare - Deep Purple (#663C6D) / Teal Blue (#56849A)
 * Color Format: OKLch (Tailwind v4 compatible)
 *
 * @see https://design-tokens.github.io/community-group/format/
 */

export const primitives = {
  $type: "primitives",
  $description: "SyndeoCare Design System - Primitive Tokens",

  color: {
    $type: "color",

    // ===== BRAND PURPLES (Primary) =====
    purple: {
      50: { $value: "oklch(0.96 0.02 310)", $description: "Lightest purple tint" },
      100: { $value: "oklch(0.92 0.04 310)", $description: "Very light purple" },
      200: { $value: "oklch(0.83 0.07 310)", $description: "Light purple" },
      300: { $value: "oklch(0.73 0.11 310)", $description: "Medium light purple" },
      400: { $value: "oklch(0.58 0.13 310)", $description: "Medium purple" },
      500: { $value: "oklch(0.42 0.12 320)", $description: "Primary brand purple - #663C6D" },
      600: { $value: "oklch(0.37 0.11 320)", $description: "Dark purple" },
      700: { $value: "oklch(0.32 0.10 320)", $description: "Darker purple" },
      800: { $value: "oklch(0.25 0.08 320)", $description: "Very dark purple" },
      900: { $value: "oklch(0.18 0.06 320)", $description: "Darkest purple" },
    },

    // ===== BRAND TEALS (Accent) =====
    teal: {
      50: { $value: "oklch(0.96 0.03 200)", $description: "Lightest teal" },
      100: { $value: "oklch(0.92 0.05 200)", $description: "Very light teal" },
      200: { $value: "oklch(0.83 0.08 200)", $description: "Light teal" },
      300: { $value: "oklch(0.73 0.10 200)", $description: "Medium light teal" },
      400: { $value: "oklch(0.63 0.10 200)", $description: "Medium teal" },
      500: { $value: "oklch(0.56 0.08 220)", $description: "Primary brand teal - #56849A" },
      600: { $value: "oklch(0.50 0.07 220)", $description: "Dark teal" },
      700: { $value: "oklch(0.43 0.06 220)", $description: "Darker teal" },
      800: { $value: "oklch(0.35 0.05 220)", $description: "Very dark teal" },
      900: { $value: "oklch(0.25 0.04 220)", $description: "Darkest teal" },
    },

    // ===== NEUTRALS =====
    neutral: {
      0: { $value: "oklch(1 0 0)", $description: "Pure white" },
      50: { $value: "oklch(0.985 0 0)", $description: "Near white" },
      100: { $value: "oklch(0.97 0 0)", $description: "Light gray" },
      200: { $value: "oklch(0.922 0 0)", $description: "Lighter gray" },
      300: { $value: "oklch(0.87 0 0)", $description: "Light gray" },
      400: { $value: "oklch(0.708 0 0)", $description: "Medium gray" },
      500: { $value: "oklch(0.556 0 0)", $description: "Gray" },
      600: { $value: "oklch(0.439 0 0)", $description: "Dark gray" },
      700: { $value: "oklch(0.371 0 0)", $description: "Darker gray" },
      800: { $value: "oklch(0.269 0 0)", $description: "Very dark gray" },
      900: { $value: "oklch(0.205 0 0)", $description: "Near black" },
      950: { $value: "oklch(0.145 0 0)", $description: "Darkest" },
    },

    // ===== STATUS COLORS =====
    red: {
      50: { $value: "oklch(0.97 0.02 25)", $description: "Lightest red" },
      100: { $value: "oklch(0.94 0.05 25)", $description: "Very light red" },
      400: { $value: "oklch(0.65 0.20 25)", $description: "Medium red" },
      500: { $value: "oklch(0.577 0.245 27.325)", $description: "Primary red / destructive" },
      600: { $value: "oklch(0.50 0.20 25)", $description: "Dark red" },
      700: { $value: "oklch(0.42 0.17 25)", $description: "Darker red" },
    },

    amber: {
      50: { $value: "oklch(0.97 0.04 85)", $description: "Lightest amber" },
      100: { $value: "oklch(0.94 0.08 85)", $description: "Very light amber" },
      400: { $value: "oklch(0.80 0.16 75)", $description: "Medium amber" },
      500: { $value: "oklch(0.75 0.18 65)", $description: "Primary amber / warning" },
      600: { $value: "oklch(0.68 0.17 55)", $description: "Dark amber" },
      700: { $value: "oklch(0.60 0.15 45)", $description: "Darker amber" },
    },

    emerald: {
      50: { $value: "oklch(0.97 0.03 165)", $description: "Lightest emerald" },
      100: { $value: "oklch(0.94 0.06 165)", $description: "Very light emerald" },
      400: { $value: "oklch(0.70 0.14 165)", $description: "Medium emerald" },
      500: { $value: "oklch(0.508 0.118 165.612)", $description: "Primary emerald / success" },
      600: { $value: "oklch(0.50 0.12 165)", $description: "Dark emerald" },
      700: { $value: "oklch(0.42 0.10 165)", $description: "Darker emerald" },
    },

    sky: {
      50: { $value: "oklch(0.97 0.02 230)", $description: "Lightest sky" },
      100: { $value: "oklch(0.94 0.04 230)", $description: "Very light sky" },
      400: { $value: "oklch(0.70 0.14 230)", $description: "Medium sky" },
      500: { $value: "oklch(0.60 0.14 240)", $description: "Primary sky / info" },
      600: { $value: "oklch(0.53 0.13 240)", $description: "Dark sky" },
      700: { $value: "oklch(0.46 0.11 240)", $description: "Darker sky" },
    },
  },

  // ===== TYPOGRAPHY =====
  fontFamily: {
    $type: "fontFamily",
    sans: { $value: ["Geist Sans", "system-ui", "sans-serif"], $description: "Primary font (Geist)" },
    arabic: { $value: ["Cairo", "Geist Sans", "sans-serif"], $description: "Font for Arabic content" },
    mono: { $value: ["Geist Mono", "Consolas", "monospace"], $description: "Monospace font" },
  },

  fontSize: {
    $type: "dimension",
    xs: { $value: "0.75rem", $description: "12px" },
    sm: { $value: "0.875rem", $description: "14px" },
    base: { $value: "1rem", $description: "16px" },
    lg: { $value: "1.125rem", $description: "18px" },
    xl: { $value: "1.25rem", $description: "20px" },
    "2xl": { $value: "1.5rem", $description: "24px" },
    "3xl": { $value: "1.875rem", $description: "30px" },
    "4xl": { $value: "2.25rem", $description: "36px" },
    "5xl": { $value: "3rem", $description: "48px" },
    "6xl": { $value: "3.75rem", $description: "60px" },
  },

  fontWeight: {
    $type: "fontWeight",
    light: { $value: 300, $description: "Light weight" },
    normal: { $value: 400, $description: "Normal weight" },
    medium: { $value: 500, $description: "Medium weight" },
    semibold: { $value: 600, $description: "Semibold weight" },
    bold: { $value: 700, $description: "Bold weight" },
  },

  lineHeight: {
    $type: "number",
    none: { $value: 1, $description: "No line height" },
    tight: { $value: 1.25, $description: "Tight line height" },
    snug: { $value: 1.375, $description: "Snug line height" },
    normal: { $value: 1.5, $description: "Normal line height" },
    relaxed: { $value: 1.625, $description: "Relaxed line height" },
    loose: { $value: 2, $description: "Loose line height" },
  },

  // ===== SPACING (4px base grid) =====
  spacing: {
    $type: "dimension",
    0: { $value: "0", $description: "No spacing" },
    px: { $value: "1px", $description: "1 pixel" },
    0.5: { $value: "0.125rem", $description: "2px" },
    1: { $value: "0.25rem", $description: "4px" },
    1.5: { $value: "0.375rem", $description: "6px" },
    2: { $value: "0.5rem", $description: "8px" },
    2.5: { $value: "0.625rem", $description: "10px" },
    3: { $value: "0.75rem", $description: "12px" },
    3.5: { $value: "0.875rem", $description: "14px" },
    4: { $value: "1rem", $description: "16px" },
    5: { $value: "1.25rem", $description: "20px" },
    6: { $value: "1.5rem", $description: "24px" },
    7: { $value: "1.75rem", $description: "28px" },
    8: { $value: "2rem", $description: "32px" },
    9: { $value: "2.25rem", $description: "36px" },
    10: { $value: "2.5rem", $description: "40px" },
    11: { $value: "2.75rem", $description: "44px - min touch target" },
    12: { $value: "3rem", $description: "48px - comfortable touch" },
    14: { $value: "3.5rem", $description: "56px" },
    16: { $value: "4rem", $description: "64px" },
    20: { $value: "5rem", $description: "80px" },
    24: { $value: "6rem", $description: "96px" },
    32: { $value: "8rem", $description: "128px" },
    40: { $value: "10rem", $description: "160px" },
    48: { $value: "12rem", $description: "192px" },
    56: { $value: "14rem", $description: "224px" },
    64: { $value: "16rem", $description: "256px" },
  },

  // ===== BORDER RADIUS =====
  borderRadius: {
    $type: "dimension",
    none: { $value: "0", $description: "No radius" },
    sm: { $value: "0.25rem", $description: "4px - small" },
    md: { $value: "0.375rem", $description: "6px - medium" },
    lg: { $value: "0.5rem", $description: "8px - large" },
    xl: { $value: "0.75rem", $description: "12px - extra large" },
    "2xl": { $value: "1rem", $description: "16px" },
    "3xl": { $value: "1.5rem", $description: "24px" },
    full: { $value: "9999px", $description: "Pill shape" },
  },

  // ===== SHADOWS =====
  shadow: {
    $type: "shadow",
    sm: {
      $value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      $description: "Small shadow",
    },
    md: {
      $value: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
      $description: "Medium shadow",
    },
    lg: {
      $value: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
      $description: "Large shadow",
    },
    xl: {
      $value: "0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.06)",
      $description: "Extra large shadow",
    },
  },

  // ===== ANIMATION =====
  duration: {
    $type: "duration",
    instant: { $value: "0ms", $description: "Instant" },
    fast: { $value: "100ms", $description: "Fast" },
    normal: { $value: "200ms", $description: "Normal" },
    slow: { $value: "300ms", $description: "Slow" },
    slower: { $value: "500ms", $description: "Slower" },
  },

  easing: {
    $type: "cubicBezier",
    linear: { $value: [0, 0, 1, 1], $description: "Linear" },
    easeIn: { $value: [0.4, 0, 1, 1], $description: "Ease in" },
    easeOut: { $value: [0, 0, 0.2, 1], $description: "Ease out" },
    easeInOut: { $value: [0.4, 0, 0.2, 1], $description: "Ease in-out" },
    spring: { $value: [0.68, -0.55, 0.265, 1.55], $description: "Spring bounce" },
  },

  // ===== Z-INDEX =====
  zIndex: {
    $type: "number",
    base: { $value: 0, $description: "Base level" },
    dropdown: { $value: 10, $description: "Dropdowns" },
    sticky: { $value: 20, $description: "Sticky elements" },
    fixed: { $value: 30, $description: "Fixed elements" },
    overlay: { $value: 40, $description: "Overlays" },
    modal: { $value: 50, $description: "Modals" },
    popover: { $value: 60, $description: "Popovers" },
    tooltip: { $value: 70, $description: "Tooltips" },
    toast: { $value: 80, $description: "Toasts" },
  },
} as const;

export type Primitives = typeof primitives;
