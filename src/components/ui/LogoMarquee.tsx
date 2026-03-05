'use client';

import { motion } from 'framer-motion';

const LOGOS = [
    'ONLYFANS', 'PORNHUB', 'BRAZZERS', 'CAM4', 'MY.FREE.CAMS', 'LOYALFANS', 'CHATURBATE', 'BLUEBELLA', 'AGENT PROVOCATEUR', 'HONEY BIRDETTE'
];

export default function LogoMarquee() {
    return (
        <div className="relative py-20 overflow-hidden bg-black/40 border-y border-white/[0.03]">
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent z-10" />

            <div className="max-w-7xl mx-auto px-4 mb-8">
                <p className="text-[10px] tracking-[0.5em] text-white/20 uppercase font-bold text-center">ILS ME FONT CONFIANCE</p>
            </div>

            <div className="flex w-full">
                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="flex gap-20 items-center whitespace-nowrap px-10"
                >
                    {[...LOGOS, ...LOGOS].map((logo, i) => (
                        <span key={i} className="text-xl md:text-2xl font-serif tracking-[0.3em] text-white/10 hover:text-white/40 transition-colors duration-500 italic uppercase">
                            {logo}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
