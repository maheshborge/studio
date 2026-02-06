
"use client";

import { useState, use, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Camera, Calendar, Scale, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

export default function FarmerSalesForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const cropRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "cropCycles", id);
  }, [db, user, id]);

  const { data: crop, isLoading } = useDoc(cropRef);

  const [formData, setFormData] = useState({
    saleHarvestDate: "",
    saleEstimatedQuantity: "",
    salePhotoUrl: "https://picsum.photos/seed/sale/800/600"
  });

  useEffect(() => {
    if (crop) {
      setFormData(prev => ({
        ...prev,
        saleHarvestDate: crop.expectedHarvestDate || ""
      }));
    }
  }, [crop]);

  const handleSubmit = async () => {
    if (!db || !cropRef) return;
    
    try {
      await updateDoc(cropRef, {
        isReadyForSale: true,
        saleHarvestDate: formData.saleHarvestDate,
        saleEstimatedQuantity: parseFloat(formData.saleEstimatedQuantity),
        remainingQuantity: parseFloat(formData.saleEstimatedQuantity),
        salePhotoUrl: formData.salePhotoUrl,
        status: "ready"
      });

      toast({ title: "विक्रीसाठी तयार!", description: "तुमचा शेतमाल आता बाजारपेठेत सर्व खरेदीदारांना दिसेल." });
      router.push("/profile");
    } catch (error) {
      toast({ variant: "destructive", title: "त्रुटी", description: "माहिती साठवताना अडचण आली." });
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
            <div className="bg-primary p-8 text-white">
              <h1 className="text-3xl font-bold">शेतमाल विक्री फॉर्म</h1>
              <p className="text-blue-100 mt-2">{crop?.name} - {crop?.variety}</p>
            </div>
            
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="font-bold">शेताचा / मालाचा फोटो</Label>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center group cursor-pointer">
                  <Image 
                    src={formData.salePhotoUrl} 
                    alt="Crop Photo" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 640px"
                    className="object-cover group-hover:opacity-75 transition-opacity" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <Camera className="w-10 h-10" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> माल कधी काढायचा आहे?</Label>
                  <Input 
                    type="date" 
                    value={formData.saleHarvestDate} 
                    onChange={(e) => setFormData(prev => ({...prev, saleHarvestDate: e.target.value}))}
                    className="h-12 rounded-xl bg-slate-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold flex items-center gap-2"><Scale className="w-4 h-4 text-primary" /> अंदाजे माल किती निघेल? (टन)</Label>
                  <Input 
                    type="number" 
                    placeholder="उदा. ५.५"
                    value={formData.saleEstimatedQuantity} 
                    onChange={(e) => setFormData(prev => ({...prev, saleEstimatedQuantity: e.target.value}))}
                    className="h-12 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                className="w-full bg-primary h-14 rounded-2xl font-bold text-lg gap-2 shadow-lg"
              >
                बाजारपेठेत माल विक्रीसाठी उपलब्ध करा <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
