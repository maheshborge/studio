
"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, ChevronRight, Mail, Lock, User as UserIcon, Loader2, Phone, ShieldCheck, ArrowLeft, Info, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, useFirestore } from "@/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";

const USER_TYPES = [
  { value: "farmer", label: "शेतकरी (Farmer)" },
  { value: "buyer", label: "खरेदीदार (Buyer)" },
  { value: "suvidha_kendra", label: "सुविधा केंद्र (Suvidha Kendra)" },
  { value: "supplier", label: "सप्लायर (Supplier)" },
  { value: "transporter", label: "ट्रान्सपोर्टर (Transporter)" },
  { value: "consultant", label: "सल्लागार (Consultant)" },
  { value: "expert", label: "एक्सपर्ट (Expert)" }
];

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [userType, setUserType] = useState("");
  
  const auth = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleAuth = async () => {
    if (!auth || !db) return;
    
    if (isForgot) {
      if (!email || !email.includes("@")) {
        return toast({ 
          variant: "destructive", 
          title: "त्रुटी", 
          description: "कृपया तुमचा नोंदणीकृत ईमेल पत्ता टाका. पासवर्ड बदलण्याची लिंक त्याच ईमेलवर येईल." 
        });
      }
      setIsLoading(true);
      try {
        await sendPasswordResetEmail(auth, email);
        toast({
          title: "ईमेल पाठवला आहे",
          description: "पासवर्ड बदलण्यासाठीची लिंक तुमच्या ईमेलवर पाठवली आहे. कृपया स्पॅम फोल्डरही तपासा.",
        });
        setIsForgot(false);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "त्रुटी",
          description: "हा ईमेल सिस्टिममध्ये सापडला नाही. कृपया तुम्ही योग्य ईमेल टाकला आहे का ते तपासा.",
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!isLogin) {
      if (!name) return toast({ variant: "destructive", title: "त्रुटी", description: "कृपया पूर्ण नाव टाका." });
      if (mobile.length !== 10) return toast({ variant: "destructive", title: "त्रुटी", description: "मोबाईल नंबर १० अंकी असावा." });
      if (!userType) return toast({ variant: "destructive", title: "त्रुटी", description: "कृपया तुमचा प्रकार निवडा." });
    }

    if (password.length < 6) {
      return toast({ variant: "destructive", title: "त्रुटी", description: "पासवर्ड किमान ६ अंकी असावा." });
    }

    setIsLoading(true);
    
    try {
      if (isLogin) {
        const loginIdentifier = (email.length === 10 && /^\d+$/.test(email)) 
          ? `${email}@mazisheti.local` 
          : email;
          
        await signInWithEmailAndPassword(auth, loginIdentifier, password);
        toast({ title: "लॉगिन यशस्वी!" });
        router.push("/profile");
      } else {
        const finalEmail = email || `${mobile}@mazisheti.local`;
        const userCredential = await createUserWithEmailAndPassword(auth, finalEmail, password);
        const user = userCredential.user;
        
        if (email && email.includes("@")) {
          sendEmailVerification(user).catch(err => console.error("Email verification error", err));
        }

        await setDoc(doc(db, "users", user.uid, "profile", "main"), {
          id: user.uid,
          name,
          mobile,
          email: email || null,
          userType,
          createdAt: new Date().toISOString()
        });

        toast({ title: "नोंदणी यशस्वी!", description: "MaziSheti मध्ये तुमचे स्वागत आहे." });
        router.push("/profile");
      }
    } catch (error: any) {
      let errorMessage = "काहीतरी चुकले आहे.";
      if (error.code === "auth/email-already-in-use") errorMessage = "हा मोबाईल नंबर किंवा ईमेल आधीच नोंदणीकृत आहे.";
      if (error.code === "auth/invalid-credential") errorMessage = "चुकीचा पासवर्ड किंवा मोबाईल नंबर.";
      
      toast({
        variant: "destructive",
        title: "त्रुटी",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Link href="/" className="flex items-center space-x-2 mb-10">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
          <Globe className="w-7 h-7" />
        </div>
        <span className="font-headline font-bold text-3xl text-primary">MaziSheti</span>
      </Link>

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] p-8 md:p-12 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
        
        <div className="relative z-10">
          <h2 className="text-3xl font-headline font-bold text-primary mb-2 text-center">
            {isForgot ? "पासवर्ड विसरलात?" : isLogin ? "लॉगिन करा" : "नवीन नोंदणी"}
          </h2>
          <p className="text-muted-foreground text-center mb-10 text-sm">
            {isForgot 
              ? "तुमचा ईमेल टाका, आम्ही पासवर्ड बदलण्याची लिंक पाठवू." 
              : isLogin 
                ? "तुमच्या खात्यात प्रवेश करण्यासाठी लॉगिन करा." 
                : "MaziSheti समुदायात सामील होण्यासाठी माहिती भरा."}
          </p>

          {!isLogin && !isForgot && (
            <Alert className="mb-6 bg-blue-50 border-blue-100 rounded-2xl">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-[11px] text-blue-700 leading-tight">
                <strong>महत्त्वाचे:</strong> पासवर्ड विसरल्यास तो रिसेट करण्यासाठी खरा ईमेल पत्ता देणे आवश्यक आहे. ईमेलशिवाय पासवर्ड बदलता येणार नाही.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-5">
            {isForgot && (
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="font-bold">नोंदणीकृत ईमेल</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                  <Input 
                    id="reset-email" 
                    type="email"
                    placeholder="example@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 rounded-xl border-slate-200" 
                  />
                </div>
              </div>
            )}

            {!isForgot && !isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold">पूर्ण नाव <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <Input 
                      id="name" 
                      placeholder="उदा. राहुल पाटील" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-12 h-12 rounded-xl border-slate-200" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userType" className="font-bold">तुम्ही कोण आहात? <span className="text-red-500">*</span></Label>
                  <Select onValueChange={setUserType}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-200">
                      <SelectValue placeholder="निवडा" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {!isForgot && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="login-id" className="font-bold">{isLogin ? "मोबाईल किंवा ईमेल" : "मोबाईल नंबर"}</Label>
                  <div className="relative">
                    {isLogin ? <UserIcon className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" /> : <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />}
                    <Input 
                      id="login-id" 
                      placeholder={isLogin ? "मोबाईल किंवा ईमेल टाका" : "१० अंकी मोबाईल नंबर"} 
                      value={isLogin ? email : mobile}
                      onChange={(e) => isLogin ? setEmail(e.target.value) : setMobile(e.target.value)}
                      className="pl-12 h-12 rounded-xl border-slate-200" 
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="font-bold text-slate-500 italic">ईमेल (पासवर्ड विसरल्यास उपयोगाचा)</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-300" />
                      <Input 
                        id="reg-email" 
                        type="email" 
                        placeholder="email@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-12 rounded-xl border-slate-100" 
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{isLogin ? "पासवर्ड" : "पासवर्ड सेट करा"} <span className="text-red-500">*</span></Label>
                    {isLogin && (
                      <button onClick={() => setIsForgot(true)} className="text-xs text-primary font-bold hover:underline">
                        पासवर्ड विसरलात?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="किमान ६ अंकी" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 rounded-xl border-slate-200" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <Button 
              onClick={handleAuth}
              disabled={isLoading}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg mt-4 shadow-lg shadow-primary/20"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : isForgot ? "लिंक पाठवा" : isLogin ? "लॉगिन करा" : "नोंदणी करा"}
              {!isLoading && <ChevronRight className="ml-2 w-5 h-5" />}
            </Button>
          </div>

          <div className="mt-8 text-center text-sm">
            {isForgot ? (
              <button onClick={() => setIsForgot(false)} className="text-primary font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
                <ArrowLeft className="w-4 h-4" /> लॉगिनकडे वळा
              </button>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <span className="text-slate-500">
                  {isLogin ? "खाते नाहीये?" : "आधीच खाते आहे?"}
                </span>{" "}
                <button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setShowPassword(false); // Reset visibility when switching
                  }}
                  className="text-primary font-bold hover:underline ml-1"
                >
                  {isLogin ? "येथे नोंदणी करा" : "येथे लॉगिन करा"}
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4" /> तुमची माहिती सुरक्षित आहे.
      </div>
    </div>
  );
}
