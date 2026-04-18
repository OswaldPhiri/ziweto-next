// src/app/seller/[id]/page.tsx
// Server component — queries Firestore directly.

import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { buildWhatsAppLink } from "@/lib/utils";
import { getProductsBySeller } from "@/lib/data";

interface Props { params: { id: string } }

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const products = await getProductsBySeller(params.id);
  if (!products.length) return { title: "Seller not found" };
  return { title: `${products[0].seller.name} – Listings` };
}

export default async function SellerPage({ params }: Props) {
  const products = await getProductsBySeller(params.id);

  if (!products.length) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-20 text-center text-gray-400">
          <div>
            <p className="text-4xl mb-4">😕</p>
            <p className="font-semibold text-gray-600 text-lg mb-2">Seller not found</p>
            <Link href="/" className="text-[#128C4C] underline text-sm">← Back to listings</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const seller   = products[0].seller;
  const initials = seller.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
  const waLink   = buildWhatsAppLink(seller.whatsapp, "your products");

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">

        <nav className="text-sm text-gray-400 mb-5">
          <Link href="/" className="hover:text-gray-700 transition-colors">Listings</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">{seller.name}</span>
        </nav>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#25D366] text-white font-bold text-xl flex items-center justify-center flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">{seller.name}</h1>
            {seller.location && <p className="text-sm text-gray-500 mt-0.5">📍 {seller.location}</p>}
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa px-4 py-2.5 text-sm rounded-xl flex-shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Message</span>
          </a>
        </div>

        <p className="text-sm font-semibold text-gray-500 mb-4">
          {products.length} listing{products.length !== 1 ? "s" : ""}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </main>
      <Footer />
    </>
  );
}
