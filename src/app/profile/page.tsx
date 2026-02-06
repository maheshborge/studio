
"use client";

import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  User, 
  Sprout, 
  ShoppingBag, 
  LayoutDashboard,
  MapPin,
  Phone,
  ShieldCheck,
  ChevronRight,
  Loader2,
  FileText,
  Users,
  Plus,
  TrendingUp,
  Truck,
  LogOut,
  CalendarDays,
  CreditCard,
  Target,
  Mail,
  Edit2
} from "lucide-react";
import { useFirestore, useUser, useDoc, useMemoFirebase, useCollection, useAuth } from "@/firebase";
import { doc, collection, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });

  const mainProfileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "main");
  }, [db, user]);

  const farmerRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "farmerData");
  }, [db, user]);

  const buyerRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "buyerData");
  }, [db, user]);

  const transporterRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "transporterData");
  }, [db, user]);

  const cropsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "users", user.uid, "cropCycles");
  }, [db, user]);

  const { data: mainProfile } = useDoc(mainProfileRef);
  const { data: farmerData } = useDoc(farmerRef);
  const { data: buyerData } = useDoc(buyerRef);
  const { data: transporterData } = useDoc(transporterRef);
  const { data: cropCycles, isLoading: isCropsLoading } = useCollection(cropsQuery);

  useEffect(() => {
    if (mainProfile) {
      setEditData({
        name: mainProfile.name || "",
        email: mainProfile.email || ""
      });
    }
  }, [mainProfile]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "लॉग आऊट यशस्वी", description: "तुम्ही तुमच्या खात्यातून बाहेर पडला आहात." });
      router.push("/");
    } catch (error) {
      toast({ variant: "destructive", title: "त्रुटी", description: "बाहेर पडताना अडचण आली." });
    }
  };

  const handleUpdateProfile = async () => {
    if (!mainProfileRef || !db) return;
    setIsUpdating(true);
    try {
      await updateDoc(mainProfileRef, {
        name: editData.name,
        email: editData.email,
        updatedAt: new Date().toISOString()
      });
      toast({ title: "प्रोफाईल अपडेट झाले!", description: "तुमची नवीन माहिती साठवण्यात आली आहे." });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "त्रुटी", description: "माहिती अपडेट करताना अडचण आली." });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;
  if (!user) { router.push("/login"); return null; }

  const userType = mainProfile?.userType || "farmer";
  const isFarmer = userType === "farmer";
  const isBuyer = userType === "buyer";
  const isTransporter = userType === "transporter";
  const isSuvidhaKendra = userType === "suvidha_kendra";

  const displayDistrict = farmerData?.district || buyerData?.district || null;

  return (
    <div className="min-h-screen bg-slate-50 font-body">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
              <LayoutDashboard className="w-10 h-10" /> माझे व्यवस्थापन
            </h1>
          </div>
          {mainProfile && (
            <div className="flex items-center gap-4">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-2xl border-primary text-primary gap-2 font-bold shadow-sm bg-white hover:bg-primary/5">
                    <Edit2 className="w-4 h-4" /> प्रोफाईल अपडेट करा
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] p-8 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-primary">माहिती अपडेट करा</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-6">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name" className="font-bold">पूर्ण नाव</Label>
                      <Input 
                        id="edit-name" 
                        value={editData.name} 
                        onChange={(e) => setEditData(prev => ({...prev, name: e.target.value}))}
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email" className="font-bold">ईमेल पत्ता</Label>
                      <Input 
                        id="edit-email" 
                        type="email"
                        value={editData.email} 
                        onChange={(e) => setEditData(prev => ({...prev, email: e.target.value}))}
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleUpdateProfile} 
                      disabled={isUpdating}
                      className="w-full h-12 rounded-xl bg-primary font-bold shadow-lg shadow-primary/20"
                    >
                      {isUpdating ? <Loader2 className="animate-spin mr-2" /> : null}
                      माहिती साठवा
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider leading-none mb-1">
                    लॉगिन: {mainProfile.userType?.toUpperCase()}
                  </p>
                  <p className="font-bold text-slate-700 leading-none">{mainProfile.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {isSuvidhaKendra && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 rounded-[2.5rem] bg-white shadow-xl hover:shadow-2xl transition-all border-none group cursor-pointer" onClick={() => router.push("/farmer/register")}>
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">शेतकरी नोंदणी</h3>
                  <p className="text-sm text-slate-500">नवीन शेतकऱ्यांची माहिती भरून त्यांना सिस्टिममध्ये सामील करा.</p>
                </Card>

                <Card className="p-8 rounded-[2.5rem] bg-white shadow-xl hover:shadow-2xl transition-all border-none group cursor-pointer">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                    <CalendarDays className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">कार्यक्रम नियोजन</h3>
                  <p className="text-sm text-slate-500">शेतकऱ्यांसाठी मेळावे, प्रशिक्षण आणि कार्यक्रमांचे नियोजन करा.</p>
                </Card>

                <Card className="p-8 rounded-[2.5rem] bg-white shadow-xl hover:shadow-2xl transition-all border-none group cursor-pointer" onClick={() => router.push("/marketplace")}>
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">माल संकलन</h3>
                  <p className="text-sm text-slate-500">शेतकऱ्यांचा माल एकत्र गोळा करून मार्केटमध्ये विक्रीसाठी पाठवा.</p>
                </Card>

                <Card className="p-8 rounded-[2.5rem] bg-white shadow-xl hover:shadow-2xl transition-all border-none group cursor-pointer">
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">पेमेंट व्यवस्थापन</h3>
                  <p className="text-sm text-slate-500">शेतकऱ्यांच्या विक्रीचे पैसे आणि हिशोब ट्रॅक करा.</p>
                </Card>
              </div>
            )}

            {isFarmer && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">माझी पिके व विक्री</h2>
                  <Link href="/farmer/register">
                    <Button className="rounded-xl gap-2 bg-green-600 shadow-md hover:bg-green-700">
                      <Plus className="w-4 h-4" /> नवीन पीक जोडा
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {cropCycles?.map(crop => (
                     <Card key={crop.id} className="rounded-3xl shadow-lg border-none overflow-hidden bg-white hover:shadow-xl transition-shadow">
                       <div className="p-6">
                         <div className="flex justify-between items-start mb-4">
                           <h3 className="text-xl font-bold text-slate-800">{crop.name}</h3>
                           <Badge className={crop.isReadyForSale ? "bg-green-100 text-green-700 border-none" : "bg-blue-100 text-blue-700 border-none"}>
                             {crop.isReadyForSale ? "विक्रीसाठी उपलब्ध" : crop.status}
                           </Badge>
                         </div>
                         <p className="text-sm text-slate-500 mb-6 font-medium">{crop.variety} • {crop.area} एकर</p>
                         
                         {!crop.isReadyForSale ? (
                           <Link href={`/farmer/sales/${crop.id}`}>
                             <Button variant="outline" className="w-full rounded-xl border-primary text-primary gap-2 font-bold hover:bg-primary/5">
                               <TrendingUp className="w-4 h-4" /> विक्रीसाठी नोंदवा
                             </Button>
                           </Link>
                         ) : (
                           <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                             <p className="text-xs font-bold text-green-700">उपलब्ध माल: {crop.remainingQuantity} टन</p>
                           </div>
                         )}
                       </div>
                     </Card>
                   ))}
                   {cropCycles?.length === 0 && (
                     <div className="md:col-span-2 p-12 bg-white rounded-[2.5rem] text-center border-dashed border-2 border-slate-200">
                       <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                       <p className="text-slate-500 font-medium">अद्याप पिकांची नोंदणी केलेली नाही.</p>
                       <Link href="/farmer/register">
                          <Button variant="link" className="text-primary font-bold mt-2">पिके नोंदवण्यासाठी येथे क्लिक करा</Button>
                       </Link>
                     </div>
                   )}
                </div>
              </>
            )}

            {isTransporter && (
              <Card className="p-8 rounded-[2.5rem] bg-white shadow-xl border-none">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary"><Truck className="w-6 h-6" /> माझी वाहने</h3>
                <div className="space-y-4">
                   {transporterData?.vehicles?.map((v: any, i: number) => (
                     <div key={i} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                        <div>
                          <p className="font-bold text-lg text-slate-800">{v.number}</p>
                          <p className="text-sm text-slate-500 font-medium">{v.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-600">ड्रायव्हर: {v.driverMobile}</p>
                        </div>
                     </div>
                   ))}
                   <Button className="w-full h-12 rounded-xl border-dashed border-primary/50 text-primary font-bold" variant="outline">
                     <Plus className="w-4 h-4 mr-2" /> नवीन वाहन जोडा
                   </Button>
                </div>
              </Card>
            )}

            {isBuyer && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">खरेदीदार डॅशबोर्ड</h2>
                <Link href="/marketplace">
                  <Button size="lg" className="w-full h-20 rounded-[2rem] bg-primary text-xl font-bold gap-4 shadow-xl hover:scale-[1.01] transition-transform">
                    <ShoppingBag className="w-8 h-8" /> बाजारपेठेत माल पहा <ChevronRight className="w-6 h-6" />
                  </Button>
                </Link>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <Card className="p-6 rounded-2xl bg-white shadow-md border-none">
                      <h4 className="font-bold mb-2">खरेदी इतिहास</h4>
                      <p className="text-sm text-slate-500">तुम्ही केलेल्या खरेदीचे हिशोब येथे पहा.</p>
                   </Card>
                   <Card className="p-6 rounded-2xl bg-white shadow-md border-none">
                      <h4 className="font-bold mb-2">आवडते शेतकरी</h4>
                      <p className="text-sm text-slate-500">तुमच्या विश्वासातील शेतकऱ्यांची यादी.</p>
                   </Card>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-[2rem] shadow-xl border-none bg-white p-8">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-primary"><User className="w-6 h-6" /> खाते तपशील</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100"><Phone className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">मोबाईल</p>
                    <p className="font-bold text-slate-700">{mainProfile?.mobile}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100"><MapPin className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">स्थान</p>
                    <p className="font-bold text-slate-700">{displayDistrict || "नोंदणी नाही"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100"><Mail className="w-6 h-6" /></div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">ईमेल</p>
                    <p className="font-bold text-slate-700 text-sm truncate max-w-[180px]">{mainProfile?.email || "नोंदणी नाही"}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t">
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="w-full rounded-2xl border-red-100 text-red-600 hover:bg-red-50 gap-2 font-bold h-14 shadow-sm"
                >
                  <LogOut className="w-5 h-5" /> लॉग आऊट
                </Button>
              </div>
            </Card>

            <Card className="rounded-[2rem] shadow-lg border-none bg-primary p-8 text-white">
               <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><ShieldCheck className="w-6 h-6" /> मदत व सुरक्षा</h4>
               <p className="text-sm text-blue-100 mb-6 leading-relaxed">तुमची सर्व माहिती मिडास सिस्टिममध्ये पूर्णपणे सुरक्षित आहे. काही तांत्रिक अडचण असल्यास संपर्क करा.</p>
               <Button variant="outline" className="w-full rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold h-12">
                 कस्टमर केअर
               </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
