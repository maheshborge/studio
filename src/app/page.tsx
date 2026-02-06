
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
  TrendingUp,
  LogIn
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
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
              शेती सल्ला, शासकीय योजना आणि बाजारपेठेची सर्व माहिती आता एकाच ठिकाणी, लॉगिन न करता.
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
              placeholder="योजना, सल्ला किंवा बातम्या शोधा..." 
              className="h-16 pl-16 pr-8 rounded-2xl border-slate-100 bg-slate-50 text-xl focus:ring-primary shadow-inner"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {KNOWLEDGE_CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex flex-col items-center gap-4 p-5 rounded-3xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
              >
                <div className={`${cat.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <cat.icon className="w-9 h-9" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-base text-slate-800">{cat.name}</p>
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
            <h2 className="text-4xl font-headline font-bold text-primary">ताज्या घडामोडी व माहिती</h2>
            <p className="text-lg text-slate-500 mt-2">तुमच्या शेतीसाठी उपयुक्त असलेले सर्व काही.</p>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="px-5 py-2 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-all font-bold">सर्व</Badge>
            <Badge variant="outline" className="px-5 py-2 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-all font-bold">बातम्या</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_FEED.map((item) => (
            <ContentCard key={item.id} {...item} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <Button variant="outline" className="rounded-2xl border-primary text-primary px-12 h-16 font-bold text-xl hover:bg-primary/5 shadow-md">
            आणखी माहिती पहा <ChevronRight className="ml-2 w-6 h-6" />
          </Button>
        </div>

        {/* Features teaser */}
        <section className="mt-32 bg-white rounded-[3.5rem] p-10 md:p-16 shadow-2xl border border-slate-50 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-full -ml-12 -mt-12" />
          <div className="flex-1 space-y-8 relative z-10">
            <h2 className="text-4xl md:text-5xl font-headline font-bold text-slate-800 leading-tight">वैयक्तिक शेती व्यवस्थापन सुरू करा</h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              मिडास सोबत तुम्ही तुमच्या पिकांची नोंदणी करू शकता, खर्चाचा हिशोब ठेवू शकता आणि थेट तज्ज्ञांना प्रश्न विचारू शकता.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FeatureItem text="पिकनिहाय प्रगती ट्रॅक करा" />
              <FeatureItem text="बाजारपेठेत स्वतःचे पीक विका" />
              <FeatureItem text="खरेदीदार व ट्रान्सपोर्टरशी जोडा" />
              <FeatureItem text="AI तज्ज्ञ सल्ला मिळवा" />
            </ul>
            <div className="pt-6">
              <Link href="/login">
                <Button className="bg-primary px-10 h-16 rounded-2xl font-bold text-xl shadow-2xl shadow-primary/30 transition-all hover:scale-105">
                  लॉगिन / नवीन नोंदणी <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative aspect-square w-full max-w-lg">
            <div className="absolute inset-0 bg-blue-50 rounded-[3rem] rotate-3 scale-105" />
            <div className="absolute inset-0 bg-primary rounded-[3.5rem] -rotate-3 overflow-hidden shadow-2xl ring-8 ring-white">
              <img 
                src="https://picsum.photos/seed/farmer_app_v2/1000/1000" 
                alt="Farmer using app" 
                className="object-cover w-full h-full opacity-90 transition-transform duration-700 hover:scale-110"
              />
            </div>
          </div>
        </section>
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

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4 font-bold text-slate-700 text-lg">
      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
        <ChevronRight className="w-5 h-5" />
      </div>
      {text}
    </li>
  );
}
