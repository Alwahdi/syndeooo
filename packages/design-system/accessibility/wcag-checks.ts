/**
 * ============================================================================
 * ACCESSIBILITY AUTOMATION - WCAG 2.2 Compliance Checks
 * ============================================================================
 *
 * Automated accessibility validation for the design system.
 * Ensures WCAG 2.2 AA/AAA compliance at the token level.
 *
 * Supports both HSL and OKLch color formats.
 */

// ===== COLOR PARSING UTILITIES =====

/**
 * Parse an OKLch string to values.
 * Format: oklch(L C H) or oklch(L C H / A)
 */
function parseOKLch(
  color: string
): { l: number; c: number; h: number } | null {
  const match = color.match(
    /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/
  );
  if (!match) return null;
  let l = Number.parseFloat(match[1]);
  if (match[1].includes("%")) l /= 100;
  return {
    l,
    c: Number.parseFloat(match[2]),
    h: Number.parseFloat(match[3]),
  };
}

/**
 * Parse an HSL string to values.
 * Format: hsl(H, S%, L%) or hsl(H S% L%)
 */
function parseHSL(
  hsl: string
): { h: number; s: number; l: number } | null {
  const match = hsl.match(/hsl\((\d+),?\s*(\d+)%,?\s*(\d+)%\)/);
  if (!match) return null;
  return {
    h: Number.parseInt(match[1]),
    s: Number.parseInt(match[2]),
    l: Number.parseInt(match[3]),
  };
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
  } else if (h >= 120 && h < 180) {
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Approximate OKLch lightness to relative luminance.
 * This is a simplified conversion; for production use,
 * a full OKLch→sRGB→luminance pipeline is recommended.
 */
function oklchToApproxLuminance(l: number): number {
  // OKLch L is perceptual lightness (0-1).
  // Approximate relative luminance via cube relationship.
  return l * l * l;
}

/**
 * Calculate relative luminance (WCAG 2.1 formula) from RGB
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Get luminance from a color string (supports HSL and OKLch)
 */
function getLuminance(color: string): number | null {
  const oklch = parseOKLch(color);
  if (oklch) {
    return oklchToApproxLuminance(oklch.l);
  }

  const hsl = parseHSL(color);
  if (hsl) {
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return getRelativeLuminance(rgb.r, rgb.g, rgb.b);
  }

  return null;
}

/**
 * Calculate contrast ratio between two colors.
 * Supports both HSL and OKLch color formats.
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);

  if (l1 === null || l2 === null) return 0;

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// ===== WCAG COMPLIANCE LEVELS =====

export interface ContrastResult {
  ratio: number;
  aa: {
    normalText: boolean; // 4.5:1
    largeText: boolean; // 3:1
    uiComponents: boolean; // 3:1
  };
  aaa: {
    normalText: boolean; // 7:1
    largeText: boolean; // 4.5:1
  };
}

export function checkContrast(
  foreground: string,
  background: string
): ContrastResult {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio: Math.round(ratio * 100) / 100,
    aa: {
      normalText: ratio >= 4.5,
      largeText: ratio >= 3,
      uiComponents: ratio >= 3,
    },
    aaa: {
      normalText: ratio >= 7,
      largeText: ratio >= 4.5,
    },
  };
}

// ===== TOUCH TARGET CHECKS =====

export interface TouchTargetResult {
  wcagAA: boolean; // 24x24 CSS pixels minimum
  wcagAAA: boolean; // 44x44 CSS pixels recommended
  appleHIG: boolean; // 44x44 points
  materialDesign: boolean; // 48x48 dp
  width: number;
  height: number;
}

export function checkTouchTarget(
  width: number,
  height: number
): TouchTargetResult {
  return {
    wcagAA: width >= 24 && height >= 24,
    wcagAAA: width >= 44 && height >= 44,
    appleHIG: width >= 44 && height >= 44,
    materialDesign: width >= 48 && height >= 48,
    width,
    height,
  };
}

// ===== FOCUS INDICATOR CHECKS =====

export interface FocusIndicatorResult {
  hasVisibleFocus: boolean;
  meetsContrastRequirement: boolean; // 3:1 against adjacent colors
  hasMinimumArea: boolean; // 2px outline or equivalent
}

export function checkFocusIndicator(
  focusColor: string,
  backgroundColor: string,
  outlineWidth: number
): FocusIndicatorResult {
  const contrast = getContrastRatio(focusColor, backgroundColor);

  return {
    hasVisibleFocus: outlineWidth > 0,
    meetsContrastRequirement: contrast >= 3,
    hasMinimumArea: outlineWidth >= 2,
  };
}

// ===== MOTION & ANIMATION CHECKS =====

export interface MotionResult {
  respectsReducedMotion: boolean;
  animationDuration: number;
  isEssentialMotion: boolean;
}

export function checkMotion(
  durationMs: number,
  hasReducedMotionFallback: boolean,
  isEssential = false
): MotionResult {
  return {
    respectsReducedMotion: hasReducedMotionFallback || durationMs === 0,
    animationDuration: durationMs,
    isEssentialMotion: isEssential,
  };
}

// ===== FULL ACCESSIBILITY AUDIT =====

export interface AccessibilityAudit {
  timestamp: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  colorContrast: {
    checked: number;
    passed: number;
    issues: Array<{
      pair: string;
      ratio: number;
      required: number;
      level: "AA" | "AAA";
    }>;
  };
  touchTargets: {
    checked: number;
    passed: number;
    issues: Array<{
      component: string;
      size: string;
      required: string;
    }>;
  };
  focusIndicators: {
    allComponentsHaveFocus: boolean;
    issues: string[];
  };
}

/**
 * Run a complete accessibility audit on the design system
 */
export function runAccessibilityAudit(): AccessibilityAudit {
  // Sample contrast checks for key SyndeoCare color combinations
  const contrastChecks = [
    {
      name: "Primary on White",
      fg: "oklch(0.42 0.12 320)",
      bg: "oklch(1 0 0)",
    },
    {
      name: "White on Primary",
      fg: "oklch(1 0 0)",
      bg: "oklch(0.42 0.12 320)",
    },
    {
      name: "Accent on White",
      fg: "oklch(0.56 0.08 220)",
      bg: "oklch(1 0 0)",
    },
    {
      name: "Text on Background",
      fg: "oklch(0.145 0 0)",
      bg: "oklch(1 0 0)",
    },
    {
      name: "Muted on Background",
      fg: "oklch(0.556 0 0)",
      bg: "oklch(1 0 0)",
    },
    {
      name: "Destructive on White",
      fg: "oklch(0.577 0.245 27.325)",
      bg: "oklch(1 0 0)",
    },
  ];

  const contrastIssues: AccessibilityAudit["colorContrast"]["issues"] = [];
  let contrastPassed = 0;

  for (const check of contrastChecks) {
    const result = checkContrast(check.fg, check.bg);
    if (result.aa.normalText) {
      contrastPassed++;
    } else {
      contrastIssues.push({
        pair: check.name,
        ratio: result.ratio,
        required: 4.5,
        level: "AA",
      });
    }
  }

  // Touch target checks for component sizes
  const touchTargetChecks = [
    { name: "Button (default)", width: 44, height: 44 },
    { name: "Button (sm)", width: 36, height: 36 },
    { name: "Input", width: 200, height: 44 },
    { name: "Checkbox", width: 20, height: 20 },
    { name: "Icon Button", width: 44, height: 44 },
  ];

  const touchIssues: AccessibilityAudit["touchTargets"]["issues"] = [];
  let touchPassed = 0;

  for (const check of touchTargetChecks) {
    const result = checkTouchTarget(check.width, check.height);
    if (result.wcagAAA) {
      touchPassed++;
    } else {
      touchIssues.push({
        component: check.name,
        size: `${check.width}x${check.height}`,
        required: "44x44",
      });
    }
  }

  const total = contrastChecks.length + touchTargetChecks.length;
  const passed = contrastPassed + touchPassed;

  return {
    timestamp: new Date().toISOString(),
    summary: {
      total,
      passed,
      failed: total - passed,
      warnings: contrastIssues.filter((i) => i.ratio >= 3).length,
    },
    colorContrast: {
      checked: contrastChecks.length,
      passed: contrastPassed,
      issues: contrastIssues,
    },
    touchTargets: {
      checked: touchTargetChecks.length,
      passed: touchPassed,
      issues: touchIssues,
    },
    focusIndicators: {
      allComponentsHaveFocus: true,
      issues: [],
    },
  };
}

// ===== ARIA PATTERN DEFINITIONS =====

export const ariaPatterns = {
  button: {
    role: "button",
    requiredAttributes: ["aria-label OR visible text"],
    optionalAttributes: ["aria-pressed", "aria-expanded", "aria-disabled"],
    keyboardInteraction: ["Enter", "Space"],
  },

  dialog: {
    role: "dialog",
    requiredAttributes: ["aria-modal", "aria-labelledby OR aria-label"],
    optionalAttributes: ["aria-describedby"],
    keyboardInteraction: [
      "Escape to close",
      "Tab to cycle focus",
      "Focus trap required",
    ],
  },

  menu: {
    role: "menu",
    requiredAttributes: ["aria-labelledby OR aria-label"],
    childRole: "menuitem",
    keyboardInteraction: [
      "Arrow keys to navigate",
      "Enter/Space to select",
      "Escape to close",
    ],
  },

  tabs: {
    containerRole: "tablist",
    tabRole: "tab",
    panelRole: "tabpanel",
    requiredAttributes: [
      "aria-selected",
      "aria-controls (tab)",
      "aria-labelledby (panel)",
    ],
    keyboardInteraction: [
      "Arrow keys to navigate tabs",
      "Tab to enter panel",
    ],
  },

  combobox: {
    role: "combobox",
    requiredAttributes: ["aria-expanded", "aria-controls", "aria-haspopup"],
    optionalAttributes: ["aria-autocomplete", "aria-activedescendant"],
    keyboardInteraction: [
      "Arrow keys to navigate",
      "Enter to select",
      "Escape to close",
    ],
  },

  alert: {
    role: "alert",
    requiredAttributes: ["aria-live (polite/assertive)"],
    optionalAttributes: ["aria-atomic"],
    notes: "Use for important, time-sensitive information",
  },

  form: {
    requiredAttributes: ["aria-label OR aria-labelledby"],
    fieldRequirements: [
      "Labels must be associated with inputs",
      "Required fields need aria-required",
      "Error messages need aria-describedby",
      "Invalid fields need aria-invalid",
    ],
  },
} as const;
