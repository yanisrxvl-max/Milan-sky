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
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-dark/95 backdrop-blur-xl"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="max-w-md w-full glass p-8 rounded-3xl border border-gold/20 shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Accent */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/10 blur-[100px] rounded-full" />

                        <div className="relative z-10 text-center">
                            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/20">
                                <span className="text-3xl font-serif gold-text">18+</span>
                            </div>

                            <h2 className="text-2xl font-serif gold-text mb-4 tracking-widest uppercase">
                                Contenu Sensible
                            </h2>

                            <p className="text-white/60 text-sm leading-relaxed mb-8">
                                Ce site contient du contenu visuel et verbal destiné à un public averti.
                                En entrant, vous certifiez être majeur (18+) et acceptez nos conditions d&apos;utilisation.
                            </p>

                            <div className="space-y-6">
                                <label className="flex items-start gap-3 cursor-pointer group text-left">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={accepted}
                                            onChange={(e) => setAccepted(e.target.checked)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 border border-gold/30 rounded bg-dark-200 peer-checked:bg-gold peer-checked:border-gold transition-all" />
                                        <svg
                                            className="absolute w-3.5 h-3.5 text-dark left-0.5 pointer-events-none hidden peer-checked:block"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={4}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-[12px] text-white/40 leading-tight group-hover:text-white/60 transition-colors">
                                        Je certifie avoir plus de 18 ans et j&apos;accepte les <a href="/legal/cgu" className="text-gold hover:underline">CGU</a> et la <a href="/legal/confidentialite" className="text-gold hover:underline">Politique de Confidentialité</a> de {MILAN_NAME} SKY.
                                    </span>
                                </label>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleVerify}
                                        disabled={!accepted}
                                        className="btn-gold w-full py-4 text-sm font-bold tracking-widest uppercase disabled:opacity-30 disabled:cursor-not-allowed group"
                                    >
                                        Entrer dans le Sky
                                        <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                    </button>

                                    <button
                                        onClick={() => window.location.href = 'https://google.com'}
                                        className="text-white/30 text-[10px] uppercase tracking-widest hover:text-white/50 transition-colors"
                                    >
                                        Quitter le site
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
