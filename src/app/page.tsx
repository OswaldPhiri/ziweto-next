// src/app/page.tsx
// Server component — fetches directly from Firestore via Firebase Admin SDK.

import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { getAllProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Ziweto Market – Buy & Sell in Malawi",
};

export const revalidate = 60;

export default async function HomePage() {
  const products = await getAllProducts();

  return (
    <>
      <Header />

      <section className="bg-white border-b border-gray-200 px-4 py-10 text-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-3">
            Buy &amp; Sell
            <br />
            <span
              className="text-[#128C4C]"
              style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontWeight: 400 }}
            >
              across Malawi
            </span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
            Find great deals from sellers near you.
            <br className="hidden sm:block" />
            Contact them directly on WhatsApp — no middleman.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <ProductGrid initialProducts={products} />
      </main>

      <Footer />
    </>
  );
}
