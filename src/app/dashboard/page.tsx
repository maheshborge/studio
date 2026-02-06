
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
  TrendingUp
} from "lucide-react";

// Mock data for initial view
const cropData = [
  { name: 'आंबा', value: 400 },
  { name: 'द्राक्षे', value: 300 },
  { name: 'पेरू', value: 200 },
  { name: 'भाज्या', value: 278 },
  { name: 'धान्य', value: 189 },
];

const genderData = [
  { name: 'पुरुष', value: 65 },
  { name: 'महिला', value: 35 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-headline font-bold text-primary mb-10">माहिती अहवाल (Reports)</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="एकूण शेतकरी" value="१,२४५" icon={Users} color="bg-blue-500" />
          <StatCard title="पिकांचे प्रकार" value="१५" icon={Sprout} color="bg-green-500" />
          <StatCard title="एकूण खरेदीदार" value="८४" icon={ShoppingBag} color="bg-purple-500" />
          <StatCard title="गावे समाविष्ट" value="३२" icon={MapPin} color="bg-orange-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <Card className="rounded-[2rem] border-none shadow-xl">
            <CardHeader>
              <CardTitle>पिकनिहाय माहिती</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cropData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-xl">
            <CardHeader>
              <CardTitle>शेतकरी लिंगनिहाय वर्गीकरण</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <p className="text-xs text-muted-foreground">एकूण</p>
                <p className="text-xl font-bold">१००%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[2rem] border-none shadow-xl overflow-hidden">
           <CardHeader className="bg-white">
              <CardTitle>जिल्हानिहाय विश्लेषण</CardTitle>
           </CardHeader>
           <CardContent className="p-0">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-6">जिल्हा</th>
                    <th className="p-6">शेतकरी संख्या</th>
                    <th className="p-6">खरेदीदार</th>
                    <th className="p-6">प्रगती</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { district: 'पुणे', farmers: 450, buyers: 22, progress: 85 },
                    { district: 'नाशिक', farmers: 380, buyers: 18, progress: 70 },
                    { district: 'अहमदनगर', farmers: 310, buyers: 12, progress: 60 },
                    { district: 'सातारा', farmers: 215, buyers: 8, progress: 45 },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6 font-bold">{row.district}</td>
                      <td className="p-6">{row.farmers}</td>
                      <td className="p-6">{row.buyers}</td>
                      <td className="p-6">
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${row.progress}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
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
    <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
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
