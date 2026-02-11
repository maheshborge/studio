
import type { Metadata } from 'next';
import './globals.css';

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
      <body className="antialiased min-h-screen bg-slate-50">
        {children}
      </body>
    </html>
  );
}
