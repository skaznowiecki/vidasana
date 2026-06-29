"use client";

import { useCart } from "@/components/cart/cart-provider";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatProductName } from "@/lib/format";
import { getProductVariant } from "@/lib/products";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { increment, decrement, getQuantity } = useCart();
  const variant = getProductVariant(product);

  if (!variant) return null;

  const quantity = getQuantity(product.id, variant.unit);
  const inStock = product.inStock !== false;

  return (
    <article
      id={`product-${product.id}`}
      className={cn(
        "group relative z-10 scroll-mt-32 flex flex-col justify-between rounded-2xl border border-sage/10 bg-white/80 p-4 shadow-sm shadow-sage/5 transition-[border-color,box-shadow] duration-300 md:hover:-translate-y-0.5 md:hover:border-sage/20 md:hover:shadow-md md:hover:shadow-sage/10",
        "animate-fade-up",
      )}
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      <div>
        <h3 className="font-sans text-[1.02rem] font-semibold leading-snug tracking-[-0.01em] text-earth">
          {formatProductName(product.name)}
        </h3>
        {product.description && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-earth/55">
            {product.description}
          </p>
        )}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-heading text-xl font-semibold text-sage">
            {formatPrice(variant.unitPrice)}
          </span>
          <span className="text-sm text-earth/45">/ {variant.unitLabel}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end">
        {inStock ? (
          <QuantityStepper
            quantity={quantity}
            onIncrement={() => increment(product)}
            onDecrement={() => decrement(product)}
          />
        ) : (
          <Badge variant="outline" className="border-amber/30 bg-amber/10 text-amber">
            Sin stock
          </Badge>
        )}
      </div>
    </article>
  );
}
