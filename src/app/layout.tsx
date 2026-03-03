import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'Milan Sky — L\'accès ultime à l\'exclusivité',
  description: 'L\'accès ultime à l\'interdit, là où l\'exclusivité n\'a plus de limites.',
  openGraph: {
    title: 'Milan Sky',
    description: 'L\'accès ultime à l\'interdit, là où l\'exclusivité n\'a plus de limites.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0A0A0A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-dark">
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
