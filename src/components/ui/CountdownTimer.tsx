'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownTimerProps {
    /** Durée cible (timestamp Unix en ms) — si absent, compte depuis maintenant + offsetHours */
    targetDate?: Date;
    offsetHours?: number;
    label?: string;
    variant?: 'hero' | 'card' | 'minimal';
    className?: string;
}

function pad(n: number) {
    return n.toString().padStart(2, '0');
}

function getTimeLeft(target: Date) {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { h: 0, m: 0, s: 0 };
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s };
}

function Digit({ value, variant }: { value: string; variant: string }) {
    return (
        <div className="relative overflow-hidden">
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={value}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className={`block tabular-nums ${variant === 'hero'
                            ? 'font-serif text-3xl md:text-4xl gold-text font-bold'
                            : variant === 'card'
                                ? 'font-serif text-2xl gold-text font-bold'
                                : 'font-mono text-lg text-gold font-bold'
                        }`}
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </div>
    );
}

export default function CountdownTimer({
    targetDate,
    offsetHours = 4,
    label = 'Prochain drop exclusif dans',
    variant = 'hero',
    className = '',
}: CountdownTimerProps) {
    // Stabiliser la cible côté client
    const [target] = useState<Date>(() => {
        if (targetDate) return targetDate;
        const now = new Date();
        now.setHours(now.getHours() + offsetHours);
        return now;
    });

    const [time, setTime] = useState(getTimeLeft(target));
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const id = setInterval(() => setTime(getTimeLeft(target)), 1000);
        return () => clearInterval(id);
    }, [target]);

    if (!mounted) return null;

    const segments = [
        { value: pad(time.h), unit: 'H' },
        { value: pad(time.m), unit: 'M' },
        { value: pad(time.s), unit: 'S' },
    ];

    if (variant === 'minimal') {
        return (
            <span className={`font-mono text-gold font-bold ${className}`}>
                {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
            </span>
        );
    }

    return (
        <div className={`flex flex-col items-center gap-3 ${className}`}>
            <p className="text-white/30 text-[10px] uppercase tracking-[0.4em] font-bold">
                {label}
            </p>
            <div className="flex items-center gap-3">
                {segments.map(({ value, unit }, i) => (
                    <div key={unit} className="flex items-center gap-3">
                        <div
                            className={`flex flex-col items-center ${variant === 'hero'
                                    ? 'bg-black/40 backdrop-blur-sm border border-gold/20 rounded-xl px-4 py-3 min-w-[60px]'
                                    : 'bg-white/5 border border-white/10 rounded-lg px-3 py-2 min-w-[48px]'
                                }`}
                        >
                            <Digit value={value} variant={variant} />
                            <span className="text-[8px] uppercase tracking-[0.3em] text-gold/40 font-bold mt-1">
                                {unit}
                            </span>
                        </div>
                        {i < segments.length - 1 && (
                            <span
                                className={`font-bold ${variant === 'hero' ? 'text-gold/40 text-2xl' : 'text-white/20 text-lg'
                                    }`}
                            >
                                :
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
