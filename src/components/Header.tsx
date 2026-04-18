// src/components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const path = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <svg width="32" height="32" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <rect width="512" height="512" rx="128" fill="#25D366" />
            <text x="256" y="350" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="320" fill="white" text-anchor="middle">Z</text>
          </svg>
          <span className="font-bold text-gray-900 text-[1.05rem] tracking-tight">
            Ziweto
            <em className="font-normal not-italic font-[var(--font-instrument)] italic text-[#128C4C]">
              Market
            </em>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              path === "/" ? "text-gray-900 bg-gray-100" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Browse
          </Link>
          <Link
            href="/admin"
            className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#128C4C] transition-colors"
          >
            Sell
          </Link>
        </nav>
      </div>
    </header>
  );
}
