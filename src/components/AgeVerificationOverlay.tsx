'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeMode } from '@/context/ThemeModeContext';

export default function AgeVerificationOverlay() {
    const { mode, toggleMode } = useThemeMode();
    const [show, setShow] = useState(false);
    const pathname = usePathname();
    const { data: session, update } = useSession();

    const [birthDate, setBirthDate] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isLegalPage = pathname?.startsWith('/legal');

    useEffect(() => {
        const verified = localStorage.getItem('milan_age_verified') === 'true';
        const sessionVerified = session?.user?.ageVerified;

        // Only show if it's NIGHT mode, not verified (local or session), and not a legal page
        if (mode === 'NIGHT' && !verified && !sessionVerified && !isLegalPage) {
            setShow(true);
            document.body.style.overflow = 'hidden';
        } else {
            setShow(false);
            if (!localStorage.getItem('milan_sky_visited')) { // Only release if not in onboarding
                // document.body.style.overflow = 'unset'; 
            }
        }
    }, [isLegalPage, mode, session]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsVerifying(true);

        try {
            const res = await fetch('/api/auth/age-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ birthDate }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.authenticated) {
                    await update({ ageVerified: true });
                }
                localStorage.setItem('milan_age_verified', 'true');
                setShow(false);
                document.body.style.overflow = 'unset';
            } else {
                const data = await res.json();
                setError(data.error || 'Erreur de vérification');
            }
        } catch (err) {
            setError('Erreur de connexion');
        } finally {
            setIsVerifying(false);
        }
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
                        className="max-w-sm w-full bg-dark-500/80 backdrop-blur-2xl p-8 md:p-10 rounded-3xl border border-red-500/20 shadow-[0_0_60px_rgba(255,0,0,0.2)] relative overflow-hidden text-center"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/10 blur-[60px] rounded-full pointer-events-none" />

                        <div className="relative z-10">
                            <span className="text-4xl font-serif text-[#ff4d4d] mb-4 block drop-shadow-[0_0_15px_rgba(255,0,0,0.3)]">18+</span>
                            <h2 className="text-sm font-serif text-white mb-3 tracking-[0.2em] uppercase">
                                Vérification Requise
                            </h2>

                            <p className="text-white/40 text-[11px] leading-relaxed mb-8 max-w-[240px] mx-auto uppercase tracking-widest">
                                L&apos;accès au Mode Nuit (+18) nécessite une confirmation légale de votre majorité.
                            </p>

                            <form onSubmit={handleVerify} className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-widest text-white/30 block text-left ml-1">Date de naissance</label>
                                    <input
                                        type="date"
                                        required
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-red-500/50 outline-none transition-all text-white"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-500 text-[9px] uppercase tracking-widest bg-red-500/10 p-2 rounded-lg">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isVerifying || !birthDate}
                                    className="w-full py-4 bg-[#ff4d4d] text-white rounded-2xl text-[10px] uppercase font-black tracking-[0.2em] hover:bg-[#ff3333] transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isVerifying ? 'Vérification...' : 'Confirmer mon âge'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        toggleMode(); // Switch back to DAY
                                        setShow(false);
                                        document.body.style.overflow = 'unset';
                                    }}
                                    className="w-full py-4 bg-transparent border border-white/10 text-white/50 rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:text-white hover:bg-white/5 transition-all active:scale-[0.98]"
                                >
                                    Retour au mode Jour
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
