// src/app/products/[id]/error.tsx
"use client";

import Link from "next/link";
import Header from "@/components/Header";

export default function ProductError({ reset }: { reset: () => void }) {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-24 text-center">
        <div>
          <p className="text-5xl mb-5">😕</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Could not load this product</h2>
          <p className="text-gray-500 text-sm mb-6">It may have been removed or the link is broken.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-gray-400 transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="px-4 py-2.5 bg-[#25D366] hover:bg-[#128C4C] text-white rounded-xl text-sm font-semibold transition-colors"
            >
              ← Browse listings
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
