
"use client";

import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Scale,
  TrendingUp,
  Filter,
  ArrowUpDown,
  Truck,
  Tag
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from "@/firebase";
import { collectionGroup, doc } from "firebase/firestore";

export default function MarketplacePage() {
  const db = useFirestore();
  const { user } = useUser();
  const [searchTerm, setSearchSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "yield" | "variety">("name");

  // Get current user profile to prioritize their category
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "main");
  }, [db, user]);
  const { data: profile } = useDoc(profileRef);
  const { data: buyerData } = useDoc(useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "buyerData");
  }, [db, user]));

  const cropsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collectionGroup(db, "cropCycles");
  }, [db]);

  const { data: allCrops, isLoading } = useCollection(cropsQuery);

  const processedCrops = useMemo(() => {
    if (!allCrops) return [];
    
    // 1. Filter by search (checks name and variety)
    let filtered = allCrops.filter(crop => 
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (crop.variety && crop.variety.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // 2. Sort
    filtered.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "variety") return (a.variety || "").localeCompare(b.variety || "");
      return (b.estimatedYield || 0) - (a.estimatedYield || 0);
    });

    // 3. Prioritize by Buyer's preferred categories
    const preferredTypes = buyerData?.purchaseTypes || [];
    if (preferredTypes.length > 0) {
      filtered.sort((a, b) => {
        const aPref = preferredTypes.includes(a.category) ? 1 : 0;
        const bPref = preferredTypes.includes(b.category) ? 1 : 0;
        return bPref - aPref;
      });
    }

    return filtered;
  }, [allCrops, searchTerm, sortBy, buyerData]);

  // Aggregate by Category - Crop
  const aggregates = useMemo(() => {
    const summary: Record<string, { area: number, yield: number }> = {};
    processedCrops.forEach(crop => {
      const key = `${crop.category?.toUpperCase()} - ${crop.name}`;
      if (!summary[key]) summary[key] = { area: 0, yield: 0 };
      summary[key].area += crop.area || 0;
      summary[key].yield += crop.estimatedYield || 0;
    });
    return Object.entries(summary).map(([label, data]) => ({ label, ...data }));
  }, [processedCrops]);

  const isTransporter = profile?.userType === "transporter";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
              <ShoppingBag className="w-10 h-10" /> पीक बाजारपेठ (Marketplace)
            </h1>
            <p className="text-muted-foreground mt-2">
              {isTransporter ? "भाड्यासाठी उपलब्ध पिके व व्यापारी" : "थेट शेतकऱ्यांकडून ताजी पिके खरेदी करा."}
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                placeholder="पीक किंवा व्हारायटी शोधा..." 
                value={searchTerm}
                onChange={(e) => setSearchSearchTerm(e.target.value)}
                className="pl-12 h-14 rounded-2xl border-none shadow-lg bg-white"
              />
            </div>
            <Button variant="outline" onClick={() => setSortBy(prev => prev === "name" ? "yield" : prev === "yield" ? "variety" : "name")} className="h-14 rounded-2xl gap-2 bg-white">
              <ArrowUpDown className="w-4 h-4" /> {sortBy === "name" ? "A-Z" : sortBy === "yield" ? "उत्पादन" : "व्हारायटी"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="bg-white border p-1 rounded-2xl h-14 mb-8">
            <TabsTrigger value="list" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white">पिकांची यादी</TabsTrigger>
            <TabsTrigger value="summary" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white">गटनिहाय सारांश</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processedCrops.map((crop) => (
                <Card key={crop.id} className="rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all overflow-hidden bg-white">
                  <div className="bg-primary/5 p-6 border-b">
                    <div className="flex justify-between items-start mb-4">
                      <Badge className="bg-green-600 text-white">{crop.status === "ready" ? "काढणीसाठी तयार" : "वाढ होत आहे"}</Badge>
                      <span className="text-2xl font-bold text-primary">{crop.area} एकर</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{crop.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span className="text-sm font-medium text-slate-500">{crop.variety || "जात उपलब्ध नाही"}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-3 tracking-widest">{crop.category}</p>
                  </div>
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Scale className="w-5 h-5 text-primary" />
                      <span className="font-bold">अंदाजित उत्पादन: {crop.estimatedYield} टन</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <MapPin className="w-5 h-5" />
                      <span>{crop.farmerDistrict || "महाराष्ट्र"}</span>
                    </div>
                    <div className="pt-4 flex items-center justify-between border-t">
                      <div className="text-xs">
                        <p className="text-slate-400 font-bold">काढणी तारीख (अंदाजे)</p>
                        <p className="text-sm font-bold text-slate-700">{crop.expectedHarvestDate}</p>
                      </div>
                      <Button className="rounded-xl bg-primary gap-2">
                        {isTransporter ? "ट्रान्सपोर्ट द्या" : "खरेदी करा"} <TrendingUp className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aggregates.map((row, i) => (
                <Card key={i} className="p-8 rounded-[2rem] border-none shadow-lg bg-white flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-bold text-primary">{row.label}</h4>
                    <p className="text-sm text-slate-500 mt-1">{row.area.toFixed(1)} एकर क्षेत्र</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-slate-800">{row.yield.toFixed(1)} <span className="text-sm">टन</span></p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">एकूण उत्पादन</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
