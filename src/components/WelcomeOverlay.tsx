'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeMode } from '@/context/ThemeModeContext';
import { Sparkles, Flame } from 'lucide-react';

export default function WelcomeOverlay() {
    const [show, setShow] = useState(false);
    const [hoveredSide, setHoveredSide] = useState<'DAY' | 'NIGHT' | null>(null);
    const [verifyingAge, setVerifyingAge] = useState(false);
    const { toggleMode } = useThemeMode();

    useEffect(() => {
        // Use sessionStorage instead of localStorage so it appears on every new visit/tab
        const visited = sessionStorage.getItem('milan_sky_visited');
        if (!visited) {
            setShow(true);
            document.body.style.overflow = 'hidden';
        }
    }, []);

    const handleSelectDay = () => {
        sessionStorage.setItem('milan_sky_visited', 'true');
        setShow(false);
        document.body.style.overflow = 'unset';
    };

    const handleSelectNight = () => {
        setVerifyingAge(true);
    };

    const confirmAge = () => {
        sessionStorage.setItem('milan_sky_visited', 'true');
        localStorage.setItem('milan_age_verified', 'true'); // They clicked Night, so they see +18 and accept.

        // Trigger the theme switch to Night
        toggleMode();

        setShow(false);
        document.body.style.overflow = 'unset';
    };

    const cancelAge = () => {
        setVerifyingAge(false);
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[300] bg-black text-white flex flex-col items-center justify-center overflow-hidden"
            >
                {/* Dynamic Background */}
                <div className="absolute inset-0 pointer-events-none transition-colors duration-1000">
                    <div className={`absolute inset-0 opacity-40 transition-opacity duration-1000 ${hoveredSide === 'DAY' ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'radial-gradient(circle at 30% 50%, rgba(201,168,76,0.15), transparent 60%)' }} />
                    <div className={`absolute inset-0 opacity-40 transition-opacity duration-1000 ${hoveredSide === 'NIGHT' ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'radial-gradient(circle at 70% 50%, rgba(255,0,50,0.15), transparent 60%)' }} />
                    <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay" />
                </div>

                {!verifyingAge ? (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="absolute top-8 md:top-20 text-center z-20 px-4 w-full"
                        >
                            <h1 className="font-serif text-2xl md:text-5xl text-cream tracking-wide mb-2 md:mb-3">
                                <span className="italic font-light">Choisis ton</span> Univers
                            </h1>
                            <p className="text-white/40 text-[10px] md:text-base max-w-[280px] md:max-w-lg mx-auto uppercase tracking-widest font-light">
                                Le divertissement, l&apos;intelligence émotionnelle, ou le fruit défendu.
                            </p>
                        </motion.div>

                        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-stretch justify-center h-full gap-4 md:gap-4 px-4 pt-32 pb-16 md:py-0 overflow-y-auto">

                            {/* DAY MODE CHOICE */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                                onHoverStart={() => setHoveredSide('DAY')}
                                onHoverEnd={() => setHoveredSide(null)}
                                onClick={handleSelectDay}
                                className="flex-1 w-full flex flex-col items-center justify-center cursor-pointer group p-4 md:p-8 rounded-[2rem] md:rounded-3xl transition-all duration-700 bg-white/[0.03] md:bg-transparent hover:bg-white/[0.05] border border-white/5 md:border-transparent active:scale-[0.98] md:active:scale-100"
                            >
                                <div className="relative w-20 h-20 md:w-48 md:h-48 mb-3 md:mb-8 drop-shadow-[0_0_20px_rgba(201,168,76,0.3)] md:drop-shadow-[0_0_30px_rgba(201,168,76,0.2)] group-hover:drop-shadow-[0_0_60px_rgba(201,168,76,0.6)] transition-all duration-700 group-hover:scale-105 pointer-events-none">
                                    <div className="absolute inset-0 bg-gold/10 rounded-full blur-3xl opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <img src="/images/milan_logo_transparent.png" alt="Pomme Intacte" className="w-full h-full object-contain relative z-10" />
                                </div>
                                <div className="text-center pointer-events-none">
                                    <h2 className="text-lg md:text-3xl font-serif text-gold mb-1 md:mb-3 flex items-center justify-center gap-2">
                                        <Sparkles size={16} className="text-gold md:w-5 md:h-5" />
                                        Le Sanctuaire
                                    </h2>
                                    <h3 className="text-[9px] md:text-xs tracking-[0.3em] uppercase text-white/60 mb-2 md:mb-4 font-bold">Lumina — Mode Jour</h3>
                                    <p className="hidden md:block text-white/40 text-[11px] md:text-sm leading-relaxed max-w-[260px] md:max-w-sm mx-auto md:group-hover:text-white/70 transition-colors">
                                        Un espace bienveillant dédié à l&apos;évolution personnelle. Lifestyle, et confidences.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Divider Line */}
                            <motion.div
                                initial={{ opacity: 0, scaleY: 0 }}
                                animate={{ opacity: 1, scaleY: 1 }}
                                transition={{ duration: 1.5, delay: 1 }}
                                className="hidden md:block w-px h-[40vh] bg-gradient-to-b from-transparent via-white/10 to-transparent shrink-0"
                            />

                            {/* NIGHT MODE CHOICE */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
                                onHoverStart={() => setHoveredSide('NIGHT')}
                                onHoverEnd={() => setHoveredSide(null)}
                                onClick={handleSelectNight}
                                className="flex-1 w-full flex flex-col items-center justify-center cursor-pointer group p-4 md:p-8 rounded-[2rem] md:rounded-3xl transition-all duration-700 bg-white/[0.03] md:bg-transparent hover:bg-white/[0.05] border border-red-500/10 md:border-transparent active:scale-[0.98] md:active:scale-100"
                            >
                                <div className="relative w-20 h-20 md:w-48 md:h-48 mb-3 md:mb-8 drop-shadow-[0_0_20px_rgba(255,0,0,0.3)] md:drop-shadow-[0_0_30px_rgba(255,0,0,0.1)] group-hover:drop-shadow-[0_0_60px_rgba(255,0,0,0.4)] transition-all duration-700 group-hover:scale-105 pointer-events-none">
                                    <div className="absolute inset-0 bg-red-500/10 rounded-full blur-3xl opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <img src="/images/milan_logo_bitten.png" alt="Pomme Croquée" className="w-full h-full object-contain relative z-10" />
                                </div>
                                <div className="text-center pointer-events-none">
                                    <h2 className="text-lg md:text-3xl font-serif text-[#ff4d4d] mb-1 md:mb-3 flex items-center justify-center gap-2">
                                        Le Fruit Défendu
                                        <Flame size={16} className="text-[#ff4d4d] md:w-5 md:h-5" />
                                    </h2>
                                    <h3 className="text-[9px] md:text-xs tracking-[0.3em] uppercase text-white/60 mb-2 md:mb-4 font-bold">Noctua — Mode Nuit</h3>
                                    <p className="hidden md:block text-white/40 text-[11px] md:text-sm leading-relaxed max-w-[260px] md:max-w-sm mx-auto md:group-hover:text-white/70 transition-colors">
                                        Succombez à la tentation. Séduction, et contenu exclusif & interactif.
                                    </p>
                                </div>
                            </motion.div>

                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 2 }}
                            className="absolute bottom-4 md:bottom-12 text-center z-20 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-4"
                        >
                            <p className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">Vous pourrez changer de mode à tout moment via le menu.</p>
                        </motion.div>
                    </>
                ) : (
                    /* AGE VERIFICATION INLINE */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative z-20 max-w-sm w-full bg-dark-400 p-8 md:p-10 rounded-3xl border border-red-500/20 shadow-[0_0_80px_rgba(255,0,0,0.15)] text-center"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/10 blur-[60px] rounded-full pointer-events-none" />

                        <span className="text-5xl font-serif text-[#ff4d4d] mb-4 block drop-shadow-[0_0_15px_rgba(255,0,0,0.3)]">18+</span>
                        <h2 className="text-sm font-serif text-white mb-3 tracking-[0.2em] uppercase">
                            Avertissement
                        </h2>

                        <p className="text-white/50 text-[12px] leading-relaxed mb-10 max-w-[240px] mx-auto">
                            L&apos;univers Noctua contient du contenu mature et exclusif strictement réservé aux adultes.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={confirmAge}
                                className="w-full py-4 bg-[#ff4d4d] text-white rounded-2xl text-[10px] uppercase font-black tracking-[0.2em] hover:bg-[#ff3333] hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] transition-all active:scale-[0.98]"
                            >
                                J&apos;accepte et je rentre
                            </button>

                            <button
                                onClick={cancelAge}
                                className="w-full py-4 bg-transparent border border-white/10 text-white/50 rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:text-white hover:bg-white/5 transition-all active:scale-[0.98]"
                            >
                                Revenir au choix
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
