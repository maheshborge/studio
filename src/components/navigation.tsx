
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Globe, 
  Search, 
  User, 
  LayoutDashboard, 
  UserPlus, 
  MessageSquare,
  BarChart3,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { name: "मुख्य पृष्ठ", href: "/", icon: Globe },
  { name: "शेतकरी नोंदणी", href: "/farmer/register", icon: UserPlus },
  { name: "खरेदीदार नोंदणी", href: "/buyer/register", icon: UserPlus },
  { name: "डॅशबोर्ड", href: "/dashboard", icon: BarChart3 },
  { name: "शेतकरी प्रश्न", href: "/questions", icon: MessageSquare },
];

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <Globe className="w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-xl text-primary hidden sm:inline-block">
              MaziSheti
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
          <Link href="/profile">
            <div className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center font-bold">
              JD
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-b bg-background p-4 space-y-4 animate-in slide-in-from-top-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-4 text-lg font-medium p-2 rounded-md",
                pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground"
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
