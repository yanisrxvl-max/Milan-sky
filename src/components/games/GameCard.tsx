'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface GameCardProps {
    id: string;
    name: string;
    description: string;
    difficulty: string;
    rewards: string[];
    index: number;
}

export default function GameCard({ id, name, description, difficulty, rewards, index }: GameCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="group relative bg-dark-400 border border-white/5 rounded-[2rem] p-6 lg:p-8 overflow-hidden hover:border-gold/30 transition-all duration-500"
        >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-transparent to-gold/0 group-hover:from-gold/5 group-hover:to-transparent transition-all duration-700 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="font-serif text-2xl text-cream group-hover:text-gold transition-colors">{name}</h3>
                    <span className="text-[10px] uppercase tracking-widest text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        {difficulty}
                    </span>
                </div>

                <p className="text-white/60 text-sm font-light leading-relaxed mb-8 flex-grow">
                    {description}
                </p>

                <div className="space-y-6">
                    <div>
                        <span className="text-[10px] uppercase tracking-widest text-gold/80 font-bold block mb-3">Récompenses</span>
                        <div className="flex flex-wrap gap-2">
                            {rewards.map((reward, i) => (
                                <span key={i} className="text-xs text-white/50 bg-dark-500 px-3 py-1.5 rounded-lg border border-white/5">
                                    {reward}
                                </span>
                            ))}
                        </div>
                    </div>

                    <Link href={`/games/${id}`} className="block">
                        <button className="w-full relative px-6 py-4 bg-white/5 text-cream text-sm font-bold tracking-widest uppercase rounded-xl border border-white/10 hover:border-gold/50 transition-all flex items-center justify-between group/btn min-h-[44px] touch-manipulation active:scale-[0.98]">
                            <span className="group-hover/btn:text-gold transition-colors">Jouer</span>
                            <ChevronRight size={18} className="text-white/30 group-hover/btn:text-gold group-hover/btn:translate-x-1 transition-all" />
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
