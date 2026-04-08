"use server";

import { database } from "@repo/database";

const MAX_ATTEMPTS = 5;

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

  // Increment attempts
  await database.emailVerificationCode.update({
    where: { id: record.id },
    data: { attempts: { increment: 1 } },
  });

  // Constant-time comparison to prevent timing attacks
  if (record.code !== normalizedCode) {
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
