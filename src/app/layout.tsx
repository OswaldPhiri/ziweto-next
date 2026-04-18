// src/app/layout.tsx

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ziweto Market – Buy & Sell in Malawi",
    template: "%s – Ziweto Market",
  },
  description:
    "Find great deals from sellers across Malawi. Contact sellers directly on WhatsApp.",
  keywords: ["Malawi", "marketplace", "buy", "sell", "Lilongwe", "Blantyre", "WhatsApp"],
  openGraph: {
    title: "Ziweto Market",
    description: "Buy & sell across Malawi. Contact sellers on WhatsApp.",
    locale: "en_MW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${instrument.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
