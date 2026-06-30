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
  clearCartFromStorage,
  getCartQuantity,
  loadCartFromStorage,
  saveCartToStorage,
  totalItems,
  totalPrice,
  updateItemQuantity,
} from "@/lib/cart-utils";
import { logEvent } from "@/lib/event-log";
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
  resetCart: () => void;
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

function logQuantityChange(
  productId: string,
  unit: ProductUnit,
  previousQuantity: number,
  nextQuantity: number,
  nextItems: CartItem[],
) {
  queueMicrotask(() => {
    const totals = {
      cartTotalItems: totalItems(nextItems),
      cartTotalPrice: totalPrice(nextItems),
    };

    if (nextQuantity > previousQuantity) {
      logEvent("cart.add", {
        productId,
        unit,
        quantity: nextQuantity,
        previousQuantity,
        ...totals,
      });
      return;
    }

    logEvent("cart.remove", {
      productId,
      unit,
      quantity: nextQuantity,
      previousQuantity,
      ...totals,
    });
  });
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

    setItems((current) => {
      const previousQuantity = getCartQuantity(current, product.id, variant.unit);
      const nextItems = updateItemQuantity(current, product.id, variant.unit, quantity);

      if (previousQuantity !== quantity) {
        logQuantityChange(product.id, variant.unit, previousQuantity, quantity, nextItems);
      }

      return nextItems;
    });
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
          if (!item) return current;

          const nextItems = [...current, item];
          logQuantityChange(product.id, variant.unit, 0, 1, nextItems);
          return nextItems;
        }

        const nextItems = updateItemQuantity(current, product.id, variant.unit, nextQty);
        logQuantityChange(product.id, variant.unit, existingQty, nextQty, nextItems);
        return nextItems;
      });
    },
    [],
  );

  const decrement = useCallback((product: Product) => {
    const variant = getProductVariant(product);
    if (!variant) return;

    setItems((current) => {
      const existingQty = getCartQuantity(current, product.id, variant.unit);
      const nextQty = existingQty - 1;
      const nextItems = updateItemQuantity(current, product.id, variant.unit, nextQty);
      logQuantityChange(product.id, variant.unit, existingQty, nextQty, nextItems);
      return nextItems;
    });
  }, []);

  const updateItemQty = useCallback(
    (productId: string, unit: ProductUnit, quantity: number) => {
      setItems((current) => {
        const previousQuantity = getCartQuantity(current, productId, unit);
        const nextItems = updateItemQuantity(current, productId, unit, quantity);

        if (previousQuantity !== quantity) {
          logQuantityChange(productId, unit, previousQuantity, quantity, nextItems);
        }

        return nextItems;
      });
    },
    [],
  );

  const clearCart = useCallback(() => {
    setItems((current) => {
      if (current.length === 0) return current;

      const previousItemCount = current.length;
      queueMicrotask(() => {
        logEvent("cart.clear", {
          previousItemCount,
          cartTotalItems: totalItems(current),
          cartTotalPrice: totalPrice(current),
        });
      });

      clearCartFromStorage();
      return [];
    });
  }, []);

  const resetCart = useCallback(() => {
    clearCartFromStorage();
    setItems([]);
  }, []);

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
      resetCart,
    }),
    [items, hydrated, getQuantity, setQuantity, increment, decrement, updateItemQty, clearCart, resetCart],
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
