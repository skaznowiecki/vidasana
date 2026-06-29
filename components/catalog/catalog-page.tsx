"use client";

import { useState } from "react";
import { CartBar } from "@/components/cart/cart-bar";
import { ProductGrid } from "@/components/catalog/product-grid";
import { SearchBar } from "@/components/catalog/search-bar";
import { CategoryNav } from "@/components/layout/category-nav";
import { SiteHeader } from "@/components/layout/site-header";
import type { CategoryId, Product } from "@/lib/types";

export function CatalogPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");

  const handleCategorySelect = (category: CategoryId | "all") => {
    setActiveCategory(category);
  };

  const handleProductSelect = (product: Product) => {
    setActiveCategory(product.category);
  };

  return (
    <>
      <SiteHeader />
      <SearchBar value={search} onChange={setSearch} onProductSelect={handleProductSelect} />
      <CategoryNav activeCategory={activeCategory} onSelect={handleCategorySelect} />
      <ProductGrid search={search} activeCategory={activeCategory} />
      <div aria-hidden className="h-[calc(5rem+env(safe-area-inset-bottom))] shrink-0 md:hidden" />
      <CartBar />
    </>
  );
}
