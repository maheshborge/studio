"use client";

import { useState, useEffect, use } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Clock, 
  ChevronLeft,
  Calendar,
  User,
  ExternalLink,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Loader2,
  Share2,
  Facebook,
  Twitter,
  Send
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getExpertAdvice, getArticleById } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

export default function ContentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [adviceData, setAdviceData] = useState<{advice: string, keyPoints: string[]} | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
    
    async function fetchData() {
      setIsLoading(true);
      const result = await getArticleById(id);
      if (result.success) {
        setData(result.article);
      } else {
        toast({
          variant: "destructive",
          title: "त्रुटी",
          description: "माहिती शोधताना अडचण आली.",
        });
      }
      setIsLoading(false);
    }
    fetchData();
  }, [id, toast]);

  const handleConsultAI = async () => {
    if (!data) return;
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

  const shareOnWhatsApp = () => {
    const text = `${data.title}\n\nयेथे वाचा: ${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const shareOnTwitter = () => {
    const text = `${data.title}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-slate-500">माहिती लोड होत आहे...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">माहिती उपलब्ध नाही.</h2>
          <Link href="/">
            <Button variant="outline">मुख्य पृष्ठावर वळा</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            <ChevronLeft className="w-4 h-4 mr-1" /> मागे वळा
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase hidden sm:inline">शेअर करा:</span>
            <Button onClick={shareOnWhatsApp} size="icon" variant="outline" className="rounded-full w-9 h-9 border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700">
              <Send className="w-4 h-4" />
            </Button>
            <Button onClick={shareOnFacebook} size="icon" variant="outline" className="rounded-full w-9 h-9 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
              <Facebook className="w-4 h-4" />
            </Button>
            <Button onClick={shareOnTwitter} size="icon" variant="outline" className="rounded-full w-9 h-9 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
              <Twitter className="w-4 h-4" />
            </Button>
          </div>
        </div>

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
              {data.fullContent.split('\n\n').map((para: string, i: number) => (
                <p key={i} className="mb-6 whitespace-pre-line">
                  {para.trim()}
                </p>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 items-center justify-between">
               <div>
                 <h4 className="font-bold text-primary mb-2">तुम्हाला ही माहिती आवडली का?</h4>
                 <p className="text-sm text-slate-600">इतर शेतकरी मित्रांसोबत ही माहिती शेअर करा.</p>
               </div>
               <div className="flex gap-4">
                  <Button onClick={shareOnWhatsApp} className="rounded-xl bg-green-600 hover:bg-green-700 gap-2 font-bold px-6">
                    <Send className="w-4 h-4 rotate-45" /> WhatsApp
                  </Button>
                  <Button onClick={shareOnFacebook} variant="outline" className="rounded-xl border-blue-200 text-blue-600 gap-2 font-bold px-6">
                    <Facebook className="w-4 h-4" /> Facebook
                  </Button>
               </div>
            </div>

            <div className="mt-8 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex flex-col md:flex-row items-center gap-6">
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
               <h3 className="text-xl font-bold mb-6">इतर ताज्या बातम्या</h3>
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
