
"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, ChevronRight, Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleAuth = async () => {
    if (!auth || !email) return;
    setIsLoading(true);
    
    try {
      if (isForgot) {
        await sendPasswordResetEmail(auth, email);
        toast({
          title: "ईमेल पाठवला आहे",
          description: "तुमचा पासवर्ड बदलण्यासाठी ईमेल तपासा.",
        });
        setIsForgot(false);
      } else if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "लॉगिन यशस्वी!" });
        router.push("/profile");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "नोंदणी यशस्वी!", description: "कृपया तुमची प्रोफाईल पूर्ण करा." });
        router.push("/profile");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "त्रुटी",
        description: error.message || "काहीतरी चुकले आहे.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center space-x-2 mb-10">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Globe className="w-7 h-7" />
        </div>
        <span className="font-headline font-bold text-3xl text-primary">MaziSheti</span>
      </Link>

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] p-8 md:p-12 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full -ml-16 -mb-16" />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-headline font-bold text-primary mb-2 text-center">
            {isForgot ? "पासवर्ड विसरलात?" : isLogin ? "स्वागत आहे" : "नवीन खाते तयार करा"}
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            {isForgot 
              ? "तुमचा ईमेल टाका, आम्ही पासवर्ड बदलण्याची लिंक पाठवू." 
              : isLogin 
                ? "तुमच्या खात्यात प्रवेश करण्यासाठी लॉगिन करा." 
                : "MaziSheti समुदायात सामील व्हा."}
          </p>

          <div className="space-y-6">
            {!isLogin && !isForgot && (
              <div className="space-y-2">
                <Label htmlFor="name">पूर्ण नाव</Label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="name" 
                    placeholder="उदा. राहुल पाटील" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-12 h-12 rounded-xl border-muted focus:ring-primary" 
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">ईमेल पत्ता</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-muted focus:ring-primary" 
                />
              </div>
            </div>

            {!isForgot && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">पासवर्ड</Label>
                  {isLogin && (
                    <button 
                      onClick={() => setIsForgot(true)}
                      className="text-xs text-primary hover:underline"
                    >
                      पासवर्ड विसरलात?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 h-12 rounded-xl border-muted focus:ring-primary" 
                  />
                </div>
              </div>
            )}

            <Button 
              onClick={handleAuth}
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg mt-4 shadow-lg shadow-primary/20 group"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : isForgot ? "लिंक पाठवा" : isLogin ? "लॉगिन करा" : "नोंदणी करा"}
              {!isLoading && <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </div>

          <div className="mt-10 text-center text-sm">
            {isForgot ? (
              <button onClick={() => setIsForgot(false)} className="text-primary font-bold hover:underline">
                मागे वळा
              </button>
            ) : (
              <>
                <span className="text-muted-foreground">
                  {isLogin ? "खाते नाहीये?" : "आधीच खाते आहे?"}
                </span>{" "}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-bold hover:underline"
                >
                  {isLogin ? "येथे नोंदणी करा" : "येथे लॉगिन करा"}
                </button>
              </>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-10 text-xs text-muted-foreground text-center max-w-xs leading-relaxed">
        पुढे चालू ठेवून, तुम्ही MaziSheti च्या <Link href="#" className="underline">अटी आणि शर्तींशी</Link> सहमत आहात.
      </div>
    </div>
  );
}
