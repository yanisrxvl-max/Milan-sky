'use client';

import { useThemeMode } from '@/context/ThemeModeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModeToggle() {
    const { mode, toggleMode } = useThemeMode();
    const isDay = mode === 'DAY';

    return (
        <button
            onClick={toggleMode}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 active:scale-90 transition-all duration-300 touch-manipulation"
            aria-label={isDay ? 'Passer en mode Nuit' : 'Passer en mode Jour'}
        >
            <AnimatePresence mode="wait">
                {isDay ? (
                    <motion.span
                        key="angel"
                        initial={{ rotate: -90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="text-2xl select-none cursor-pointer"
                    >
                        👼🏼
                    </motion.span>
                ) : (
                    <motion.span
                        key="demon"
                        initial={{ rotate: 90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: -90, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="text-2xl select-none cursor-pointer"
                    >
                        😈
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    );
}
