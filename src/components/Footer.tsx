'use client';

import Link from 'next/link';
import { MILAN_NAME } from '@/lib/constants';
import { useI18n } from '@/context/I18nContext';

export default function Footer() {
    const { t } = useI18n();
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
                    <Link href="/" className="group flex flex-col items-center overflow-visible">
                        <span className="font-serif text-3xl text-white tracking-[0.2em] group-hover:gold-text-glow transition-all duration-500">MILAN</span>
                        <span className="text-[10px] uppercase tracking-[0.6em] gold-text mt-1 font-bold italic ml-[0.6em]">SKY</span>
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
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 text-red-500/60 text-[10px] uppercase tracking-[0.2em] font-bold border border-red-500/10 px-4 py-2 rounded-xl bg-red-500/5 mx-auto w-fit">
                        {t('footer.age_legal')}
                    </div>
                    <p className="text-[9px] text-white/10 tracking-[0.2em] font-light uppercase">
                        © {currentYear} {MILAN_NAME} SKY — LUXURY DIGITAL EXPERIENCE
                    </p>
                </div>
            </div>
        </footer>
    );
}
