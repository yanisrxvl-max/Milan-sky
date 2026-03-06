'use client';

import Link from 'next/link';
import { MILAN_NAME } from '@/lib/constants';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const links = [
        { label: 'Mentions Légales', href: '/legal/mentions-legales' },
        { label: 'CGU', href: '/legal/cgu' },
        { label: 'CGV', href: '/legal/cgv' },
        { label: 'Confidentialité', href: '/legal/confidentialite' },
        { label: 'Cookies', href: '/legal/cookies' },
    ];

    return (
        <footer className="relative z-10 py-12 px-4 border-t border-gold/5 bg-dark">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* Logo / Brand */}
                <div className="flex flex-col items-center mb-10 overflow-visible pb-4">
                    <div className="w-12 h-[1px] bg-gold/40 mb-3" />
                    <Link href="/" className="group flex flex-col items-center gap-2 overflow-visible">
                        <div className="w-12 h-12 relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-gold/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <img
                                src="/images/milan_logo_transparent.png"
                                alt="Milan Sky"
                                className="w-full h-full object-contain relative z-10 drop-shadow-[0_2px_8px_rgba(255,215,0,0.15)] group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-serif text-2xl md:text-3xl text-white tracking-[0.2em] group-hover:gold-text-glow transition-all duration-500">MILAN</span>
                            <span className="text-[10px] uppercase tracking-[0.6em] gold-text mt-1 font-bold italic ml-[0.6em]">SKY</span>
                        </div>
                    </Link>
                </div>

                {/* Legal Links */}
                <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-[11px] uppercase tracking-widest text-white/30 hover:text-gold transition-colors duration-300"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Disclaimer / Copyright */}
                <div className="text-center space-y-3">
                    <p className="text-[10px] text-white/20 tracking-wide max-w-lg leading-relaxed uppercase">
                        Plateforme réservée aux adultes (18+). Tous droits réservés.
                        Toute reproduction ou redistribution de contenu est strictement interdite.
                    </p>
                    <p className="text-[9px] text-white/10 tracking-[0.2em] font-light">
                        © {currentYear} {MILAN_NAME} SKY — LUXURY DIGITAL EXPERIENCE
                    </p>
                </div>
            </div>
        </footer>
    );
}
