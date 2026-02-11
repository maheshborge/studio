
import type { Metadata } from 'next';
import './globals.css';
import { FirebaseClientProvider } from "@/firebase";

export const metadata: Metadata = {
  title: 'MaziSheti - MIDAS',
  description: 'प्रगत शेतीचा डिजिटल सोबती',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
