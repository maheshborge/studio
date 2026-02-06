
"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collectionGroup } from "firebase/firestore";
import { Database, Users, Sprout, ShoppingBag, Loader2 } from "lucide-react";

export default function DatabaseViewPage() {
  const db = useFirestore();

  // Fetch all user profiles
  const profilesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collectionGroup(db, "profile");
  }, [db]);
  const { data: profiles, isLoading: isProfilesLoading } = useCollection(profilesQuery);

  // Fetch all crop cycles
  const cropsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collectionGroup(db, "cropCycles");
  }, [db]);
  const { data: crops, isLoading: isCropsLoading } = useCollection(cropsQuery);

  // Fetch all buyer data
  const buyersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collectionGroup(db, "buyerData");
  }, [db]);
  const { data: buyers, isLoading: isBuyersLoading } = useCollection(buyersQuery);

  if (isProfilesLoading || isCropsLoading || isBuyersLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-body">
        <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
        <p className="text-slate-500 font-bold">डेटा लोड होत आहे...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-body">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Database className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-bold text-primary">डेटाबेस मास्टर व्ह्यू (Excel Style)</h1>
        </div>

        <Tabs defaultValue="users" className="space-y-8">
          <TabsList className="bg-white p-1 rounded-2xl h-14 border shadow-sm">
            <TabsTrigger value="users" className="rounded-xl px-8 h-full gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Users className="w-4 h-4" /> युजर्स ({profiles?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="crops" className="rounded-xl px-8 h-full gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Sprout className="w-4 h-4" /> पिके ({crops?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="buyers" className="rounded-xl px-8 h-full gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <ShoppingBag className="w-4 h-4" /> खरेदीदार ({buyers?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="rounded-[2rem] border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-white border-b">
                <CardTitle>युजर्स यादी</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-bold">नाव</TableHead>
                      <TableHead className="font-bold">मोबाईल</TableHead>
                      <TableHead className="font-bold">प्रकार</TableHead>
                      <TableHead className="font-bold">नोंदणी तारीख</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles?.filter(p => p.userType).map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.name}</TableCell>
                        <TableCell>{profile.mobile}</TableCell>
                        <TableCell className="capitalize">{profile.userType}</TableCell>
                        <TableCell className="text-slate-500 text-xs">
                          {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('mr-IN') : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crops">
            <Card className="rounded-[2rem] border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-white border-b">
                <CardTitle>पिकनिहाय माहिती</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-bold">पिकाचे नाव</TableHead>
                      <TableHead className="font-bold">शेतकरी</TableHead>
                      <TableHead className="font-bold">क्षेत्र (एकर)</TableHead>
                      <TableHead className="font-bold">अंदाजित उत्पादन (टन)</TableHead>
                      <TableHead className="font-bold">काढणी तारीख</TableHead>
                      <TableHead className="font-bold">स्थिती</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {crops?.map((crop) => (
                      <TableRow key={crop.id}>
                        <TableCell className="font-bold text-primary">{crop.name}</TableCell>
                        <TableCell>{crop.farmerName || 'Unknown'}</TableCell>
                        <TableCell>{crop.area}</TableCell>
                        <TableCell>{crop.estimatedYield}</TableCell>
                        <TableCell>{crop.expectedHarvestDate}</TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            crop.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {crop.status === 'ready' ? 'काढणीस तयार' : 'वाढ होत आहे'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="buyers">
            <Card className="rounded-[2rem] border-none shadow-xl overflow-hidden">
              <CardHeader className="bg-white border-b">
                <CardTitle>खरेदीदार तपशील</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-bold">संस्थेचे नाव</TableHead>
                      <TableHead className="font-bold">संपर्क व्यक्ती</TableHead>
                      <TableHead className="font-bold">कॅटेगरी</TableHead>
                      <TableHead className="font-bold">परवाना क्रमांक</TableHead>
                      <TableHead className="font-bold">जिल्हा</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyers?.map((buyer) => (
                      <TableRow key={buyer.id}>
                        <TableCell className="font-bold">{buyer.orgName}</TableCell>
                        <TableCell>{buyer.contactName}</TableCell>
                        <TableCell className="capitalize">{buyer.category}</TableCell>
                        <TableCell className="font-mono text-xs">{buyer.licenseNumber || '-'}</TableCell>
                        <TableCell>{buyer.district}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
