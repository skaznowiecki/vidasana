"use client";

import { ProductCard as ProductCardComponent } from "@/components/catalog/product-card";
import { filterProducts } from "@/lib/search";
import { CATEGORIES, type CategoryId } from "@/lib/types";

interface ProductGridProps {
  search: string;
  activeCategory: CategoryId | "all";
}

function CategorySectionHeader({
  label,
  count,
}: {
  label: string;
  count: number;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-amber/80">Categoría</p>
        <h2 className="font-heading text-2xl font-semibold text-earth md:text-3xl">{label}</h2>
      </div>
      <span className="text-sm text-earth/45">
        {count} producto{count === 1 ? "" : "s"}
      </span>
    </div>
  );
}

export function ProductGrid({ search, activeCategory }: ProductGridProps) {
  const filtered = filterProducts(search, activeCategory);

  if (filtered.length === 0) {
    return (
      <div id="catalog-content" className="scroll-mt-28 mx-auto max-w-6xl px-4 py-16 text-center md:px-6">
        <p className="font-heading text-xl text-earth/70">No encontramos productos</p>
        <p className="mt-2 text-sm text-earth/50">Probá con otra búsqueda o categoría</p>
      </div>
    );
  }

  if (activeCategory !== "all") {
    const category = CATEGORIES.find((item) => item.id === activeCategory);

    return (
      <section
        id="catalog-content"
        className="scroll-mt-28 border-b border-sage/8 pb-32"
      >
        <div className="mx-auto max-w-6xl px-4 pt-8 md:px-6 md:pt-10">
          <CategorySectionHeader
            label={category?.label ?? "Productos"}
            count={filtered.length}
          />
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 md:grid-cols-2 md:px-6 lg:grid-cols-3">
          {filtered.map((product, index) => (
            <ProductCardComponent key={product.id} product={product} index={index} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <div id="catalog-content" className="scroll-mt-28 pb-32">
      {CATEGORIES.map((category) => {
        const categoryProducts = filtered.filter((p) => p.category === category.id);
        if (categoryProducts.length === 0) return null;

        return (
          <section
            key={category.id}
            id={category.id}
            className="scroll-mt-28 border-b border-sage/8 last:border-b-0"
          >
            <div className="mx-auto max-w-6xl px-4 pt-10 md:px-6">
              <CategorySectionHeader
                label={category.label}
                count={categoryProducts.length}
              />
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 pb-10 md:grid-cols-2 md:px-6 lg:grid-cols-3">
              {categoryProducts.map((product, index) => (
                <ProductCardComponent key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
