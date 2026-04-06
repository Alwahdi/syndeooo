import { describe, expect, it } from "vitest";
import {
  generateDesignSystemExport,
  exportAsJSON,
  exportForStyleDictionary,
  exportAsCSSVariables,
} from "../export/tokens.json";

describe("Design System Exports", () => {
  describe("generateDesignSystemExport", () => {
    it("returns a complete export object", () => {
      const exported = generateDesignSystemExport();
      expect(exported.$schema).toBeDefined();
      expect(exported.$version).toBe("1.0.0");
      expect(exported.$name).toBe("SyndeoCare Design System");
    });

    it("includes token layers", () => {
      const exported = generateDesignSystemExport();
      expect(exported.tokens.primitives).toBeDefined();
      expect(exported.tokens.semantics).toBeDefined();
      expect(exported.tokens.components).toBeDefined();
    });

    it("includes component guide", () => {
      const exported = generateDesignSystemExport();
      expect(exported.componentGuide.button).toBeDefined();
      expect(exported.componentGuide.card).toBeDefined();
      expect(exported.componentGuide.badge).toBeDefined();
      expect(exported.componentGuide.input).toBeDefined();
      expect(exported.componentGuide.toast).toBeDefined();
    });

    it("component guide has accessibility info", () => {
      const exported = generateDesignSystemExport();
      expect(exported.componentGuide.button.accessibility).toContain(
        "44px"
      );
      expect(exported.componentGuide.input.accessibility).toContain(
        "label"
      );
    });

    it("includes usage guidelines", () => {
      const exported = generateDesignSystemExport();
      expect(exported.usageGuidelines.spacing).toContain("4px grid");
      expect(exported.usageGuidelines.colors).toContain("OKLch");
      expect(exported.usageGuidelines.accessibility).toContain("WCAG");
    });

    it("includes metadata", () => {
      const exported = generateDesignSystemExport();
      expect(exported.meta.brand).toBe("SyndeoCare");
      expect(exported.meta.themes).toEqual(["light", "dark"]);
    });
  });

  describe("exportAsJSON", () => {
    it("returns a valid JSON string", () => {
      const json = exportAsJSON();
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it("contains the design system name", () => {
      const json = exportAsJSON();
      const parsed = JSON.parse(json);
      expect(parsed.$name).toBe("SyndeoCare Design System");
    });

    it("is formatted with indentation", () => {
      const json = exportAsJSON();
      expect(json).toContain("\n");
      expect(json).toContain("  ");
    });
  });

  describe("exportForStyleDictionary", () => {
    it("returns color tokens in Style Dictionary format", () => {
      const sd = exportForStyleDictionary();
      expect(sd.color.brand.purple).toBeDefined();
      expect(sd.color.brand.teal).toBeDefined();
      expect(sd.color.neutral).toBeDefined();
    });

    it("color tokens have { value } format", () => {
      const sd = exportForStyleDictionary();
      expect(sd.color.brand.purple[50]).toHaveProperty("value");
      expect(sd.color.brand.purple[50].value).toMatch(/^oklch\(/);
    });

    it("includes spacing tokens", () => {
      const sd = exportForStyleDictionary();
      expect(Object.keys(sd.spacing).length).toBeGreaterThan(0);
    });

    it("includes border radius tokens", () => {
      const sd = exportForStyleDictionary();
      expect(Object.keys(sd.borderRadius).length).toBeGreaterThan(0);
    });

    it("includes status colors", () => {
      const sd = exportForStyleDictionary();
      expect(sd.color.status.red).toBeDefined();
      expect(sd.color.status.amber).toBeDefined();
      expect(sd.color.status.emerald).toBeDefined();
      expect(sd.color.status.sky).toBeDefined();
    });
  });

  describe("exportAsCSSVariables", () => {
    it("returns a valid CSS string", () => {
      const css = exportAsCSSVariables();
      expect(css).toContain(":root {");
      expect(css).toContain("}");
    });

    it("includes brand purple colors", () => {
      const css = exportAsCSSVariables();
      expect(css).toContain("--color-purple-500");
      expect(css).toContain("oklch(0.42 0.12 320)");
    });

    it("includes brand teal colors", () => {
      const css = exportAsCSSVariables();
      expect(css).toContain("--color-teal-500");
      expect(css).toContain("oklch(0.56 0.08 220)");
    });

    it("includes neutral colors", () => {
      const css = exportAsCSSVariables();
      expect(css).toContain("--color-neutral-");
    });

    it("includes spacing variables", () => {
      const css = exportAsCSSVariables();
      expect(css).toContain("--spacing-");
    });

    it("includes radius variables", () => {
      const css = exportAsCSSVariables();
      expect(css).toContain("--radius-");
    });
  });
});
