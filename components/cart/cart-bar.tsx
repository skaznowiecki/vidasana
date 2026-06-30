"use client";

import { MessageCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { CartSheet } from "@/components/cart/cart-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { openWhatsAppOrder } from "@/lib/whatsapp";

export function CartBar() {
  const { items, totalItems, totalPrice, hydrated } = useCart();
  const [open, setOpen] = useState(false);

  if (!hydrated) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sage/15 bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-sage/20 bg-white px-3 text-sage transition-colors hover:bg-sage/5 sm:px-4"
            aria-label="Ver carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm font-medium">Ver carrito</span>
            {totalItems > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-amber px-1.5 text-[10px] text-cream hover:bg-amber">
                {totalItems}
              </Badge>
            )}
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wider text-earth/50">Total</p>
            <p className="truncate font-heading text-lg font-semibold text-earth">
              {formatPrice(totalPrice)}
            </p>
          </div>

          <Button
            type="button"
            disabled={items.length === 0}
            onClick={() => openWhatsAppOrder(items, "cart_bar")}
            className="h-11 shrink-0 rounded-full bg-sage px-4 text-cream hover:bg-sage-dark md:px-6"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Comprar por WhatsApp</span>
            <span className="sm:hidden">Comprar</span>
          </Button>
        </div>
      </div>

      <CartSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
