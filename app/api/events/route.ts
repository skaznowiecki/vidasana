import { after } from "next/server";
import {
  CART_EVENT_TYPES,
  type CartEventDocument,
  type CartEventPayload,
  type CartEventType,
  insertEvent,
} from "@/lib/db/events";

function isCartEventType(value: unknown): value is CartEventType {
  return typeof value === "string" && CART_EVENT_TYPES.includes(value as CartEventType);
}

function isValidPayload(value: unknown): value is CartEventPayload {
  return value === null || typeof value === "object";
}

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const { type, sessionId, timestamp, payload } = body as Record<string, unknown>;

  if (!isCartEventType(type)) {
    return Response.json({ error: "Invalid event type" }, { status: 400 });
  }

  if (typeof sessionId !== "string" || sessionId.length === 0) {
    return Response.json({ error: "Invalid sessionId" }, { status: 400 });
  }

  if (typeof timestamp !== "string" || Number.isNaN(Date.parse(timestamp))) {
    return Response.json({ error: "Invalid timestamp" }, { status: 400 });
  }

  if (!isValidPayload(payload)) {
    return Response.json({ error: "Invalid payload" }, { status: 400 });
  }

  const doc: CartEventDocument = {
    type,
    sessionId,
    timestamp: new Date(timestamp),
    payload: payload ?? {},
  };

  after(async () => {
    try {
      await insertEvent(doc);
    } catch (error) {
      console.error("[events] failed to persist", error);
    }
  });

  return Response.json({ ok: true }, { status: 202 });
}
