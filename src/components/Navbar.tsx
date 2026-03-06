'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { MILAN_NAME, MILAN_AVATARS } from '@/lib/constants';
import { useThemeMode } from '@/context/ThemeModeContext';
import { useI18n } from '@/context/I18nContext';
import AnimatedCounter from './ui/AnimatedCounter';
import ModeToggle from './ModeToggle';
import GoogleTranslate from './GoogleTranslate';

export default function Navbar() {
  const { data: session } = useSession();
  const { mode } = useThemeMode();
  const { t } = useI18n();
  const isDay = mode === 'DAY';
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/', label: t('nav.home') },
    { href: '/library', label: isDay ? 'Contenu de jour' : 'Contenu de nuit' },
    { href: '/chat', label: 'Chat' },
    { href: '/skycoins', label: 'SkyCoins' },
    { href: '/subscriptions', label: isDay ? t('nav.subscriptions') : 'Accès' },
    ...(isDay ? [{ href: '/engagement', label: 'Engagements' }] : []),
    ...(isAdmin ? [{ href: '/admin', label: t('nav.admin') }] : []),
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-dark-500/80 backdrop-blur-xl border-b border-white/[0.04] py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-[90rem] mx-auto px-4 md:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-14' : 'h-20'}`}>
          <div className="flex items-center gap-2 md:gap-3 shrink-0 md:mr-10">
            <Link href="/" className="flex flex-col items-center gap-0 group relative cursor-pointer shrink-0">
              <div className="flex flex-col items-center leading-none overflow-visible">
                <div className={`bg-gold mb-1.5 transform group-hover:scale-x-150 transition-all duration-700 ${isScrolled ? 'w-4 h-[1px]' : 'w-6 h-[2px] opacity-60'}`} />
                <span className={`font-serif font-light text-white tracking-[0.05em] mb-1 transition-all duration-500 ${isScrolled ? 'text-xl' : 'text-2xl'}`}>MILAN</span>
                <div className={`flex items-center gap-2 w-full transition-all duration-500 ${isScrolled ? 'opacity-0 h-0 hidden' : 'opacity-100'}`}>
                  <div className={`h-[0.5px] flex-1 bg-gradient-to-l ${isDay ? 'from-gold/40' : 'from-gray-400/40'} to-transparent`} />
                  <span className={`text-[10px] uppercase tracking-[0.8em] font-black italic ml-[0.8em] ${isDay ? 'gold-text-glow' : 'silver-text'}`}>SKY</span>
                  <div className={`h-[0.5px] flex-1 bg-gradient-to-r ${isDay ? 'from-gold/40' : 'from-gray-400/40'} to-transparent`} />
                </div>
              </div>
              <div className="absolute -inset-4" /> {/* Click target */}
            </Link>

            {/* Language Selector — under logo */}
            <div className={`transition-all duration-500 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
              <GoogleTranslate />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5 p-1 rounded-2xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-md mx-auto">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1.5 rounded-xl text-[9px] uppercase tracking-[0.1em] font-bold transition-all duration-300 relative ${isActive(link.href)
                  ? 'text-gold'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
              >
                {isActive(link.href) && (
                  <div className="absolute inset-0 bg-gold/10 rounded-xl border border-gold/20" />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth & Balance Section */}
          <div className="flex items-center gap-3 md:gap-10 shrink-0 md:ml-10">
            <div className="flex items-center px-1 md:px-2">
              <ModeToggle />
            </div>

            {session ? (
              <div className="flex items-center gap-3 md:gap-5">
                {/* Balance Display */}
                {balance !== null && (
                  <Link href="/skycoins" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gold/5 border border-gold/10 rounded-full hover:bg-gold/10 hover:border-gold/30 transition-all group">
                    <span className="text-[10px] font-black text-gold tracking-widest"><AnimatedCounter value={balance} /> SC</span>
                    <div className="w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center text-[8px] text-gold font-black group-hover:bg-gold group-hover:text-dark transition-colors">SC</div>
                  </Link>
                )}

                <Link href="/chat" className="hidden md:flex relative group items-center justify-center">
                  <div className="absolute inset-0 bg-gold rounded-full opacity-0 blur-md group-hover:opacity-40 transition-opacity" />
                  <div className={`rounded-full overflow-hidden border border-white/10 group-hover:border-gold transition-all duration-500 relative z-10 ${isScrolled ? 'w-8 h-8' : 'w-10 h-10'}`}>
                    <img
                      src={(MILAN_AVATARS as any)[session.user.subscription?.tier || 'GUEST'] || MILAN_AVATARS.GUEST}
                      alt={MILAN_NAME}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Notification Dot Simulation */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-dark-500 z-20" />
                </Link>

                <Link
                  href="/dashboard"
                  className={`hidden md:flex btn-gold text-[9px] uppercase tracking-[0.2em] relative group overflow-hidden touch-manipulation flex-shrink-0 ${isScrolled ? '!py-2 !px-4' : '!py-3 !px-6'}`}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10">{t('nav.profile')}</span>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-3">
                <Link
                  href="/login"
                  className="hidden xs:flex text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 hover:text-white transition-colors px-2 md:px-4 py-3 min-h-[44px] items-center justify-center touch-manipulation"
                >
                  {t('nav.login')}
                </Link>
                <Link href="/register" className={`btn-gold text-[9px] md:text-[10px] uppercase font-bold tracking-[0.1em] md:tracking-[0.2em] touch-manipulation ${isScrolled ? '!py-2 !px-3 md:!px-5' : '!py-2 md:!py-3 !px-3 md:!px-6'}`}>
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
