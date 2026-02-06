"use client";

import { useState, use } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Clock, 
  Share2, 
  MessageSquare, 
  Sparkles, 
  ChevronLeft,
  Calendar,
  User,
  ExternalLink,
  CheckCircle2,
  Lightbulb
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getExpertAdvice } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const contentData = {
  "1": {
    title: "आंबा पिकावरील रोगांचे नियंत्रण कसे करावे?",
    fullContent: `
      या हंगामात आंब्यावर प्रामुख्याने करपा आणि भुरी या रोगांचा प्रादुर्भाव मोठ्या प्रमाणात दिसून येत आहे. वातावरणातील आर्द्रता आणि सतत ढगाळ हवामानामुळे हे रोग झपाट्याने पसरतात. 

      भुरी रोगाच्या नियंत्रणासाठी झाडावर गंधकाची फवारणी करणे अत्यंत महत्त्वाचे आहे. तसेच करपा रोगासाठी कॉपर ऑक्सीक्लोराईडचा वापर तज्ज्ञांनी सुचवला आहे. झाडाच्या फांद्यांची योग्य छाटणी केल्यास हवा खेळती राहते आणि रोगांचा प्रादुर्भाव कमी होतो.

      शेतकऱ्यांनी बागेचे नियमित निरीक्षण करावे आणि सुरुवातीच्या काळातच लक्षणे दिसल्यास उपाययोजना कराव्यात. जमिनीतील ओलावा टिकवून ठेवण्यासाठी आच्छादनाचा वापर करावा. खतांचे योग्य व्यवस्थापन केल्यास झाडाची प्रतिकारशक्ती वाढते.
    `,
    imageUrl: "https://picsum.photos/seed/advice1/1200/600",
    category: "शेती सल्ला",
    date: "१५ मे २०२४",
    author: "डॉ. विकास पाटील",
    sourceUrl: "https://www.mazisheti.org/mango-care"
  }
};

export default function ContentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const data = contentData[id as keyof typeof contentData] || contentData["1"];
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [adviceData, setAdviceData] = useState<{advice: string, keyPoints: string[]} | null>(null);
  const { toast } = useToast();

  const handleConsultAI = async () => {
    setIsAnalyzing(true);
    const result = await getExpertAdvice(data.fullContent);
    setIsAnalyzing(false);

    if (result.success) {
      setAdviceData({ advice: result.advice!, keyPoints: result.keyPoints! });
      toast({
        title: "AI सल्ला तयार आहे",
        description: "आमच्या AI तज्ज्ञाने लेखाचे विश्लेषण करून खास तुमच्यासाठी कृती आराखडा तयार केला आहे.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "त्रुटी",
        description: "AI शी संपर्क होऊ शकला नाही. कृपया थोड्या वेळाने प्रयत्न करा.",
      });
    }
  };

  const isAdvice = data.category === "शेती सल्ला";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-8">
          <ChevronLeft className="w-4 h-4 mr-1" /> मागे वळा
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <article className="lg:col-span-8">
            <Badge className="bg-primary text-white mb-6 uppercase tracking-wider px-3 py-1">
              {data.category}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-headline font-bold mb-6 text-primary leading-tight">
              {data.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-muted-foreground border-y py-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>By {data.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{data.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>३ मिनिटे वाचन</span>
              </div>
            </div>

            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden mb-10 shadow-lg">
              <Image
                src={data.imageUrl}
                alt={data.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="prose prose-lg max-w-none prose-p:leading-relaxed prose-p:text-slate-700">
              {data.fullContent.split('\n\n').map((para, i) => (
                <p key={i} className="mb-6 whitespace-pre-line">
                  {para.trim()}
                </p>
              ))}
            </div>

            <div className="mt-12 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex flex-col md:flex-row items-center gap-6">
               <div className="flex-1">
                 <h4 className="font-bold text-primary mb-2">मूळ स्रोत</h4>
                 <p className="text-sm text-slate-600 mb-4">ही माहिती mazisheti.org वरून घेण्यात आली आहे.</p>
                 <Link href={data.sourceUrl} target="_blank">
                    <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/5 rounded-xl">
                      mazisheti.org ला भेट द्या <ExternalLink className="w-4 h-4" />
                    </Button>
                 </Link>
               </div>
            </div>
          </article>

          <aside className="lg:col-span-4 space-y-8">
            <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-accent">AI तज्ज्ञ सल्ला</h3>
                </div>
                
                {!adviceData && !isAnalyzing ? (
                  <>
                    <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                      या लेखातील माहितीचे विश्लेषण करून, तुमच्या शेतीसाठी महत्त्वाचा कृती आराखडा मिळवण्यासाठी आमच्या AI तज्ज्ञाची मदत घ्या.
                    </p>
                    <Button 
                      onClick={handleConsultAI}
                      className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-14 rounded-2xl shadow-lg shadow-accent/20"
                    >
                      AI सल्ला मिळवा
                    </Button>
                  </>
                ) : isAnalyzing ? (
                  <div className="space-y-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[95%]" />
                    <Skeleton className="h-4 w-[80%]" />
                    <div className="pt-4 space-y-3">
                       <Skeleton className="h-10 w-full rounded-xl" />
                       <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                    <p className="text-xs text-center text-muted-foreground animate-pulse mt-4">
                      माहितीचे विश्लेषण चालू आहे...
                    </p>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-5 bg-accent/5 rounded-[2rem] border border-accent/10 mb-8">
                      <p className="text-slate-700 leading-relaxed text-sm italic">
                        "{adviceData.advice}"
                      </p>
                    </div>

                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-500" /> महत्त्वाचे कृती मुद्दे:
                    </h4>
                    <ul className="space-y-4 mb-8">
                      {adviceData.keyPoints.map((point, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-600">
                          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      variant="ghost" 
                      onClick={() => setAdviceData(null)}
                      className="w-full text-accent hover:bg-accent/5 text-xs h-10 rounded-xl"
                    >
                      माहिती पुसून टाका
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-primary text-white">
               <h3 className="text-xl font-bold mb-6">संबंधित माहिती</h3>
               <div className="space-y-8">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-5 group cursor-pointer">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                        <Image
                          src={`https://picsum.photos/seed/rel${i}/200/200`}
                          alt="Thumbnail"
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-sm font-bold line-clamp-2 group-hover:text-blue-200 transition-colors">
                          {i === 1 ? "बाजारपेठेतील वाढते दर आणि नियोजन" : "शासकीय ठिबक सिंचन योजना अपडेट"}
                        </h4>
                        <p className="text-[10px] text-blue-200 mt-2 uppercase tracking-wider font-bold">बातमी</p>
                      </div>
                    </div>
                  ))}
               </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
