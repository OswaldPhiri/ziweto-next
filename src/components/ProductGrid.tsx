// src/components/ProductGrid.tsx
"use client";

import { useState, useMemo } from "react";
import { Product, CATEGORIES, Category } from "@/types";
import ProductCard from "./ProductCard";

interface Props {
  initialProducts: Product[];
}

export default function ProductGrid({ initialProducts }: Props) {
  const [search,      setSearch]      = useState("");
  const [activecat,   setActiveCat]   = useState<Category | "all">("all");
  const [maxPrice,    setMaxPrice]    = useState(0);
  const [sort,        setSort]        = useState<"newest" | "price-asc" | "price-desc">("newest");

  const filtered = useMemo(() => {
    let list = [...initialProducts];

    if (activecat !== "all") list = list.filter((p) => p.category === activecat);
    if (maxPrice > 0)        list = list.filter((p) => p.price <= maxPrice);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.seller.location?.toLowerCase().includes(q)
      );
    }

    if (sort === "price-asc")  list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    // "newest" keeps server order (already sorted newest-first)

    return list;
  }, [initialProducts, activecat, maxPrice, search, sort]);

  return (
    <div>
      {/* ── Search bar ── */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white outline-none focus:border-[#25D366] transition-colors"
        />
      </div>

      {/* ── Category chips ── */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveCat("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            activecat === "all"
              ? "bg-[#25D366] border-[#25D366] text-white"
              : "bg-white border-gray-200 text-gray-500 hover:border-[#25D366] hover:text-[#128C4C]"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCat(cat.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activecat === cat.value
                ? "bg-[#25D366] border-[#25D366] text-white"
                : "bg-white border-gray-200 text-gray-500 hover:border-[#25D366] hover:text-[#128C4C]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Price + Sort ── */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <select
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 bg-white outline-none focus:border-[#25D366] cursor-pointer"
        >
          <option value={0}>Any price</option>
          <option value={5000}>Under MWK 5,000</option>
          <option value={20000}>Under MWK 20,000</option>
          <option value={50000}>Under MWK 50,000</option>
          <option value={100000}>Under MWK 100,000</option>
          <option value={500000}>Under MWK 500,000</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 bg-white outline-none focus:border-[#25D366] cursor-pointer"
        >
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <span className="self-center text-xs text-gray-400 ml-auto">
          {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-semibold text-gray-600 text-lg mb-1">No products found</p>
          <p className="text-sm">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
