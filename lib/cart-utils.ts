import type { CartItem } from "./types";

export const CART_STORAGE_KEY = "vidasana-cart";

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

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}
