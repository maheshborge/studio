"use client";

import { useState, useMemo, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { 
  Sprout, 
  FileText, 
  CloudSun, 
  Newspaper, 
  ShoppingBag,
  Search,
  TrendingUp,
  LogIn,
  Globe,
  Loader2,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ContentCard } from "@/components/content-card";
import { cn } from "@/lib/utils";
import { getLatestAgriNews } from "@/app/actions";

const KNOWLEDGE_CATEGORIES = [
  { id: "all", name: "सर्व", icon: Globe, color: "bg-slate-600", desc: "सर्व माहिती" },
  { id: "advice", name: "शेती सल्ला", icon: Sprout, color: "bg-emerald-600", desc: "तज्ज्ञांचे मार्गदर्शन" },
  { id: "schemes", name: "शासकीय योजना", icon: FileText, color: "bg-indigo-600", desc: "अनुदान व लाभ" },
  { id: "weather", name: "हवामान अंदाज", icon: CloudSun, color: "bg-orange-500", desc: "पाऊस व तापमान" },
  { id: "news", name: "बातम्या", icon: Newspaper, color: "bg-violet-600", desc: "ताज्या घडामोडी" },
  { id: "market", name: "बाजारपेठ", icon: ShoppingBag, color: "bg-amber-600", desc: "खरेदी व विक्री" },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newsFeed, setNewsFeed] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        setIsLoading(true);
        const result = await getLatestAgriNews();
        if (result.success) {
          setNewsFeed(result.news || []);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNews();
  }, []);

  const filteredFeed = useMemo(() => {
    return newsFeed.filter(item => {
      const matchesCategory = selectedCategory === "all" || item.categoryKey === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, newsFeed]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-body">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-primary pt-20 pb-32 text-white relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-accent/20 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-8xl font-headline font-black mb-8 leading-[1.1] tracking-tight">
              मिडास, <br /><span className="text-blue-300">प्रगत शेतीचा <br />डिजिटल सोबती.</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/90 mb-12 max-w-2xl font-medium leading-relaxed">
              ताज्या बातम्या, शेती सल्ला आणि शासकीय योजनांची माहिती आता एका क्लिकवर. आधुनिक शेतीसाठी आधुनिक तंत्रज्ञान.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/login">
                <Button size="lg" className="bg-white text-primary hover:bg-blue-50 font-bold rounded-[1.25rem] h-16 px-10 text-xl w-full sm:w-auto shadow-2xl shadow-black/20 transition-all hover:scale-105 active:scale-95">
                  सुरू करा / नोंदणी <LogIn className="ml-2 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-bold rounded-[1.25rem] h-16 px-10 text-xl shadow-xl transition-all hover:border-white">
                  बाजारपेठ पहा <ArrowUpRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Feed */}
      <main className="container mx-auto px-4 py-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[4rem] shadow-sm">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <p className="text-slate-400 font-bold text-lg">ताज्या घडामोडी लोड होत आहेत...</p>
          </div>
        ) : filteredFeed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredFeed.map((item) => (
              <ContentCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[4rem] shadow-sm">
            <h3 className="text-3xl font-black text-slate-800">काहीही सापडले नाही</h3>
          </div>
        )}
      </main>
    </div>
  );
}
