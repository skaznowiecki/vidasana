"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getCartQuantity,
  loadCartFromStorage,
  saveCartToStorage,
  totalItems,
  totalPrice,
  updateItemQuantity,
} from "@/lib/cart-utils";
import { formatProductName } from "@/lib/format";
import { getProductVariant } from "@/lib/products";
import type { CartItem, Product, ProductUnit } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  totalItems: number;
  totalPrice: number;
  getQuantity: (productId: string, unit: ProductUnit) => number;
  setQuantity: (product: Product, quantity: number) => void;
  increment: (product: Product) => void;
  decrement: (product: Product) => void;
  updateItemQuantity: (productId: string, unit: ProductUnit, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function buildCartItem(product: Product, quantity: number): CartItem | null {
  if (product.inStock === false) return null;

  const variant = getProductVariant(product);
  if (!variant) return null;

  return {
    productId: product.id,
    name: formatProductName(product.name),
    unit: variant.unit,
    unitLabel: variant.unitLabel,
    unitPrice: variant.unitPrice,
    quantity,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setItems(loadCartFromStorage());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCartToStorage(items);
  }, [items, hydrated]);

  const setQuantity = useCallback((product: Product, quantity: number) => {
    if (product.inStock === false) return;

    const variant = getProductVariant(product);
    if (!variant) return;

    setItems((current) =>
      updateItemQuantity(current, product.id, variant.unit, quantity),
    );
  }, []);

  const increment = useCallback(
    (product: Product) => {
      if (product.inStock === false) return;

      const variant = getProductVariant(product);
      if (!variant) return;

      setItems((current) => {
        const existingQty = getCartQuantity(current, product.id, variant.unit);
        const nextQty = existingQty + 1;

        if (existingQty === 0) {
          const item = buildCartItem(product, 1);
          return item ? [...current, item] : current;
        }

        return updateItemQuantity(current, product.id, variant.unit, nextQty);
      });
    },
    [],
  );

  const decrement = useCallback((product: Product) => {
    const variant = getProductVariant(product);
    if (!variant) return;

    setItems((current) => {
      const existingQty = getCartQuantity(current, product.id, variant.unit);
      return updateItemQuantity(current, product.id, variant.unit, existingQty - 1);
    });
  }, []);

  const updateItemQty = useCallback(
    (productId: string, unit: ProductUnit, quantity: number) => {
      setItems((current) => updateItemQuantity(current, productId, unit, quantity));
    },
    [],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const getQuantity = useCallback(
    (productId: string, unit: ProductUnit) => getCartQuantity(items, productId, unit),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      hydrated,
      totalItems: totalItems(items),
      totalPrice: totalPrice(items),
      getQuantity,
      setQuantity,
      increment,
      decrement,
      updateItemQuantity: updateItemQty,
      clearCart,
    }),
    [items, hydrated, getQuantity, setQuantity, increment, decrement, updateItemQty, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
