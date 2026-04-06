import { describe, expect, it } from "vitest";
import { designTokens } from "../tokens";
import { primitives } from "../tokens/primitives";
import { semantics } from "../tokens/semantics";
import { components } from "../tokens/components";

describe("Design Tokens - Master Export", () => {
  describe("DTCG metadata", () => {
    it("has schema reference", () => {
      expect(designTokens.$schema).toBe(
        "https://design-tokens.github.io/community-group/format/"
      );
    });

    it("has version", () => {
      expect(designTokens.$version).toBe("1.0.0");
    });

    it("has name", () => {
      expect(designTokens.$name).toBe("SyndeoCare Design System");
    });

    it("has description", () => {
      expect(designTokens.$description).toContain("Healthcare");
    });
  });

  describe("Meta information", () => {
    it("identifies the brand", () => {
      expect(designTokens.meta.brand).toBe("SyndeoCare");
    });

    it("lists supported platforms", () => {
      expect(designTokens.meta.platforms).toEqual(
        expect.arrayContaining(["web", "ios", "android"])
      );
    });

    it("lists supported themes", () => {
      expect(designTokens.meta.themes).toEqual(["light", "dark"]);
    });

    it("lists supported languages", () => {
      expect(designTokens.meta.languages).toEqual(
        expect.arrayContaining(["en", "ar"])
      );
    });

    it("indicates RTL support", () => {
      expect(designTokens.meta.rtlSupport).toBe(true);
    });
  });

  describe("Token bundle completeness", () => {
    it("exports primitives", () => {
      expect(designTokens.primitives).toBe(primitives);
    });

    it("exports semantics", () => {
      expect(designTokens.semantics).toBe(semantics);
    });

    it("exports components", () => {
      expect(designTokens.components).toBe(components);
    });
  });
});
