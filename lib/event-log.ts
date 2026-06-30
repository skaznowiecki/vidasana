import type { CartEventPayload, CartEventType } from "@/lib/db/events";

const SESSION_KEY = "vidasana-session-id";
const EVENTS_ENDPOINT = "/api/events";

function getSessionId(): string {
  try {
    const existing = localStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return "anonymous";
  }
}

function sendPayload(body: string): void {
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const sent = navigator.sendBeacon(
      EVENTS_ENDPOINT,
      new Blob([body], { type: "application/json" }),
    );
    if (sent) return;
  }

  void fetch(EVENTS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function logEvent(type: CartEventType, payload: CartEventPayload): void {
  try {
    const body = JSON.stringify({
      type,
      sessionId: getSessionId(),
      timestamp: new Date().toISOString(),
      payload,
    });
    sendPayload(body);
  } catch {
    // Never block UX
  }
}
