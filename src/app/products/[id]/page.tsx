// src/app/products/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { getProductById } from "@/lib/data";
import { formatPrice, buildWhatsAppLink, timeAgo } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | Ziweto Market`,
    description: product.shortDesc,
    openGraph: {
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const waLink = buildWhatsAppLink(product.seller.whatsapp, product.name);
  const catColor = CATEGORY_COLORS[product.category] ?? "bg-gray-100 text-gray-600";

  return (
    <>
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Breadcrumb / Back */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#128C4C] transition-colors mb-6 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to browsing
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side: Images */}
          <div className="space-y-6">
            <ProductGallery images={allImages} name={product.name} />
          </div>

          {/* Right Side: Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${catColor}`}>
                  {product.category}
                </span>
                <span className="text-xs text-gray-400 font-medium italic">
                  Posted {timeAgo(product.createdAt)}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#128C4C]">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            {/* Seller Card */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#25D366]/10 text-[#128C4C] rounded-full flex items-center justify-center text-xl font-bold">
                  {product.seller.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-0.5">Seller</p>
                  <p className="font-bold text-gray-900">{product.seller.name}</p>
                </div>
              </div>
              
              {product.seller.location && (
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-white/50 py-2 px-3 rounded-xl border border-gray-100">
                  <span>📍</span>
                  <span className="font-medium">{product.seller.location}</span>
                </div>
              )}

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa w-full py-4 text-base rounded-xl shadow-[0_4px_15px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] transition-all"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Description Sections */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#128C4C] italic">Overview</h3>
                <p className="text-lg text-gray-700 leading-relaxed font-medium italic">
                  {product.shortDesc}
                </p>
              </div>

              {product.description && (
                <div className="space-y-3 pt-6 border-t border-gray-100">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Details</h3>
                  <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
