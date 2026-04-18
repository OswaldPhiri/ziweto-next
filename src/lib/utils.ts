// src/lib/utils.ts

import { Category } from "@/types";

export function formatPrice(amount: number): string {
  return "MWK " + amount.toLocaleString("en-MW");
}

export function buildWhatsAppLink(whatsapp: string, productName: string): string {
  const number  = whatsapp.replace(/\D/g, "");
  const message = encodeURIComponent(
    `Hi, I'm interested in "${productName}" listed on Ziweto Market. Is it still available?`
  );
  return `https://wa.me/${number}?text=${message}`;
}

export function timeAgo(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  if (mins < 1)  return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days  = Math.floor(hours / 24);
  if (days < 7)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function categoryEmoji(cat: Category): string {
  const map: Record<Category, string> = {
    electronics: "📱",
    fashion:     "👗",
    food:        "🥦",
    home:        "🏠",
    vehicles:    "🚗",
    services:    "🔧",
    other:       "📦",
  };
  return map[cat] ?? "📦";
}

// Checks whether Firebase env vars have been filled in
export function isFirebaseConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return !!key && !key.includes("your_");
}
