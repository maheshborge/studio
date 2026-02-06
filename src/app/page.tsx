
"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { 
  Sprout, 
  FileText, 
  CloudSun, 
  Newspaper, 
  CalendarDays, 
  ShoppingBag,
  Search,
  ArrowRight,
  ChevronRight,
  UserPlus,
  TrendingUp,
  LogIn
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ContentCard } from "@/components/content-card";

const KNOWLEDGE_CATEGORIES = [
  { id: "advice", name: "शेती सल्ला", icon: Sprout, color: "bg-green-500", desc: "तज्ज्ञांचे मार्गदर्शन" },
  { id: "schemes", name: "शासकीय योजना", icon: FileText, color: "bg-blue-500", desc: "अनुदान व लाभ" },
  { id: "weather", name: "हवामान अंदाज", icon: CloudSun, color: "bg-orange-500", desc: "पाऊस व तापमान" },
  { id: "news", name: "बातम्या", icon: Newspaper, color: "bg-purple-500", desc: "ताज्या घडामोडी" },
  { id: "events", name: "कार्यक्रम", icon: CalendarDays, color: "bg-pink-500", desc: "मेळावे व प्रदर्शने" },
  { id: "market", name: "बाजारपेठ", icon: ShoppingBag, color: "bg-amber-500", desc: "खरेदी व विक्री" },
];

const MOCK_FEED = [
  {
    id: "1",
    title: "आंबा पिकावरील रोगांचे नियंत्रण कसे करावे?",
    excerpt: "या हंगामात आंब्यावर येणाऱ्या रोगांपासून संरक्षण करण्यासाठी तज्ज्ञांनी दिलेले हे महत्त्वाचे सल्ले नक्की वाचा...",
    imageUrl: "https://picsum.photos/seed/advice1/600/400",
    category: "शेती सल्ला",
    date: "१५ मे २०२४",
    type: "article" as const
  },
  {
    id: "2",
    title: "नवीन ट्रॅक्टर अनुदान योजना २०२४ जाहीर",
    excerpt: "महाराष्ट्र शासनातर्फे शेतकऱ्यांसाठी ट्रॅक्टर खरेदीवर ५०% पर्यंत अनुदान दिले जाणार आहे. अर्ज करण्याची पद्धत पहा...",
    imageUrl: "https://picsum.photos/seed/scheme1/600/400",
    category: "शासकीय योजना",
    date: "१४ मे २०२४",
    type: "article" as const
  },
  {
    id: "3",
    title: "कोकण किनारपट्टीवर पुढील ४८ तासात पावसाची शक्यता",
    excerpt: "हवामान खात्याने वर्तवलेल्या अंदाजानुसार कोकणात वादळी वाऱ्यासह पावसाची शक्यता आहे. शेतकऱ्यांनी काळजी घ्यावी...",
    imageUrl: "https://picsum.photos/seed/weather1/600/400",
    category: "हवामान अंदाज",
    date: "१३ मे २०२४",
    type: "article" as const
  }
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-primary pt-12 pb-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6 leading-tight">
              मिडास, <br /><span className="text-blue-200">प्रगत शेतीचा डिजिटल सोबती.</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-xl">
              शेती सल्ला, शासकीय योजना आणि बाजारपेठेची सर्व माहिती आता एकाच ठिकाणी, लॉगिन न करता.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-white text-primary hover:bg-blue-50 font-bold rounded-2xl h-14 px-8 text-lg w-full sm:w-auto">
                  सुरू करा / नोंदणी <LogIn className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/marketplace" className="hidden md:block">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold rounded-2xl h-14 px-8 text-lg">
                  बाजारपेठ पहा <TrendingUp className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Categories */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <Card className="rounded-[2.5rem] border-none shadow-2xl p-4 md:p-8 bg-white">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            <Input 
              placeholder="योजना, सल्ला किंवा बातम्या शोधा..." 
              className="h-16 pl-14 pr-6 rounded-2xl border-slate-100 bg-slate-50 text-lg focus:ring-primary shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {KNOWLEDGE_CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-all group"
              >
                <div className={`${cat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm text-slate-800">{cat.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{cat.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-headline font-bold text-primary">ताज्या घडामोडी व माहिती</h2>
            <p className="text-slate-500">तुमच्या शेतीसाठी उपयुक्त असलेले सर्व काही.</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-4 py-2 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors">सर्व</Badge>
            <Badge variant="outline" className="px-4 py-2 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors">बातम्या</Badge>
            <Badge variant="outline" className="px-4 py-2 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors">व्हिडिओ</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_FEED.map((item) => (
            <ContentCard key={item.id} {...item} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button variant="outline" className="rounded-2xl border-primary text-primary px-10 h-14 font-bold text-lg hover:bg-primary/5">
            आणखी माहिती पहा <ChevronRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Features for Logged in users teaser */}
        <section className="mt-24 bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-headline font-bold text-slate-800">वैयक्तिक शेती व्यवस्थापन सुरू करा</h2>
            <p className="text-lg text-slate-600">
              लॉगिन केल्यानंतर तुम्ही तुमच्या पिकांची नोंदणी करू शकता, खर्चाचा हिशोब ठेवू शकता आणि थेट तज्ज्ञांना प्रश्न विचारू शकता.
            </p>
            <ul className="space-y-4">
              <FeatureItem text="पिकनिहाय प्रगती ट्रॅक करा" />
              <FeatureItem text="कुटुंबाची व स्थलांतराची माहिती साठवा" />
              <FeatureItem text="बाजारपेठेत स्वतःचे पीक विका" />
            </ul>
            <div className="flex flex-wrap gap-4 mt-4">
              <Link href="/login">
                <Button className="bg-primary px-8 h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
                  लॉगिन / नवीन नोंदणी <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative aspect-square w-full max-w-md">
            <div className="absolute inset-0 bg-blue-100 rounded-[3rem] rotate-3" />
            <div className="absolute inset-0 bg-primary rounded-[3rem] -rotate-3 overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/farmer_app/800/800" 
                alt="Farmer using app" 
                className="object-cover w-full h-full opacity-80"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Sprout className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-white">Midas</span>
          </div>
          <p className="max-w-md mx-auto mb-8">
            शेतकऱ्यांच्या उन्नतीसाठी बनवलेले एक प्रगत डिजिटल माध्यम.
          </p>
          <div className="flex justify-center gap-6 mb-12">
            <Link href="#" className="hover:text-white transition-colors">आमच्याबद्दल</Link>
            <Link href="#" className="hover:text-white transition-colors">संपर्क</Link>
            <Link href="#" className="hover:text-white transition-colors">अटी व शर्ती</Link>
          </div>
          <p className="text-sm">© २०२४ Midas. सर्व हक्क राखीव.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 font-bold text-slate-700">
      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
        <ChevronRight className="w-4 h-4" />
      </div>
      {text}
    </li>
  );
}
