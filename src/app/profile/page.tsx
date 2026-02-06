
"use client";

import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  PackageCheck,
  Globe,
  Plane,
  Users,
  GraduationCap,
  ShieldCheck
} from "lucide-react";
import { useAuth, useFirestore, useUser, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, setDoc, collection, addDoc, serverTimestamp, updateDoc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { locationData } from "@/lib/locations";

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

const WATER_SOURCES = [
  { id: "borewell", label: "बोअरवेल" },
  { id: "well", label: "विहीर" },
  { id: "pond", label: "शेततळे" },
  { id: "lift", label: "उपसा सिंचन" }
];

const MIGRATION_REASONS = [
  { value: "shikshan", label: "शिक्षण (Education)" },
  { value: "nokari", label: "नोकरी (Job)" },
  { value: "marriage", label: "लग्न (Marriage)" },
  { value: "business", label: "व्यवसाय (Business)" }
];

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const mainProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "main");
  }, [db, user]);

  const farmerRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "farmerData");
  }, [db, user]);

  const cropsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "users", user.uid, "cropCycles");
  }, [db, user]);

  const { data: mainProfile } = useDoc(mainProfileRef);
  const { data: farmerData, isLoading: isProfileLoading } = useDoc(farmerRef);
  const { data: cropCycles, isLoading: isCropsLoading } = useCollection(cropsQuery);

  const [formData, setFormData] = useState({
    name: "", contactNumber: "", state: "Maharashtra", district: "", taluka: "", village: "", pincode: "",
    totalLandArea: "", waterSources: [] as string[], crops: [{ name: "", area: "" }],
    totalMembers: "", womenCount: "", menCount: "", studentCount: "",
    migrationEntries: [{ reason: "", city: "", count: "" }]
  });

  const [isOtherState, setIsOtherState] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddCrop, setShowAddCrop] = useState(false);

  const allLocations = useMemo(() => {
    const locations: string[] = [];
    const maharashtra = locationData["Maharashtra"];
    Object.keys(maharashtra).forEach(district => {
      locations.push(district);
      maharashtra[district].forEach(taluka => locations.push(taluka));
    });
    return Array.from(new Set(locations));
  }, []);

  useEffect(() => {
    if (farmerData) {
      setFormData(prev => ({ ...prev, ...farmerData }));
      if (farmerData.state && farmerData.state !== "Maharashtra") {
        setIsOtherState(true);
      }
    } else if (mainProfile) {
      setFormData(prev => ({ ...prev, name: mainProfile.name, contactNumber: mainProfile.mobile }));
    }
  }, [farmerData, mainProfile]);

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;
  if (!user) { router.push("/login"); return null; }

  const handleInputChange = (id: string, value: string) => {
    if (id === "contactNumber" && value.length > 10) return;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    if (id === "state") {
      if (value === "Other") {
        setIsOtherState(true);
        setFormData(prev => ({ ...prev, state: "", district: "", taluka: "" }));
      } else {
        setIsOtherState(false);
        setFormData(prev => ({ ...prev, state: value, district: "", taluka: "" }));
      }
      return;
    }
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleWaterSourceChange = (label: string) => {
    setFormData(prev => {
      const sources = prev.waterSources || [];
      const updated = sources.includes(label) ? sources.filter(s => s !== label) : [...sources, label];
      return { ...prev, waterSources: updated };
    });
  };

  const handleMigrationChange = (index: number, field: string, value: string) => {
    const newEntries = [...formData.migrationEntries];
    if (field === "count") {
      const totalKutumb = parseInt(formData.totalMembers) || 0;
      const countVal = parseInt(value) || 0;
      if (countVal > totalKutumb) {
        toast({ variant: "destructive", title: "त्रुटी", description: "संख्या एकूण कुटुंब सदस्यांपेक्षा जास्त असू शकत नाही." });
        return;
      }
    }
    newEntries[index] = { ...newEntries[index], [field]: value };
    setFormData(prev => ({ ...prev, migrationEntries: newEntries }));
  };

  const addMigrationEntry = () => {
    setFormData(prev => ({ ...prev, migrationEntries: [...prev.migrationEntries, { reason: "", city: "", count: "" }] }));
  };

  const removeMigrationEntry = (index: number) => {
    setFormData(prev => ({ ...prev, migrationEntries: prev.migrationEntries.filter((_, i) => i !== index) }));
  };

  const handleProfileSave = async () => {
    if (!db || !user) return;
    if (formData.contactNumber.length !== 10) {
      toast({ variant: "destructive", title: "त्रुटी", description: "मोबाईल नंबर १० अंकी असणे आवश्यक आहे." });
      return;
    }
    setIsSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid, "profile", "farmerData"), { ...formData, updatedAt: new Date().toISOString() }, { merge: true });
      toast({ title: "माहिती साठवली!", description: "तुमची माहिती अपडेट झाली आहे." });
    } catch (e) {
      toast({ variant: "destructive", title: "त्रुटी", description: "माहिती साठवता आली नाही." });
    } finally { setIsSaving(false); }
  };

  const districts = Object.keys(locationData["Maharashtra"]);
  const talukas = (!isOtherState && formData.district) ? locationData["Maharashtra"][formData.district] : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
            <LayoutDashboard className="w-10 h-10" /> माझीशेती, माझे व्यवस्थापन
          </h1>
          {mainProfile && (
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider leading-none mb-1">लॉगिन केलेला मोबाईल</p>
                <p className="font-bold text-slate-700 leading-none">{mainProfile.mobile}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-[2rem] shadow-xl border-none">
              <CardHeader className="bg-primary text-white rounded-t-[2rem]">
                <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> वैयक्तिक व शेती माहिती</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2"><Label>शेतकऱ्याचे नाव</Label><Input value={formData.name} onChange={e => handleInputChange("name", e.target.value)} className="rounded-xl" /></div>
                <div className="space-y-2"><Label>मोबाईल नंबर</Label><Input type="number" value={formData.contactNumber} onChange={e => handleInputChange("contactNumber", e.target.value)} className="rounded-xl" /></div>
                
                <div className="space-y-4 pt-4 border-t">
                  <Label className="font-bold">पत्ता</Label>
                  <Select value={isOtherState ? "Other" : "Maharashtra"} onValueChange={(val) => handleSelectChange("state", val)}>
                    <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="राज्य निवडा" /></SelectTrigger>
                    <SelectContent><SelectItem value="Maharashtra">Maharashtra (महाराष्ट्र)</SelectItem><SelectItem value="Other">Other (इतर राज्य)</SelectItem></SelectContent>
                  </Select>
                  {!isOtherState && (
                    <>
                      <Select value={formData.district} onValueChange={(val) => handleSelectChange("district", val)}>
                        <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="जिल्हा निवडा" /></SelectTrigger>
                        <SelectContent>{districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                      </Select>
                      <Select value={formData.taluka} disabled={!formData.district} onValueChange={(val) => handleSelectChange("taluka", val)}>
                        <SelectTrigger className="h-10 rounded-xl"><SelectValue placeholder="तालुका निवडा" /></SelectTrigger>
                        <SelectContent>{talukas.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </>
                  )}
                  {isOtherState && (
                    <>
                      <Input placeholder="राज्याचे नाव" value={formData.state} onChange={e => handleInputChange("state", e.target.value)} className="rounded-xl h-10" />
                      <Input placeholder="जिल्ह्याचे नाव" value={formData.district} onChange={e => handleInputChange("district", e.target.value)} className="rounded-xl h-10" />
                      <Input placeholder="तालुक्याचे नाव" value={formData.taluka} onChange={e => handleInputChange("taluka", e.target.value)} className="rounded-xl h-10" />
                    </>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label className="text-xs">गाव</Label><Input value={formData.village} onChange={e => handleInputChange("village", e.target.value)} className="h-10 rounded-lg"/></div>
                    <div className="space-y-1"><Label className="text-xs">पिनकोड</Label><Input type="number" value={formData.pincode} onChange={e => handleInputChange("pincode", e.target.value)} className="h-10 rounded-lg"/></div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <Label className="font-bold text-primary flex items-center gap-2"><Users className="w-4 h-4" /> कुटुंबाची माहिती</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label className="text-xs">एकूण सदस्य</Label><Input type="number" value={formData.totalMembers} onChange={e => handleInputChange("totalMembers", e.target.value)} className="h-10 rounded-lg"/></div>
                    <div className="space-y-1"><Label className="text-xs">महिला</Label><Input type="number" value={formData.womenCount} onChange={e => handleInputChange("womenCount", e.target.value)} className="h-10 rounded-lg"/></div>
                    <div className="space-y-1"><Label className="text-xs">पुरुष</Label><Input type="number" value={formData.menCount} onChange={e => handleInputChange("menCount", e.target.value)} className="h-10 rounded-lg"/></div>
                    <div className="space-y-1"><Label className="text-xs">विद्यार्थी (१५-३५)</Label><Input type="number" value={formData.studentCount} onChange={e => handleInputChange("studentCount", e.target.value)} className="h-10 rounded-lg"/></div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="font-bold text-primary flex items-center gap-2"><Plane className="w-4 h-4" /> स्थलांतर माहिती</Label>
                    <Button size="sm" variant="ghost" onClick={addMigrationEntry} className="text-primary"><Plus className="w-4 h-4" /></Button>
                  </div>
                  {formData.migrationEntries.map((entry, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-xl space-y-3 relative group">
                      <Button variant="ghost" size="icon" onClick={() => removeMigrationEntry(index)} className="absolute top-1 right-1 h-6 w-6 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="w-3 h-3" /></Button>
                      <select className="w-full h-8 rounded-lg border text-xs bg-white" value={entry.reason} onChange={e => handleMigrationChange(index, "reason", e.target.value)}>
                        <option value="">कारण निवडा</option>
                        {MIGRATION_REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                      </select>
                      <Input list={`loc-prof-${index}`} placeholder="शहर..." value={entry.city} onChange={e => handleMigrationChange(index, "city", e.target.value)} className="h-8 text-xs bg-white"/>
                      <datalist id={`loc-prof-${index}`}>{allLocations.map(l => <option key={l} value={l} />)}</datalist>
                      <Input type="number" placeholder="संख्या" value={entry.count} onChange={e => handleMigrationChange(index, "count", e.target.value)} className="h-8 text-xs bg-white"/>
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
            
            <div className="space-y-6">
              {isCropsLoading ? (
                <div className="py-20 text-center text-muted-foreground">माहिती लोड होत आहे...</div>
              ) : cropCycles && cropCycles.length > 0 ? (
                cropCycles.map(crop => (
                  <Card key={crop.id} className="rounded-[2.5rem] shadow-xl border-none overflow-hidden bg-white">
                    <div className="bg-slate-50 p-6 border-b flex justify-between items-center">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">{crop.name} <span className="text-slate-400 text-lg font-normal">({crop.area} एकर)</span></h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{crop.season}</Badge>
                          <Badge className={crop.status === 'Growing' ? 'bg-blue-500' : 'bg-green-500'}>
                            {crop.status === 'Growing' ? 'वाढ चालू' : 'काढणी झाली'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">प्रगती</p>
                        <p className="text-2xl font-bold text-primary">{Math.round((crop.stagesCompleted?.length || 0) / STAGES.length * 100)}%</p>
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {STAGES.map(stage => {
                          const isDone = crop.stagesCompleted?.includes(stage.id);
                          return (
                            <div key={stage.id} className={`p-4 rounded-2xl border flex flex-col items-center text-center gap-2 ${isDone ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                              <stage.icon className={`w-6 h-6 ${isDone ? 'text-green-600' : 'text-slate-300'}`} />
                              <span className="text-[10px] font-bold leading-tight">{stage.label}</span>
                              {isDone && <CheckCircle2 className="w-4 h-4 text-green-600 mt-auto" />}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="p-12 text-center rounded-[2.5rem] border-dashed">
                  <Sprout className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-500 font-bold">अद्याप कोणतेही पीक जोडलेले नाही.</p>
                  <Button variant="link" onClick={() => setShowAddCrop(true)}>पहिले पीक जोडा</Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
