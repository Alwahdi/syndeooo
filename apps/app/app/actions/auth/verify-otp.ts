"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import { database } from "@repo/database";

const MAX_ATTEMPTS = 5;
const OTP_SECRET = process.env.OTP_SECRET || "default-otp-secret-change-in-production";

function hashCode(code: string): string {
  return createHmac("sha256", OTP_SECRET)
    .update(code)
    .digest("hex");
}

function constantTimeCompare(a: string, b: string): boolean {
  try {
    const bufferA = Buffer.from(a, "hex");
    const bufferB = Buffer.from(b, "hex");
    if (bufferA.length !== bufferB.length) {
      return false;
    }
    return timingSafeEqual(bufferA, bufferB);
  } catch {
    return false;
  }
}

export async function verifyOtp(email: string, code: string) {
  if (!(email && code)) {
    return { error: "Email and code are required" };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedCode = code.trim();

  // Find the most recent unexpired code for this email
  const record = await database.emailVerificationCode.findFirst({
    where: {
      email: normalizedEmail,
      verified: false,
      expiresAt: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return {
      error: "No valid verification code found. Please request a new one.",
    };
  }

  // Check attempts limit
  if (record.attempts >= MAX_ATTEMPTS) {
    return { error: "Too many attempts. Please request a new code." };
  }

  // Hash the provided code
  const providedCodeHash = hashCode(normalizedCode);

  // Constant-time comparison to prevent timing attacks
  const isValid = constantTimeCompare(record.codeHash, providedCodeHash);

  // Atomically increment attempts only if under limit
  const updateResult = await database.emailVerificationCode.updateMany({
    where: {
      id: record.id,
      attempts: { lt: MAX_ATTEMPTS },
    },
    data: { attempts: { increment: 1 } },
  });

  // If update failed, we hit the limit concurrently
  if (updateResult.count === 0) {
    return { error: "Too many attempts. Please request a new code." };
  }

  if (!isValid) {
    const remainingAttempts = MAX_ATTEMPTS - record.attempts - 1;
    return {
      error: `Invalid code. ${remainingAttempts} attempt${remainingAttempts === 1 ? "" : "s"} remaining.`,
    };
  }

  // Mark as verified
  await database.emailVerificationCode.update({
    where: { id: record.id },
    data: { verified: true },
  });

  return { success: true };
}