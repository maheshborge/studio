
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, Play, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            12
          </span>
        </div>
        <Link 
          href={`/content/${id}`}
          className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline"
        >
          Read more
          <ExternalLink className="w-3 h-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}
