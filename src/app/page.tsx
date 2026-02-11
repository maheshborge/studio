
"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, LogIn, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getLatestAgriNews } from "@/app/actions";

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestAgriNews().then(res => {
      if (res.success) setNews(res.news);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-primary text-white py-24 px-4 overflow-hidden relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            मिडास, <br /><span className="text-green-200">प्रगत शेतीचा सोबती.</span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl opacity-90">
            आधुनिक तंत्रज्ञान आणि तज्ज्ञ सल्ला आता तुमच्या खिशात. एमआयडीएएस प्लॅटफॉर्मवर सामील व्हा.
          </p>
          <div className="flex gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-white text-primary hover:bg-green-50 font-bold px-8 h-14 rounded-xl text-lg">
                नोंदणी करा <LogIn className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold px-8 h-14 rounded-xl text-lg">
                बाजारपेठ पहा <ShoppingBag className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <main className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-black mb-10 flex items-center gap-3">
          <Sprout className="text-primary w-8 h-8" /> ताज्या घडामोडी
        </h2>
        
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map(item => (
              <Card key={item.id} className="rounded-[2rem] overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all">
                <div className="relative aspect-video">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500 mb-6">{item.excerpt}</p>
                  <Button variant="link" className="p-0 text-primary font-bold">
                    सविस्तर वाचा <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
