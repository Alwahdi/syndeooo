"use server";

import { createHmac, randomInt } from "node:crypto";
import { database } from "@repo/database";
import { resend } from "@repo/email";
import { keys as emailKeys } from "@repo/email/keys";
import { OtpTemplate } from "@repo/email/templates/otp";

const OTP_SECRET = process.env.OTP_SECRET || "default-otp-secret-change-in-production";

function hashCode(code: string): string {
  return createHmac("sha256", OTP_SECRET)
    .update(code)
    .digest("hex");
}

const OTP_EXPIRY_MINUTES = 10;
const MIN_INTERVAL_SECONDS = 60;

export async function sendOtp(email: string) {
  if (!email || typeof email !== "string") {
    return { error: "Email is required" };
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Use transaction with advisory lock for serialization
    const result = await database.$transaction(async (tx) => {
      // Acquire advisory lock for this email (pg_advisory_xact_lock auto-releases at end of transaction)
      await tx.$executeRawUnsafe(
        `SELECT pg_advisory_xact_lock(hashtext($1))`,
        normalizedEmail
      );

      // Rate limit: 1 OTP per minute per email
      const recentCode = await tx.emailVerificationCode.findFirst({
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
      const code = String(randomInt(100_000, 1_000_000));
      const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
      const codeHash = hashCode(code);

      // Store hashed code
      const createdCode = await tx.emailVerificationCode.create({
        data: {
          email: normalizedEmail,
          codeHash,
          expiresAt,
        },
      });

      return { code, createdCodeId: createdCode.id };
    });

    if ("error" in result) {
      return result;
    }

    // Send email after transaction commits
    let emailSent = false;
    if (resend) {
      try {
        const { RESEND_FROM } = emailKeys();
        await resend.emails.send({
          from: RESEND_FROM ?? "SyndeoCare <noreply@syndeocare.com>",
          to: normalizedEmail,
          subject: `${result.code} is your SyndeoCare verification code`,
          react: OtpTemplate({ code: result.code, email: normalizedEmail }),
        });
        emailSent = true;
      } catch (emailError) {
        // Email failed - delete the created code
        await database.emailVerificationCode.delete({
          where: { id: result.createdCodeId },
        }).catch(() => {
          // Ignore delete errors
        });
        throw emailError;
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Send OTP error:", error);
    return { error: "Failed to send verification code" };
  }
}