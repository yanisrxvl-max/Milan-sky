'use client';

import { useThemeMode } from '@/context/ThemeModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles, Zap } from 'lucide-react';

export default function ModeToggle() {
    const { mode, toggleMode } = useThemeMode();

    return (
        <button
            onClick={toggleMode}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-milan-accent/30 bg-milan-glass backdrop-blur-md overflow-hidden group touch-manipulation active:scale-95 transition-all duration-300"
        >
            <div className="absolute inset-0 bg-milan-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative w-8 h-8 flex items-center justify-center text-xl">
                <AnimatePresence mode="wait">
                    {mode === 'DAY' ? (
                        <motion.div
                            key="angel"
                            initial={{ y: 10, opacity: 0, scale: 0.5 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -10, opacity: 0, scale: 0.5 }}
                        >
                            👼
                        </motion.div>
                    ) : (
                        <motion.div
                            key="demon"
                            initial={{ y: 10, opacity: 0, scale: 0.5 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -10, opacity: 0, scale: 0.5 }}
                        >
                            😈
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex flex-col items-start pr-2 text-left">
                <span className="text-[9px] uppercase tracking-tight font-black leading-none opacity-60 whitespace-nowrap">
                    Mode de l&apos;avatar : {mode === 'DAY' ? 'Jour' : 'Nuit'}
                </span>
            </div>

            <motion.div
                animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.1, 1]
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-gold/30"
            >
                <Sparkles size={12} />
            </motion.div>
        </button>
    );
}
