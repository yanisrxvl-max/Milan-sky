'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-light gold-text tracking-wider">
              Milan Sky
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: '/library', label: 'Bibliothèque' },
              { href: '/skycoins', label: 'SkyCoins' },
              { href: '/subscriptions', label: 'Abonnements' },
              { href: '/chat', label: 'Chat' },
              { href: '/private-requests', label: 'Privé' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-gold bg-gold/10'
                    : 'text-white/60 hover:text-cream hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {session ? (
              <Link
                href="/dashboard"
                className="btn-gold text-sm !py-2 !px-5"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-white/60 hover:text-cream transition-colors px-3 py-2"
                >
                  Connexion
                </Link>
                <Link href="/register" className="btn-gold text-sm !py-2 !px-5">
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
