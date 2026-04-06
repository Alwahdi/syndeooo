import { describe, expect, it } from "vitest";
import { semantics } from "../tokens/semantics";
import { primitives } from "../tokens/primitives";

describe("Design Tokens - Semantics", () => {
  describe("DTCG structure", () => {
    it("has a $type identifier", () => {
      expect(semantics.$type).toBe("semantics");
    });

    it("has a $description", () => {
      expect(semantics.$description).toContain("SyndeoCare");
    });
  });

  describe("Light theme", () => {
    it("defines surface colors", () => {
      expect(semantics.light.surface.background.resolvedValue).toBe(
        primitives.color.neutral[0].$value
      );
      expect(semantics.light.surface.foreground.resolvedValue).toBe(
        primitives.color.neutral[950].$value
      );
      expect(semantics.light.surface.card.resolvedValue).toBe(
        primitives.color.neutral[0].$value
      );
    });

    it("maps primary action to brand purple", () => {
      expect(semantics.light.action.primary.resolvedValue).toBe(
        primitives.color.purple[500].$value
      );
    });

    it("maps secondary action to brand teal", () => {
      expect(semantics.light.action.secondary.resolvedValue).toBe(
        primitives.color.teal[500].$value
      );
    });

    it("maps destructive action to red", () => {
      expect(semantics.light.action.destructive.resolvedValue).toBe(
        primitives.color.red[500].$value
      );
    });

    it("defines all feedback colors", () => {
      expect(semantics.light.feedback.success.resolvedValue).toBe(
        primitives.color.emerald[500].$value
      );
      expect(semantics.light.feedback.warning.resolvedValue).toBe(
        primitives.color.amber[500].$value
      );
      expect(semantics.light.feedback.error.resolvedValue).toBe(
        primitives.color.red[500].$value
      );
      expect(semantics.light.feedback.info.resolvedValue).toBe(
        primitives.color.sky[500].$value
      );
    });

    it("has white foreground on feedback colors for contrast", () => {
      const white = primitives.color.neutral[0].$value;
      expect(semantics.light.feedback.successForeground.resolvedValue).toBe(white);
      expect(semantics.light.feedback.warningForeground.resolvedValue).toBe(white);
      expect(semantics.light.feedback.errorForeground.resolvedValue).toBe(white);
      expect(semantics.light.feedback.infoForeground.resolvedValue).toBe(white);
    });

    it("defines border colors", () => {
      expect(semantics.light.border.default.resolvedValue).toBe(
        primitives.color.neutral[200].$value
      );
      expect(semantics.light.border.focus.resolvedValue).toBe(
        primitives.color.purple[500].$value
      );
    });

    it("defines text hierarchy", () => {
      expect(semantics.light.text.primary).toBeDefined();
      expect(semantics.light.text.secondary).toBeDefined();
      expect(semantics.light.text.muted).toBeDefined();
      expect(semantics.light.text.disabled).toBeDefined();
      expect(semantics.light.text.brand).toBeDefined();
      expect(semantics.light.text.link).toBeDefined();
    });
  });

  describe("Dark theme", () => {
    it("inverts surface colors from light theme", () => {
      // Dark bg should be dark, light bg should be light
      expect(semantics.dark.surface.background.resolvedValue).toBe(
        primitives.color.neutral[950].$value
      );
      expect(semantics.dark.surface.foreground.resolvedValue).toBe(
        primitives.color.neutral[50].$value
      );
    });

    it("uses lighter brand shades for dark mode actions", () => {
      // Dark mode uses lighter (400) shade instead of darker (500)
      expect(semantics.dark.action.primary.resolvedValue).toBe(
        primitives.color.purple[400].$value
      );
      expect(semantics.dark.action.secondary.resolvedValue).toBe(
        primitives.color.teal[400].$value
      );
    });

    it("has white foreground on success/warning for WCAG compliance", () => {
      const white = primitives.color.neutral[0].$value;
      expect(semantics.dark.feedback.successForeground.resolvedValue).toBe(white);
      expect(semantics.dark.feedback.warningForeground.resolvedValue).toBe(white);
    });

    it("defines dark theme borders", () => {
      expect(semantics.dark.border.default.resolvedValue).toBe(
        primitives.color.neutral[700].$value
      );
    });
  });

  describe("Gradients", () => {
    it("defines primary gradient", () => {
      expect(semantics.gradient.primary.$value).toContain("linear-gradient");
      expect(semantics.gradient.primary.$value).toContain(
        "primitives.color.purple.500"
      );
    });

    it("defines brand gradient (purple → teal)", () => {
      expect(semantics.gradient.brand.$value).toContain(
        "primitives.color.purple.500"
      );
      expect(semantics.gradient.brand.$value).toContain(
        "primitives.color.teal.500"
      );
    });

    it("defines hero gradient", () => {
      expect(semantics.gradient.hero.$value).toContain("linear-gradient");
    });
  });

  describe("Theme consistency", () => {
    it("light and dark themes have matching structure", () => {
      const lightKeys = Object.keys(semantics.light);
      const darkKeys = Object.keys(semantics.dark);

      // Both should have surface, action, feedback, border, text
      expect(lightKeys).toEqual(expect.arrayContaining(darkKeys));
    });

    it("all resolved values are valid OKLch colors", () => {
      function checkResolvedValues(
        obj: Record<string, unknown>,
        path = ""
      ): void {
        for (const [key, value] of Object.entries(obj)) {
          if (key.startsWith("$")) continue;
          if (
            typeof value === "object" &&
            value !== null &&
            "resolvedValue" in value
          ) {
            const rv = (value as { resolvedValue: string }).resolvedValue;
            expect(rv, `${path}.${key} should be oklch format`).toMatch(
              /^oklch\(/
            );
          } else if (typeof value === "object" && value !== null) {
            checkResolvedValues(
              value as Record<string, unknown>,
              `${path}.${key}`
            );
          }
        }
      }

      checkResolvedValues(semantics.light as unknown as Record<string, unknown>, "light");
      checkResolvedValues(semantics.dark as unknown as Record<string, unknown>, "dark");
    });
  });
});
