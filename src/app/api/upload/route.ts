// src/app/api/upload/route.ts
// POST /api/upload — returns a signed Cloudinary upload URL.
// The admin panel uses this to upload product images directly from the browser
// to Cloudinary. The signing happens here on the server so the API secret
// is never sent to the browser.
//
// Required env vars (add to .env.local and Vercel):
//   CLOUDINARY_CLOUD_NAME
//   CLOUDINARY_API_KEY
//   CLOUDINARY_API_SECRET

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  try {
    const { getAuth } = await import("firebase-admin/auth");
    const { adminDb: _db } = await import("@/lib/firebase-admin"); // ensures admin is initialised
    void _db;
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return false;
    await getAuth().verifyIdToken(token);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables." },
      { status: 503 }
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder    = "ziweto-market";

  // Build the signature string — must match Cloudinary's expected format exactly
  // Parameters must be in alphabetical order: folder, timestamp
  const toSign    = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  return NextResponse.json({
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
    // The browser posts the file directly to this URL
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  });
}
