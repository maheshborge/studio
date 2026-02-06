
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  BarChart3, 
  MessageSquare, 
  ShoppingBag,
  ArrowRight,
  ClipboardList
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
            MaziSheti मॅनेजमेंट सिस्टम
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            शेतकरी नोंदणी, खरेदीदार व्यवस्थापन आणि माहितीचे विश्लेषण करण्यासाठी एक डिजिटल व्यासपीठ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <QuickActionCard 
            title="शेतकरी नोंदणी" 
            desc="नवीन शेतकऱ्याची माहिती भरा" 
            icon={UserPlus} 
            href="/farmer/register" 
            color="bg-green-500"
          />
          <QuickActionCard 
            title="खरेदीदार नोंदणी" 
            desc="नवीन खरेदीदाराची नोंदणी करा" 
            icon={ShoppingBag} 
            href="/buyer/register" 
            color="bg-blue-500"
          />
          <QuickActionCard 
            title="शेतकरी प्रश्न" 
            desc="शेती आणि जनावरांचे प्रश्न" 
            icon={MessageSquare} 
            href="/questions" 
            color="bg-orange-500"
          />
          <QuickActionCard 
            title="रिपोर्ट्स / अहवाल" 
            desc="सर्व माहितीचे विश्लेषण" 
            icon={BarChart3} 
            href="/dashboard" 
            color="bg-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="rounded-[2rem] border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="text-primary" />
                अलीकडील नोंदणी
              </CardTitle>
              <CardDescription>सिस्टममध्ये नुकत्याच झालेल्या हालचाली</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <UserPlus className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold">शेतकरी नोंदणी - राहुल पाटील</p>
                        <p className="text-xs text-muted-foreground">पुणे, महाराष्ट्र • २ तास पूर्वी</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">पहा</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-xl bg-primary text-white">
            <CardHeader>
              <CardTitle>माहिती संकलन</CardTitle>
              <CardDescription className="text-blue-100">तुमच्या विभागातील आकडेवारी</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <StatBox label="एकूण शेतकरी" value="१,२४५" />
                <StatBox label="एकूण खरेदीदार" value="८४" />
                <StatBox label="सोडवलेले प्रश्न" value="४५२" />
                <StatBox label="नवीन प्रश्न" value="१२" />
              </div>
              <Link href="/dashboard" className="block mt-8">
                <Button className="w-full bg-white text-primary hover:bg-blue-50 font-bold">
                  विस्तृत अहवाल पहा <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-white border-t py-8 text-center text-sm text-muted-foreground">
        © २०२४ MaziSheti App. सर्व हक्क राखीव.
      </footer>
    </div>
  );
}

function QuickActionCard({ title, desc, icon: Icon, href, color }: any) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-2xl transition-all cursor-pointer border-none shadow-lg rounded-[2rem] group overflow-hidden">
        <div className={cn("h-2 w-full", color)} />
        <CardContent className="pt-8">
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform", color)}>
            <Icon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{desc}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
      <p className="text-xs text-blue-100 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
