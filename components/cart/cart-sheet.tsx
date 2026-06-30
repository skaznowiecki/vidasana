"use client";

import { MessageCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { useCart } from "@/components/cart/cart-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import { checkoutViaWhatsApp } from "@/lib/whatsapp";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, totalPrice, clearCart, resetCart } = useCart();
  const isDesktop = useIsDesktop();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className="flex h-[85vh] max-h-[85vh] w-full flex-col gap-0 border-sage/15 bg-cream p-0 sm:max-w-md md:h-full md:max-h-full"
      >
        <SheetHeader className="shrink-0 border-b border-sage/10 px-4 py-3 text-left md:px-6 md:py-5">
          <SheetTitle className="font-heading text-xl text-earth md:text-2xl">Tu pedido</SheetTitle>
          <SheetDescription className="text-sm text-earth/60">
            Revisá los productos antes de enviar por WhatsApp
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 md:px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <p className="font-heading text-xl text-earth/70">Carrito vacío</p>
              <p className="mt-2 max-w-xs text-sm text-earth/50">
                Agregá productos desde el catálogo para armar tu pedido
              </p>
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow key={`${item.productId}-${item.unit}`} item={item} />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="shrink-0 border-t border-sage/10 bg-white/60 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:px-6 md:pt-5 md:pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="mb-2 flex items-center justify-between md:mb-4">
              <span className="text-xs uppercase tracking-wider text-earth/50 md:text-sm">Total</span>
              <span className="font-heading text-xl font-semibold text-earth md:text-2xl">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <Separator className="mb-2 bg-sage/10 md:mb-4" />

            <div className="flex flex-col gap-1.5 md:gap-2">
              <Button
                type="button"
                onClick={() => {
                  checkoutViaWhatsApp(items, "cart_sheet");
                  resetCart?.();
                  onOpenChange(false);
                }}
                className="h-11 w-full rounded-full bg-sage text-cream hover:bg-sage-dark md:h-12 md:cursor-pointer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Comprar por WhatsApp
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={clearCart}
                className="h-6 w-auto self-center rounded-full px-1.5 py-0 text-[11px] text-earth/40 hover:text-destructive md:h-10 md:w-full md:px-4 md:text-sm md:cursor-pointer"
              >
                <Trash2 className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
                Vaciar carrito
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
