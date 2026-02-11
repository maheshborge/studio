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

      {/* Categories / Search Bar Card */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <Card className="rounded-[3.5rem] border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] p-8 md:p-12 bg-white">
          <div className="relative mb-12 max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <Input 
              placeholder="ताज्या बातम्या किंवा योजना शोधा..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-16 pl-16 pr-8 rounded-full border-slate-100 bg-slate-50 text-lg focus:ring-2 focus:ring-primary/20 shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {KNOWLEDGE_CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex flex-col items-center gap-5 p-6 rounded-[2.5rem] transition-all group relative",
                  selectedCategory === cat.id ? "bg-primary/5 shadow-sm" : "hover:bg-slate-50"
                )}
              >
                <div className={cn(
                  cat.color, 
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-500",
                  selectedCategory === cat.id ? "scale-110 rotate-3 shadow-primary/30" : "group-hover:scale-110 group-hover:-rotate-3"
                )}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className={cn("font-bold text-base", selectedCategory === cat.id ? "text-primary" : "text-slate-700")}>
                    {cat.name}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">{cat.desc.split(' ')[0]}</p>
                </div>
                {selectedCategory === cat.id && (
                  <div className="absolute bottom-2 w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Content Feed */}
      <main className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-headline font-black text-slate-900 flex items-center gap-4">
              <span className="w-12 h-1 bg-primary rounded-full hidden md:block" />
              {selectedCategory === "all" ? "शेती विश्वातील घडामोडी" : KNOWLEDGE_CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-xl text-slate-500 mt-4 leading-relaxed">शेतकऱ्यांच्या प्रगतीसाठी निवडक आणि महत्त्वपूर्ण माहिती.</p>
          </div>
        </div>

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
          <div className="text-center py-32 bg-white rounded-[4rem] shadow-sm border-2 border-dashed border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-3xl font-black text-slate-800">काहीही सापडले नाही</h3>
            <p className="text-slate-500 mt-2 mb-10">तुमच्या शोध संज्ञेसाठी कोणतीही बातमी उपलब्ध नाही.</p>
            <Button 
              variant="outline" 
              className="rounded-2xl h-14 px-8 border-primary text-primary font-bold hover:bg-primary/5" 
              onClick={() => setSelectedCategory("all")}
            >
              सर्व बातम्या पहा
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-24 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center mb-16">
            <div className="bg-white/5 p-4 rounded-[2rem] mb-6 backdrop-blur-md border border-white/10">
              <img src="/logo.svg" alt="MaziSheti Logo" width={80} height={80} className="object-contain" />
            </div>
            <span className="text-4xl font-black text-white tracking-tighter mb-2">MaziSheti</span>
            <p className="text-slate-500 font-medium">प्रगत शेतीचा डिजिटल सोबती.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12 mb-20">
            <Link href="#" className="text-lg font-bold hover:text-white transition-all hover:translate-y-[-2px]">आमच्याबद्दल</Link>
            <Link href="#" className="text-lg font-bold hover:text-white transition-all hover:translate-y-[-2px]">संपर्क</Link>
            <Link href="#" className="text-lg font-bold hover:text-white transition-all hover:translate-y-[-2px]">अटी व शर्ती</Link>
            <Link href="/dashboard" className="text-lg font-bold hover:text-white transition-all hover:translate-y-[-2px]">डॅशबोर्ड</Link>
          </div>
          
          <div className="max-w-4xl mx-auto border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm font-medium tracking-wide text-slate-600">© २०२४ MaziSheti Platform. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <Globe className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
