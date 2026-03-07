'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';
import { LogIn, UserPlus, ChevronDown } from 'lucide-react';

export default function AuthDropdown() {
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all active:scale-95 group text-white"
            >
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80 group-hover:text-gold transition-colors">
                    Connexion
                </span>
                <ChevronDown
                    size={14}
                    className={`text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-48 bg-dark-400/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 p-1"
                    >
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors group"
                        >
                            <LogIn size={16} className="text-white/40 group-hover:text-white" />
                            <span className="text-xs font-semibold tracking-wider uppercase">Se connecter</span>
                        </Link>

                        <div className="h-px w-full bg-white/5 my-1" />

                        <Link
                            href="/register"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gold/80 hover:text-dark hover:bg-gold rounded-xl transition-colors group"
                        >
                            <UserPlus size={16} className="text-gold/60 group-hover:text-dark" />
                            <span className="text-xs font-bold tracking-wider uppercase">Créer un compte</span>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
