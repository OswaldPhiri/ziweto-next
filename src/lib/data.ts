// src/lib/data.ts
// Direct Firestore queries for use in Server Components.
// These run on the server only — never bundled into the browser.
// Using these avoids the anti-pattern of server components calling their own API routes.

import { adminDb } from "@/lib/firebase-admin";
import { Product } from "@/types";

function docToProduct(doc: FirebaseFirestore.DocumentSnapshot): Product {
  const d = doc.data()!;
  return {
    id:          doc.id,
    name:        d.name,
    price:       d.price,
    category:    d.category,
    shortDesc:   d.shortDesc,
    description: d.description ?? "",
    image:       d.image ?? "",
    images:      d.images ?? [],
    seller:      d.seller,
    createdAt:   d.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
    updatedAt:   d.updatedAt?.toDate?.()?.toISOString(),
  };
}

// All products, newest first
export async function getAllProducts(): Promise<Product[]> {
  try {
    const snapshot = await adminDb
      .collection("products")
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) return [];
    return snapshot.docs.map(docToProduct);
  } catch (err) {
    console.error("getAllProducts error:", (err as Error).message);
    return [];
  }
}

// Single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const doc = await adminDb.collection("products").doc(id).get();
    if (!doc.exists) return null;
    return docToProduct(doc);
  } catch (err) {
    console.error("getProductById error:", (err as Error).message);
    return null;
  }
}

// All products from one seller
export async function getProductsBySeller(sellerId: string): Promise<Product[]> {
  try {
    const snapshot = await adminDb
      .collection("products")
      .where("seller.id", "==", sellerId)
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) return [];
    return snapshot.docs.map(docToProduct);
  } catch (err) {
    console.warn("getProductsBySeller error:", (err as Error).message);
    return [];
  }
}
