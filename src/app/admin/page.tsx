// src/app/admin/page.tsx
// Server component shell — just sets metadata and renders the client panel.
// All auth and data logic is in AdminPanel (client component).

import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminPanel from "@/components/AdminPanel";

export const metadata: Metadata = { title: "Admin – Manage Listings" };

export default function AdminPage() {
  return (
    <>
      <Header />
      <AdminPanel />
      <Footer />
    </>
  );
}
