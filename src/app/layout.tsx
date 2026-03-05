import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
});
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';
import AgeVerificationOverlay from '@/components/AgeVerificationOverlay';
import InstallBanner from '@/components/pwa/InstallBanner';

export const metadata: Metadata = {
  title: 'Milan Sky — L\'accès ultime à l\'exclusivité',
  openGraph: {
    title: 'Milan Sky',
    description: 'L\'accès ultime à l\'interdit, là où l\'exclusivité n\'a plus de limites.',
    type: 'website',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/images/milan_icon.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Milan Sky',
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
    <html lang="fr" className={`dark ${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-dark font-sans">
        <Providers>
          <InstallBanner />
          <AgeVerificationOverlay />
          <Navbar />
          <main className="min-h-[80vh]">
            {children}
          </main>
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
