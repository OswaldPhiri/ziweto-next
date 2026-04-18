// src/components/ProductSkeleton.tsx
// Shown while products are loading. Matches the exact shape of ProductCard
// so the layout doesn't jump when real content arrives.

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-gray-100" />
      {/* Body */}
      <div className="px-3 pt-3 pb-2 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded-full w-4/5" />
        <div className="h-3 bg-gray-100 rounded-full w-full" />
        <div className="h-3 bg-gray-100 rounded-full w-2/3" />
        <div className="h-4 bg-gray-200 rounded-full w-1/2 mt-1" />
      </div>
      {/* Button placeholder */}
      <div className="px-3 pb-3">
        <div className="h-10 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
