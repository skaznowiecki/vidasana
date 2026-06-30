import type { CartItem } from "./types";

export const CART_STORAGE_KEY = "vidasana-cart";
const CART_STORAGE_TTL_MS = 5 * 24 * 60 * 60 * 1000;

interface StoredCart {
  items: CartItem[];
  savedAt: number;
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as CartItem;
  return (
    typeof item.productId === "string" &&
    typeof item.name === "string" &&
    typeof item.unit === "string" &&
    typeof item.unitLabel === "string" &&
    typeof item.unitPrice === "number" &&
    typeof item.quantity === "number"
  );
}

function parseStoredItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isCartItem);
}

export function cartItemKey(productId: string, unit: string): string {
  return `${productId}:${unit}`;
}

export function addOrUpdateItem(items: CartItem[], item: CartItem): CartItem[] {
  const key = cartItemKey(item.productId, item.unit);
  const existing = items.find((i) => cartItemKey(i.productId, i.unit) === key);

  if (existing) {
    return items.map((i) =>
      cartItemKey(i.productId, i.unit) === key
        ? { ...i, quantity: i.quantity + item.quantity }
        : i,
    );
  }

  return [...items, item];
}

export function updateItemQuantity(
  items: CartItem[],
  productId: string,
  unit: string,
  quantity: number,
): CartItem[] {
  if (quantity <= 0) {
    return items.filter((i) => cartItemKey(i.productId, i.unit) !== cartItemKey(productId, unit));
  }

  return items.map((i) =>
    cartItemKey(i.productId, i.unit) === cartItemKey(productId, unit)
      ? { ...i, quantity }
      : i,
  );
}

export function getCartQuantity(
  items: CartItem[],
  productId: string,
  unit: string,
): number {
  return (
    items.find((i) => cartItemKey(i.productId, i.unit) === cartItemKey(productId, unit))
      ?.quantity ?? 0
  );
}

export function totalItems(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function totalPrice(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function clearCartFromStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
}

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      const items = parseStoredItems(parsed);
      if (items.length === 0) {
        clearCartFromStorage();
        return [];
      }

      saveCartToStorage(items);
      return items;
    }

    if (!parsed || typeof parsed !== "object") {
      clearCartFromStorage();
      return [];
    }

    const stored = parsed as Partial<StoredCart>;
    const items = parseStoredItems(stored.items);
    const savedAt = stored.savedAt;

    if (typeof savedAt !== "number" || Date.now() - savedAt > CART_STORAGE_TTL_MS) {
      clearCartFromStorage();
      return [];
    }

    if (items.length === 0) {
      clearCartFromStorage();
      return [];
    }

    return items;
  } catch {
    clearCartFromStorage();
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;

  if (items.length === 0) {
    clearCartFromStorage();
    return;
  }

  const payload: StoredCart = {
    items,
    savedAt: Date.now(),
  };

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
}
