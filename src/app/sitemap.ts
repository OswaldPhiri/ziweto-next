// src/app/sitemap.ts
import { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  let productIds: string[] = [];
  try {
    const products = await getAllProducts();
    productIds = products.map((p) => p.id);
  } catch {
    productIds = [];
  }

  const productPages = productIds.map((id) => ({
    url:             `${baseUrl}/products/${id}`,
    lastModified:    new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    {
      url:             baseUrl,
      lastModified:    new Date(),
      changeFrequency: "always" as const,
      priority: 1,
    },
    ...productPages,
  ];
}
