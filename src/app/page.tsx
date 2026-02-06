import { Navigation } from "@/components/navigation";
import { ContentCard } from "@/components/content-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const featuredContent = [
  {
    id: "1",
    title: "The Resilience of Giriama Traditions in Modern Kenya",
    excerpt: "Exploring the vibrant cultural heritage of the Giriama people and how traditional practices are adapting to the 21st century.",
    imageUrl: PlaceHolderImages.find(img => img.id === 'culture-1')?.imageUrl || "https://picsum.photos/seed/culture1/600/400",
    category: "Culture",
    date: "May 12, 2024",
    type: "article" as const
  },
  {
    id: "2",
    title: "Community Town Hall: Infrastructure Development in Mazisheti",
    excerpt: "Highlights from the recent community meeting discussing new water sanitation projects and road improvements.",
    imageUrl: PlaceHolderImages.find(img => img.id === 'news-1')?.imageUrl || "https://picsum.photos/seed/news1/600/400",
    category: "News",
    date: "May 10, 2024",
    type: "article" as const
  },
  {
    id: "3",
    title: "MaziSheti Exclusive: Interview with Elder Kalume",
    excerpt: "A deep dive into the oral history of the region through the lens of one of our most respected community elders.",
    imageUrl: PlaceHolderImages.find(img => img.id === 'video-1')?.imageUrl || "https://picsum.photos/seed/video1/600/400",
    category: "Interview",
    date: "May 08, 2024",
    type: "video" as const
  }
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bg')?.imageUrl || "https://picsum.photos/seed/hero/1200/600";

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[500px] flex items-center justify-center text-white overflow-hidden">
          <Image
            src={heroImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
            data-ai-hint="African landscape"
          />
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px]" />
          <div className="container relative z-10 px-4 text-center max-w-3xl">
            <Badge className="mb-6 bg-accent border-none text-white px-4 py-1.5 text-sm font-bold uppercase tracking-widest">
              Community Hub
            </Badge>
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6 leading-tight">
              Connecting Mazisheti to the World
            </h1>
            <p className="text-lg md:text-xl text-blue-50 mb-8 max-w-2xl mx-auto leading-relaxed">
              Stay updated with aggregated news, culture, and community insights directly from mazisheti.org, enhanced with AI insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-blue-50 font-bold px-8 rounded-xl h-14">
                Explore Feed
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 rounded-xl h-14">
                Join Community
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Aggregated Content</h3>
                <p className="text-muted-foreground">Real-time updates and media parsed directly from our primary community source.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-accent mb-6">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Summarization</h3>
                <p className="text-muted-foreground">Save time with instant AI-powered summaries of articles and video transcripts.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <ArrowRight className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Global Reach</h3>
                <p className="text-muted-foreground">Built for the local community, optimized for the global diaspora.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Feed */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-headline font-bold text-primary">Latest from Mazisheti</h2>
                <p className="text-muted-foreground mt-2">Discover what's happening in our vibrant community.</p>
              </div>
              <Link href="/feed">
                <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5">
                  View All Feed <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredContent.map((item) => (
                <ContentCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-[2.5rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32" />
              
              <div className="relative z-10 flex-1 text-white text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-headline font-bold mb-6">Join our growing community today</h2>
                <p className="text-blue-100 text-lg mb-8 max-w-xl">
                  Create your profile to save articles, participate in discussions, and get personalized content summaries.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link href="/login">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border-none px-8 font-bold rounded-xl h-14">
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative z-10 flex-1 flex justify-center md:justify-end">
                 <div className="relative w-full max-w-sm aspect-square bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 p-6 flex flex-col justify-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent" />
                      <div className="flex-1">
                        <div className="h-3 w-24 bg-white/30 rounded-full mb-2" />
                        <div className="h-2 w-16 bg-white/20 rounded-full" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-white/10 rounded-full" />
                      <div className="h-2 w-full bg-white/10 rounded-full" />
                      <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                    </div>
                    <div className="flex gap-2">
                       <div className="h-8 w-20 bg-white/20 rounded-lg" />
                       <div className="h-8 w-20 bg-white/20 rounded-lg" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <Globe className="w-8 h-8 text-primary" />
                <span className="font-headline font-bold text-2xl text-primary">MaziSheti</span>
              </Link>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                Empowering the Mazisheti community through information technology, AI, and connectivity. Aggregating culture and news for the next generation.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/feed" className="hover:text-primary transition-colors">Latest Feed</Link></li>
                <li><Link href="/videos" className="hover:text-primary transition-colors">Video Gallery</Link></li>
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Connect</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/profile" className="hover:text-primary transition-colors">Your Profile</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
                <li><Link href="https://www.mazisheti.org" target="_blank" className="hover:text-primary transition-colors">mazisheti.org</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 MaziSheti App. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold", className)}>
      {children}
    </span>
  );
}
