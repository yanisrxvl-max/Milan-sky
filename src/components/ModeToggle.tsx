'use client';

import { useThemeMode } from '@/context/ThemeModeContext';
import { useI18n } from '@/context/I18nContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModeToggle() {
    const { mode, toggleMode } = useThemeMode();
    const { t } = useI18n();
    const isDay = mode === 'DAY';

    return (
        <button
            onClick={toggleMode}
            className="relative w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 active:scale-95 transition-all duration-300 touch-manipulation group"
            aria-label={isDay ? t('nav.switch_to_night') : t('nav.switch_to_day')}
        >
            <div className="absolute inset-0 bg-gold/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <AnimatePresence mode="wait">
                {isDay ? (
                    <motion.div
                        key="day"
                        initial={{ rotateY: -90, scale: 0.8, opacity: 0 }}
                        animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                        exit={{ rotateY: 90, scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-8 h-8 drop-shadow-[0_0_8px_rgba(255,215,0,0.3)] select-none cursor-pointer"
                    >
                        <img
                            src="/images/milan_logo_transparent.png"
                            alt="Day Mode Logo"
                            className="w-full h-full object-contain"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="night"
                        initial={{ rotateY: 90, scale: 0.8, opacity: 0 }}
                        animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                        exit={{ rotateY: -90, scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-8 h-8 drop-shadow-[0_0_8px_rgba(255,0,0,0.3)] select-none cursor-pointer"
                    >
                        <img
                            src="/images/milan_logo_bitten.png"
                            alt="Night Mode Logo"
                            className="w-full h-full object-contain"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}
