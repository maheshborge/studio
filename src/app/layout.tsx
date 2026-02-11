import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase";

export const metadata: Metadata = {
  title: 'MaziSheti - MIDAS Platform',
  description: 'प्रगत शेतीचा डिजिटल सोबती - MIDAS Platform by Mazisheti.org',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mr">
      <body className="font-body antialiased min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
        <FirebaseClientProvider>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
