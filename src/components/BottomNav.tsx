'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, Coins, MessageSquare, User, Settings, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', icon: Home, label: 'Accueil' },
  { href: '/library', icon: LayoutGrid, label: 'Contenu' },
  { href: '/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/skycoins', icon: Coins, label: 'SkyCoins' },
  { href: '/dashboard', icon: User, label: 'Profil' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Don't show on auth pages
  if (['/login', '/register', '/reset-password'].includes(pathname)) return null;

  const isAdmin = session?.user?.role === 'ADMIN';
  const items = isAdmin
    ? [...navItems, { href: '/admin', icon: Settings, label: 'Admin' }]
    : navItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] w-full pb-[calc(0.75rem+env(safe-area-inset-bottom))] px-4 pointer-events-none flex justify-center lg:hidden">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto flex items-center gap-1 p-2 bg-dark-500/70 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
      >
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative group p-3 rounded-2xl transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
            >
              <div className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-gold' : 'text-white/30 group-hover:text-white/60'}`}>
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              </div>

              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white/5 rounded-2xl border border-white/5"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold shadow-[0_0_8px_rgba(201,168,76,0.8)]" />
              )}
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}
