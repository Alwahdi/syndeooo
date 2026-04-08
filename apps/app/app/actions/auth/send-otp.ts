"use server";

import { createHash, randomInt } from "node:crypto";
import { database } from "@repo/database";
import { resend } from "@repo/email";
import { keys as emailKeys } from "@repo/email/keys";
import { OtpTemplate } from "@repo/email/templates/otp";

const OTP_EXPIRY_MINUTES = 10;
const MIN_INTERVAL_SECONDS = 60;

function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export async function sendOtp(email: string) {
  if (!email || typeof email !== "string") {
    return { error: "Email is required" };
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Rate limit: 1 OTP per minute per email
  const recentCode = await database.emailVerificationCode.findFirst({
    where: {
      email: normalizedEmail,
      createdAt: {
        gte: new Date(Date.now() - MIN_INTERVAL_SECONDS * 1000),
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentCode) {
    return { error: "Please wait before requesting another code" };
  }

  // Generate 6-digit code
  const code = String(randomInt(100_000, 999_999));
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Store hashed code
  await database.emailVerificationCode.create({
    data: {
      email: normalizedEmail,
      code: hashCode(code),
      expiresAt,
    },
  });

  // Send email
  if (resend) {
    const { RESEND_FROM } = emailKeys();
    await resend.emails.send({
      from: RESEND_FROM ?? "SyndeoCare <noreply@syndeocare.com>",
      to: normalizedEmail,
      subject: `${code} is your SyndeoCare verification code`,
      react: OtpTemplate({ code, email: normalizedEmail }),
    });
  }

  return { success: true };
}
