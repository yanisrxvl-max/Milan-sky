'use client';

import { useI18n, Locale } from '@/context/I18nContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const FLAGS: { locale: Locale; flag: string; label: string }[] = [
    { locale: 'fr', flag: '🇫🇷', label: 'Français' },
    { locale: 'en', flag: '🇬🇧', label: 'English' },
    { locale: 'ar', flag: '🇸🇦', label: 'العربية' },
    { locale: 'pt', flag: '🇧🇷', label: 'Português' },
];

export default function LanguageSelector() {
    const { locale, setLocale } = useI18n();
    const [isOpen, setIsOpen] = useState(false);

    const currentFlag = FLAGS.find(f => f.locale === locale) || FLAGS[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/5 transition-all touch-manipulation"
                aria-label="Change language"
            >
                <span className="text-base leading-none">{currentFlag.flag}</span>
                <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold hidden sm:inline">
                    {locale.toUpperCase()}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div className="fixed inset-0 z-[199]" onClick={() => setIsOpen(false)} />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute top-full left-0 mt-2 z-[200] bg-dark-300/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl min-w-[140px]"
                        >
                            {FLAGS.map((item) => (
                                <button
                                    key={item.locale}
                                    onClick={() => {
                                        setLocale(item.locale);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all hover:bg-white/5 ${locale === item.locale ? 'bg-gold/10 text-gold' : 'text-white/60'
                                        }`}
                                >
                                    <span className="text-lg leading-none">{item.flag}</span>
                                    <span className="text-[10px] uppercase tracking-widest font-bold">{item.label}</span>
                                    {locale === item.locale && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
