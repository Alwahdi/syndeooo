import { describe, expect, it } from "vitest";
import { components } from "../tokens/components";

describe("Design Tokens - Components", () => {
  describe("DTCG structure", () => {
    it("has a $type identifier", () => {
      expect(components.$type).toBe("components");
    });

    it("has a $description", () => {
      expect(components.$description).toContain("SyndeoCare");
    });
  });

  describe("Button tokens", () => {
    it("defines size variants", () => {
      expect(components.button.size.sm).toBeDefined();
      expect(components.button.size.default).toBeDefined();
      expect(components.button.size.lg).toBeDefined();
      expect(components.button.size.xl).toBeDefined();
    });

    it("default button meets WCAG minimum touch target (44px)", () => {
      expect(components.button.size.default.height.$description).toContain(
        "44px"
      );
      expect(components.button.size.default.height.$description).toContain(
        "WCAG"
      );
    });

    it("defines style variants", () => {
      expect(components.button.variant.default).toBeDefined();
      expect(components.button.variant.secondary).toBeDefined();
      expect(components.button.variant.outline).toBeDefined();
      expect(components.button.variant.ghost).toBeDefined();
      expect(components.button.variant.destructive).toBeDefined();
    });

    it("defines disabled and loading states", () => {
      expect(components.button.state.disabled.opacity.$value).toBe(0.5);
      expect(components.button.state.disabled.cursor.$value).toBe(
        "not-allowed"
      );
      expect(components.button.state.loading.cursor.$value).toBe("wait");
    });

    it("defines animation properties", () => {
      expect(components.button.animation.pressScale.$value).toBe(0.98);
    });
  });

  describe("Card tokens", () => {
    it("defines padding variants", () => {
      expect(components.card.padding.sm).toBeDefined();
      expect(components.card.padding.default).toBeDefined();
      expect(components.card.padding.lg).toBeDefined();
    });

    it("defines hover effects", () => {
      expect(components.card.hover.shadow).toBeDefined();
      expect(components.card.hover.borderColor).toBeDefined();
      expect(components.card.hover.transform.$value).toBe("translateY(-2px)");
    });
  });

  describe("Input tokens", () => {
    it("defines height variants", () => {
      expect(components.input.height.sm).toBeDefined();
      expect(components.input.height.default).toBeDefined();
      expect(components.input.height.lg).toBeDefined();
    });

    it("defines border states", () => {
      expect(components.input.border.default).toBeDefined();
      expect(components.input.border.focus).toBeDefined();
      expect(components.input.border.error).toBeDefined();
      expect(components.input.border.success).toBeDefined();
    });

    it("defines focus ring properties", () => {
      expect(components.input.focus.ringWidth.$value).toBe("2px");
      expect(components.input.focus.ringOffset.$value).toBe("2px");
    });
  });

  describe("Badge tokens", () => {
    it("defines badge variants", () => {
      expect(components.badge.variant.default).toBeDefined();
      expect(components.badge.variant.secondary).toBeDefined();
      expect(components.badge.variant.success).toBeDefined();
      expect(components.badge.variant.warning).toBeDefined();
      expect(components.badge.variant.destructive).toBeDefined();
      expect(components.badge.variant.outline).toBeDefined();
    });

    it("uses pill shape border radius", () => {
      expect(components.badge.borderRadius.$value).toContain(
        "primitives.borderRadius.full"
      );
    });
  });

  describe("Avatar tokens", () => {
    it("defines size variants", () => {
      expect(components.avatar.size.xs).toBeDefined();
      expect(components.avatar.size.sm).toBeDefined();
      expect(components.avatar.size.default).toBeDefined();
      expect(components.avatar.size.lg).toBeDefined();
      expect(components.avatar.size.xl).toBeDefined();
      expect(components.avatar.size["2xl"]).toBeDefined();
    });
  });

  describe("Skeleton tokens", () => {
    it("defines shimmer animation", () => {
      expect(components.skeleton.shimmer.gradient.$value).toContain(
        "linear-gradient"
      );
      expect(components.skeleton.shimmer.duration.$value).toBe("1.5s");
    });
  });

  describe("Toast tokens", () => {
    it("defines toast variants", () => {
      expect(components.toast.variant.default).toBeDefined();
      expect(components.toast.variant.success).toBeDefined();
      expect(components.toast.variant.error).toBeDefined();
      expect(components.toast.variant.warning).toBeDefined();
    });

    it("defines enter/exit animations", () => {
      expect(components.toast.animation.enter.duration).toBeDefined();
      expect(components.toast.animation.exit.duration).toBeDefined();
    });
  });

  describe("Sidebar tokens", () => {
    it("defines collapsed and expanded widths", () => {
      expect(components.sidebar.width.collapsed.$value).toBe("56px");
      expect(components.sidebar.width.expanded.$value).toBe("240px");
    });

    it("defines active item styling", () => {
      expect(components.sidebar.item.activeBackground).toBeDefined();
      expect(components.sidebar.item.activeForeground).toBeDefined();
    });
  });
});
