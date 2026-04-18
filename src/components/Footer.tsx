// src/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-4 mt-auto">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-white font-bold text-base mb-1">Ziweto Market</p>
        <p className="text-sm mb-2">Connecting buyers and sellers across Malawi.</p>
        <p className="text-xs opacity-50">© {new Date().getFullYear()} Ziweto Market</p>
      </div>
    </footer>
  );
}
