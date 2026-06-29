"use client";

import { useCart } from "@/components/cart/cart-provider";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { formatPrice, formatProductName } from "@/lib/format";
import type { CartItem } from "@/lib/types";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateItemQuantity } = useCart();

  return (
    <div className="flex items-start justify-between gap-3 border-b border-sage/10 py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="font-medium leading-snug text-earth">{formatProductName(item.name)}</p>
        <p className="mt-1 text-sm text-earth/60">
          {formatPrice(item.unitPrice)} / {item.unitLabel}
        </p>
        <p className="mt-2 text-sm font-semibold text-amber">
          {formatPrice(item.unitPrice * item.quantity)}
        </p>
      </div>
      <QuantityStepper
        size="sm"
        quantity={item.quantity}
        onIncrement={() =>
          updateItemQuantity(item.productId, item.unit, item.quantity + 1)
        }
        onDecrement={() =>
          updateItemQuantity(item.productId, item.unit, item.quantity - 1)
        }
      />
    </div>
  );
}
