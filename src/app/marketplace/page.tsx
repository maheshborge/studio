
"use client";

import { useState, useMemo, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Scale,
  Calendar,
  Truck,
  Tag,
  Loader2,
  ArrowRight,
  Package,
  Phone,
  User,
  AlertCircle
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase, useUser } from "@/firebase";
import { collectionGroup, doc, addDoc, collection, query, where, updateDoc, getDocs, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PACKING_TYPES = [
  { id: "bag", label: "बॅग" },
  { id: "sack", label: "गोणी" },
  { id: "crate", label: "क्रेट" },
  { id: "carton", label: "कार्टन बॉक्स" },
  { id: "loose", label: "लुज" },
  { id: "other", label: "इतर" }
];

export default function MarketplacePage() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [searchTerm, setSearchSearchTerm] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [isSearchingTransporter, setIsSearchingTransporter] = useState(false);
  const [foundTransporter, setFoundTransporter] = useState<any>(null);
  const [transporterVehicles, setTransporterVehicles] = useState<any[]>([]);

  // Purchase form state
  const [purchaseData, setPurchaseData] = useState({
    quantity: "",
    rate: "",
    packingType: "bag",
    packingCount: "",
    packingWeight: "",
    vehicleNumber: "",
    driverMobile: ""
  });

  const cropsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collectionGroup(db, "cropCycles"), where("isReadyForSale", "==", true));
  }, [db]);

  const { data: allCrops, isLoading } = useCollection(cropsQuery);

  const filteredCrops = useMemo(() => {
    if (!allCrops) return [];
    return allCrops.filter(c => 
      c.remainingQuantity > 0 &&
      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (c.variety && c.variety.toLowerCase().includes(searchTerm.toLowerCase())))
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [allCrops, searchTerm]);

  // Logic to search transporter when mobile number is entered
  useEffect(() => {
    const searchTransporter = async () => {
      if (!db || purchaseData.driverMobile.length !== 10) {
        setFoundTransporter(null);
        setTransporterVehicles([]);
        return;
      }

      setIsSearchingTransporter(true);
      try {
        // 1. Search for a profile with this mobile number
        const q = query(collectionGroup(db, "profile"), where("mobile", "==", purchaseData.driverMobile));
        const snapshot = await getDocs(q);
        
        let foundUser: any = null;
        snapshot.forEach(doc => {
          if (doc.id === "main") {
            foundUser = { ...doc.data(), userId: doc.ref.parent.parent?.id };
          }
        });

        if (foundUser && foundUser.userType === "transporter") {
          setFoundTransporter(foundUser);
          // 2. Fetch transporter vehicles
          const tDoc = await getDoc(doc(db, "users", foundUser.userId, "profile", "transporterData"));
          if (tDoc.exists()) {
            const data = tDoc.data();
            setTransporterVehicles(data.vehicles || []);
            if (data.vehicles?.length === 1) {
              setPurchaseData(prev => ({ ...prev, vehicleNumber: data.vehicles[0].number }));
            }
          }
          toast({ title: "ट्रान्सपोर्टर सापडला!", description: `${foundUser.name} यांची माहिती फेच केली आहे.` });
        } else {
          setFoundTransporter("not_found");
          setTransporterVehicles([]);
        }
      } catch (error) {
        console.error("Transporter search error:", error);
      } finally {
        setIsSearchingTransporter(false);
      }
    };

    const timeoutId = setTimeout(searchTransporter, 500);
    return () => clearTimeout(timeoutId);
  }, [purchaseData.driverMobile, db, toast]);

  const handleFinalPurchase = async () => {
    if (!db || !user || !selectedCrop) return;

    if (!purchaseData.vehicleNumber || !purchaseData.driverMobile) {
      toast({ variant: "destructive", title: "त्रुटी", description: "गाडी नंबर आणि ड्रायव्हर नंबर आवश्यक आहे." });
      return;
    }

    setIsBuying(true);

    try {
      const qty = parseFloat(purchaseData.quantity);
      if (qty > selectedCrop.remainingQuantity) {
        toast({ variant: "destructive", title: "त्रुटी", description: "उपलब्ध माल्यापेक्षा जास्त वजन निवडले आहे." });
        return;
      }

      await addDoc(collection(db, "transactions"), {
        ...purchaseData,
        cropId: selectedCrop.id,
        cropName: selectedCrop.name,
        variety: selectedCrop.variety,
        buyerId: user.uid,
        buyerName: user.displayName || "Buyer",
        totalAmount: qty * (parseFloat(purchaseData.rate) || 0),
        timestamp: new Date().toISOString()
      });

      const farmerId = selectedCrop.farmerId;
      const cropRef = doc(db, "users", farmerId, "cropCycles", selectedCrop.id);
      const newRemaining = selectedCrop.remainingQuantity - qty;
      
      await updateDoc(cropRef, {
        remainingQuantity: newRemaining,
        status: newRemaining <= 0 ? "sold" : "ready"
      });

      toast({ title: "खरेदी यशस्वी!", description: "तुमची खरेदी नोंदवण्यात आली आहे." });
      setSelectedCrop(null);
    } catch (error) {
      toast({ variant: "destructive", title: "त्रुटी", description: "खरेदी करताना अडचण आली." });
    } finally {
      setIsBuying(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
            <ShoppingBag className="w-10 h-10" /> पीक बाजारपेठ (Marketplace)
          </h1>
          <div className="mt-6 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="पीक किंवा व्हारायटी शोधा..." 
              value={searchTerm}
              onChange={(e) => setSearchSearchTerm(e.target.value)}
              className="pl-12 h-14 rounded-2xl border-none shadow-lg bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCrops.map((crop) => (
            <Card key={crop.id} className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white hover:shadow-2xl transition-all">
              <div className="relative aspect-video">
                <Image 
                  src={crop.salePhotoUrl || "https://picsum.photos/seed/market/600/400"} 
                  alt={crop.name} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover" 
                />
                <Badge className="absolute top-4 left-4 bg-green-600">काढणीस तयार</Badge>
              </div>
              <CardContent className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">{crop.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1"><Tag className="w-3 h-3" /> {crop.variety}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{crop.remainingQuantity} <span className="text-xs">टन</span></p>
                    <p className="text-[10px] uppercase font-bold text-slate-400">उपलब्ध माल</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{crop.saleHarvestDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{crop.farmerDistrict}</span>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full h-12 rounded-xl bg-primary gap-2" onClick={() => {
                      setSelectedCrop(crop);
                      setPurchaseData(prev => ({...prev, quantity: crop.remainingQuantity.toString(), rate: ""}));
                    }}>
                      खरेदी करा <ArrowRight className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl rounded-[2.5rem] p-8 overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Package className="text-primary" /> खरेदी प्रक्रिया
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="space-y-2">
                        <Label className="font-bold">मालाचे नाव</Label>
                        <Input value={crop.name} readOnly className="bg-slate-50 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">व्हारायटी</Label>
                        <Input value={crop.variety} readOnly className="bg-slate-50 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">किती माल खरेदी करायचा? (टन)</Label>
                        <Input 
                          type="number" 
                          max={crop.remainingQuantity}
                          value={purchaseData.quantity}
                          onChange={(e) => setPurchaseData(prev => ({...prev, quantity: e.target.value}))}
                          className="rounded-xl border-primary" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold">मालाचा दर (प्रति टन)</Label>
                        <Input 
                          type="number"
                          placeholder="उदा. १५०००"
                          value={purchaseData.rate}
                          onChange={(e) => setPurchaseData(prev => ({...prev, rate: e.target.value}))}
                          className="rounded-xl border-primary" 
                        />
                      </div>

                      <div className="md:col-span-2 border-t pt-4">
                        <h4 className="font-bold text-primary mb-4 flex items-center gap-2"><Truck className="w-5 h-5" /> ट्रान्सपोर्टर व गाडी माहिती</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="font-bold">ड्रायव्हर मोबाईल नंबर</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input 
                                type="number"
                                placeholder="९८७६५४३२१०"
                                value={purchaseData.driverMobile}
                                onChange={(e) => {
                                  if (e.target.value.length <= 10) {
                                    setPurchaseData(prev => ({...prev, driverMobile: e.target.value}));
                                  }
                                }}
                                className="rounded-xl pl-10 h-12"
                              />
                              {isSearchingTransporter && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="font-bold">गाडी नंबर</Label>
                            {transporterVehicles.length > 0 ? (
                              <Select 
                                value={purchaseData.vehicleNumber} 
                                onValueChange={(val) => setPurchaseData(prev => ({...prev, vehicleNumber: val}))}
                              >
                                <SelectTrigger className="h-12 rounded-xl">
                                  <SelectValue placeholder="गाडी निवडा" />
                                </SelectTrigger>
                                <SelectContent>
                                  {transporterVehicles.map((v: any) => (
                                    <SelectItem key={v.number} value={v.number}>{v.number} ({v.type})</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="relative">
                                <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input 
                                  placeholder="उदा. MH-12-AB-1234"
                                  value={purchaseData.vehicleNumber}
                                  onChange={(e) => setPurchaseData(prev => ({...prev, vehicleNumber: e.target.value}))}
                                  className="rounded-xl pl-10 h-12"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {foundTransporter === "not_found" && purchaseData.driverMobile.length === 10 && (
                          <Alert variant="destructive" className="mt-4 rounded-2xl bg-red-50 border-red-100">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>ट्रान्सपोर्टर सापडला नाही</AlertTitle>
                            <AlertDescription>
                              हा नंबर सिस्टिममध्ये नोंदणीकृत नाही. कृपया ट्रान्सपोर्टरला नोंदणी करण्यास सांगा किंवा मॅन्युअली माहिती भरा.
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {foundTransporter && foundTransporter !== "not_found" && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                            <User className="w-5 h-5 text-blue-600" />
                            <p className="text-sm font-bold text-blue-700">ट्रान्सपोर्टर: {foundTransporter.name}</p>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-4">
                        <div className="space-y-2">
                          <Label className="font-bold text-xs">पॅकिंग प्रकार</Label>
                          <Select value={purchaseData.packingType} onValueChange={(val) => setPurchaseData(prev => ({...prev, packingType: val}))}>
                            <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {PACKING_TYPES.map(p => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="font-bold text-xs">पॅकिंग संख्या</Label>
                          <Input type="number" value={purchaseData.packingCount} onChange={(e) => setPurchaseData(prev => ({...prev, packingCount: e.target.value}))} className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-bold text-xs">पॅकिंगसह वजन (टन)</Label>
                          <Input type="number" value={purchaseData.packingWeight} onChange={(e) => setPurchaseData(prev => ({...prev, packingWeight: e.target.value}))} className="rounded-xl" />
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full h-14 bg-green-600 hover:bg-green-700 rounded-2xl mt-8 font-bold text-lg shadow-lg"
                      onClick={handleFinalPurchase}
                      disabled={isBuying}
                    >
                      {isBuying ? <Loader2 className="animate-spin mr-2" /> : null}
                      खरेदी फायनल करा
                    </Button>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
