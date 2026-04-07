import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const schemaPath = path.resolve(import.meta.dirname, "../prisma/schema.prisma");
const schema = fs.readFileSync(schemaPath, "utf-8");

describe("Prisma Schema", () => {
  describe("Auth models", () => {
    it("defines User model with required fields", () => {
      expect(schema).toMatch(/model User \{/);
      expect(schema).toMatch(/id\s+String\s+@id/);
      expect(schema).toMatch(/name\s+String/);
      expect(schema).toMatch(/email\s+String\s+@unique/);
      expect(schema).toMatch(/emailVerified\s+Boolean/);
      expect(schema).toMatch(/createdAt\s+DateTime/);
      expect(schema).toMatch(/updatedAt\s+DateTime/);
    });

    it("defines Session model with required fields", () => {
      expect(schema).toMatch(/model Session \{/);
      expect(schema).toMatch(/token\s+String\s+@unique/);
      expect(schema).toMatch(/expiresAt\s+DateTime/);
      expect(schema).toMatch(/userId\s+String/);
      expect(schema).toMatch(/activeOrganizationId\s+String\?/);
    });

    it("defines Account model", () => {
      expect(schema).toMatch(/model Account \{/);
      expect(schema).toMatch(/providerId\s+String/);
      expect(schema).toMatch(/accountId\s+String/);
      expect(schema).toMatch(/password\s+String\?/);
    });

    it("defines Verification model", () => {
      expect(schema).toMatch(/model Verification \{/);
      expect(schema).toMatch(/identifier\s+String/);
      expect(schema).toMatch(/value\s+String/);
      expect(schema).toMatch(/expiresAt\s+DateTime/);
    });

    it("defines Organization model", () => {
      expect(schema).toMatch(/model Organization \{/);
      expect(schema).toMatch(/name\s+String/);
      expect(schema).toMatch(/slug\s+String\?\s+@unique/);
    });

    it("defines Member model with org and user relations", () => {
      expect(schema).toMatch(/model Member \{/);
      expect(schema).toMatch(/organizationId\s+String/);
      expect(schema).toMatch(/userId\s+String/);
      expect(schema).toMatch(/role\s+String/);
    });

    it("defines Invitation model", () => {
      expect(schema).toMatch(/model Invitation \{/);
      expect(schema).toMatch(/email\s+String/);
      expect(schema).toMatch(/status\s+String/);
      expect(schema).toMatch(/inviterId\s+String/);
    });
  });

  describe("Application models", () => {
    it("defines Page model", () => {
      expect(schema).toMatch(/model Page \{/);
      expect(schema).toMatch(/name\s+String/);
    });
  });

  describe("Relations & Indexes", () => {
    it("Session has userId index", () => {
      // Check for index on Session model
      const sessionBlock = schema.match(/model Session \{[\s\S]*?\n\}/)?.[0];
      expect(sessionBlock).toMatch(/@@index\(\[userId\]\)/);
      expect(sessionBlock).toMatch(/@@index\(\[token\]\)/);
    });

    it("Account has userId index", () => {
      const accountBlock = schema.match(/model Account \{[\s\S]*?\n\}/)?.[0];
      expect(accountBlock).toMatch(/@@index\(\[userId\]\)/);
    });

    it("Member has organization and user indexes", () => {
      const memberBlock = schema.match(/model Member \{[\s\S]*?\n\}/)?.[0];
      expect(memberBlock).toMatch(/@@index\(\[organizationId\]\)/);
      expect(memberBlock).toMatch(/@@index\(\[userId\]\)/);
    });

    it("Invitation has organization and inviter indexes", () => {
      const invitationBlock = schema.match(
        /model Invitation \{[\s\S]*?\n\}/
      )?.[0];
      expect(invitationBlock).toMatch(/@@index\(\[organizationId\]\)/);
      expect(invitationBlock).toMatch(/@@index\(\[inviterId\]\)/);
    });

    it("User has cascade delete on sessions", () => {
      const sessionBlock = schema.match(/model Session \{[\s\S]*?\n\}/)?.[0];
      expect(sessionBlock).toMatch(/onDelete: Cascade/);
    });

    it("User has cascade delete on accounts", () => {
      const accountBlock = schema.match(/model Account \{[\s\S]*?\n\}/)?.[0];
      expect(accountBlock).toMatch(/onDelete: Cascade/);
    });
  });
});
