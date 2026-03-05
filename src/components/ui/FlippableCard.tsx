'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface FlippableCardProps {
    frontIcon: React.ReactNode;
    frontTitle: string;
    frontDesc: string;
    backStory: string;
    backSpecs: string[];
    index?: number;
}

export default function FlippableCard({
    frontIcon,
    frontTitle,
    frontDesc,
    backStory,
    backSpecs,
    index = 0,
}: FlippableCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative perspective-1000 h-[380px] w-full cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.7, type: 'spring', stiffness: 180, damping: 22 }}
                className="relative w-full h-full preserve-3d"
            >
                {/* ── FACE AVANT ── */}
                <div className="absolute inset-0 backface-hidden">
                    <div className="h-full bg-dark-200/40 backdrop-blur-sm border border-white/[0.07] rounded-3xl p-8 hover:border-gold/30 hover:shadow-[0_0_40px_rgba(201,168,76,0.07)] transition-all duration-700 flex flex-col items-center text-center justify-center group/card overflow-hidden relative">
                        {/* Glow de fond au hover */}
                        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />

                        {/* Ligne décorative top */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

                        {/* Icône */}
                        <div className="w-16 h-16 rounded-2xl bg-gold/5 border border-gold/15 flex items-center justify-center text-gold mb-6 group-hover/card:scale-110 group-hover/card:bg-gold/10 group-hover/card:border-gold/30 group-hover/card:shadow-[0_0_20px_rgba(201,168,76,0.2)] transition-all duration-500 relative z-10">
                            {frontIcon}
                        </div>

                        <h3 className="font-serif text-2xl text-cream mb-4 tracking-wide relative z-10">
                            {frontTitle}
                        </h3>
                        <p className="text-white/35 text-sm leading-relaxed mb-8 relative z-10">
                            {frontDesc}
                        </p>

                        {/* Hint flip */}
                        <div className="text-[10px] uppercase tracking-widest text-gold/30 group-hover/card:text-gold/70 transition-colors flex items-center gap-2 mt-auto relative z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-pulse" />
                            Découvrir l&apos;histoire
                        </div>
                    </div>
                </div>

                {/* ── FACE ARRIÈRE ── */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <div className="h-full bg-dark-100/95 border border-gold/20 rounded-3xl p-8 shadow-[0_0_60px_rgba(201,168,76,0.08)] flex flex-col relative overflow-hidden">
                        {/* Fond ambiant gold */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gold/[0.06] blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/[0.04] blur-[60px] rounded-full -ml-16 -mb-16 pointer-events-none" />

                        {/* Ligne top */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

                        <h4 className="text-[10px] uppercase tracking-[0.35em] text-gold/50 mb-4 font-bold relative z-10">
                            L&apos;Intimité
                        </h4>
                        <p className="text-white/65 leading-relaxed italic text-sm mb-6 line-clamp-6 relative z-10 flex-1">
                            &quot;{backStory}&quot;
                        </p>

                        <div className="mt-auto relative z-10">
                            <h4 className="text-[10px] uppercase tracking-[0.35em] text-gold/40 mb-3 font-bold">
                                Inclus
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                {backSpecs.slice(0, 4).map((spec, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 text-[9px] text-white/40 uppercase tracking-wider"
                                    >
                                        <div className="w-1 h-1 rounded-full bg-gold/50 shrink-0" />
                                        {spec}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hint retour */}
                        <div className="mt-6 text-[9px] uppercase tracking-[0.3em] text-white/15 text-center relative z-10">
                            Cliquer pour retourner
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
