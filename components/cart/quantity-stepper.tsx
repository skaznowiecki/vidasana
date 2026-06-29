"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  className?: string;
  size?: "sm" | "md";
}

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  className,
  size = "md",
}: QuantityStepperProps) {
  const buttonSize = size === "sm" ? "h-9 w-9" : "h-11 w-11";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-sage/20 bg-cream/80 p-1",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          buttonSize,
          "rounded-full text-earth hover:bg-sage/10 hover:text-sage",
        )}
        onClick={onDecrement}
        aria-label="Disminuir cantidad"
        disabled={quantity <= 0}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span
        className={cn(
          "min-w-8 text-center font-medium tabular-nums text-earth",
          size === "sm" ? "text-sm" : "text-base",
        )}
        aria-live="polite"
      >
        {quantity}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          buttonSize,
          "rounded-full bg-sage text-cream hover:bg-sage-dark hover:text-cream",
        )}
        onClick={onIncrement}
        aria-label="Aumentar cantidad"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
