"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Sprout, 
  Users, 
  Plane,
  Save,
  Loader2,
  LogOut,
  MapPin,
  Phone,
  CheckCircle2,
  Droplets,
  TrendingUp,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { useAuth, useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

const steps = [
  { id: 1, name: "वैयक्तिक माहिती", icon: User },
  { id: 2, name: "शेतीची माहिती", icon: Sprout },
  { id: 3, name: "कुटुंबाची माहिती", icon: Users },
  { id: 4, name: "स्थलांतर माहिती", icon: Plane },
];

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const farmerRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "farmerData");
  }, [db, user]);

  const { data: farmerData, isLoading: isDataLoading } = useDoc(farmerRef);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "", address: "", contactNumber: "", recommendation: "",
    landArea: "", waterSource: "", cropArea: "", production: "",
    totalMembers: "", womenCount: "", menCount: "", studentCount: "",
    migrationEducation: "", migrationJob: "", migrationMarriage: ""
  });

  useEffect(() => {
    if (farmerData) {
      setFormData(prev => ({ ...prev, ...farmerData }));
    }
  }, [farmerData]);

  if (isUserLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!db || !user) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid, "profile", "farmerData"), {
        ...formData,
        updatedAt: new Date().toISOString(),
        userId: user.uid
      });
      toast({
        title: "प्रोफाईल अपडेट झाली!",
        description: "तुमची माहिती यशस्वीरित्या साठवण्यात आली आहे.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "त्रुटी",
        description: error.message || "माहिती साठवताना अडचण आली.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const CurrentStepIcon = steps[currentStep - 1].icon;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
              <User className="w-8 h-8" /> तुमची प्रोफाईल
            </h1>
            <Button variant="ghost" onClick={handleLogout} className="text-destructive font-bold gap-2">
              <LogOut className="w-4 h-4" /> लॉग आउट
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-12 relative px-4">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2" />
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`flex flex-col items-center gap-2 z-10`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 cursor-pointer transition-all ${currentStep >= step.id ? "bg-primary text-white border-primary scale-110" : "bg-white border-slate-200 text-slate-400"}`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold hidden sm:block ${currentStep >= step.id ? "text-primary" : "text-slate-400"}`}>{step.name}</span>
              </div>
            ))}
          </div>

          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-white">
            <div className="bg-primary p-8 text-white flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  {steps[currentStep - 1].name}
                </h2>
                <p className="text-blue-100 mt-2">कृपया अचूक माहिती भरा आणि साठवा.</p>
              </div>
              <div className="hidden md:block">
                <CurrentStepIcon className="w-16 h-16 opacity-20" />
              </div>
            </div>
            
            <CardContent className="p-8 md:p-12">
              {isDataLoading ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
              ) : (
                <>
                  {currentStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4">
                      <Field id="name" label="शेतकऱ्याचे पूर्ण नाव" icon={User} value={formData.name} onChange={handleInputChange} />
                      <Field id="contactNumber" label="संपर्क क्रमांक" icon={Phone} value={formData.contactNumber} onChange={handleInputChange} />
                      <div className="md:col-span-2">
                        <Field id="address" label="पत्ता (गाव, तालुका, जिल्हा)" icon={MapPin} value={formData.address} onChange={handleInputChange} />
                      </div>
                      <div className="md:col-span-2">
                        <Field id="recommendation" label="शिफारस (कोणी सुचवले?)" icon={CheckCircle2} value={formData.recommendation} onChange={handleInputChange} />
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4">
                      <Field id="landArea" label="एकूण जमीन क्षेत्र (एकर)" icon={Sprout} value={formData.landArea} onChange={handleInputChange} />
                      <Field id="waterSource" label="पाण्याची सोय" icon={Droplets} value={formData.waterSource} onChange={handleInputChange} />
                      <Field id="cropArea" label="पीकनिहाय क्षेत्र" icon={TrendingUp} value={formData.cropArea} onChange={handleInputChange} />
                      <Field id="production" label="अंदाजित वार्षिक उत्पादन" icon={TrendingUp} value={formData.production} onChange={handleInputChange} />
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4">
                      <Field id="totalMembers" label="एकूण सदस्य" icon={Users} type="number" value={formData.totalMembers} onChange={handleInputChange} />
                      <Field id="womenCount" label="महिलांची संख्या" icon={Users} type="number" value={formData.womenCount} onChange={handleInputChange} />
                      <Field id="menCount" label="पुरुषांची संख्या" icon={Users} type="number" value={formData.menCount} onChange={handleInputChange} />
                      <Field id="studentCount" label="विद्यार्थ्यांची संख्या" icon={Users} type="number" value={formData.studentCount} onChange={handleInputChange} />
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-right-4">
                      <Field id="migrationEducation" label="शिक्षणासाठी स्थलांतर (उद्देश)" icon={Plane} value={formData.migrationEducation} onChange={handleInputChange} />
                      <Field id="migrationJob" label="नोकरीसाठी स्थलांतर" icon={Plane} value={formData.migrationJob} onChange={handleInputChange} />
                      <Field id="migrationMarriage" label="लग्नासाठी स्थलांतर" icon={Plane} value={formData.migrationMarriage} onChange={handleInputChange} />
                    </div>
                  )}

                  <div className="mt-12 flex flex-wrap justify-between gap-4">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                        className="rounded-xl px-6 h-12 font-bold"
                      >
                        <ArrowLeft className="mr-2 w-4 h-4" /> मागे
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleNext}
                        disabled={currentStep === steps.length}
                        className="rounded-xl px-6 h-12 font-bold"
                      >
                        पुढे <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700 rounded-xl px-10 h-12 font-bold text-white shadow-lg shadow-green-200"
                    >
                      {isSaving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />} माहिती साठवा
                    </Button>
                  </div>
                </>
              )}
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
      <Label htmlFor={id} className="text-slate-700 font-bold">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input 
          id={id} 
          type={type}
          value={value || ""}
          onChange={onChange}
          placeholder={`${label} भरा...`} 
          className="pl-12 h-12 rounded-xl border-slate-200 focus:ring-primary bg-slate-50"
        />
      </div>
    </div>
  );
}
