
"use client";

import { useState, useEffect, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Mail
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "लॉग आऊट यशस्वी", description: "तुम्ही तुमच्या खात्यातून बाहेर पडला आहात." });
      router.push("/");
    } catch (error) {
      toast({ variant: "destructive", title: "त्रुटी", description: "बाहेर पडताना अडचण आली." });
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
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
              <LayoutDashboard className="w-10 h-10" /> माझे व्यवस्थापन
            </h1>
          </div>
          {mainProfile && (
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
                    <Button className="rounded-xl gap-2 bg-green-600">
                      <Plus className="w-4 h-4" /> नवीन पीक जोडा
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {cropCycles?.map(crop => (
                     <Card key={crop.id} className="rounded-3xl shadow-lg border-none overflow-hidden bg-white">
                       <div className="p-6">
                         <div className="flex justify-between items-start mb-4">
                           <h3 className="text-xl font-bold">{crop.name}</h3>
                           <Badge className={crop.isReadyForSale ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
                             {crop.isReadyForSale ? "विक्रीसाठी उपलब्ध" : crop.status}
                           </Badge>
                         </div>
                         <p className="text-sm text-slate-500 mb-6">{crop.variety} • {crop.area} एकर</p>
                         
                         {!crop.isReadyForSale ? (
                           <Link href={`/farmer/sales/${crop.id}`}>
                             <Button variant="outline" className="w-full rounded-xl border-primary text-primary gap-2">
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
                </div>
              </>
            )}

            {isTransporter && (
              <Card className="p-8 rounded-[2.5rem] bg-white shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Truck className="text-primary" /> माझी वाहने</h3>
                <div className="space-y-4">
                   {transporterData?.vehicles?.map((v: any, i: number) => (
                     <div key={i} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-lg">{v.number}</p>
                          <p className="text-sm text-slate-500">{v.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">ड्रायव्हर: {v.driverMobile}</p>
                        </div>
                     </div>
                   ))}
                   <Button className="w-full h-12 rounded-xl border-dashed border-primary/50" variant="outline">
                     <Plus className="w-4 h-4 mr-2" /> नवीन वाहन जोडा
                   </Button>
                </div>
              </Card>
            )}

            {isBuyer && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">खरेदीदार डॅशबोर्ड</h2>
                <Link href="/marketplace">
                  <Button size="lg" className="w-full h-20 rounded-[2rem] bg-primary text-xl font-bold gap-4 shadow-xl">
                    <ShoppingBag className="w-8 h-8" /> बाजारपेठेत माल पहा <ChevronRight className="w-6 h-6" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-[2rem] shadow-xl border-none bg-white p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><User className="w-5 h-5 text-primary" /> खाते तपशील</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500"><Phone className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">मोबाईल</p>
                    <p className="font-bold">{mainProfile?.mobile}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500"><MapPin className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">स्थान</p>
                    <p className="font-bold">{displayDistrict || "नोंदणी नाही"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500"><Mail className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">ईमेल</p>
                    <p className="font-bold text-xs truncate max-w-[150px]">{mainProfile?.email || "नोंदणी नाही"}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 gap-2 font-bold h-12"
                >
                  <LogOut className="w-4 h-4" /> लॉग आऊट
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
