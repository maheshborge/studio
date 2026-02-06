"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const STAGES = [
  { id: "preparation", label: "मशागत / जमीन तयार करणे", icon: Hammer },
  { id: "seeds", label: "बियाणे निवड / बीजप्रक्रिया", icon: Sprout },
  { id: "sowing", label: "पेरणी / लागवड", icon: MapPin },
  { id: "weeding", label: "आंतरमशागत / तण नियंत्रण", icon: Hammer },
  { id: "pest_control", label: "कीड व रोग नियंत्रण", icon: Bug },
  { id: "fertilization", label: "खत व्यवस्थापन", icon: Droplets },
  { id: "harvesting", label: "काढणी", icon: PackageCheck },
  { id: "post_harvest", label: "ग्रेडिंग, सॉर्टिंग व पॅकिंग", icon: PackageCheck }
];

const WATER_SOURCES = ["बोअरवेल १", "बोअरवेल २", "शेततळे", "इरिगेशन स्कीम"];

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
    totalLandArea: "", waterSource: "", crops: [{ name: "", area: "" }]
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [newCrop, setNewCrop] = useState({ name: "", area: "", season: "Kharif", type: "Fruits" });

  useEffect(() => {
    if (farmerData) setFormData(prev => ({ ...prev, ...farmerData }));
  }, [farmerData]);

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;
  if (!user) { router.push("/login"); return null; }

  const calculateTotalCropArea = () => {
    return formData.crops.reduce((acc, curr) => acc + (parseFloat(curr.area) || 0), 0);
  };

  const handleProfileSave = async () => {
    if (!db || !user) return;
    
    if (formData.contactNumber.length !== 10) {
      toast({ variant: "destructive", title: "त्रुटी", description: "मोबाईल नंबर १० अंकी असणे आवश्यक आहे." });
      return;
    }

    const totalArea = calculateTotalCropArea();
    const limit = parseFloat(formData.totalLandArea) || 0;

    if (totalArea > limit) {
      toast({
        variant: "destructive",
        title: "त्रुटी",
        description: `पिकांचे एकूण क्षेत्र (${totalArea} एकर) तुमच्या जमिनीपेक्षा (${limit} एकर) जास्त आहे.`
      });
      return;
    }

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

  const handleCropChange = (index: number, field: string, value: string) => {
    const newCrops = [...formData.crops];
    newCrops[index] = { ...newCrops[index], [field]: value };
    
    const tempTotal = newCrops.reduce((acc, curr) => acc + (parseFloat(curr.area) || 0), 0);
    const limit = parseFloat(formData.totalLandArea) || 0;

    if (tempTotal > limit && field === "area") {
      toast({
        variant: "destructive",
        title: "क्षेत्र मर्यादा ओलांडली!",
        description: "पिकांचे क्षेत्र एकूण जमिनीपेक्षा जास्त होत आहे.",
      });
    }

    setFormData(prev => ({ ...prev, crops: newCrops }));
  };

  const addCropField = () => {
    const totalArea = calculateTotalCropArea();
    const limit = parseFloat(formData.totalLandArea) || 0;

    if (totalArea >= limit) {
      toast({
        variant: "destructive",
        title: "जमीन शिल्लक नाही!",
        description: "तुमची जमीन पूर्ण झाली आहे, आता अधिक पिके जोडता येणार नाहीत.",
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      crops: [...prev.crops, { name: "", area: "" }]
    }));
  };

  const removeCropField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.filter((_, i) => i !== index)
    }));
  };

  const handleAddCropCycle = async () => {
    if (!db || !user || !newCrop.name) return;
    
    // Check if adding this crop cycle exceeds total land
    const existingCropsTotal = cropCycles?.reduce((acc, curr) => acc + (parseFloat(curr.area) || 0), 0) || 0;
    const newArea = parseFloat(newCrop.area) || 0;
    const limit = parseFloat(formData.totalLandArea) || 0;

    if (existingCropsTotal + newArea > limit) {
      toast({
        variant: "destructive",
        title: "क्षेत्र मर्यादा ओलांडली!",
        description: "हे पीक जोडल्यास तुमचे एकूण क्षेत्र जमिनीपेक्षा जास्त होईल.",
      });
      return;
    }

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
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-[2rem] shadow-xl border-none">
              <CardHeader className="bg-primary text-white rounded-t-[2rem]">
                <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> वैयक्तिक व शेती माहिती</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label>शेतकऱ्याचे नाव</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>मोबाईल नंबर</Label>
                  <Input 
                    type="number"
                    value={formData.contactNumber} 
                    onChange={e => {
                      if (e.target.value.length <= 10) setFormData({...formData, contactNumber: e.target.value})
                    }} 
                    className="rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>एकूण जमीन क्षेत्र (एकर)</Label>
                  <Input 
                    type="number" 
                    value={formData.totalLandArea} 
                    onChange={e => setFormData({...formData, totalLandArea: e.target.value})}
                    className="rounded-xl font-bold text-primary" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="font-bold">पाण्याची सोय</Label>
                  <Select value={formData.waterSource} onValueChange={(val) => setFormData({...formData, waterSource: val})}>
                    <SelectTrigger className="h-12 rounded-xl bg-slate-50">
                      <SelectValue placeholder="निवडा" />
                    </SelectTrigger>
                    <SelectContent>
                      {WATER_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">पीकनिहाय क्षेत्र</Label>
                    <div className="text-[10px] font-bold text-slate-500">
                      शिल्लक: {(parseFloat(formData.totalLandArea) || 0) - calculateTotalCropArea()}
                    </div>
                    <Button variant="ghost" size="sm" onClick={addCropField} className="text-primary h-8 w-8 p-0">
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                  {formData.crops.map((crop, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Input 
                          placeholder="पीक" 
                          value={crop.name}
                          onChange={(e) => handleCropChange(index, "name", e.target.value)}
                          className="h-10 rounded-lg text-sm"
                        />
                      </div>
                      <div className="w-20">
                        <Input 
                          type="number"
                          placeholder="एकर" 
                          value={crop.area}
                          onChange={(e) => handleCropChange(index, "area", e.target.value)}
                          className="h-10 rounded-lg text-sm"
                        />
                      </div>
                      {formData.crops.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeCropField(index)} className="text-red-400 h-10 w-10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button onClick={handleProfileSave} disabled={isSaving} className="w-full rounded-xl gap-2 mt-4">
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />} माहिती साठवा
                </Button>
              </CardContent>
            </Card>
          </div>

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
