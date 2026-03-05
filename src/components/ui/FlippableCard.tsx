'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface FlippableCardProps {
    frontIcon: React.ReactNode;
    frontTitle: string;
    frontDesc: string;
    backStory: string;
    backSpecs: string[];
}

export default function FlippableCard({ frontIcon, frontTitle, frontDesc, backStory, backSpecs }: FlippableCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="relative perspective-1000 h-[380px] w-full cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
                className="relative w-full h-full preserve-3d"
            >
                {/* FRONT SIDE */}
                <div className="absolute inset-0 backface-hidden">
                    <div className="h-full bg-dark-200/40 backdrop-blur border border-red-500/10 rounded-3xl p-8 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(255,0,0,0.1)] transition-all duration-700 flex flex-col items-center text-center justify-center group/card overflow-hidden">
                        {/* Background Pulsing Glow */}
                        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />

                        <div className="w-16 h-16 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500 mb-6 group-hover/card:scale-110 group-hover/card:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-500 relative z-10">
                            {frontIcon}
                        </div>
                        <h3 className="font-serif text-2xl text-cream mb-4 tracking-wide relative z-10">{frontTitle}</h3>
                        <p className="text-white/30 text-sm leading-relaxed mb-8 relative z-10">{frontDesc}</p>
                        <div className="text-[10px] uppercase tracking-widest text-red-500/40 group-hover/card:text-red-500 transition-colors flex items-center gap-2 mt-auto relative z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            Découvrir l&apos;histoire
                        </div>
                    </div>
                </div>

                {/* BACK SIDE */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                    <div className="h-full bg-dark-100 border border-red-500/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(153,0,0,0.2)] flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-[60px] rounded-full -mr-16 -mt-16" />

                        <h4 className="text-[10px] uppercase tracking-[0.3em] text-red-500/60 mb-4 font-bold relative z-10">L&apos;Intimité</h4>
                        <p className="text-white/70 leading-relaxed italic text-sm mb-6 line-clamp-6 relative z-10">
                            &quot;{backStory}&quot;
                        </p>

                        <div className="mt-auto relative z-10">
                            <h4 className="text-[10px] uppercase tracking-[0.3em] text-red-500/60 mb-3 font-bold">Inclus</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {backSpecs.slice(0, 4).map((spec, i) => (
                                    <div key={i} className="flex items-center gap-2 text-[9px] text-white/30 uppercase tracking-wider">
                                        <div className="w-1 h-1 rounded-full bg-red-500/50" />
                                        {spec}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
