// src/app/not-found.tsx

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-24 text-center">
        <div>
          <p className="text-6xl mb-5">😕</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
          <p className="text-gray-500 mb-6 text-sm">
            This listing may have been removed, or the link is incorrect.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#128C4C] text-white font-semibold rounded-xl text-sm transition-colors"
          >
            ← Back to listings
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
