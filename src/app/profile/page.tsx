
"use client";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Bookmark, 
  History, 
  LogOut,
  Camera
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ProfilePage() {
  const avatarImage = PlaceHolderImages.find(img => img.id === 'profile-avatar')?.imageUrl || "https://picsum.photos/seed/avatar/150/150";

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-headline font-bold text-primary mb-10">Your Account</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Tabs (Desktop) */}
            <aside className="lg:col-span-1 space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-3 bg-primary/5 text-primary font-bold">
                <User className="w-4 h-4" /> Personal Info
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                <Bookmark className="w-4 h-4" /> Saved Items
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                <History className="w-4 h-4" /> History
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                <Bell className="w-4 h-4" /> Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                <Shield className="w-4 h-4" /> Security
              </Button>
              <div className="pt-8">
                <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            </aside>

            {/* Profile Forms */}
            <div className="lg:col-span-3 space-y-8">
              {/* Profile Header */}
              <Card className="border-none shadow-lg rounded-3xl p-8 bg-white">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-xl ring-4 ring-primary/10">
                      <Image
                        src={avatarImage}
                        alt="Profile avatar"
                        width={128}
                        height={128}
                        className="object-cover"
                      />
                    </div>
                    <Button size="icon" className="absolute -bottom-2 -right-2 rounded-xl bg-accent hover:bg-accent/90 shadow-lg border-4 border-white h-10 w-10">
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-primary">John Doe</h2>
                    <p className="text-muted-foreground mb-4">Mazisheti Community Member since 2024</p>
                    <div className="flex gap-4 justify-center md:justify-start">
                      <div className="bg-blue-50 px-4 py-2 rounded-xl">
                        <span className="block text-xs text-primary font-bold">SAVED</span>
                        <span className="text-xl font-bold">24</span>
                      </div>
                      <div className="bg-purple-50 px-4 py-2 rounded-xl">
                        <span className="block text-xs text-accent font-bold">READ</span>
                        <span className="text-xl font-bold">156</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Account Details */}
              <Card className="border-none shadow-lg rounded-3xl p-8 bg-white">
                <CardHeader className="px-0 pt-0 mb-6">
                  <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" className="rounded-xl border-muted focus:ring-primary h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" className="rounded-xl border-muted focus:ring-primary h-12" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" className="rounded-xl border-muted focus:ring-primary h-12" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea 
                      id="bio"
                      className="w-full rounded-xl border border-muted bg-background px-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[100px]"
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <Button className="bg-primary hover:bg-primary/90 rounded-xl px-8 h-12 font-bold">
                    Save Changes
                  </Button>
                </div>
              </Card>

              {/* Preferences */}
              <Card className="border-none shadow-lg rounded-3xl p-8 bg-white">
                 <CardHeader className="px-0 pt-0 mb-6">
                  <CardTitle className="text-xl font-bold">Community Preferences</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                    <div>
                      <h4 className="font-bold text-sm">Email Newsletters</h4>
                      <p className="text-xs text-muted-foreground">Receive weekly digests from mazisheti.org</p>
                    </div>
                    <div className="h-6 w-11 bg-primary rounded-full relative">
                      <div className="absolute top-1 right-1 h-4 w-4 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                    <div>
                      <h4 className="font-bold text-sm">AI Summaries</h4>
                      <p className="text-xs text-muted-foreground">Auto-generate summaries for saved articles</p>
                    </div>
                    <div className="h-6 w-11 bg-muted rounded-full relative">
                      <div className="absolute top-1 left-1 h-4 w-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
