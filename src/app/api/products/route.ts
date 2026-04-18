// src/app/api/products/route.ts
// GET  /api/products — public, returns all products (used by admin panel refresh)
// POST /api/products — creates a new product, requires Firebase Auth token

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getAllProducts } from "@/lib/data";

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  try {
    const { getAuth } = await import("firebase-admin/auth");
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return false;
    await getAuth().verifyIdToken(token);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { FieldValue } = await import("firebase-admin/firestore");
    const ref = await adminDb.collection("products").add({
      ...body,
      createdAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ id: ref.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
