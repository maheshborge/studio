
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
  Truck
} from "lucide-react";
import { useFirestore, useUser, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

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

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;
  if (!user) { router.push("/login"); return null; }

  const userType = mainProfile?.userType || "farmer";
  const isFarmer = userType === "farmer";
  const isBuyer = userType === "buyer";
  const isTransporter = userType === "transporter";

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
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
