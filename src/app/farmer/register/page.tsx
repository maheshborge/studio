
"use client";

import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  User, 
  MapPin, 
  Phone, 
  Sprout, 
  Users, 
  ArrowRight, 
  Plus,
  Trash2,
  Globe,
  GraduationCap,
  Calendar,
  Tag,
  Briefcase,
  Building
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser } from "@/firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { locationData } from "@/lib/locations";
import { addDays, format } from "date-fns";

const steps = [
  { id: 1, name: "वैयक्तिक माहिती", icon: User },
  { id: 2, name: "शेतीची माहिती", icon: Sprout },
  { id: 3, name: "कुटुंबाची माहिती", icon: Users },
  { id: 4, name: "स्थलांतर माहिती", icon: GraduationCap },
];

const CROP_CATEGORIES = [
  { id: "fruits", label: "फळे", days: 90 },
  { id: "vegetables", label: "भाजीपाला", days: 50 },
  { id: "grains", label: "धान्ये", days: 90 },
  { id: "spices", label: "मसाले", days: 70 },
  { id: "flowers", label: "फुले", days: 70 }
];

export default function FarmerRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "", contactNumber: "", 
    recommendationName: "", recommendationContact: "",
    state: "Maharashtra", district: "", taluka: "", village: "", pincode: "",
    landArea: "", waterSources: [] as string[], 
    crops: [{ name: "", variety: "", category: "grains", area: "", startDate: format(new Date(), "yyyy-MM-dd") }],
    totalMembers: "", womenCount: "", menCount: "", studentCount: "",
    migrationEntries: [{ reason: "", city: "", count: "" }]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCropChange = (index: number, field: string, value: string) => {
    const newCrops = [...formData.crops];
    newCrops[index] = { ...newCrops[index], [field]: value };
    setFormData(prev => ({ ...prev, crops: newCrops }));
  };

  const handleMigrationChange = (index: number, field: string, value: string) => {
    const newEntries = [...formData.migrationEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setFormData(prev => ({ ...prev, migrationEntries: newEntries }));
  };

  const addMigrationEntry = () => {
    setFormData(prev => ({
      ...prev,
      migrationEntries: [...prev.migrationEntries, { reason: "", city: "", count: "" }]
    }));
  };

  const removeMigrationEntry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      migrationEntries: prev.migrationEntries.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!db || !user) return;

    try {
      // 1. Save main farmer profile
      await setDoc(doc(db, "users", user.uid, "profile", "farmerData"), {
        ...formData,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 2. Save individual crop cycles
      for (const crop of formData.crops) {
        if (!crop.name) continue;
        const categoryData = CROP_CATEGORIES.find(c => c.id === crop.category);
        const maturityDays = categoryData?.days || 90;
        const expectedHarvest = addDays(new Date(crop.startDate), maturityDays);

        await addDoc(collection(db, "users", user.uid, "cropCycles"), {
          name: crop.name,
          variety: crop.variety,
          category: crop.category,
          area: parseFloat(crop.area) || 0,
          startDate: crop.startDate,
          expectedHarvestDate: format(expectedHarvest, "yyyy-MM-dd"),
          estimatedYield: (parseFloat(crop.area) || 0) * 2.5, // Standard estimate multiplier
          status: "growing",
          farmerId: user.uid,
          farmerDistrict: formData.district,
          farmerName: formData.name
        });
      }

      toast({ title: "नोंदणी यशस्वी!", description: "तुमची शेती आणि पीक माहिती साठवण्यात आली आहे." });
      router.push("/profile");
    } catch (error) {
      toast({ variant: "destructive", title: "त्रुटी", description: "माहिती साठवताना अडचण आली." });
    }
  };

  const districts = Object.keys(locationData["Maharashtra"] || {});
  const talukas = formData.district ? locationData["Maharashtra"][formData.district] : [];

  const activeStep = steps[currentStep - 1];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
            <div className="bg-primary p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">{activeStep.name}</h2>
                <p className="text-blue-100 mt-2">मिडास पीक व्यवस्थापन</p>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl">
                <activeStep.icon className="w-8 h-8" />
              </div>
            </div>
            
            <CardContent className="p-8 md:p-12">
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field id="name" label="शेतकऱ्याचे पूर्ण नाव" icon={User} value={formData.name} onChange={handleInputChange} />
                    <Field id="contactNumber" label="संपर्क क्रमांक" icon={Phone} type="number" value={formData.contactNumber} onChange={handleInputChange} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">जिल्हा</Label>
                      <Select value={formData.district} onValueChange={(val) => handleSelectChange("district", val)}>
                        <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="निवडा" /></SelectTrigger>
                        <SelectContent>{districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">तालुका</Label>
                      <Select value={formData.taluka} disabled={!formData.district} onValueChange={(val) => handleSelectChange("taluka", val)}>
                        <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="निवडा" /></SelectTrigger>
                        <SelectContent>{talukas.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <Field id="village" label="गाव" icon={MapPin} value={formData.village} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <Field id="landArea" label="एकूण जमीन क्षेत्र (एकर)" icon={Sprout} type="number" value={formData.landArea} onChange={handleInputChange} />
                  
                  <div className="space-y-6 border-t pt-6">
                    <Label className="font-bold text-lg">पीक तपशील व लागवड तारीख</Label>
                    {formData.crops.map((crop, index) => (
                      <Card key={index} className="p-6 bg-slate-50 border-none rounded-2xl relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold">पिकाचा प्रकार</Label>
                            <Select value={crop.category} onValueChange={(val) => handleCropChange(index, "category", val)}>
                              <SelectTrigger className="bg-white h-12 rounded-xl"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {CROP_CATEGORIES.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold">पिकाचे नाव</Label>
                            <Input placeholder="उदा. आंबा" value={crop.name} onChange={(e) => handleCropChange(index, "name", e.target.value)} className="bg-white h-12 rounded-xl"/>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold">व्हारायटी (जात)</Label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input placeholder="उदा. केसर" value={crop.variety} onChange={(e) => handleCropChange(index, "variety", e.target.value)} className="bg-white h-12 rounded-xl pl-10"/>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold">तारीख (लागण/छाटणी)</Label>
                            <Input type="date" value={crop.startDate} onChange={(e) => handleCropChange(index, "startDate", e.target.value)} className="bg-white h-12 rounded-xl"/>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-bold">क्षेत्र (एकर)</Label>
                            <div className="flex gap-2">
                              <Input type="number" placeholder="0.0" value={crop.area} onChange={(e) => handleCropChange(index, "area", e.target.value)} className="bg-white h-12 rounded-xl"/>
                              <Button variant="ghost" onClick={() => setFormData(prev => ({...prev, crops: prev.crops.filter((_,i) => i !== index)}))} className="text-red-500 h-12 w-12 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"><Trash2/></Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    <Button variant="outline" onClick={() => setFormData(prev => ({...prev, crops: [...prev.crops, {name:"", variety: "", category:"grains", area:"", startDate: format(new Date(), "yyyy-MM-dd")}]}))} className="w-full h-14 rounded-2xl border-dashed border-primary/30 text-primary gap-2 hover:bg-primary/5"><Plus/> नवीन पीक जोडा</Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-primary border-b pb-2">कुटुंबाची माहिती</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field id="totalMembers" label="एकूण कुटुंब सदस्य संख्या" icon={Users} type="number" value={formData.totalMembers} onChange={handleInputChange} />
                    <Field id="womenCount" label="महिलांची संख्या" icon={Users} type="number" value={formData.womenCount} onChange={handleInputChange} />
                    <Field id="menCount" label="पुरुषांची संख्या" icon={Users} type="number" value={formData.menCount} onChange={handleInputChange} />
                    <Field id="studentCount" label="विद्यार्थ्यांची संख्या" icon={GraduationCap} type="number" value={formData.studentCount} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <h3 className="text-xl font-bold text-primary border-b pb-2">स्थलांतर माहिती</h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {formData.migrationEntries.map((entry, index) => (
                      <Card key={index} className="p-8 bg-slate-50 border-none rounded-[2rem] shadow-sm relative animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-bold flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-primary" /> स्थलांतराचे कारण
                            </Label>
                            <Input 
                              placeholder="उदा. शिक्षण, नोकरी" 
                              value={entry.reason} 
                              onChange={(e) => handleMigrationChange(index, "reason", e.target.value)} 
                              className="bg-white h-12 rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold flex items-center gap-2">
                              <Building className="w-4 h-4 text-primary" /> गाव / शहर
                            </Label>
                            <Input 
                              placeholder="उदा. पुणे, मुंबई" 
                              value={entry.city} 
                              onChange={(e) => handleMigrationChange(index, "city", e.target.value)} 
                              className="bg-white h-12 rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-bold flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary" /> सदस्य संख्या
                            </Label>
                            <div className="flex gap-3">
                              <Input 
                                type="number" 
                                placeholder="0" 
                                value={entry.count} 
                                onChange={(e) => handleMigrationChange(index, "count", e.target.value)} 
                                className="bg-white h-12 rounded-xl"
                              />
                              <Button 
                                variant="ghost" 
                                onClick={() => removeMigrationEntry(index)}
                                className="text-red-500 h-12 w-12 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors shrink-0"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Button 
                      variant="outline" 
                      onClick={addMigrationEntry}
                      className="w-full h-16 rounded-2xl border-dashed border-primary/30 text-primary gap-2 hover:bg-primary/5 font-bold"
                    >
                      <Plus className="w-6 h-6" /> नवीन स्थलांतर माहिती जोडा
                    </Button>

                    <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-blue-800 leading-relaxed font-medium">
                        तुमच्या कुटुंबातील सदस्य कामासाठी किंवा शिक्षणासाठी बाहेर गावी जात असल्यास त्याची माहिती भरा. यामुळे आम्हाला तुमच्या कुटुंबाच्या गरजा अधिक चांगल्या प्रकारे समजतील.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-12 flex justify-between gap-4">
                <Button variant="outline" onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))} disabled={currentStep === 1} className="rounded-xl px-8 h-12 font-bold">मागे</Button>
                {currentStep < steps.length ? (
                  <Button onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length))} className="bg-primary px-8 h-12 rounded-xl font-bold shadow-lg shadow-primary/20">पुढे जा <ArrowRight className="ml-2 w-4 h-4"/></Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 px-12 h-12 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all hover:scale-105 active:scale-95">नोंदणी पूर्ण करा</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Field({ id, label, icon: Icon, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="font-bold text-slate-700">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input id={id} type={type} value={value} onChange={onChange} className="pl-12 h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
      </div>
    </div>
  );
}
