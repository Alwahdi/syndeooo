import { analytics } from "@repo/analytics/server";
import { log } from "@repo/observability/log";
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Auth webhook handler.
 *
 * Better Auth manages user/session lifecycle directly via the database,
 * so external webhooks are no longer needed for core auth events.
 *
 * This endpoint is preserved for any custom webhook integrations
 * (e.g., syncing user events to external analytics or CRM systems).
 */

interface AuthWebhookPayload {
  event: string;
  data: {
    id?: string;
    email?: string;
    name?: string;
    image?: string;
    organizationId?: string;
    userId?: string;
    [key: string]: unknown;
  };
}

export const POST = async (request: Request): Promise<Response> => {
  try {
    // Verify HMAC signature before parsing
    const webhookSecret = process.env.AUTH_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get("x-webhook-signature");
      if (!signature) {
        return new Response(
          JSON.stringify({ error: "Missing signature" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      const rawBody = await request.text();
      const expectedSignature = createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      const signatureBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSignature);

      if (
        signatureBuffer.length !== expectedBuffer.length ||
        !timingSafeEqual(signatureBuffer, expectedBuffer)
      ) {
        return new Response(
          JSON.stringify({ error: "Invalid signature" }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      // Parse the already-read body
      const payload = JSON.parse(rawBody) as AuthWebhookPayload;

      // Validate payload shape
      if (
        !payload ||
        typeof payload !== "object" ||
        typeof payload.event !== "string" ||
        payload.data == null
      ) {
        return new Response(
          JSON.stringify({ error: "Invalid payload format" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const { event, data } = payload;

      log.info("Auth webhook received", {
        event,
        userId: data.id,
        organizationId: data.organizationId,
      });

      if (data.id) {
        switch (event) {
          case "user.created": {
            analytics?.identify({
              distinctId: data.id,
              properties: {
                email: data.email,
                name: data.name,
                avatar: data.image,
                createdAt: new Date(),
              },
            });
            analytics?.capture({
              event: "User Created",
              distinctId: data.id,
            });
            break;
          }
          case "user.updated": {
            analytics?.identify({
              distinctId: data.id,
              properties: {
                email: data.email,
                name: data.name,
                avatar: data.image,
              },
            });
            analytics?.capture({
              event: "User Updated",
              distinctId: data.id,
            });
            break;
          }
          default: {
            log.info("Unhandled auth webhook event", { event });
            break;
          }
        }
      }

      await analytics?.shutdown();

      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Fallback path if no webhook secret is configured
    const payload = (await request.json()) as AuthWebhookPayload;

    // Validate payload shape
    if (
      !payload ||
      typeof payload !== "object" ||
      typeof payload.event !== "string" ||
      payload.data == null
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid payload format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { event, data } = payload;

    log.info("Auth webhook received", {
      event,
      userId: data.id,
      organizationId: data.organizationId,
    });

    if (data.id) {
      switch (event) {
        case "user.created": {
          analytics?.identify({
            distinctId: data.id,
            properties: {
              email: data.email,
              name: data.name,
              avatar: data.image,
            },
          });
          analytics?.capture({
            event: "User Created",
            distinctId: data.id,
          });
          break;
        }
        case "user.updated": {
          analytics?.identify({
            distinctId: data.id,
            properties: {
              email: data.email,
              name: data.name,
              avatar: data.image,
            },
          });
          analytics?.capture({
            event: "User Updated",
            distinctId: data.id,
          });
          break;
        }
        default: {
          log.info("Unhandled auth webhook event", { event });
          break;
        }
      }
    }

    await analytics?.shutdown();

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    log.error("Auth webhook error:", { error });
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
};