// src/app/api/seller/[id]/route.ts
// GET /api/seller/:sellerId — all products from one seller

import { NextRequest, NextResponse } from "next/server";
import { getProductsBySeller } from "@/lib/data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const products = await getProductsBySeller(id);
  return NextResponse.json(products);
}
