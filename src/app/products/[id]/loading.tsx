// src/app/products/[id]/loading.tsx

import Header from "@/components/Header";

export default function ProductLoading() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-40 bg-gray-200 rounded-full mb-6 animate-pulse" />

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Gallery skeleton */}
          <div className="lg:flex-1">
            <div className="aspect-[4/3] bg-gray-200 rounded-2xl animate-pulse" />
          </div>

          {/* Info skeleton */}
          <div className="lg:flex-1 space-y-4">
            <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-8 bg-gray-200 rounded-full w-3/4 animate-pulse" />
            <div className="h-9 bg-gray-200 rounded-full w-1/3 animate-pulse" />
            <div className="space-y-2 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-3.5 bg-gray-100 rounded-full animate-pulse" style={{ width: `${85 - i * 10}%` }} />
              ))}
            </div>
            <div className="h-14 bg-gray-200 rounded-2xl animate-pulse mt-4" />
            <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </main>
    </>
  );
}
