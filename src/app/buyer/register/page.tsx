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
  ShoppingBag,
  Tag,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useFirestore } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function BuyerRegistrationPage() {
  const [formData, setFormData] = useState({
    name: "", address: "", contactNumber: "", 
    recommendationName: "", recommendationContact: "",
    category: "", purchaseType: ""
  });
  
  const { toast } = useToast();
  const router = useRouter();
  const db = useFirestore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!db) return;
    try {
      const buyerId = crypto.randomUUID();
      const userId = "demo-user";
      
      await setDoc(doc(db, "users", userId, "buyers", buyerId), {
        id: buyerId,
        ...formData,
        createdAt: new Date().toISOString()
      });

      toast({
        title: "खरेदीदार नोंदणी यशस्वी!",
        description: "माहिती यशस्वीरित्या साठवण्यात आली आहे.",
      });
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "त्रुटी",
        description: "नोंदणी करताना अडचण आली.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
            <div className="bg-blue-600 p-8 text-white">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                खरेदीदार नोंदणी
              </h2>
              <p className="text-blue-100 mt-2">व्यापारी, हॉटेल किंवा सोसायट्यांसाठी नोंदणी.</p>
            </div>
            
            <CardContent className="p-8 md:p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field id="name" label="खरेदीदाराचे/संस्थेचे नाव" icon={User} value={formData.name} onChange={handleInputChange} />
                <Field id="contactNumber" label="संपर्क क्रमांक" icon={Phone} value={formData.contactNumber} onChange={handleInputChange} />
                <div className="md:col-span-2">
                  <Field id="address" label="पत्ता" icon={MapPin} value={formData.address} onChange={handleInputChange} />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold">खरेदी कॅटेगरी</Label>
                  <Select onValueChange={(val) => setFormData(prev => ({...prev, category: val}))}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50">
                      <SelectValue placeholder="निवडा" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trader">व्यापारी</SelectItem>
                      <SelectItem value="hotel">हॉटेल</SelectItem>
                      <SelectItem value="society">सोसायटी</SelectItem>
                      <SelectItem value="process_center">प्रक्रिया केंद्र</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold">खरेदी प्रकार</Label>
                  <Select onValueChange={(val) => setFormData(prev => ({...prev, purchaseType: val}))}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 bg-slate-50">
                      <SelectValue placeholder="निवडा" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fruits">फळे</SelectItem>
                      <SelectItem value="veg">भाजीपाला</SelectItem>
                      <SelectItem value="flowers">फुले</SelectItem>
                      <SelectItem value="grains">धान्य</SelectItem>
                      <SelectItem value="spices">मसाले</SelectItem>
                      <SelectItem value="animals">जनावरे</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 pt-4 border-t">
                  <Label className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4 block">शिफारस (कोणी सुचवले?)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field id="recommendationName" label="शिफारस करणाऱ्याचे नाव" icon={User} value={formData.recommendationName} onChange={handleInputChange} />
                    <Field id="recommendationContact" label="मोबाईल नंबर" icon={Phone} value={formData.recommendationContact} onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl h-14 font-bold text-lg shadow-lg shadow-blue-200"
              >
                नोंदणी पूर्ण करा
              </Button>
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
          value={value}
          onChange={onChange}
          className="pl-12 h-12 rounded-xl border-slate-200 focus:ring-primary bg-slate-50"
        />
      </div>
    </div>
  );
}
