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
  ShoppingBag, 
  MapPin,
  TrendingUp,
  FileText
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collectionGroup } from "firebase/firestore";
import { useMemo } from "react";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DashboardPage() {
  const db = useFirestore();
  
  const profilesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collectionGroup(db, "profile");
  }, [db]);

  const { data: profiles, isLoading } = useCollection(profilesQuery);

  const cropStats = useMemo(() => {
    if (!profiles) return [];
    const stats: Record<string, number> = {};
    profiles.forEach(p => {
      (p.crops || []).forEach((c: any) => {
        const area = parseFloat(c.area) || 0;
        stats[c.name] = (stats[c.name] || 0) + area;
      });
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [profiles]);

  const districtStats = useMemo(() => {
    if (!profiles) return [];
    const stats: Record<string, { farmers: number, area: number }> = {};
    profiles.forEach(p => {
      // Basic logic to extract district from address string if possible, 
      // in real app we'd have a district field
      const district = p.address.split(',').pop()?.trim() || "इतर";
      if (!stats[district]) stats[district] = { farmers: 0, area: 0 };
      stats[district].farmers += 1;
      stats[district].area += parseFloat(p.landArea) || 0;
    });
    return Object.entries(stats).map(([district, data]) => ({ district, ...data }));
  }, [profiles]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-headline font-bold text-primary mb-10">माहिती अहवाल (Reports)</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="एकूण शेतकरी" value={profiles?.length || 0} icon={Users} color="bg-blue-500" />
          <StatCard title="पिकांचे प्रकार" value={cropStats.length} icon={Sprout} color="bg-green-500" />
          <StatCard title="एकूण क्षेत्र (एकर)" value={cropStats.reduce((acc, curr) => acc + curr.value, 0).toFixed(1)} icon={TrendingUp} color="bg-orange-500" />
          <StatCard title="सक्रिय विभाग" value={districtStats.length} icon={MapPin} color="bg-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <Card className="rounded-[2rem] border-none shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="text-primary w-5 h-5" /> स्वतंत्र पिकनिहाय अहवाल
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">विश्लेषण चालू आहे...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cropStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'क्षेत्र (एकर)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-xl bg-white">
            <CardHeader>
              <CardTitle>पिकनिहाय टक्केवारी</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cropStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {cropStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">एकूण क्षेत्र</p>
                <p className="text-2xl font-bold">{cropStats.reduce((acc, curr) => acc + curr.value, 0).toFixed(1)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[2rem] border-none shadow-xl overflow-hidden bg-white">
           <CardHeader className="bg-slate-50/50">
              <CardTitle>जिल्हानिहाय विश्लेषण</CardTitle>
           </CardHeader>
           <CardContent className="p-0">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-6">जिल्हा/विभाग</th>
                    <th className="p-6">शेतकरी संख्या</th>
                    <th className="p-6">एकूण क्षेत्र</th>
                    <th className="p-6">प्रगती</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {districtStats.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6 font-bold">{row.district}</td>
                      <td className="p-6">{row.farmers}</td>
                      <td className="p-6">{row.area.toFixed(1)} एकर</td>
                      <td className="p-6">
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${Math.min(row.area * 5, 100)}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {districtStats.length === 0 && !isLoading && (
                    <tr><td colSpan={4} className="p-10 text-center text-muted-foreground">अद्याप कोणतीही माहिती उपलब्ध नाही.</td></tr>
                  )}
                </tbody>
              </table>
           </CardContent>
        </Card>
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
