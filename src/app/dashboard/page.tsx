"use client";

import { Navigation } from "@/components/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  TrendingUp,
  FileText,
  MessageSquare,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from "@/firebase";
import { collectionGroup, doc, collection } from "firebase/firestore";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

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
  const { data: allCrops } = useCollection(cropsQuery);

  const questionsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "questions");
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
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-headline font-black text-slate-900">मिडास विश्लेषण डॅशबोर्ड</h1>
            <p className="text-slate-500 mt-2 text-lg">तुमच्या पिकांची आणि क्षेत्राची सविस्तर माहिती.</p>
          </div>
          <div className="flex gap-3">
            <Badge className="bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-full text-sm font-bold flex gap-2">
              <Filter className="w-4 h-4" /> फिल्टर
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <StatCard title="एकूण पीक नोंदणी" value={stats.count} icon={Sprout} color="bg-emerald-500" trend="+12% या महिन्यात" />
          <StatCard title="एकूण क्षेत्र (एकर)" value={stats.area.toFixed(1)} icon={TrendingUp} color="bg-indigo-500" trend="+5.4% वाढ" />
          <StatCard title="युजर्स" value="१,२५०" icon={Users} color="bg-violet-500" trend="नवीन शेतकरी" />
          {isExpert && <StatCard title="प्रलंबित प्रश्न" value={sortedQuestions.length} icon={MessageSquare} color="bg-orange-500" trend="तातडीचे" />}
        </div>

        {isExpert ? (
          <div className="space-y-10">
            <h2 className="text-3xl font-black text-slate-800">शेतकऱ्यांचे सर्वाधिक प्रश्न</h2>
            <div className="grid grid-cols-1 gap-6">
              {sortedQuestions.map((q, i) => (
                <Card key={i} className="p-8 rounded-[2.5rem] border-none shadow-xl flex justify-between items-center bg-white group hover:bg-primary hover:text-white transition-all cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <Badge className="mb-2 bg-primary/10 text-primary border-none group-hover:bg-white/20 group-hover:text-white">
                        {q.category}
                      </Badge>
                      <h4 className="text-xl font-bold">{q.text}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-orange-500 group-hover:text-white">{q.askCount}</p>
                    <p className="text-[10px] uppercase font-black opacity-60 tracking-widest">विचारले</p>
                  </div>
                </Card>
              ))}
              {sortedQuestions.length === 0 && <p className="text-slate-500 text-center py-20 font-bold">अद्याप कोणताही प्रश्न नाही.</p>}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="flex items-center gap-3 text-2xl font-black">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  स्वतंत्र पिकनिहाय अहवाल
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[450px] p-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.byCrop}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 'bold'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 'bold'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                      cursor={{fill: '#f8fafc'}}
                    />
                    <Bar dataKey="value" fill="#4F46E5" radius={[10, 10, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="flex items-center gap-3 text-2xl font-black">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  पिकनिहाय टक्केवारी
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[450px] flex items-center justify-center relative p-8">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={stats.byCrop} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={100} 
                      outerRadius={150} 
                      paddingAngle={8} 
                      dataKey="value"
                      stroke="none"
                    >
                      {stats.byCrop.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-4xl font-black text-slate-900">{stats.area.toFixed(0)}</p>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">एकूण एकर</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend }: any) {
  return (
    <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white group hover:shadow-2xl transition-all duration-500">
      <div className="p-8 flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110", color)}>
            <Icon className="w-8 h-8" />
          </div>
          <div className="bg-slate-50 p-2 rounded-full text-slate-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div>
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-4xl font-black text-slate-900">{value}</p>
          {trend && <p className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1">● {trend}</p>}
        </div>
      </div>
    </Card>
  );
}
