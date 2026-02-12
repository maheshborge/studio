"use client";

import { Phone, Sprout } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-12 md:p-20 rounded-[3rem] shadow-2xl border border-slate-100 max-w-2xl w-full flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-[#15803d] rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg shadow-green-900/20">
          <Sprout className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
          आम्ही लवकरच तुमच्या सेवेत रुजू होतोय.
        </h1>
        
        <div className="w-16 h-1 bg-[#15803d]/20 rounded-full mb-10" />
        
        <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
          अधिक माहितीसाठी खालील नंबर वर संपर्क करा.
        </p>

        <a 
          href="tel:9975740444" 
          className="flex items-center gap-4 bg-[#15803d] hover:bg-[#166534] text-white px-8 py-4 rounded-2xl font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-green-900/20"
        >
          <Phone className="w-6 h-6" />
          9975740444
        </a>
      </div>
      
      <footer className="mt-12 text-slate-400 text-sm font-bold uppercase tracking-widest">
        © 2024 MaziSheti - MIDAS
      </footer>
    </div>
  );
}