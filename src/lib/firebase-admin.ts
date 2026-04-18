// src/lib/firebase-admin.ts
// Server-side ONLY. Used in API routes.
// The private key never leaves the server.

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  return initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
      // Vercel stores the key as a single-line string with literal \n — we convert those back
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}

const adminApp = getAdminApp();
const adminDb  = getFirestore(adminApp);

export { adminApp, adminDb };
