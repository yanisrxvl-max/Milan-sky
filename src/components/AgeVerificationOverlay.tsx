'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MILAN_NAME } from '@/lib/constants';

export default function AgeVerificationOverlay() {
    const [show, setShow] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const pathname = usePathname();

    const isLegalPage = pathname?.startsWith('/legal');

    useEffect(() => {
        const verified = localStorage.getItem('milan_age_verified');
        if (!verified && !isLegalPage) {
            setShow(true);
            document.body.style.overflow = 'hidden';
        } else {
            setShow(false);
            document.body.style.overflow = 'unset';
        }
    }, [isLegalPage]);

    const handleVerify = () => {
        if (!accepted) return;
        localStorage.setItem('milan_age_verified', 'true');
        setShow(false);
        document.body.style.overflow = 'unset';
    };

    if (isLegalPage) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                        className="max-w-sm w-full bg-dark-500/80 backdrop-blur-2xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden text-center"
                    >
                        {/* Subtle glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-gold/10 blur-[60px] rounded-full pointer-events-none" />

                        <div className="relative z-10">
                            <span className="text-4xl font-serif text-white mb-4 block">18+</span>
                            <h2 className="text-sm font-serif text-white mb-3 tracking-[0.2em] uppercase">
                                Contenu Sensible
                            </h2>

                            <p className="text-white/40 text-[11px] leading-relaxed mb-8 max-w-[240px] mx-auto">
                                Ce site contient du contenu réservé aux adultes.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleVerify}
                                    className="w-full py-4 bg-white text-black rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-white/90 transition-all active:scale-[0.98]"
                                >
                                    J&apos;ai plus de 18 ans
                                </button>

                                <button
                                    onClick={() => window.location.href = 'https://google.com'}
                                    className="w-full py-4 bg-transparent border border-white/10 text-white/50 rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:text-white hover:bg-white/5 transition-all active:scale-[0.98]"
                                >
                                    Quitter
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
