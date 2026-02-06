"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  MapPin, 
  Phone, 
  Sprout, 
  Droplets, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Plane,
  Plus,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { locationData } from "@/lib/locations";

const steps = [
  { id: 1, name: "वैयक्तिक माहिती", icon: User },
  { id: 2, name: "शेतीची माहिती", icon: Sprout },
  { id: 3, name: "कुटुंबाची माहिती", icon: Users },
  { id: 4, name: "स्थलांतर माहिती", icon: Plane },
];

const WATER_SOURCES = ["बोअरवेल १", "बोअरवेल २", "शेततळे", "इरिगेशन स्कीम"];

export default function FarmerRegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", contactNumber: "", 
    recommendationName: "", recommendationContact: "",
    state: "Maharashtra", district: "", taluka: "", village: "", pincode: "",
    landArea: "4", waterSource: "", 
    crops: [{ name: "", area: "" }],
    totalMembers: "", womenCount: "", menCount: "", studentCount: "",
    migrationEducation: "", migrationJob: "", migrationMarriage: ""
  });
  
  const { toast } = useToast();
  const db = useFirestore();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    // Limit contact numbers to 10 digits
    if ((id === "contactNumber" || id === "recommendationContact") && value.length > 10) return;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => {
      const updates: any = { [id]: value };
      if (id === "state") { updates.district = ""; updates.taluka = ""; }
      if (id === "district") { updates.taluka = ""; }
      return { ...prev, ...updates };
    });
  };

  const addCropField = () => {
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

  const handleCropChange = (index: number, field: string, value: string) => {
    const newCrops = [...formData.crops];
    newCrops[index] = { ...newCrops[index], [field]: value };
    setFormData(prev => ({ ...prev, crops: newCrops }));
  };

  const calculateTotalCropArea = () => {
    return formData.crops.reduce((acc, curr) => acc + (parseFloat(curr.area) || 0), 0);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (formData.contactNumber.length !== 10) {
        toast({ variant: "destructive", title: "त्रुटी", description: "मोबाईल नंबर १० अंकी असणे आवश्यक आहे." });
        return;
      }
    }
    if (currentStep === 2) {
      const totalArea = calculateTotalCropArea();
      if (totalArea > parseFloat(formData.landArea)) {
        toast({
          variant: "destructive",
          title: "त्रुटी",
          description: `पिकांचे एकूण क्षेत्र (${totalArea} एकर) तुमच्या जमिनीपेक्षा (${formData.landArea} एकर) जास्त आहे.`
        });
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!db) return;
    if (formData.contactNumber.length !== 10) {
      toast({ variant: "destructive", title: "त्रुटी", description: "मोबाईल नंबर १० अंकी असणे आवश्यक आहे." });
      return;
    }
    try {
      const farmerId = crypto.randomUUID();
      const userId = "demo-user"; 
      await setDoc(doc(db, "users", userId, "farmers", farmerId), {
        id: farmerId,
        ...formData,
        createdAt: new Date().toISOString()
      });
      toast({ title: "नोंदणी यशस्वी!", description: "शेतकऱ्याची माहिती यशस्वीरित्या साठवण्यात आली आहे." });
      router.push("/");
    } catch (error) {
      toast({ variant: "destructive", title: "त्रुटी", description: "माहिती साठवताना अडचण आली." });
    }
  };

  const selectedStateData = (locationData as any)[formData.state];
  const districts = selectedStateData ? Object.keys(selectedStateData) : [];
  const talukas = (formData.district && selectedStateData) ? selectedStateData[formData.district] : [];

  const StepIcon = steps[currentStep - 1].icon;

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
            <div className="bg-primary p-8 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold flex items-center gap-3">{steps[currentStep - 1].name}</h2>
                  <p className="text-blue-100 mt-2">कृपया अचूक माहिती भरा.</p>
                </div>
                <StepIcon className="w-16 h-16 opacity-20" />
              </div>
            </div>
            
            <CardContent className="p-8 md:p-12">
              {currentStep === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field id="name" label="शेतकऱ्याचे पूर्ण नाव" icon={User} value={formData.name} onChange={handleInputChange} />
                    <Field id="contactNumber" label="संपर्क क्रमांक" icon={Phone} type="number" value={formData.contactNumber} onChange={handleInputChange} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="font-bold">राज्य</Label>
                      <Select value={formData.state} onValueChange={(val) => handleSelectChange("state", val)}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="निवडा" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(locationData).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">जिल्हा</Label>
                      <Select value={formData.district} disabled={!formData.state} onValueChange={(val) => handleSelectChange("district", val)}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="निवडा" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold">तालुका</Label>
                      <Select value={formData.taluka} disabled={!formData.district} onValueChange={(val) => handleSelectChange("taluka", val)}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="निवडा" />
                        </SelectTrigger>
                        <SelectContent>
                          {talukas.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field id="village" label="गाव" icon={MapPin} value={formData.village} onChange={handleInputChange} />
                    <Field id="pincode" label="पिनकोड" icon={MapPin} value={formData.pincode} onChange={handleInputChange} />
                  </div>

                  <div className="pt-4 border-t">
                    <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4 block">शिफारस (कोणी सुचवले?)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field id="recommendationName" label="शिफारस करणाऱ्याचे नाव" icon={User} value={formData.recommendationName} onChange={handleInputChange} />
                      <Field id="recommendationContact" label="मोबाईल नंबर" icon={Phone} type="number" value={formData.recommendationContact} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field id="landArea" label="एकूण जमीन क्षेत्र (एकर)" icon={Sprout} value={formData.landArea} onChange={handleInputChange} readOnly />
                    
                    <div className="space-y-2">
                      <Label className="font-bold">पाण्याची सोय</Label>
                      <Select value={formData.waterSource} onValueChange={(val) => handleSelectChange("waterSource", val)}>
                        <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50">
                          <SelectValue placeholder="निवडा" />
                        </SelectTrigger>
                        <SelectContent>
                          {WATER_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <Label className="font-bold text-lg">पीकनिहाय क्षेत्र माहिती</Label>
                      <div className="text-sm font-bold text-slate-500">
                        शिल्लक क्षेत्र: {parseFloat(formData.landArea) - calculateTotalCropArea()} एकर
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.crops.map((crop, index) => (
                        <div key={index} className="flex gap-4 items-end animate-in fade-in zoom-in-95">
                          <div className="flex-1 space-y-2">
                            <Label className="text-xs">पिकाचे नाव</Label>
                            <Input 
                              placeholder="उदा. आंबा" 
                              value={crop.name}
                              onChange={(e) => handleCropChange(index, "name", e.target.value)}
                              className="h-12 rounded-xl bg-slate-50"
                            />
                          </div>
                          <div className="w-32 space-y-2">
                            <Label className="text-xs">क्षेत्र (एकर)</Label>
                            <Input 
                              type="number"
                              placeholder="0.0" 
                              value={crop.area}
                              onChange={(e) => handleCropChange(index, "area", e.target.value)}
                              className="h-12 rounded-xl bg-slate-50"
                            />
                          </div>
                          {formData.crops.length > 1 && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeCropField(index)}
                              className="text-red-500 hover:bg-red-50 h-12 w-12 rounded-xl"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button 
                      variant="outline" 
                      onClick={addCropField}
                      className="w-full h-12 rounded-xl border-dashed border-2 gap-2 text-primary hover:bg-primary/5"
                    >
                      <Plus className="w-5 h-5" /> आणखी पीक जोडा
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field id="totalMembers" label="एकूण सदस्य" icon={Users} type="number" value={formData.totalMembers} onChange={handleInputChange} />
                    <Field id="womenCount" label="महिलांची संख्या" icon={Users} type="number" value={formData.womenCount} onChange={handleInputChange} />
                    <Field id="menCount" label="पुरुषांची संख्या" icon={Users} type="number" value={formData.menCount} onChange={handleInputChange} />
                    <Field id="studentCount" label="विद्यार्थ्यांची संख्या" icon={Users} type="number" value={formData.studentCount} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="grid grid-cols-1 gap-6">
                    <Field id="migrationEducation" label="शिक्षणासाठी स्थलांतर" icon={Plane} value={formData.migrationEducation} onChange={handleInputChange} />
                    <Field id="migrationJob" label="नोकरीसाठी स्थलांतर" icon={Plane} value={formData.migrationJob} onChange={handleInputChange} />
                    <Field id="migrationMarriage" label="लग्नासाठी स्थलांतर" icon={Plane} value={formData.migrationMarriage} onChange={handleInputChange} />
                  </div>
                </div>
              )}

              <div className="mt-12 flex justify-between gap-4">
                <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1} className="rounded-xl px-8 h-12 font-bold">
                  <ArrowLeft className="mr-2 w-4 h-4" /> मागे
                </Button>
                {currentStep < steps.length ? (
                  <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 rounded-xl px-8 h-12 font-bold">
                    पुढे जा <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 rounded-xl px-12 h-12 font-bold text-white shadow-lg shadow-green-200">
                    नोंदणी पूर्ण करा
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Field({ id, label, icon: Icon, value, onChange, type = "text", readOnly = false }: any) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-700 font-bold">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input 
          id={id} 
          type={type} 
          value={value || ""} 
          onChange={onChange} 
          placeholder={`${label} भरा...`} 
          readOnly={readOnly}
          className={`pl-12 h-12 rounded-xl border-slate-200 focus:ring-primary bg-slate-50 ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`} 
        />
      </div>
    </div>
  );
}
