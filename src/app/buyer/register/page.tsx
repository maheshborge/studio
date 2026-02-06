
"use client";

import { useState, useEffect } from "react";
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
  ShoppingBag,
  IdCard,
  FileText,
  Building2,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

const BUYER_CATEGORIES = [
  { value: "trader", label: "व्यापारी (Trader)" },
  { value: "hotel", label: "हॉटेल (Hotel)" },
  { value: "society", label: "सोसायटी (Society)" },
  { value: "process_center", label: "प्रक्रिया केंद्र (Process Center)" }
];

const ID_TYPES = [
  { value: "aadhaar", label: "आधार कार्ड" },
  { value: "pan", label: "पॅन कार्ड" },
  { value: "voting", label: "मतदान कार्ड" }
];

const LICENSE_TYPES = [
  { value: "fssai", label: "FSSAI परवाना" },
  { value: "shop_act", label: "शॉप अ‍ॅक्ट" },
  { value: "market_committee", label: "बाजार समिती परवाना" },
  { value: "gst", label: "GST नंबर" }
];

const PURCHASE_TYPES = [
  { id: "fruits", label: "फळे" },
  { id: "veg", label: "भाजीपाला" },
  { id: "flowers", label: "फुले" },
  { id: "grains", label: "धान्य" },
  { id: "spices", label: "मसाले" },
  { id: "onion_potato", label: "कांदा - बटाटा" },
  { id: "animals", label: "जनावरे" }
];

