// src/app/api/products/[id]/route.ts
// GET    /api/products/:id — public single product read
// PUT    /api/products/:id — update, requires Firebase Auth token
// DELETE /api/products/:id — delete, requires Firebase Auth token

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getProductById } from "@/lib/data";

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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json();
    const { FieldValue } = await import("firebase-admin/firestore");
    await adminDb.collection("products").doc(id).update({
      ...body,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    await adminDb.collection("products").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
