import { getDb } from "@/lib/db/mongodb";
import type { ProductUnit } from "@/lib/types";

export const CART_EVENT_TYPES = [
  "cart.add",
  "cart.remove",
  "cart.clear",
  "checkout.initiated",
] as const;

export type CartEventType = (typeof CART_EVENT_TYPES)[number];

export interface CartEventPayload {
  productId?: string;
  unit?: ProductUnit;
  quantity?: number;
  previousQuantity?: number;
  cartTotalItems?: number;
  cartTotalPrice?: number;
  previousItemCount?: number;
  itemCount?: number;
  totalPrice?: number;
  items?: Array<{
    productId: string;
    unit: ProductUnit;
    quantity: number;
    unitPrice: number;
  }>;
  source?: "cart_bar" | "cart_sheet";
}

export interface CartEventDocument {
  type: CartEventType;
  sessionId: string;
  timestamp: Date;
  payload: CartEventPayload;
}

let indexesEnsured = false;

async function ensureIndexes() {
  if (indexesEnsured) return;

  const db = await getDb();
  if (!db) return;

  const collection = db.collection("cart_events");
  await collection.createIndex({ timestamp: -1 });
  await collection.createIndex({ sessionId: 1, timestamp: -1 });
  indexesEnsured = true;
}

export async function insertEvent(doc: CartEventDocument): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[events] MONGODB_URI not configured — skipping insert");
    return;
  }

  await ensureIndexes();
  await db.collection("cart_events").insertOne(doc);
}
