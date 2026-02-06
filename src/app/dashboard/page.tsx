
"use client";

import { Navigation } from "@/components/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  Sprout, 
  MapPin,
  TrendingUp,
  FileText,
  MessageSquare
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from "@/firebase";
import { collectionGroup, doc } from "firebase/firestore";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardPage() {
  const db = useFirestore();
  const { user } = useUser();

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "main");
  }, [db, user]);
  const { data: profile } = useDoc(profileRef);

  const cropsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collectionGroup(db, "cropCycles");
  }, [db]);
  const { data: allCrops, isLoading: isCropsLoading } = useCollection(cropsQuery);

  const questionsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collectionGroup(db, "questions"); // Mocked global questions
  }, [db]);
  const { data: questions } = useCollection(questionsQuery);

  const stats = useMemo(() => {
    if (!allCrops) return { area: 0, count: 0, byCrop: [] };
    const summary: Record<string, number> = {};
    let totalArea = 0;
    allCrops.forEach(c => {
      totalArea += c.area || 0;
      summary[c.name] = (summary[c.name] || 0) + (c.area || 0);
    });
    return {
      area: totalArea,
      count: allCrops.length,
      byCrop: Object.entries(summary).map(([name, value]) => ({ name, value }))
    };
  }, [allCrops]);

  const sortedQuestions = useMemo(() => {
    if (!questions) return [];
    return [...questions].sort((a, b) => (b.askCount || 0) - (a.askCount || 0));
  }, [questions]);

  const isExpert = profile?.userType === "expert";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-headline font-bold text-primary mb-10">मिडास डॅशबोर्ड व विश्लेषण</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="एकूण पीक नोंदणी" value={stats.count} icon={Sprout} color="bg-green-500" />
          <StatCard title="एकूण क्षेत्र (एकर)" value={stats.area.toFixed(1)} icon={TrendingUp} color="bg-blue-500" />
          {isExpert && <StatCard title="प्रलंबित प्रश्न" value={sortedQuestions.length} icon={MessageSquare} color="bg-orange-500" />}
        </div>

        {isExpert ? (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">शेतकऱ्यांचे सर्वाधिक प्रश्न (Trending Topics)</h2>
            <div className="grid grid-cols-1 gap-4">
              {sortedQuestions.map((q, i) => (
                <Card key={i} className="p-6 rounded-2xl border-none shadow-md flex justify-between items-center bg-white">
                  <div>
                    <Badge className="mb-2 bg-primary/10 text-primary border-none">{q.category}</Badge>
                    <h4 className="text-lg font-bold">{q.text}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-500">{q.askCount}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400">वेळा विचारले</p>
                  </div>
                </Card>
              ))}
              {sortedQuestions.length === 0 && <p className="text-slate-500">अद्याप कोणताही प्रश्न नाही.</p>}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <Card className="rounded-[2rem] border-none shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-primary w-5 h-5" /> स्वतंत्र पिकनिहाय अहवाल
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.byCrop}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'क्षेत्र (एकर)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none shadow-xl bg-white">
              <CardHeader>
                <CardTitle>पिकनिहाय टक्केवारी</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.byCrop} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                      {stats.byCrop.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-lg rounded-3xl overflow-hidden bg-white">
      <div className="p-6 flex items-center gap-6">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white", color)}>
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
}
