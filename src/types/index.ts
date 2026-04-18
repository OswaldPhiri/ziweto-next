// src/types/index.ts

export interface Seller {
  id: string;
  name: string;
  whatsapp: string;
  location: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  shortDesc: string;
  description: string;
  image: string;
  images: string[];
  seller: Seller;
  createdAt: string; // ISO string (serialisable for Next.js props)
  updatedAt?: string;
}

export type Category =
  | "electronics"
  | "fashion"
  | "food"
  | "home"
  | "vehicles"
  | "services"
  | "other";

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: "electronics", label: "Electronics",      emoji: "📱" },
  { value: "fashion",     label: "Fashion",          emoji: "👗" },
  { value: "food",        label: "Food & Groceries", emoji: "🥦" },
  { value: "home",        label: "Home & Garden",    emoji: "🏠" },
  { value: "vehicles",    label: "Vehicles",         emoji: "🚗" },
  { value: "services",    label: "Services",         emoji: "🔧" },
  { value: "other",       label: "Other",            emoji: "📦" },
];

export const CATEGORY_COLORS: Record<Category, string> = {
  electronics: "bg-blue-50   text-blue-700",
  fashion:     "bg-purple-50 text-purple-700",
  food:        "bg-orange-50 text-orange-700",
  home:        "bg-green-50  text-green-700",
  vehicles:    "bg-slate-100 text-slate-700",
  services:    "bg-amber-50  text-amber-700",
  other:       "bg-gray-100  text-gray-600",
};
