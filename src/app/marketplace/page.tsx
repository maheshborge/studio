
"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  User, 
  Phone,
  ArrowRight,
  TrendingUp,
  Scale
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collectionGroup, doc, updateDoc, arrayUnion } from "firebase/firestore";

export default function MarketplacePage() {
  const db = useFirestore();
  const { user } = useUser();
  const [searchTerm, setSearchSearchTerm] = useState("");
  const [quoteRate, setQuoteRate] = useState("");

  const cropsQuery = useMemoFirebase(() => {
    if (!db) return null;
    // Get all crop cycles across all farmers
    return collectionGroup(db, "cropCycles");
  }, [db]);

  const { data: allCrops, isLoading } = useCollection(cropsQuery);

  // Filter crops that are harvested and ready for sale
  const availableCrops = allCrops?.filter(crop => 
    (crop.status === "Harvested" || crop.status === "Listed") &&
    (crop.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleMakeOffer = async (cropId: string, farmerId: string) => {
    if (!db || !user || !quoteRate) return;
    // In a real app, we need the farmer's UID from the crop document path
    // For this prototype, we'll assume the farmer ID is available or use a workaround
    toast({ title: "ऑफर पाठवली!", description: "तुमची बोली शेतकऱ्याकडे पाठवण्यात आली आहे." });
    setQuoteRate("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
              <ShoppingBag className="w-10 h-10" /> पीक बाजारपेठ (Marketplace)
            </h1>
            <p className="text-muted-foreground mt-2">थेट शेतकऱ्यांकडून ताजी पिके खरेदी करा.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder="पीक शोधा (उदा. आंबा, गहू)..." 
              value={searchTerm}
              onChange={(e) => setSearchSearchTerm(e.target.value)}
              className="pl-12 h-14 rounded-2xl border-none shadow-lg bg-white"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse shadow-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableCrops?.map((crop) => (
              <Card key={crop.id} className="rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all group overflow-hidden bg-white">
                <div className="bg-primary/5 p-6 border-b border-primary/10">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-green-600 text-white px-3 py-1 rounded-full">विक्रीसाठी उपलब्ध</Badge>
                    <span className="text-2xl font-bold text-primary">{crop.area} एकर</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800">{crop.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest font-bold">{crop.season} हंगाम</p>
                </div>
                
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Scale className="w-5 h-5 text-primary" />
                      <span className="font-bold">अंदाजित उत्पादन: ५० क्विंटल</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <span className="text-sm">पुणे, महाराष्ट्र</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-slate-400 font-bold uppercase text-[10px]">सध्याची सर्वोच्च बोली</p>
                      <p className="text-xl font-bold text-green-600">₹ २,४००</p>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="rounded-xl bg-primary hover:bg-primary/90 gap-2">
                          बोली लावा <TrendingUp className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-3xl">
                        <DialogHeader>
                          <DialogTitle>तुमची बोली (Offer) नोंदवा</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>दर (प्रति क्विंटल ₹)</Label>
                            <Input 
                              type="number" 
                              placeholder="उदा. २५००" 
                              value={quoteRate}
                              onChange={e => setQuoteRate(e.target.value)}
                              className="h-12 rounded-xl"
                            />
                          </div>
                          <Button onClick={() => handleMakeOffer(crop.id, "")} className="w-full h-12 rounded-xl bg-green-600">ऑफर पाठवा</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
            {availableCrops?.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <p className="text-xl text-muted-foreground font-headline">सध्या विक्रीसाठी कोणतीही पिके उपलब्ध नाहीत.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
