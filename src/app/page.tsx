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
  ArrowRight,
  ChevronRight,
  TrendingUp,
  LogIn,
  Globe,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ContentCard } from "@/components/content-card";
import { cn } from "@/lib/utils";
import { getLatestAgriNews } from "@/app/actions";

const KNOWLEDGE_CATEGORIES = [
  { id: "all", name: "सर्व", icon: Globe, color: "bg-slate-500", desc: "सर्व माहिती" },
  { id: "advice", name: "शेती सल्ला", icon: Sprout, color: "bg-green-500", desc: "तज्ज्ञांचे मार्गदर्शन" },
  { id: "schemes", name: "शासकीय योजना", icon: FileText, color: "bg-blue-500", desc: "अनुदान व लाभ" },
  { id: "weather", name: "हवामान अंदाज", icon: CloudSun, color: "bg-orange-500", desc: "पाऊस व तापमान" },
  { id: "news", name: "बातम्या", icon: Newspaper, color: "bg-purple-500", desc: "ताज्या घडामोडी" },
  { id: "market", name: "बाजारपेठ", icon: ShoppingBag, color: "bg-amber-500", desc: "खरेदी व विक्री" },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [newsFeed, setNewsFeed] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      setIsLoading(true);
      const result = await getLatestAgriNews();
      if (result.success) {
        setNewsFeed(result.news);
      }
      setIsLoading(false);
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
    <div className="flex flex-col min-h-screen bg-slate-50 font-body">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-primary pt-16 pb-28 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-40 -mt-40 blur-3xl animate-pulse" />
        <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-headline font-bold mb-8 leading-tight">
              मिडास, <br /><span className="text-blue-200">प्रगत शेतीचा डिजिटल सोबती.</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl font-medium">
              ताज्या बातम्या, शेती सल्ला आणि शासकीय योजनांची माहिती आता थेट गुगल न्यूज फीड स्वरूपात.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
              <Link href="/login">
                <Button size="lg" className="bg-white text-primary hover:bg-blue-50 font-bold rounded-2xl h-16 px-10 text-xl w-full sm:w-auto shadow-2xl transition-all hover:scale-105">
                  सुरू करा / नोंदणी <LogIn className="ml-2 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold rounded-2xl h-16 px-10 text-xl shadow-xl">
                  बाजारपेठ पहा <TrendingUp className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Categories */}
      <div className="container mx-auto px-4 -mt-14 relative z-20">
        <Card className="rounded-[3rem] border-none shadow-2xl p-6 md:p-10 bg-white">
          <div className="relative mb-10">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-7 h-7" />
            <Input 
              placeholder="ताज्या बातम्या किंवा योजना शोधा..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-16 pl-16 pr-8 rounded-2xl border-slate-100 bg-slate-50 text-xl focus:ring-primary shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {KNOWLEDGE_CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex flex-col items-center gap-4 p-5 rounded-3xl transition-all group border border-transparent",
                  selectedCategory === cat.id ? "bg-primary/5 border-primary/20" : "hover:bg-slate-50 hover:border-slate-100"
                )}
              >
                <div className={cn(
                  cat.color, 
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform duration-300",
                  selectedCategory === cat.id ? "scale-110 shadow-primary/20" : "group-hover:scale-110"
                )}>
                  <cat.icon className="w-9 h-9" />
                </div>
                <div className="text-center">
                  <p className={cn("font-bold text-base", selectedCategory === cat.id ? "text-primary" : "text-slate-800")}>
                    {cat.name}
                  </p>
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-tight">{cat.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <main className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
              <Newspaper className="w-8 h-8" />
              {selectedCategory === "all" ? "ताज्या घडामोडी (Google News Feed)" : KNOWLEDGE_CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-lg text-slate-500 mt-2">तुमच्या शेतीसाठी आजच्या महत्त्वाच्या बातम्या.</p>
          </div>
          <div className="flex gap-3">
            <Badge 
              variant={selectedCategory === "all" ? "default" : "outline"} 
              className="px-5 py-2 rounded-full cursor-pointer transition-all font-bold"
              onClick={() => setSelectedCategory("all")}
            >
              सर्व बातम्या
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-slate-500 font-bold">ताज्या बातम्या शोधत आहोत...</p>
          </div>
        ) : filteredFeed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredFeed.map((item) => (
              <ContentCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">माहिती सापडली नाही</h3>
            <p className="text-slate-500 mt-2">निवडलेल्या कॅटेगरीमध्ये सध्या कोणतीही माहिती उपलब्ध नाही.</p>
            <Button variant="ghost" className="mt-6 text-primary" onClick={() => setSelectedCategory("all")}>सर्व बातम्या पहा</Button>
          </div>
        )}

        <div className="mt-20 text-center">
          <Button variant="outline" className="rounded-2xl border-primary text-primary px-12 h-16 font-bold text-xl hover:bg-primary/5 shadow-md">
            आणखी बातम्या पहा <ChevronRight className="ml-2 w-6 h-6" />
          </Button>
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-20 mt-10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Sprout className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold text-white tracking-tight">Midas</span>
          </div>
          <p className="max-w-lg mx-auto mb-10 text-lg leading-relaxed">
            शेतकऱ्यांच्या उन्नतीसाठी आणि समृद्धीसाठी बनवलेले एक प्रगत डिजिटल माध्यम.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-16 font-medium">
            <Link href="#" className="hover:text-white transition-colors">आमच्याबद्दल</Link>
            <Link href="#" className="hover:text-white transition-colors">संपर्क</Link>
            <Link href="#" className="hover:text-white transition-colors">अटी व शर्ती</Link>
            <Link href="#" className="hover:text-white transition-colors">गोपनीयता धोरण</Link>
          </div>
          <div className="border-t border-slate-800 pt-10">
            <p className="text-sm">© २०२४ Midas. सर्व हक्क राखीव. प्रगत शेतीचा डिजिटल सोबती.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
