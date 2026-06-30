import { totalPrice } from "./cart-utils";
import { logEvent } from "./event-log";
import { formatPrice, formatProductName } from "./format";
import type { CartItem } from "./types";

const WHATSAPP_NUMBER = "5491168201870";

export function buildWhatsAppOrderUrl(items: CartItem[]): string {
  const total = totalPrice(items);
  const lines = items.map(
    (item) =>
      `• ${formatProductName(item.name)} (${item.unitLabel}) x${item.quantity} — ${formatPrice(item.unitPrice * item.quantity)}`,
  );

  const body = [
    "Hola! Quiero hacer un pedido en Vidasana:",
    "",
    ...lines,
    "",
    `*Total: ${formatPrice(total)}*`,
    "",
    "Gracias!",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;
}

export function openWhatsAppOrder(
  items: CartItem[],
  source: "cart_bar" | "cart_sheet" = "cart_bar",
): void {
  if (items.length === 0) return;

  logEvent("checkout.initiated", {
    itemCount: items.length,
    totalPrice: totalPrice(items),
    source,
    items: items.map((item) => ({
      productId: item.productId,
      unit: item.unit,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
  });

  window.open(buildWhatsAppOrderUrl(items), "_blank", "noopener,noreferrer");
}
