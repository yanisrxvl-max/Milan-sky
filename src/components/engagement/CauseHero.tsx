'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface CauseHeroProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    accentColor: string;       // e.g. 'text-blue-400'
    gradientFrom: string;      // e.g. 'from-blue-500/20'
    borderColor: string;       // e.g. 'border-blue-500/30'
}

export default function CauseHero({ icon: Icon, title, subtitle, accentColor, gradientFrom, borderColor }: CauseHeroProps) {
    return (
        <section className="relative z-10 pt-28 pb-20 px-4">
            {/* Background glow */}
            <div className={`absolute inset-0 bg-gradient-to-b ${gradientFrom} to-transparent opacity-30 pointer-events-none`} />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Back */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        href="/engagement"
                        className="inline-flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-widest font-bold hover:text-white transition-colors mb-12 group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Retour aux engagements
                    </Link>
                </motion.div>

                {/* Icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={`w-20 h-20 rounded-3xl border ${borderColor} bg-white/5 flex items-center justify-center mb-8 ${accentColor}`}
                >
                    <Icon size={36} />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-serif text-4xl md:text-6xl text-cream tracking-tight mb-6 leading-tight"
                >
                    {title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-white/40 text-base md:text-lg max-w-2xl leading-relaxed"
                >
                    {subtitle}
                </motion.p>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className={`h-[1px] mt-12 origin-left bg-gradient-to-r ${gradientFrom.replace('from-', 'from-').replace('/20', '/40')} to-transparent`}
                />
            </div>
        </section>
    );
}
