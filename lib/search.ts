import { PRODUCTS } from "./products";
import type { CategoryId, Product } from "./types";

export function matchProductsByQuery(query: string, limit?: number): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const matches = PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(normalized) ||
      product.description?.toLowerCase().includes(normalized),
  );

  return limit ? matches.slice(0, limit) : matches;
}

export function filterProducts(
  search: string,
  activeCategory: CategoryId | "all",
): Product[] {
  const query = search.trim().toLowerCase();

  return PRODUCTS.filter((product) => {
    const matchesCategory =
      activeCategory === "all" ? true : product.category === activeCategory;
    const matchesSearch =
      query.length === 0 ||
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });
}
