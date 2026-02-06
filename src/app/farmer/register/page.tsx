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
  ArrowLeft,
  Plane,
  Plus,
  Trash2,
  Globe,
  GraduationCap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useUser } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { locationData } from "@/lib/locations";

const steps = [
  { id: 1, name: "वैयक्तिक माहिती", icon: User },
  { id: 2, name: "शेतीची माहिती", icon: Sprout },
  { id: 3, name: "कुटुंबाची माहिती", icon: Users },
  { id: 4, name: "स्थलांतर माहिती", icon: Plane },
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

export default function FarmerRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isOtherState, setIsOtherState] = useState(false);
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: "", contactNumber: "", 
    recommendationName: "", recommendationContact: "",
    state: "Maharashtra", district: "", taluka: "", village: "", pincode: "",
    landArea: "", waterSources: [] as string[], 
    crops: [{ name: "", area: "" }],
    totalMembers: "", womenCount: "", menCount: "", studentCount: "",
    migrationEntries: [{ reason: "", city: "", count: "" }]
  });
  
  const { toast } = useToast();
  const db = useFirestore();
  const router = useRouter();

  const allLocations = useMemo(() => {
    const locations: string[] = [];
    const maharashtra = locationData["Maharashtra"];
    Object.keys(maharashtra).forEach(district => {
      locations.push(district);
      maharashtra[district].forEach(taluka => locations.push(taluka));
    });
    return Array.from(new Set(locations));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if ((id === "contactNumber" || id === "recommendationContact") && value.length > 10) return;
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
      const updated = sources.includes(label)
        ? sources.filter(s => s !== label)
        : [...sources, label];
      return { ...prev, waterSources: updated };
    });
  };

  const calculateTotalCropArea = () => {
    return formData.crops.reduce((acc, curr) => acc + (parseFloat(curr.area) || 0), 0);
  };

  const addCropField = () => {
    const totalArea = calculateTotalCropArea();
    const limit = parseFloat(formData.landArea) || 0;

    if (totalArea >= limit) {
      toast({ variant: "destructive", title: "जमीन शिल्लक नाही!", description: "तुमच्या एकूण जमिनीपेक्षा जास्त क्षेत्र तुम्ही जोडू शकत नाही." });
      return;
    }
    setFormData(prev => ({ ...prev, crops: [...prev.crops, { name: "", area: "" }] }));
  };

  const handleCropChange = (index: number, field: string, value: string) => {
    const newCrops = [...formData.crops];
    newCrops[index] = { ...newCrops[index], [field]: value };
    setFormData(prev => ({ ...prev, crops: newCrops }));
  };

  const handleMigrationChange = (index: number, field: string, value: string) => {
    const newEntries = [...formData.migrationEntries];
    if (field === "count") {
      const totalKutumb = parseInt(formData.totalMembers) || 0;
      const countVal = parseInt(value) || 0;
      if (countVal > totalKutumb) {
        toast({ variant: "destructive", title: "त्रुटी", description: "संख्या एकूण सदस्यांपेक्षा जास्त नको." });
        return;
      }
    }
    newEntries[index] = { ...newEntries[index], [field]: value };
    setFormData(prev => ({ ...prev, migrationEntries: newEntries }));
  };

  const handleNext = () => {
    if (currentStep === 1 && formData.contactNumber.length !== 10) {
      toast({ variant: "destructive", title: "त्रुटी", description: "मोबाईल नंबर १० अंकी हवा." });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!db) return;
    if (!user) {
      toast({ variant: "destructive", title: "लॉगिन आवश्यक", description: "माहिती साठवण्यासाठी कृपया आधी लॉगिन करा." });
      router.push("/login");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid, "profile", "farmerData"), {
        ...formData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: "नोंदणी यशस्वी!", description: "माहिती यशस्वीरित्या साठवण्यात आली आहे." });
      router.push("/profile");
    } catch (error) {
      toast({ variant: "destructive", title: "त्रुटी", description: "माहिती साठवताना अडचण आली." });
    }
  };

  const selectedStateData = locationData["Maharashtra"];
  const districts = selectedStateData ? Object.keys(selectedStateData) : [];
  const talukas = (!isOtherState && formData.district) ? selectedStateData[formData.district] : [];

  const activeStep = steps[currentStep - 1];
  const StepIcon = activeStep.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
            {steps.map((step) => (
              <div key={step.id} className={`flex flex-col items-center gap-2 ${currentStep >= step.id ? "text-primary" : "text-slate-400"}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${currentStep >= step.id ? "bg-primary text-white border-primary" : "bg-white border-slate-200"}`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold hidden sm:block">{step.name}</span>
              </div>
            ))}
          </div>

          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
            <div className="bg-primary p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">{activeStep.name}</h2>
                <p className="text-blue-100 mt-2">कृपया अचूक माहिती भरा.</p>
              </div>
              <div className="hidden md:block">
                <StepIcon className="w-16 h-16 opacity-20" />
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
                      <Label className="font-bold">राज्य</Label>
                      <Select value={isOtherState ? "Other" : "Maharashtra"} onValueChange={(val) => handleSelectChange("state", val)}>
                        <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="निवडा" /></SelectTrigger>
                        <SelectContent><SelectItem value="Maharashtra">Maharashtra</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                      </Select>
                    </div>
                    {isOtherState ? (
                      <>
                        <Field id="state" label="राज्याचे नाव" icon={Globe} value={formData.state} onChange={handleInputChange} />
                        <Field id="district" label="जिल्ह्याचे नाव" icon={MapPin} value={formData.district} onChange={handleInputChange} />
                        <Field id="taluka" label="तालुक्याचे नाव" icon={MapPin} value={formData.taluka} onChange={handleInputChange} />
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field id="village" label="गाव" icon={MapPin} value={formData.village} onChange={handleInputChange} />
                    <Field id="pincode" label="पिनकोड" icon={MapPin} type="number" value={formData.pincode} onChange={handleInputChange} />
                  </div>
                  <div className="pt-4 border-t">
                    <Label className="text-slate-500 text-xs font-bold uppercase mb-4 block">शिफारस</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field id="recommendationName" label="नाव" icon={User} value={formData.recommendationName} onChange={handleInputChange} />
                      <Field id="recommendationContact" label="मोबाईल नंबर" icon={Phone} type="number" value={formData.recommendationContact} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field id="landArea" label="एकूण जमीन क्षेत्र (एकर)" icon={Sprout} type="number" value={formData.landArea} onChange={handleInputChange} />
                    <div className="space-y-3">
                      <Label className="font-bold">पाण्याची सोय</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {WATER_SOURCES.map((source) => (
                          <div key={source.id} className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border">
                            <Checkbox id={source.id} checked={formData.waterSources?.includes(source.label)} onCheckedChange={() => handleWaterSourceChange(source.label)}/>
                            <label htmlFor={source.id} className="text-sm cursor-pointer">{source.label}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 border-t pt-6">
                    <Label className="font-bold text-lg">पीकनिहाय क्षेत्र माहिती</Label>
                    {formData.crops.map((crop, index) => (
                      <div key={index} className="flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                          <Label className="text-xs">पिकाचे नाव</Label>
                          <Input placeholder="उदा. आंबा" value={crop.name} onChange={(e) => handleCropChange(index, "name", e.target.value)} className="h-12 rounded-xl"/>
                        </div>
                        <div className="w-32 space-y-2">
                          <Label className="text-xs">क्षेत्र (एकर)</Label>
                          <Input type="number" placeholder="0.0" value={crop.area} onChange={(e) => handleCropChange(index, "area", e.target.value)} className="h-12 rounded-xl"/>
                        </div>
                        <Button variant="ghost" onClick={() => setFormData(prev => ({...prev, crops: prev.crops.filter((_,i) => i !== index)}))} className="text-red-500 h-12 w-12"><Trash2/></Button>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addCropField} className="w-full h-12 rounded-xl border-dashed gap-2"><Plus/> आणखी पीक जोडा</Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field id="totalMembers" label="एकूण सदस्य" icon={Users} type="number" value={formData.totalMembers} onChange={handleInputChange} />
                  <Field id="womenCount" label="महिलांची संख्या" icon={User} type="number" value={formData.womenCount} onChange={handleInputChange} />
                  <Field id="menCount" label="पुरुषांची संख्या" icon={User} type="number" value={formData.menCount} onChange={handleInputChange} />
                  <Field id="studentCount" label="विद्यार्थ्यांची संख्या (१५ ते ३५ वयोगट)" icon={GraduationCap} type="number" value={formData.studentCount} onChange={handleInputChange} />
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold text-lg">कुटुंबातील सदस्यांचे स्थलांतर</Label>
                    <Button onClick={() => setFormData(prev => ({...prev, migrationEntries: [...prev.migrationEntries, {reason:"", city:"", count:""}]}))} variant="outline" size="sm"><Plus/></Button>
                  </div>
                  {formData.migrationEntries.map((entry, index) => (
                    <Card key={index} className="p-4 bg-slate-50 relative">
                      <Button variant="ghost" onClick={() => setFormData(prev => ({...prev, migrationEntries: prev.migrationEntries.filter((_,i) => i !== index)}))} className="absolute top-2 right-2 text-red-400"><Trash2/></Button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">कारण</Label>
                          <Select value={entry.reason} onValueChange={(val) => handleMigrationChange(index, "reason", val)}>
                            <SelectTrigger className="bg-white"><SelectValue placeholder="निवडा"/></SelectTrigger>
                            <SelectContent>{MIGRATION_REASONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">शहर/ठिकाण</Label>
                          <Input list={`locs-${index}`} value={entry.city} onChange={(e) => handleMigrationChange(index, "city", e.target.value)} className="bg-white"/>
                          <datalist id={`locs-${index}`}>{allLocations.map(l => <option key={l} value={l}/>)}</datalist>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">संख्या</Label>
                          <Input type="number" value={entry.count} onChange={(e) => handleMigrationChange(index, "count", e.target.value)} className="bg-white"/>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <div className="mt-12 flex justify-between gap-4">
                <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1} className="rounded-xl px-8 h-12">मागे</Button>
                {currentStep < steps.length ? (
                  <Button onClick={handleNext} className="bg-primary px-8 h-12">पुढे जा <ArrowRight/></Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-green-600 px-12 h-12 text-white">नोंदणी पूर्ण करा</Button>
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
      <Label htmlFor={id} className="font-bold">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input id={id} type={type} value={value} onChange={onChange} className="pl-12 h-12 rounded-xl bg-slate-50" />
      </div>
    </div>
  );
}