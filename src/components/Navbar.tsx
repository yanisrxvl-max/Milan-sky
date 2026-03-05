'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { MILAN_NAME, MILAN_AVATARS } from '@/lib/constants';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const isAdmin = session?.user?.role === 'ADMIN';

  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (session) {
      fetch('/api/skycoins')
        .then(res => res.json())
        .then(data => setBalance(data.balance))
        .catch(() => { });
    }
  }, [session]);

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/library', label: 'Bibliothèque' },
    { href: '/muses', label: 'Les Muses' },
    { href: '/chat', label: 'Chat' },
    { href: '/private-requests', label: 'Privé' },
    { href: '/skycoins', label: 'SkyCoins' },
    { href: '/subscriptions', label: 'Abonnements' },
    { href: '/story', label: 'Histoire' },
    ...(isAdmin ? [{ href: '/admin', label: 'Admin' }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md bg-dark/40 border-b border-gold/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex flex-col items-center gap-0 group relative py-4">
            <div className="flex flex-col items-center leading-none overflow-visible pb-1">
              <div className="w-8 h-[2px] bg-gold/60 mb-1.5 transform group-hover:scale-x-150 transition-transform duration-700" />
              <span className="font-serif text-3xl font-light text-white tracking-[0.05em] mb-1">MILAN</span>
              <div className="flex items-center gap-2 w-full">
                <div className="h-[0.5px] flex-1 bg-gradient-to-l from-gold/40 to-transparent" />
                <span className="text-[10px] uppercase tracking-[0.8em] font-black gold-text-glow italic ml-[0.8em]">SKY</span>
                <div className="h-[0.5px] flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
              </div>
            </div>
            <div className="absolute -bottom-2 h-4 w-full" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${isActive(link.href)
                  ? 'text-gold bg-gold/10'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth & Balance Section */}
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                {/* Balance Display - Monetization Psychology */}
                {balance !== null && (
                  <Link href="/skycoins" className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-full hover:bg-gold/20 transition-all group">
                    <span className="text-[10px] font-black text-gold tracking-tighter">{balance} SC</span>
                    <div className="w-4 h-4 rounded-full bg-gold flex items-center justify-center text-[10px] text-dark font-bold group-hover:scale-110 transition-transform">✦</div>
                  </Link>
                )}

                <Link href="/chat" className="relative group">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gold/30 group-hover:border-gold transition-colors">
                    <img
                      src={(MILAN_AVATARS as any)[session.user.subscription?.tier || 'GUEST'] || MILAN_AVATARS.GUEST}
                      alt={MILAN_NAME}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <Link
                  href="/dashboard"
                  className="btn-gold text-[10px] !py-2 !px-4 uppercase tracking-[0.2em]"
                >
                  Me
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-[10px] uppercase tracking-widest text-white/40 hover:text-cream transition-colors px-3 py-2"
                >
                  Connexion
                </Link>
                <Link href="/register" className="btn-gold text-[10px] !py-2 !px-5 uppercase tracking-widest">
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
