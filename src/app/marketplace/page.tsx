"use client";

import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  User, 
  Phone,
  Filter,
  ArrowRight
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collectionGroup, query } from "firebase/firestore";
import { useState } from "react";

export default function MarketplacePage() {
  const db = useFirestore();
  const [searchTerm, setSearchSearchTerm] = useState("");

  const farmerProfilesQuery = useMemoFirebase(() => {
    if (!db) return null;
    // We use collectionGroup to find all "farmerData" docs across all users
    return collectionGroup(db, "profile");
  }, [db]);

  const { data: farmerProfiles, isLoading } = useCollection(farmerProfilesQuery);

  // Flatten farmers into list of crops
  const availableCrops = farmerProfiles?.flatMap(profile => 
    (profile.crops || []).map((crop: any) => ({
      ...crop,
      farmerName: profile.name,
      address: profile.address,
      contact: profile.contactNumber,
      farmerId: profile.userId
    }))
  ).filter(crop => 
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    crop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
              <ShoppingBag className="w-10 h-10" /> पीक बाजारपेठ (Marketplace)
            </h1>
            <p className="text-muted-foreground mt-2">शेतकऱ्यांनी विक्रीसाठी उपलब्ध केलेली पिके.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="पीक किंवा गाव शोधा..." 
              value={searchTerm}
              onChange={(e) => setSearchSearchTerm(e.target.value)}
              className="pl-12 h-14 rounded-2xl border-none shadow-lg bg-white"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse shadow-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableCrops?.map((crop, index) => (
              <Card key={index} className="rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all group overflow-hidden bg-white">
                <div className="bg-primary/5 p-6 border-b border-primary/10 group-hover:bg-primary/10 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                      उपलब्ध आहे
                    </Badge>
                    <span className="text-2xl font-bold text-primary">{crop.area} एकर</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800">{crop.name}</h3>
                </div>
                
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-600">
                      <User className="w-5 h-5 text-primary" />
                      <span className="font-bold">{crop.farmerName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <span className="text-sm line-clamp-1">{crop.address}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-600 font-bold">
                      <Phone className="w-4 h-4" />
                      {crop.contact}
                    </div>
                    <Button className="rounded-xl bg-primary hover:bg-primary/90 gap-2">
                      खरेदी करा <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {availableCrops?.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-xl text-muted-foreground">सध्या कोणतीही पिके उपलब्ध नाहीत.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
