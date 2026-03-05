'use client';

import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface LockedContentCardProps {
    title: string;
    type: string;
    price?: number;
    tier?: string;
    thumbnailUrl?: string;
    onUnlockClick: () => void;
}

export function LockedContentCard({
    title,
    type,
    price,
    tier,
    thumbnailUrl,
    onUnlockClick,
}: LockedContentCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative rounded-2xl overflow-hidden bg-dark-200 border border-white/5 aspect-[4/5] cursor-pointer"
            onClick={onUnlockClick}
        >
            {/* Background Image with strong blur */}
            {thumbnailUrl ? (
                <div
                    className="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-40 transition-opacity duration-500 group-hover:opacity-30"
                    style={{ backgroundImage: `url(${thumbnailUrl})` }}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-dark-100 to-dark-300" />
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-400 via-dark-400/80 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col p-6">
                {/* Top Badges */}
                <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/70">
                        {type}
                    </span>
                    {tier && (
                        <span className="text-xs font-semibold px-3 py-1 bg-gold/20 backdrop-blur-md border border-gold/30 rounded-full text-gold">
                            {tier}
                        </span>
                    )}
                </div>

                {/* Center Lock Icon */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center ring-1 ring-white/10 group-hover:ring-gold/40 group-hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-all duration-500">
                        <Lock className="text-white/50 group-hover:text-gold transition-colors duration-500" size={24} />
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="mt-auto text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-serif text-xl text-cream mb-2 line-clamp-2">{title}</h3>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {price ? (
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-medium border border-gold/20">
                                Débloquer pour {price} SC
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-cream text-sm font-medium border border-white/20">
                                Abonnez-vous pour voir
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Decorative Border Glow on Hover */}
            <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 rounded-2xl transition-colors duration-500" />
        </motion.div>
    );
}
