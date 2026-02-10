"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Globe, 
  User, 
  Menu,
  X,
  LogIn,
  ShoppingBag,
  Sprout,
  Database,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@/firebase";

const navItems = [
  { name: "मुख्य पृष्ठ", href: "/", icon: Globe },
  { name: "बाजारपेठ", href: "/marketplace", icon: ShoppingBag },
  { name: "माझी शेती", href: "/profile", icon: Sprout },
  { name: "डॅशबोर्ड", href: "/dashboard", icon: BarChart3 },
  { name: "डेटा व्ह्यू", href: "/admin/database", icon: Database },
];

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm font-body">
      <div className="container mx-auto px-4 flex h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="MaziSheti Logo" width={56} height={56} className="object-contain" />
            <span className="font-headline font-black text-2xl text-primary hidden sm:inline-block tracking-tight">
              MaziSheti
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-bold transition-all hover:text-primary relative py-1",
                pathname === item.href ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
          
          {user ? (
            <Link href="/profile">
              <Button className="rounded-full h-10 w-10 p-0 bg-primary shadow-lg shadow-primary/20 hover:scale-105 transition-transform overflow-hidden">
                <User className="w-5 h-5 text-white" />
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="rounded-xl gap-2 font-bold px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <LogIn className="w-4 h-4" /> लॉगिन
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b bg-white p-4 space-y-2 animate-in slide-in-from-top-4 shadow-xl">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-4 text-lg font-bold p-4 rounded-2xl transition-colors",
                pathname === item.href ? "bg-primary text-white" : "text-muted-foreground hover:bg-slate-50"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}