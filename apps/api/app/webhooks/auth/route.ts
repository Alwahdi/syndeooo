import { analytics } from "@repo/analytics/server";
import { log } from "@repo/observability/log";
import { NextResponse } from "next/server";

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
    const payload = (await request.json()) as AuthWebhookPayload;
    const { event, data } = payload;

    log.info("Auth webhook received", { event, data });

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
  } catch (error) {
    log.error("Auth webhook error:", { error });
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
};
