import { describe, expect, it } from "vitest";
import {
  getContrastRatio,
  checkContrast,
  checkTouchTarget,
  checkFocusIndicator,
  checkMotion,
  runAccessibilityAudit,
  ariaPatterns,
} from "../accessibility/wcag-checks";

describe("WCAG Accessibility Checks", () => {
  describe("getContrastRatio", () => {
    it("returns high contrast for black on white (OKLch)", () => {
      const ratio = getContrastRatio("oklch(0 0 0)", "oklch(1 0 0)");
      expect(ratio).toBeGreaterThan(15);
    });

    it("returns 1:1 for same colors", () => {
      const ratio = getContrastRatio("oklch(0.5 0 0)", "oklch(0.5 0 0)");
      expect(ratio).toBe(1);
    });

    it("returns 0 for unparseable colors", () => {
      const ratio = getContrastRatio("not-a-color", "oklch(1 0 0)");
      expect(ratio).toBe(0);
    });

    it("handles HSL colors", () => {
      const ratio = getContrastRatio("hsl(0, 0%, 0%)", "hsl(0, 0%, 100%)");
      expect(ratio).toBeGreaterThan(15);
    });

    it("handles mixed OKLch and HSL", () => {
      const ratio = getContrastRatio("oklch(0 0 0)", "hsl(0, 0%, 100%)");
      expect(ratio).toBeGreaterThan(10);
    });
  });

  describe("checkContrast", () => {
    it("passes AA for high contrast pairs", () => {
      const result = checkContrast("oklch(0.15 0 0)", "oklch(1 0 0)");
      expect(result.aa.normalText).toBe(true);
      expect(result.aa.largeText).toBe(true);
      expect(result.aa.uiComponents).toBe(true);
    });

    it("passes AAA for very high contrast pairs", () => {
      const result = checkContrast("oklch(0 0 0)", "oklch(1 0 0)");
      expect(result.aaa.normalText).toBe(true);
      expect(result.aaa.largeText).toBe(true);
    });

    it("fails for low contrast pairs", () => {
      const result = checkContrast("oklch(0.7 0 0)", "oklch(0.8 0 0)");
      expect(result.aa.normalText).toBe(false);
    });

    it("returns a numeric ratio", () => {
      const result = checkContrast("oklch(0.42 0.12 320)", "oklch(1 0 0)");
      expect(result.ratio).toBeGreaterThan(0);
      expect(typeof result.ratio).toBe("number");
    });
  });

  describe("checkTouchTarget", () => {
    it("44x44 passes WCAG AAA", () => {
      const result = checkTouchTarget(44, 44);
      expect(result.wcagAA).toBe(true);
      expect(result.wcagAAA).toBe(true);
      expect(result.appleHIG).toBe(true);
    });

    it("48x48 passes Material Design", () => {
      const result = checkTouchTarget(48, 48);
      expect(result.materialDesign).toBe(true);
    });

    it("24x24 passes WCAG AA minimum", () => {
      const result = checkTouchTarget(24, 24);
      expect(result.wcagAA).toBe(true);
      expect(result.wcagAAA).toBe(false);
    });

    it("20x20 fails WCAG AA", () => {
      const result = checkTouchTarget(20, 20);
      expect(result.wcagAA).toBe(false);
    });

    it("returns the dimensions", () => {
      const result = checkTouchTarget(36, 48);
      expect(result.width).toBe(36);
      expect(result.height).toBe(48);
    });
  });

  describe("checkFocusIndicator", () => {
    it("passes with visible 2px focus and sufficient contrast", () => {
      const result = checkFocusIndicator(
        "oklch(0.42 0.12 320)",
        "oklch(1 0 0)",
        2
      );
      expect(result.hasVisibleFocus).toBe(true);
      expect(result.meetsContrastRequirement).toBe(true);
      expect(result.hasMinimumArea).toBe(true);
    });

    it("fails with 0px outline", () => {
      const result = checkFocusIndicator(
        "oklch(0.42 0.12 320)",
        "oklch(1 0 0)",
        0
      );
      expect(result.hasVisibleFocus).toBe(false);
      expect(result.hasMinimumArea).toBe(false);
    });

    it("fails contrast with similar colors", () => {
      const result = checkFocusIndicator(
        "oklch(0.9 0 0)",
        "oklch(0.95 0 0)",
        2
      );
      expect(result.meetsContrastRequirement).toBe(false);
    });
  });

  describe("checkMotion", () => {
    it("passes with reduced motion fallback", () => {
      const result = checkMotion(300, true);
      expect(result.respectsReducedMotion).toBe(true);
      expect(result.animationDuration).toBe(300);
    });

    it("passes with 0ms duration", () => {
      const result = checkMotion(0, false);
      expect(result.respectsReducedMotion).toBe(true);
    });

    it("fails without reduced motion fallback", () => {
      const result = checkMotion(300, false);
      expect(result.respectsReducedMotion).toBe(false);
    });

    it("flags essential motion", () => {
      const result = checkMotion(200, true, true);
      expect(result.isEssentialMotion).toBe(true);
    });
  });

  describe("runAccessibilityAudit", () => {
    it("returns a complete audit report", () => {
      const audit = runAccessibilityAudit();

      expect(audit.timestamp).toBeDefined();
      expect(audit.summary.total).toBeGreaterThan(0);
      expect(audit.summary.passed).toBeGreaterThanOrEqual(0);
      expect(audit.summary.failed).toBeGreaterThanOrEqual(0);
    });

    it("checks color contrast pairs", () => {
      const audit = runAccessibilityAudit();
      expect(audit.colorContrast.checked).toBeGreaterThan(0);
    });

    it("checks touch target sizes", () => {
      const audit = runAccessibilityAudit();
      expect(audit.touchTargets.checked).toBeGreaterThan(0);
    });

    it("summary total equals passed + failed", () => {
      const audit = runAccessibilityAudit();
      expect(audit.summary.total).toBe(
        audit.summary.passed + audit.summary.failed
      );
    });
  });

  describe("ARIA Patterns", () => {
    it("defines button pattern", () => {
      expect(ariaPatterns.button.role).toBe("button");
      expect(ariaPatterns.button.keyboardInteraction).toContain("Enter");
      expect(ariaPatterns.button.keyboardInteraction).toContain("Space");
    });

    it("defines dialog pattern", () => {
      expect(ariaPatterns.dialog.role).toBe("dialog");
      expect(ariaPatterns.dialog.keyboardInteraction).toEqual(
        expect.arrayContaining([expect.stringContaining("Escape")])
      );
    });

    it("defines tabs pattern", () => {
      expect(ariaPatterns.tabs.containerRole).toBe("tablist");
      expect(ariaPatterns.tabs.tabRole).toBe("tab");
      expect(ariaPatterns.tabs.panelRole).toBe("tabpanel");
    });

    it("defines form pattern with field requirements", () => {
      expect(ariaPatterns.form.fieldRequirements.length).toBeGreaterThan(0);
      expect(ariaPatterns.form.fieldRequirements).toEqual(
        expect.arrayContaining([
          expect.stringContaining("Labels"),
          expect.stringContaining("aria-required"),
        ])
      );
    });
  });
});
