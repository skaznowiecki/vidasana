"use client";

import { cn } from "@/lib/utils";
import { CATEGORIES, type CategoryId } from "@/lib/types";

interface CategoryNavProps {
  activeCategory: CategoryId | "all";
  onSelect: (category: CategoryId | "all") => void;
}

export function CategoryNav({ activeCategory, onSelect }: CategoryNavProps) {
  return (
    <nav
      className="border-b border-sage/10 bg-cream/90"
      aria-label="Categorías"
    >
      <div className="mx-auto max-w-6xl overflow-x-auto px-4 py-3 md:px-6 scrollbar-none">
        <div className="flex min-w-max gap-2">
          <CategoryPill
            label="Todos"
            active={activeCategory === "all"}
            onClick={() => onSelect("all")}
          />
          {CATEGORIES.map((category) => (
            <CategoryPill
              key={category.id}
              label={category.label}
              active={activeCategory === category.id}
              onClick={() => onSelect(category.id)}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
        active
          ? "bg-sage text-cream shadow-sm shadow-sage/20"
          : "border border-sage/15 bg-white/70 text-earth/70 hover:border-sage/30 hover:text-earth",
      )}
    >
      {label}
    </button>
  );
}
