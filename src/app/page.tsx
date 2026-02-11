
"use client";

import Link from "next/link";
import { Sprout, LogIn, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-6 border-b bg-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sprout className="w-8 h-8 text-green-600" />
          <span className="font-bold text-2xl tracking-tight">MaziSheti</span>
        </div>
        <Link href="/login">
          <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md">
            <LogIn className="w-4 h-4" /> लॉगिन
          </button>
        </Link>
      </header>

      <main className="flex-1 container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6">
          प्रगत शेतीचा <br /><span className="text-green-600">डिजिटल सोबती.</span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
          एमआयडीएएस प्लॅटफॉर्मवर सामील व्हा आणि आपल्या शेतीला आधुनिक तंत्रज्ञानाची जोड द्या.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 hover:scale-105 transition-all">
              सुरू करा <ChevronRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </main>

      <footer className="p-10 text-center text-slate-400 text-sm">
        © 2024 MaziSheti - MIDAS Platform. All rights reserved.
      </footer>
    </div>
  );
}
