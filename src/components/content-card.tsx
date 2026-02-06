
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Play, 
  ExternalLink, 
  Facebook, 
  Instagram, 
  Send 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ContentCardProps {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
  type: "article" | "video";
}

export function ContentCard({ id, title, excerpt, imageUrl, category, date, type }: ContentCardProps) {
  const { toast } = useToast();
  const currentUrl = typeof window !== "undefined" ? `${window.location.origin}/content/${id}` : "";

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text = `${title}\n\nयेथे वाचा: ${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleFacebookShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleInstagramShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Link Copied",
      description: "Instagram साठी लिंक कॉपी केली आहे. तुम्ही तुमच्या स्टोरीमध्ये पेस्ट करू शकता.",
    });
    navigator.clipboard.writeText(currentUrl);
  };

  return (
    <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card rounded-2xl flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint="mazisheti content"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
        <Badge 
          className={cn(
            "absolute top-4 left-4 font-semibold uppercase tracking-wider",
            type === "video" ? "bg-accent text-white" : "bg-primary text-white"
          )}
        >
          {category}
        </Badge>
        {type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white ring-4 ring-white/50 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-white" />
            </div>
          </div>
        )}
      </div>
      <CardHeader className="p-5 flex-grow">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Clock className="w-3 h-3" />
          <span>{date}</span>
        </div>
        <Link href={`/content/${id}`}>
          <h3 className="text-xl font-headline font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="mt-3 text-muted-foreground text-sm line-clamp-3">
          {excerpt}
        </p>
      </CardHeader>
      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-muted/50 mt-auto">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleWhatsAppShare}
            className="p-1.5 rounded-full hover:bg-green-50 text-slate-600 hover:text-green-600 transition-colors"
            title="WhatsApp वर शेअर करा"
          >
            <Send className="w-4 h-4" />
          </button>
          <button 
            onClick={handleFacebookShare}
            className="p-1.5 rounded-full hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors"
            title="Facebook वर शेअर करा"
          >
            <Facebook className="w-4 h-4" />
          </button>
          <button 
            onClick={handleInstagramShare}
            className="p-1.5 rounded-full hover:bg-pink-50 text-slate-600 hover:text-pink-600 transition-colors"
            title="Instagram वर शेअर करा"
          >
            <Instagram className="w-4 h-4" />
          </button>
          <span className="text-xs font-black text-slate-950 uppercase ml-1">शेअर</span>
        </div>
        <Link 
          href={`/content/${id}`}
          className="text-primary text-sm font-black flex items-center gap-1 hover:underline decoration-4"
        >
          अधिक वाचा
          <ExternalLink className="w-3 h-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}
