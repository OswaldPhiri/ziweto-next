// src/app/products/[id]/page.tsx
// Server component — queries Firestore directly, no HTTP roundtrip.

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import ProductGallery from "@/components/ProductGallery";
import { CATEGORY_COLORS } from "@/types";
import { formatPrice, buildWhatsAppLink } from "@/lib/utils";
import { getProductById } from "@/lib/data";

interface Props { params: { id: string } }

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductById(params.id);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} – MWK ${product.price.toLocaleString()}`,
    description: product.shortDesc,
    openGraph: {
      title: product.name,
      description: product.shortDesc,
      images: product.image ? [product.image] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  const allImages = [product.image, ...(product.images ?? [])].filter(Boolean) as string[];
  const waLink    = buildWhatsAppLink(product.seller.whatsapp, product.name);
  const catColor  = CATEGORY_COLORS[product.category] ?? "bg-gray-100 text-gray-600";

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">

        <nav className="text-sm text-gray-400 mb-5 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-700 transition-colors">Listings</Link>
          <span>›</span>
          <span className="text-gray-600 line-clamp-1">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 lg:items-start">

          <div className="lg:flex-1 lg:sticky lg:top-20">
            <ProductGallery images={allImages} name={product.name} />
          </div>

          <div className="lg:flex-1 space-y-5">
            <div>
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize mb-3 ${catColor}`}>
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>
            </div>

            {product.description && (
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa w-full py-4 text-base rounded-2xl font-bold flex"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Contact Seller on WhatsApp
            </a>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Seller</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {product.seller.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{product.seller.name}</p>
                  {product.seller.location && (
                    <p className="text-xs text-gray-500 mt-0.5">📍 {product.seller.location}</p>
                  )}
                </div>
              </div>
              {product.seller.id && (
                <Link
                  href={`/seller/${product.seller.id}`}
                  className="inline-block mt-3 text-xs font-medium text-[#128C4C] hover:underline"
                >
                  See all listings from this seller →
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
