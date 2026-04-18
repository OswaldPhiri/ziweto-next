// src/components/ProductCard.tsx

import Link from "next/link";
import Image from "next/image";
import { Product, CATEGORY_COLORS } from "@/types";
import { formatPrice, buildWhatsAppLink, categoryEmoji } from "@/lib/utils";
import WhatsAppIcon from "./WhatsAppIcon";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const waLink    = buildWhatsAppLink(product.seller.whatsapp, product.name);
  const catColor  = CATEGORY_COLORS[product.category] ?? "bg-gray-100 text-gray-600";
  const emoji     = categoryEmoji(product.category);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col card-lift">
      {/* Image — clicking goes to detail page */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-green-50 to-emerald-50">
              {emoji}
            </div>
          )}
          {/* Category badge */}
          <span className={`absolute top-2 left-2 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${catColor}`}>
            {product.category}
          </span>
        </div>
      </Link>

      {/* Body */}
      <Link href={`/products/${product.id}`} className="block flex-1 px-3 pt-3 pb-1 no-underline">
        <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1">
          {product.name}
        </p>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2">
          {product.shortDesc}
        </p>
        <p className="font-bold text-gray-900 text-base">{formatPrice(product.price)}</p>
        {product.seller.location && (
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <span>📍</span> {product.seller.location}
          </p>
        )}
      </Link>

      {/* WhatsApp CTA */}
      <div className="px-3 pb-3 pt-2">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-wa w-full py-2.5 text-sm rounded-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <WhatsAppIcon className="w-4 h-4" />
          Contact on WhatsApp
        </a>
      </div>
    </div>
  );
}
