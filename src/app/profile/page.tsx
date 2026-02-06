
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
  Plane,
  Plus
} from "lucide-react";
import { useFirestore, useUser, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

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

  const cropsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "users", user.uid, "cropCycles");
  }, [db, user]);

  const { data: mainProfile } = useDoc(mainProfileRef);
  const { data: farmerData, isLoading: isFarmerLoading } = useDoc(farmerRef);
  const { data: buyerData, isLoading: isBuyerLoading } = useDoc(buyerRef);
  const { data: cropCycles, isLoading: isCropsLoading } = useCollection(cropsQuery);

  if (isUserLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;
  if (!user) { router.push("/login"); return null; }

  const userType = mainProfile?.userType || "farmer";
  const isFarmer = userType === "farmer";
  const isBuyer = userType === "buyer";

  // Determine the display district from whichever profile is filled
  const displayDistrict = farmerData?.district || buyerData?.district || null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-3">
              <LayoutDashboard className="w-10 h-10" /> माझीशेती, माझे व्यवस्थापन
            </h1>
            <p className="text-slate-500 mt-2">तुमच्या भूमिकेनुसार माहिती व्यवस्थापित करा.</p>
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
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {isFarmer && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">सक्रिय पीक चक्र</h2>
                  <Link href="/farmer/register">
                    <Button className="rounded-xl gap-2 bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4" /> नवीन पीक / माहिती अपडेट
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {cropCycles && cropCycles.length > 0 ? (
                     cropCycles.map(crop => (
                       <Card key={crop.id} className="rounded-3xl shadow-lg border-none overflow-hidden">
                         <div className="p-6">
                           <h3 className="text-xl font-bold">{crop.name}</h3>
                           <p className="text-sm text-muted-foreground">{crop.area} एकर • {crop.season}</p>
                           <Badge className="mt-4 bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">{crop.status}</Badge>
                         </div>
                       </Card>
                     ))
                   ) : (
                     <Card className="col-span-full p-12 text-center rounded-[2.5rem] border-dashed bg-white">
                       <Sprout className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                       <p className="text-slate-500 font-bold mb-4">अद्याप कोणतेही पीक जोडलेले नाही.</p>
                       <Link href="/farmer/register">
                        <Button variant="outline" className="rounded-xl border-primary text-primary">प्रोफाईल पूर्ण करा</Button>
                       </Link>
                     </Card>
                   )}
                </div>
              </>
            )}

            {isBuyer && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">खरेदीदार डॅशबोर्ड</h2>
                  <Link href="/buyer/register">
                    <Button className="rounded-xl gap-2 bg-primary">
                      <ShoppingBag className="w-4 h-4" /> परवाना माहिती अपडेट करा
                    </Button>
                  </Link>
                </div>
                
                <Card className="p-12 text-center rounded-[2.5rem] border-dashed bg-white">
                   <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                   <h3 className="text-xl font-bold text-slate-700 mb-2">तुमचे खरेदीदार प्रोफाइल</h3>
                   <p className="text-slate-500 mb-6">तुमची कॅटेगरी, परवाना आणि खरेदीचे प्रकार अपडेट करण्यासाठी खालील बटनावर क्लिक करा.</p>
                   <Link href="/buyer/register">
                    <Button className="rounded-xl h-12 px-8 font-bold">माहिती अपडेट करा <ChevronRight className="ml-2 w-4 h-4" /></Button>
                   </Link>
                </Card>
              </>
            )}

            {!isFarmer && !isBuyer && (
              <Card className="p-12 text-center rounded-[2.5rem] bg-white">
                <p className="text-slate-500 font-bold">कृपया तुमच्या भूमिकेनुसार माहिती अपडेट करा.</p>
              </Card>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5" /> खाते तपशील</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
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
              </CardContent>
            </Card>

            <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
              <h3 className="font-bold text-primary mb-4">मदत हवी आहे?</h3>
              <p className="text-sm text-slate-600 mb-6">तुम्हाला काही प्रश्न असल्यास किंवा तांत्रिक अडचण असल्यास आमच्याशी संपर्क साधा.</p>
              <Button variant="outline" className="w-full rounded-xl border-primary text-primary hover:bg-primary/5">सपोर्ट टीमशी बोला</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
