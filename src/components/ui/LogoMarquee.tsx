'use client';

import { motion } from 'framer-motion';
import { useThemeMode } from '@/context/ThemeModeContext';

const NIGHT_ITEMS = [
    { name: 'CEDRIC DREAMER', url: 'https://instagram.com/lereveur_' },
    { name: 'ACE CARTER', url: 'https://x.com/acecarter69' },
    { name: 'ALDES', url: 'https://x.com/iamaldes' },
    { name: 'ANDREW LEPY', url: 'https://instagram.com/andrewlepy' },
    { name: 'MAXOU TWINK', url: null },
    { name: 'TENINCHTOPX', url: 'https://x.com/teninchtopx' },
    { name: 'BOYFUN', url: null },
    { name: 'ONLYFANS', url: null },
    { name: 'TOP4FAN', url: null }
];

const DAY_SOCIALS = [
    { name: 'INSTAGRAM', url: 'https://instagram.com/onlymilansky', icon: '📸' },
    { name: 'TIKTOK', url: 'https://tiktok.com/@milansky_', icon: '🎵' },
    { name: 'TWITTER / X', url: 'https://x.com/onlymilansky', icon: '𝕏' },
    { name: 'SNAPCHAT', url: 'https://snapchat.com/add/milanskyof', icon: '👻' },
    { name: 'INSTAGRAM', url: 'https://instagram.com/onlymilansky', icon: '📸' },
    { name: 'TIKTOK', url: 'https://tiktok.com/@milansky_', icon: '🎵' },
    { name: 'TWITTER / X', url: 'https://x.com/onlymilansky', icon: '𝕏' },
    { name: 'SNAPCHAT', url: 'https://snapchat.com/add/milanskyof', icon: '👻' },
];

export default function LogoMarquee() {
    const { mode } = useThemeMode();
    const isDay = mode === 'DAY';
    const items = isDay ? DAY_SOCIALS : NIGHT_ITEMS;

    return (
        <div className="py-6 bg-dark-500 border-y border-white/[0.03] overflow-hidden whitespace-nowrap flex items-center relative z-20">
            <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-dark-500 to-transparent z-10" />
            <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-dark-500 to-transparent z-10" />

            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: isDay ? 30 : 40, ease: "linear", repeat: Infinity }}
                className="flex items-center gap-16 md:gap-32 pr-16 md:pr-32"
            >
                {[...items, ...items].map((item, i) => (
                    item.url ? (
                        <a
                            key={i}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-shrink-0 relative group transition-colors duration-300 ${isDay
                                    ? 'text-gold/50 hover:text-gold font-serif uppercase tracking-[0.3em] text-xs md:text-sm font-bold flex items-center gap-3'
                                    : 'text-white/20 hover:text-gold font-serif uppercase tracking-[0.3em] text-[10px] md:text-sm font-bold'
                                }`}
                        >
                            {isDay && 'icon' in item && (
                                <span className="text-base group-hover:scale-110 transition-transform">{(item as any).icon}</span>
                            )}
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                        </a>
                    ) : (
                        <span key={i} className="text-white/20 font-serif uppercase tracking-[0.3em] text-[10px] md:text-sm font-bold flex-shrink-0 cursor-default">
                            {item.name}
                        </span>
                    )
                ))}
            </motion.div>
        </div>
    );
}
