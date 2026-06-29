"use client";

import { Search, X } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatProductName } from "@/lib/format";
import { matchProductsByQuery } from "@/lib/search";
import { CATEGORIES, type Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const MAX_SUGGESTIONS = 8;
const MIN_QUERY_LENGTH = 2;

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onProductSelect?: (product: Product) => void;
}

function getCategoryLabel(categoryId: Product["category"]) {
  return CATEGORIES.find((category) => category.id === categoryId)?.label ?? "";
}

function highlightMatch(text: string, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return text;

  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(normalized);
  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + normalized.length);
  const after = text.slice(index + normalized.length);

  return (
    <>
      {before}
      <mark className="rounded-sm bg-amber/20 px-0.5 text-earth">{match}</mark>
      {after}
    </>
  );
}

export function SearchBar({ value, onChange, onProductSelect }: SearchBarProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const suggestions = useMemo(
    () => matchProductsByQuery(value, MAX_SUGGESTIONS),
    [value],
  );

  const shouldShowSuggestions =
    isMobileViewport &&
    isOpen &&
    value.trim().length >= MIN_QUERY_LENGTH &&
    suggestions.length > 0;

  const closeSuggestions = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
  }, []);

  const clearSearch = useCallback(() => {
    onChange("");
    closeSuggestions();
    inputRef.current?.focus();
  }, [closeSuggestions, onChange]);

  const hasValue = value.length > 0;

  const selectProduct = useCallback(
    (product: Product) => {
      onChange(product.name);
      onProductSelect?.(product);
      closeSuggestions();
      inputRef.current?.blur();
    },
    [closeSuggestions, onChange, onProductSelect],
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeSuggestions();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [closeSuggestions]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const updateViewport = () => {
      setIsMobileViewport(mediaQuery.matches);
      if (!mediaQuery.matches) closeSuggestions();
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, [closeSuggestions]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!shouldShowSuggestions) {
      if (event.key === "Escape") closeSuggestions();
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((current) =>
          current < suggestions.length - 1 ? current + 1 : 0,
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((current) =>
          current > 0 ? current - 1 : suggestions.length - 1,
        );
        break;
      case "Enter":
        event.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          selectProduct(suggestions[activeIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        closeSuggestions();
        break;
    }
  };

  return (
    <section className="border-b border-sage/8 bg-cream/50">
      <div className="relative mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <div className="flex items-center gap-3 md:gap-4">
          <div ref={containerRef} className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-5 top-1/2 z-10 h-6 w-6 -translate-y-1/2 text-earth/40 md:left-6 md:h-7 md:w-7" />
            <Input
              ref={inputRef}
              type="search"
              role="combobox"
              aria-expanded={shouldShowSuggestions}
              aria-controls={shouldShowSuggestions ? listboxId : undefined}
              aria-activedescendant={
                shouldShowSuggestions && activeIndex >= 0
                  ? `${listboxId}-option-${activeIndex}`
                  : undefined
              }
              aria-autocomplete="list"
              placeholder="Buscar productos..."
              value={value}
              onChange={(event) => {
                onChange(event.target.value);
                setIsOpen(true);
                setActiveIndex(-1);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              className="h-16 w-full rounded-full border-sage/20 bg-white px-5 py-4 pl-14 text-lg text-earth shadow-md shadow-sage/10 placeholder:text-earth/40 focus-visible:border-sage/40 focus-visible:ring-4 focus-visible:ring-sage/15 md:h-[4.75rem] md:pl-16 md:text-xl [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
              aria-label="Buscar productos"
            />

            {shouldShowSuggestions && (
              <ul
                id={listboxId}
                role="listbox"
                aria-label="Sugerencias de productos"
                className="absolute inset-x-0 top-[calc(100%+0.75rem)] z-40 overflow-hidden rounded-2xl border border-sage/15 bg-white shadow-xl shadow-sage/15"
              >
                {suggestions.map((product, index) => (
                  <li
                    key={product.id}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectProduct(product)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "flex w-full items-start gap-4 px-5 py-4 text-left transition-colors md:px-6 md:py-4",
                        index === activeIndex ? "bg-sage/8" : "hover:bg-sage/5",
                      )}
                    >
                      <Search className="mt-1 h-5 w-5 shrink-0 text-sage/60" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-base font-medium leading-snug text-earth md:text-lg">
                          {highlightMatch(formatProductName(product.name), value)}
                        </span>
                        <span className="mt-1 block text-sm text-earth/50 md:text-base">
                          {highlightMatch(getCategoryLabel(product.category), value)}
                          {product.description ? (
                            <>
                              {" · "}
                              {highlightMatch(product.description, value)}
                            </>
                          ) : null}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {hasValue && (
            <Button
              type="button"
              variant="outline"
              onClick={clearSearch}
              aria-label="Limpiar búsqueda"
              className="h-16 shrink-0 rounded-full border-sage/20 bg-white px-4 text-base text-earth/70 shadow-md shadow-sage/10 hover:bg-sage/5 hover:text-earth md:h-[4.75rem] md:px-5 md:text-lg"
            >
              <X className="size-5" />
              <span className="hidden sm:inline">Limpiar</span>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
