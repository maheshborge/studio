
"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Sprout, 
  Droplets, 
  TrendingUp, 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock,
  LayoutDashboard,
  MapPin,
  Phone,
  Hammer,
  Bug,
  PackageCheck
} from "lucide-react";
import { useAuth, useFirestore, useUser, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, setDoc, collection, addDoc, serverTimestamp, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { locationData } from "@/lib/locations";

const STAGES = [
  { id: "preparation", label: "मशागत / जमीन तयार करणे", icon: Hammer },
  { id: "seeds", label: "बियाणे निवड / बीजप्रक्रिया", icon: Sprout },
  { id: "sowing", label: "पेरणी / लागवड", icon: MapPin },
  { id: "weeding", label: "आंतरमशागत / तण नियंत्रण", icon: Hammer },
  { id: "pest_control", label: "कीड व रोग नियंत्रण", icon: Bug },
  { id: "fertilization", label: "खत व्यवस्थापन", icon: Droplets, subStages: ["लागणीनंतर", "फुलोरा वेळ", "फळधारणा वेळ"] },
  { id: "harvesting", label: "काढणी", icon: PackageCheck },
  { id: "post_harvest", label: "ग्रेडिंग, सॉर्टिंग व पॅकिंग", icon: PackageCheck }
];

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const farmerRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "farmerData");
  }, [db, user]);

  const cropsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "users", user.uid, "cropCycles");
  }, [db, user]);

  const { data: farmerData, isLoading: isProfileLoading } = useDoc(farmerRef);
  const { data: cropCycles, isLoading: isCropsLoading } = useCollection(cropsQuery);

  const [formData, setFormData] = useState({
    name: "", contactNumber: "", state: "Maharashtra", district: "", taluka: "", village: "", pincode: "",
    totalLandArea: "4", waterSources: [] as string[]
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [newCrop, setNewCrop] = useState({ name: "", area: "", season: "Kharif", type: "Fruits" });

  useEffect(() => {
    if (farmerData) setFormData(prev => ({ ...prev, ...farmerData }));
  }, [farmerData]);

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;
  if (!user) { router.push("/login"); return null; }

  const handleProfileSave = async () => {
    if (!db || !user) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid, "profile", "farmerData"), {
        ...formData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: "माहिती साठवली!", description: "तुमची वैयक्तिक माहिती अपडेट झाली आहे." });
    } catch (e) {
      toast({ variant: "destructive", title: "त्रुटी", description: "माहिती साठवता आली नाही." });
    } finally { setIsSaving(false); }
  };

  const handleAddCropCycle = async () => {
    if (!db || !user || !newCrop.name) return;
    try {
      await addDoc(collection(db, "users", user.uid, "cropCycles"), {
        ...newCrop,
        status: "Growing",
        currentStage: "preparation",
        stagesCompleted: [],
        offers: [],
        createdAt: serverTimestamp()
      });
      setShowAddCrop(false);
      toast({ title: "पीक जोडले!", description: "नवीन पीक चक्राची सुरुवात झाली आहे." });
    } catch (e) {
      toast({ variant: "destructive", title: "त्रुटी", description: "पीक जोडता आले नाही." });
    }
  };

  const updateStage = async (cropId: string, stageId: string) => {
    if (!db || !user) return;
    const cropRef = doc(db, "users", user.uid, "cropCycles", cropId);
    const crop = cropCycles?.find(c => c.id === cropId);
    if (!crop) return;

    const newStages = crop.stagesCompleted.includes(stageId) 
      ? crop.stagesCompleted.filter((s: string) => s !== stageId)
      : [...crop.stagesCompleted, stageId];

    await updateDoc(cropRef, { 
      stagesCompleted: newStages,
      status: stageId === "harvesting" ? "Harvested" : crop.status
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-headline font-bold text-primary mb-10 flex items-center gap-3">
          <LayoutDashboard className="w-10 h-10" /> माझे शेती व्यवस्थापन
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Farm Assets & Profile */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-[2rem] shadow-xl border-none">
              <CardHeader className="bg-primary text-white rounded-t-[2rem]">
                <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> वैयक्तिक व शेती माहिती</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>शेतकऱ्याचे नाव</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>एकूण जमीन क्षेत्र (एकर)</Label>
                  <Input value={formData.totalLandArea} readOnly className="bg-slate-50 rounded-xl font-bold text-primary" />
                </div>
                <div className="space-y-2">
                  <Label>पाण्याचे स्रोत</Label>
                  <div className="flex flex-wrap gap-2">
                    {["बोअरवेल १", "बोअरवेल २", "शेततळे", "इरिगेशन स्कीम"].map(source => (
                      <Badge 
                        key={source} 
                        variant={formData.waterSources.includes(source) ? "default" : "outline"}
                        className="cursor-pointer px-3 py-1 rounded-lg"
                        onClick={() => {
                          const newSources = formData.waterSources.includes(source)
                            ? formData.waterSources.filter(s => s !== source)
                            : [...formData.waterSources, source];
                          setFormData({...formData, waterSources: newSources});
                        }}
                      >
                        {source}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button onClick={handleProfileSave} disabled={isSaving} className="w-full rounded-xl gap-2">
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />} माहिती साठवा
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Active Crops Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">सक्रिय पीक चक्र (Active Crops)</h2>
              <Button onClick={() => setShowAddCrop(true)} className="rounded-xl gap-2 bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4" /> नवीन पीक जोडा
              </Button>
            </div>

            {showAddCrop && (
              <Card className="rounded-3xl border-2 border-dashed border-green-200 bg-green-50/30 p-6 animate-in fade-in zoom-in-95">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>पिकाचे नाव</Label>
                    <Input placeholder="उदा. गहू" value={newCrop.name} onChange={e => setNewCrop({...newCrop, name: e.target.value})} className="bg-white rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>क्षेत्र (एकर)</Label>
                    <Input type="number" placeholder="उदा. १.५" value={newCrop.area} onChange={e => setNewCrop({...newCrop, area: e.target.value})} className="bg-white rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>हंगाम</Label>
                    <select className="w-full h-10 rounded-xl border border-input px-3" value={newCrop.season} onChange={e => setNewCrop({...newCrop, season: e.target.value})}>
                      <option value="Kharif">खरीप</option>
                      <option value="Rabbi">रब्बी</option>
                      <option value="Summer">उन्हाळी</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <Button onClick={handleAddCropCycle} className="bg-green-600 w-full rounded-xl">सुरू करा</Button>
                    <Button variant="ghost" onClick={() => setShowAddCrop(false)} className="rounded-xl">रद्द</Button>
                  </div>
                </div>
              </Card>
            )}

            <div className="space-y-6">
              {cropCycles?.map(crop => (
                <Card key={crop.id} className="rounded-[2.5rem] shadow-xl border-none overflow-hidden bg-white">
                  <div className="bg-slate-50 p-6 border-b flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">{crop.name} <span className="text-slate-400 text-lg font-normal">({crop.area} एकर)</span></h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{crop.season}</Badge>
                        <Badge className={crop.status === 'Growing' ? 'bg-blue-500' : 'bg-green-500'}>{crop.status === 'Growing' ? 'वाढ चालू' : 'काढणी झाली'}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">प्रगती</p>
                      <p className="text-2xl font-bold text-primary">{Math.round((crop.stagesCompleted.length / STAGES.length) * 100)}%</p>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {STAGES.map(stage => {
                        const isDone = crop.stagesCompleted.includes(stage.id);
                        return (
                          <div 
                            key={stage.id} 
                            onClick={() => updateStage(crop.id, stage.id)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-2 ${isDone ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-400'}`}
                          >
                            <stage.icon className={`w-6 h-6 ${isDone ? 'text-green-600' : 'text-slate-300'}`} />
                            <span className="text-[10px] font-bold leading-tight">{stage.label}</span>
                            {isDone && <CheckCircle2 className="w-4 h-4 text-green-600 mt-auto" />}
                          </div>
                        );
                      })}
                    </div>

                    {crop.status === 'Harvested' && (
                      <div className="mt-8 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-blue-800 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> व्यापाऱ्यांकडून आलेल्या ऑफर्स</h4>
                          <Badge className="bg-blue-600">{crop.offers?.length || 0} नवीन</Badge>
                        </div>
                        <div className="space-y-3">
                          {crop.offers?.length > 0 ? (
                            crop.offers.map((offer: any, i: number) => (
                              <div key={i} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
                                <div>
                                  <p className="font-bold">{offer.buyerName}</p>
                                  <p className="text-2xl font-bold text-green-600">₹ {offer.rate} <span className="text-xs text-muted-foreground font-normal">/ क्विंटल</span></p>
                                </div>
                                <Button size="sm" className="rounded-lg bg-green-600 hover:bg-green-700">Approve</Button>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-blue-600/60 text-center py-4">अद्याप कोणतीही बोली आलेली नाही. पीक मार्केटप्लेसवर लिस्ट झाले आहे.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {cropCycles?.length === 0 && !isCropsLoading && (
                <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed">
                  <Sprout className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500">अद्याप कोणतेही पीक जोडलेले नाही.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
