// src/app/error.tsx
"use client"; // Error boundaries must be client components in Next.js

import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    // Log to your error tracking service here in future (e.g. Sentry)
    console.error("Page error:", error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-24 text-center">
        <div>
          <p className="text-5xl mb-5">⚠️</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            We couldn&apos;t load the listings right now. This is usually a temporary issue.
          </p>
          <button
            onClick={reset}
            className="px-5 py-3 bg-[#25D366] hover:bg-[#128C4C] text-white font-semibold rounded-xl text-sm transition-colors"
          >
            Try again
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
