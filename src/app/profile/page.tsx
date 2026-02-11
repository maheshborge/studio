
"use client";

import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { doc } from "firebase/firestore";
import { User, LogOut, Loader2, Sprout } from "lucide-react";
import { signOut } from "firebase/auth";
import { useAuth } from "@/firebase";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "main");
  }, [db, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-600 w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white">
              <Sprout className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-bold">माझे डॅशबोर्ड</h1>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" /> लॉग आऊट
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-center mb-2">{profile?.name || "शेतकरी मित्र"}</h2>
            <p className="text-center text-slate-500 text-sm mb-6">{profile?.mobile}</p>
            <div className="bg-green-50 text-green-700 text-center py-2 rounded-xl font-bold text-xs uppercase tracking-widest">
              {profile?.userType || "User"}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold mb-4">स्वागत आहे!</h3>
              <p className="text-slate-600 leading-relaxed">
                मिडास प्लॅटफॉर्मवर तुमचे स्वागत आहे. लवकरच येथे तुम्हाला तुमच्या पिकांची माहिती आणि बाजारपेठेतील दर दिसू लागतील.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
