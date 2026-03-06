'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoTooltipProps {
    term: string;
    definition: string;
    children?: React.ReactNode;
}

export default function InfoTooltip({ term, definition }: InfoTooltipProps) {
    const [show, setShow] = useState(false);

    return (
        <span
            className="relative inline-block cursor-help"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
            onTouchStart={() => setShow(!show)}
        >
            <span className="border-b border-dotted border-gold/40 text-gold/80 hover:text-gold transition-colors">
                {term}
            </span>
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 z-50"
                    >
                        <div className="bg-dark-300/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                            <p className="text-[9px] uppercase tracking-widest text-gold/60 font-bold mb-1.5">{term}</p>
                            <p className="text-white/60 text-xs leading-relaxed">{definition}</p>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-dark-300/95" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}
