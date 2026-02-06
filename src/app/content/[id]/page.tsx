
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
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getAiSummary } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

// Mock data for the specific item
const contentData = {
  "1": {
    title: "The Resilience of Giriama Traditions in Modern Kenya",
    fullContent: `
      The Giriama community of coastal Kenya has long been celebrated for its deep-rooted cultural heritage, particularly its vibrant traditional dances and rich oral history. In recent years, as globalization spreads its influence into every corner of the country, there has been a significant push within the Mazisheti region to preserve these sacred traditions while finding new ways to integrate them into modern society.

      Key cultural festivals like the Mazisheti Harvest Festival have seen a resurgence in youth participation. Local schools are now incorporating traditional folklore into their extracurricular activities, ensuring that the younger generation remains connected to their ancestors' wisdom. 

      "We cannot move forward if we forget where we came from," says Mzee Charo, a village elder. "Our stories are our maps for the future. By sharing them on platforms like Mazisheti.org, we ensure they never die out."

      The role of technology in this preservation effort cannot be overstated. By digitizing traditional songs and archiving oral histories, the community is building a bridge across time. The challenges remain, however, as urbanization continues to draw young people away from rural ancestral lands. This article explores the balance between preserving the old and embracing the new.
    `,
    imageUrl: "https://picsum.photos/seed/mazi2/1200/600",
    category: "Culture",
    date: "May 12, 2024",
    author: "Samuel Katana",
    sourceUrl: "https://www.mazisheti.org/resilience-of-traditions"
  }
};

export default function ContentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const data = contentData[id as keyof typeof contentData] || contentData["1"];
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const result = await getAiSummary(data.fullContent);
    setIsSummarizing(false);

    if (result.success) {
      setSummary(result.summary!);
      toast({
        title: "Summary Generated",
        description: "AI has successfully summarized this article for you.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate summary. Please try again later.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-8">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Feed
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article Content */}
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
                <span>4 min read</span>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <Button variant="ghost" size="sm" className="h-8 gap-2">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
                <Button variant="ghost" size="sm" className="h-8 gap-2">
                  <MessageSquare className="w-4 h-4" /> 12
                </Button>
              </div>
            </div>

            <div className="relative aspect-video rounded-3xl overflow-hidden mb-10 shadow-lg">
              <Image
                src={data.imageUrl}
                alt={data.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="prose prose-lg max-w-none prose-headings:text-primary prose-p:leading-relaxed prose-p:text-slate-700">
              {data.fullContent.split('\n\n').map((para, i) => (
                <p key={i} className="mb-6 whitespace-pre-line">
                  {para.trim()}
                </p>
              ))}
            </div>

            <div className="mt-12 p-8 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center gap-6">
               <div className="flex-1">
                 <h4 className="font-bold text-primary mb-2">Original Source</h4>
                 <p className="text-sm text-slate-600 mb-4">This content was aggregated from mazisheti.org. You can read the original article there.</p>
                 <Link href={data.sourceUrl} target="_blank">
                    <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/5">
                      Visit mazisheti.org <ExternalLink className="w-4 h-4" />
                    </Button>
                 </Link>
               </div>
            </div>
          </article>

          {/* Sidebar Tools */}
          <aside className="lg:col-span-4 space-y-8">
            <Card className="p-6 border-none shadow-xl rounded-3xl bg-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full -mr-12 -mt-12" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-accent">AI Summary</h3>
                </div>
                
                {!summary && !isSummarizing ? (
                  <>
                    <p className="text-muted-foreground mb-6 text-sm">
                      Pressed for time? Use our AI tool to get a concise summary of this aggregated content instantly.
                    </p>
                    <Button 
                      onClick={handleSummarize}
                      className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-12 rounded-xl"
                    >
                      Summarize with AI
                    </Button>
                  </>
                ) : isSummarizing ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[95%]" />
                    <Skeleton className="h-4 w-[80%]" />
                    <p className="text-xs text-center text-muted-foreground animate-pulse mt-4">
                      Analyzing content and generating summary...
                    </p>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 mb-6">
                      <p className="text-slate-700 leading-relaxed text-sm italic">
                        "{summary}"
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setSummary(null)}
                      className="w-full text-accent hover:bg-accent/5 text-xs h-8"
                    >
                      Clear Summary
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 border-none shadow-lg rounded-3xl bg-primary text-white">
               <h3 className="text-lg font-bold mb-4">Related Content</h3>
               <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={`https://picsum.photos/seed/rel${i}/150/150`}
                          alt="Thumbnail"
                          fill
                          className="object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold line-clamp-2 group-hover:text-blue-200 transition-colors">
                          {i === 1 ? "Mazisheti Water Project Update" : "Coastal Music Heritage Series"}
                        </h4>
                        <p className="text-[10px] text-blue-200 mt-1 uppercase tracking-wider">News</p>
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
