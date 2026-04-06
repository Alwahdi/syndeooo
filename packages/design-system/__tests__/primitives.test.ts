import { describe, expect, it } from "vitest";
import { primitives } from "../tokens/primitives";

describe("Design Tokens - Primitives", () => {
  describe("DTCG structure", () => {
    it("has a $type identifier", () => {
      expect(primitives.$type).toBe("primitives");
    });

    it("has a $description", () => {
      expect(primitives.$description).toBeDefined();
      expect(primitives.$description).toContain("SyndeoCare");
    });
  });

  describe("Brand colors", () => {
    it("defines the full purple (primary) scale", () => {
      const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
      for (const shade of shades) {
        expect(primitives.color.purple[shade]).toBeDefined();
        expect(primitives.color.purple[shade].$value).toMatch(/^oklch\(/);
      }
    });

    it("defines the full teal (accent) scale", () => {
      const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
      for (const shade of shades) {
        expect(primitives.color.teal[shade]).toBeDefined();
        expect(primitives.color.teal[shade].$value).toMatch(/^oklch\(/);
      }
    });

    it("uses correct primary brand color (Deep Purple #663C6D)", () => {
      expect(primitives.color.purple[500].$value).toBe(
        "oklch(0.42 0.12 320)"
      );
    });

    it("uses correct accent brand color (Teal Blue #56849A)", () => {
      expect(primitives.color.teal[500].$value).toBe("oklch(0.56 0.08 220)");
    });
  });

  describe("Neutral colors", () => {
    it("defines a complete neutral scale", () => {
      const shades = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
      for (const shade of shades) {
        expect(primitives.color.neutral[shade]).toBeDefined();
        expect(primitives.color.neutral[shade].$value).toMatch(/^oklch\(/);
      }
    });

    it("has pure white at 0", () => {
      expect(primitives.color.neutral[0].$value).toBe("oklch(1 0 0)");
    });

    it("has darkest value at 950", () => {
      expect(primitives.color.neutral[950].$value).toBe("oklch(0.145 0 0)");
    });
  });

  describe("Status colors", () => {
    it("defines red (destructive) colors", () => {
      expect(primitives.color.red[500]).toBeDefined();
      expect(primitives.color.red[500].$value).toMatch(/^oklch\(/);
    });

    it("defines amber (warning) colors", () => {
      expect(primitives.color.amber[500]).toBeDefined();
      expect(primitives.color.amber[500].$value).toMatch(/^oklch\(/);
    });

    it("defines emerald (success) colors", () => {
      expect(primitives.color.emerald[500]).toBeDefined();
      expect(primitives.color.emerald[500].$value).toMatch(/^oklch\(/);
    });

    it("defines sky (info) colors", () => {
      expect(primitives.color.sky[500]).toBeDefined();
      expect(primitives.color.sky[500].$value).toMatch(/^oklch\(/);
    });
  });

  describe("All colors use OKLch format", () => {
    it("all color values are in oklch() format", () => {
      const colorGroups = [
        primitives.color.purple,
        primitives.color.teal,
        primitives.color.neutral,
        primitives.color.red,
        primitives.color.amber,
        primitives.color.emerald,
        primitives.color.sky,
      ];

      for (const group of colorGroups) {
        for (const [key, token] of Object.entries(group)) {
          if (key.startsWith("$")) continue;
          expect(
            (token as { $value: string }).$value,
            `Color token ${key} should use oklch format`
          ).toMatch(/^oklch\([\d.]+ [\d.]+ [\d.]+\)$/);
        }
      }
    });
  });

  describe("Typography", () => {
    it("defines font families", () => {
      expect(primitives.fontFamily.sans.$value).toContain("Geist Sans");
      expect(primitives.fontFamily.arabic.$value).toContain("Cairo");
      expect(primitives.fontFamily.mono.$value).toContain("Geist Mono");
    });

    it("defines a complete font size scale", () => {
      const sizes = [
        "xs",
        "sm",
        "base",
        "lg",
        "xl",
        "2xl",
        "3xl",
        "4xl",
        "5xl",
        "6xl",
      ];
      for (const size of sizes) {
        expect(primitives.fontSize[size]).toBeDefined();
        expect(primitives.fontSize[size].$value).toMatch(/rem$/);
      }
    });

    it("defines font weights", () => {
      expect(primitives.fontWeight.light.$value).toBe(300);
      expect(primitives.fontWeight.normal.$value).toBe(400);
      expect(primitives.fontWeight.medium.$value).toBe(500);
      expect(primitives.fontWeight.semibold.$value).toBe(600);
      expect(primitives.fontWeight.bold.$value).toBe(700);
    });
  });

  describe("Spacing", () => {
    it("uses 4px base grid", () => {
      expect(primitives.spacing[1].$value).toBe("0.25rem"); // 4px
      expect(primitives.spacing[2].$value).toBe("0.5rem"); // 8px
      expect(primitives.spacing[4].$value).toBe("1rem"); // 16px
    });

    it("includes WCAG minimum touch target size (44px)", () => {
      expect(primitives.spacing[11].$value).toBe("2.75rem"); // 44px
      expect(primitives.spacing[11].$description).toContain("touch target");
    });
  });

  describe("Border radius", () => {
    it("defines a radius scale", () => {
      const sizes = ["none", "sm", "md", "lg", "xl", "2xl", "3xl", "full"];
      for (const size of sizes) {
        expect(primitives.borderRadius[size]).toBeDefined();
      }
    });

    it("full radius is pill shape", () => {
      expect(primitives.borderRadius.full.$value).toBe("9999px");
    });
  });

  describe("Shadows", () => {
    it("defines shadow scale", () => {
      expect(primitives.shadow.sm).toBeDefined();
      expect(primitives.shadow.md).toBeDefined();
      expect(primitives.shadow.lg).toBeDefined();
      expect(primitives.shadow.xl).toBeDefined();
    });
  });

  describe("Animation", () => {
    it("defines duration scale", () => {
      expect(primitives.duration.instant.$value).toBe("0ms");
      expect(primitives.duration.fast.$value).toBe("100ms");
      expect(primitives.duration.normal.$value).toBe("200ms");
      expect(primitives.duration.slow.$value).toBe("300ms");
      expect(primitives.duration.slower.$value).toBe("500ms");
    });

    it("defines easing functions", () => {
      expect(primitives.easing.linear.$value).toEqual([0, 0, 1, 1]);
      expect(primitives.easing.easeInOut.$value).toEqual([0.4, 0, 0.2, 1]);
    });
  });

  describe("Z-Index", () => {
    it("defines z-index layers in ascending order", () => {
      const layers = [
        primitives.zIndex.base.$value,
        primitives.zIndex.dropdown.$value,
        primitives.zIndex.sticky.$value,
        primitives.zIndex.fixed.$value,
        primitives.zIndex.overlay.$value,
        primitives.zIndex.modal.$value,
        primitives.zIndex.popover.$value,
        primitives.zIndex.tooltip.$value,
        primitives.zIndex.toast.$value,
      ];

      for (let i = 1; i < layers.length; i++) {
        expect(layers[i]).toBeGreaterThan(layers[i - 1]);
      }
    });
  });
});