export default function BuyerRegistrationPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  // Fetch logged-in user's profile to pre-fill contact info
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "main");
  }, [db, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  const [formData, setFormData] = useState({
    orgName: "",
    contactName: "",
    contactNumber: "",
    address: "",
    recommendationName: "",
    recommendationContact: "",
    category: "",
    idType: "",
    idNumber: "",
    licenseType: "",
    licenseNumber: "",
    purchaseTypes: [] as string[]
  });

  // Effect to pre-fill contact info once profile is loaded
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        contactName: profile.name || "",
        contactNumber: profile.mobile || ""
      }));
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if ((id === "contactNumber" || id === "recommendationContact") && value.length > 10) return;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePurchaseTypeChange = (id: string) => {
    setFormData(prev => {
      const current = prev.purchaseTypes;
      const updated = current.includes(id) 
        ? current.filter(t => t !== id)
        : [...current, id];
      return { ...prev, purchaseTypes: updated };
    });
  };

  const handleSubmit = async () => {
    if (!db || !user) return;
    
    if (!formData.orgName) {
      toast({ variant: "destructive", title: "त्रुटी", description: "संस्था/कंपनीचे नाव आवश्यक आहे." });
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid, "profile", "buyerData"), {
        ...formData,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      toast({
        title: "नोंदणी यशस्वी!",
        description: "तुमची खरेदीदार माहिती सुरक्षितपणे साठवण्यात आली आहे.",
      });
      router.push("/profile");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "त्रुटी",
        description: "माहिती साठवताना अडचण आली.",
      });
    }
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
        <p className="text-slate-500 font-bold">माहिती लोड होत आहे...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
            <div className="bg-primary p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <ShoppingBag className="w-8 h-8" /> खरेदीदार नोंदणी
                </h2>
                <p className="text-blue-100 mt-2">व्यापारी, हॉटेल किंवा संस्थांसाठी तपशील भरा.</p>
              </div>
              <div className="hidden md:block opacity-20">
                <Building2 className="w-16 h-16" />
              </div>
            </div>
            
            <CardContent className="p-8 md:p-12 space-y-10">
              {/* संस्था माहिती */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2 border-b pb-2">
                  <Building2 className="w-5 h-5" /> संस्था / आस्थापना माहिती
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <Field 
                    id="orgName" 
                    label="संस्था / आस्थापना / कंपनीचे नाव" 
                    icon={Building2} 
                    value={formData.orgName} 
                    onChange={handleInputChange} 
                    placeholder="उदा. श्री गणेश ट्रेडर्स किंवा स्वतःचे नाव"
                  />
                </div>
              </div>

              {/* संपर्क व्यक्ती माहिती - Variable based on Login */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2 border-b pb-2">
                  <User className="w-5 h-5" /> संपर्क व्यक्ती माहिती
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field 
                    id="contactName" 
                    label="लॉगिन केलेल्या व्यक्तीचे नाव" 
                    icon={User} 
                    value={formData.contactName} 
                    onChange={handleInputChange}
                    readOnly
                    helperText="खात्यातून घेतलेले नाव"
                  />
                  <Field 
                    id="contactNumber" 
                    label="संपर्क क्रमांक (मोबाईल)" 
                    icon={Phone} 
                    value={formData.contactNumber} 
                    onChange={handleInputChange}
                    readOnly
                    helperText="खात्यातून घेतलेला नंबर"
                  />
                  <div className="md:col-span-2">
                    <Field 
                      id="address" 
                      label="पत्ता (पूर्ण पत्ता)" 
                      icon={MapPin} 
                      value={formData.address} 
                      onChange={handleInputChange} 
                      placeholder="उदा. मु. पो. ..., जिल्हा ..."
                    />
                  </div>
                </div>
              </div>

              {/* खरेदीदार कॅटेगरी */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2 border-b pb-2">
                  <ShoppingBag className="w-5 h-5" /> खरेदीदार कॅटेगरी व प्रकार
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold">कॅटेगरी निवडा</Label>
                    <Select onValueChange={(val) => setFormData(prev => ({...prev, category: val}))}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50">
                        <SelectValue placeholder="निवडा" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUYER_CATEGORIES.map(cat => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="font-bold">खरेदी प्रकार (एक किंवा अधिक निवडा)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {PURCHASE_TYPES.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2 bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-primary/30 transition-colors">
                        <Checkbox 
                          id={type.id} 
                          checked={formData.purchaseTypes.includes(type.id)}
                          onCheckedChange={() => handlePurchaseTypeChange(type.id)}
                        />
                        <label htmlFor={type.id} className="text-sm font-medium cursor-pointer">{type.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* परवाना नोंदणी */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2 border-b pb-2">
                  <FileText className="w-5 h-5" /> परवाना व ओळखपत्र नोंदणी
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold">ओळखपत्र निवडा</Label>
                    <Select onValueChange={(val) => setFormData(prev => ({...prev, idType: val}))}>
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50">
                        <SelectValue placeholder="निवडा" />
                      </SelectTrigger>
                      <SelectContent>
                        {ID_TYPES.map(id => <SelectItem key={id.value} value={id.value}>{id.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Field id="idNumber" label="ओळखपत्र क्रमांक" icon={IdCard} value={formData.idNumber} onChange={handleInputChange} />
                  
                  <div className="space-y-2">
                    <Label className="font-bold">परवाना निवडा</Label>
                    <Select onValueChange={(val) => setFormData(prev => ({...prev, licenseType: val}))}>
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50">
                        <SelectValue placeholder="निवडा" />
                      </SelectTrigger>
                      <SelectContent>
                        {LICENSE_TYPES.map(lic => <SelectItem key={lic.value} value={lic.value}>{lic.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Field id="licenseNumber" label="परवाना क्रमांक" icon={FileText} value={formData.licenseNumber} onChange={handleInputChange} />
                </div>
              </div>

              {/* शिफारस */}
              <div className="pt-6 border-t">
                <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-6 block">शिफारस (कोणी सुचवले?)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field id="recommendationName" label="शिफारस करणाऱ्याचे नाव" icon={User} value={formData.recommendationName} onChange={handleInputChange} placeholder="उदा. अमोल पाटील" />
                  <Field id="recommendationContact" label="मोबाईल नंबर" icon={Phone} type="number" value={formData.recommendationContact} onChange={handleInputChange} placeholder="उदा. 9876543210" />
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                className="w-full bg-primary hover:bg-primary/90 rounded-2xl h-16 font-bold text-xl shadow-lg shadow-primary/20 gap-2 mt-8 transition-all hover:scale-[1.01]"
              >
                माहिती साठवा <ArrowRight className="w-6 h-6" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function Field({ id, label, icon: Icon, value, onChange, type = "text", placeholder = "", readOnly = false, helperText = "" }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={id} className="text-slate-700 font-bold">{label}</Label>
        {helperText && <span className="text-[10px] text-slate-400 font-medium italic">{helperText}</span>}
      </div>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input 
          id={id} 
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`pl-12 h-12 rounded-xl border-slate-200 focus:ring-primary transition-all ${readOnly ? 'bg-slate-100 cursor-not-allowed border-dashed' : 'bg-slate-50 hover:bg-white focus:bg-white'}`}
        />
      </div>
    </div>
  );
}
