// src/app/loading.tsx
// Next.js renders this file automatically while page.tsx is fetching data.
// Users on slow 3G see the skeleton immediately instead of a blank screen.

import Header from "@/components/Header";
import { ProductGridSkeleton } from "@/components/ProductSkeleton";

export default function Loading() {
  return (
    <>
      <Header />

      {/* Hero skeleton */}
      <section className="bg-white border-b border-gray-200 px-4 py-10 text-center">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="h-10 bg-gray-200 rounded-full w-3/4 mx-auto animate-pulse" />
          <div className="h-10 bg-gray-100 rounded-full w-1/2 mx-auto animate-pulse" />
          <div className="h-4 bg-gray-100 rounded-full w-2/3 mx-auto mt-2 animate-pulse" />
        </div>
      </section>

      {/* Filter bar skeleton */}
      <div className="max-w-6xl mx-auto w-full px-4 py-6">
        <div className="flex gap-2 mb-5">
          <div className="h-10 bg-gray-200 rounded-xl flex-1 animate-pulse" />
        </div>
        <div className="flex gap-2 mb-5 flex-wrap">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-7 w-20 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
        <ProductGridSkeleton />
      </div>
    </>
  );
}
