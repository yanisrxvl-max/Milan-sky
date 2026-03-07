'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2, Crown, Sparkles, ArrowRight,
    Eye, Flame, Diamond
} from 'lucide-react';
import Link from 'next/link';
import { PremiumButton } from '@/components/ui/PremiumButton';

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="page-container flex items-center justify-center min-h-screen bg-dark"><div className="animate-pulse text-gold/50 text-xs font-bold uppercase tracking-widest">Initialisation...</div></div>}>
            <SuccessContent />
        </Suspense>
    );
}

function SuccessContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const coins = searchParams.get('coins');
    const tier = searchParams.get('tier')?.toUpperCase();

    const isSubscription = type === 'subscription';
    const isSkyCoins = type === 'skycoins';

    const [showContent, setShowContent] = useState(false);

    // Timeline effect for cinematic entry
    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 800);
        return () => clearTimeout(timer);
    }, []);

    // ----------------------------------------------------
    // CINEMATIC TIER ANIMATIONS
    // ----------------------------------------------------
    const renderTierAnimation = () => {
        switch (tier) {
            case 'VOYEUR':
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="flex flex-col items-center justify-center space-y-8"
                    >
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "120px", opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
                            className="relative w-[120px] rounded-full border border-white/20 flex items-center justify-center overflow-hidden bg-dark-200"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute inset-0 bg-white/5 rounded-full"
                            />
                            <Eye size={48} className="text-white/40" />
                        </motion.div>
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-serif text-white tracking-widest uppercase">Voyeur</h2>
                            <p className="text-sm text-white/50 tracking-[0.15em] uppercase font-light max-w-xs mx-auto">
                                "Le voile se lève. Bienvenue dans l'ombre."
                            </p>
                        </div>
                    </motion.div>
                );

            case 'INITIE':
            case 'INITIÉ':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="flex flex-col items-center justify-center space-y-8"
                    >
                        <div className="relative">
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0.8] }}
                                transition={{ delay: 0.3, duration: 1.5, ease: "easeOut" }}
                                className="absolute inset-0 bg-gold/30 blur-[40px] rounded-full"
                            />
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="relative z-10 w-[120px] h-[120px] rounded-full flex items-center justify-center bg-gradient-to-b from-orange-500/20 to-transparent border border-orange-500/30 shadow-[0_0_50px_rgba(249,115,22,0.3)]"
                            >
                                <Flame size={56} className="text-orange-400" />
                            </motion.div>
                        </div>
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-serif text-orange-400 tracking-widest uppercase items-center gap-3 flex justify-center">
                                Initié
                            </h2>
                            <p className="text-sm text-gold/70 tracking-[0.1em] uppercase font-light max-w-sm mx-auto leading-relaxed">
                                "Tu as franchi le premier cercle. L'expérience commence."
                            </p>
                        </div>
                    </motion.div>
                );

            case 'PRIVILEGE':
            case 'PRIVILÈGE':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                        className="flex flex-col items-center justify-center space-y-8"
                    >
                        <div className="relative">
                            {/* Shockwave effect */}
                            <motion.div
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 3, opacity: 0 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute inset-0 border-2 border-cyan-400/50 rounded-full"
                            />
                            <motion.div
                                initial={{ scale: 0.8, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                                className="relative z-10 w-[140px] h-[140px] rounded-2xl rotate-45 flex items-center justify-center bg-gradient-to-br from-cyan-900/40 to-blue-900/20 border border-cyan-400/30 backdrop-blur-xl shadow-[0_0_60px_rgba(34,211,238,0.2)]"
                            >
                                <div className="-rotate-45">
                                    <Diamond size={64} className="text-cyan-300" strokeWidth={1} />
                                </div>
                            </motion.div>
                        </div>
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-serif text-cyan-300 tracking-widest uppercase">Privilège</h2>
                            <p className="text-sm text-cyan-100/60 tracking-[0.1em] uppercase font-light max-w-sm mx-auto leading-relaxed">
                                "L'exception devient ta norme. Accès total débloqué."
                            </p>
                        </div>
                    </motion.div>
                );

            case 'SKYCLUB':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2.5 }}
                        className="flex flex-col items-center justify-center space-y-12"
                    >
                        {/* God Rays / Divine Light */}
                        <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none overflow-hidden flex justify-center">
                            <motion.div
                                initial={{ opacity: 0, y: -100 }}
                                animate={{ opacity: 0.15, y: 0 }}
                                transition={{ duration: 3 }}
                                className="w-1/2 h-full bg-gradient-to-b from-gold via-gold/10 to-transparent blur-[80px]"
                            />
                        </div>

                        {/* Particles */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{
                                        y: "100%", x: `${Math.random() * 100}%`,
                                        opacity: 0, scale: Math.random() * 0.5 + 0.5
                                    }}
                                    animate={{
                                        y: "-20%",
                                        opacity: [0, 0.8, 0],
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2,
                                        ease: "linear"
                                    }}
                                    className="absolute w-1 h-1 bg-gold rounded-full"
                                />
                            ))}
                        </div>

                        <div className="relative z-10 w-[160px] h-[160px] flex items-center justify-center">
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 15 }}
                                className="absolute z-20"
                            >
                                <Crown size={80} className="text-gold drop-shadow-[0_0_20px_rgba(201,168,76,0.8)]" strokeWidth={1.5} />
                            </motion.div>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute w-[140px] h-[140px] border border-dashed border-gold/30 rounded-full"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute w-[180px] h-[180px] bg-gold/10 blur-[30px] rounded-full"
                            />
                        </div>

                        <div className="text-center space-y-4 relative z-10 pt-4">
                            <h2 className="text-4xl font-serif text-gold tracking-[0.2em] flex flex-col items-center gap-2">
                                <span className="text-[10px] text-white/40 tracking-[0.3em] font-sans">CERCLE FERMÉ</span>
                                SKYCLUB
                            </h2>
                            <p className="text-[13px] text-gold/80 tracking-[0.15em] uppercase font-light max-w-md mx-auto leading-relaxed border-t border-b border-gold/10 py-4 mt-6">
                                "Bienvenue au sommet. Tu fais désormais partie de l'Élite."
                            </p>
                        </div>
                    </motion.div>
                );

            default:
                return (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="w-24 h-24 mx-auto rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-8 shadow-[0_0_40px_rgba(201,168,76,0.3)]"
                    >
                        <CheckCircle2 size={48} />
                    </motion.div>
                );
        }
    }

    return (
        <div className="page-container min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-dark">
            {/* Base ambient background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay" />
            </div>

            <AnimatePresence>
                {showContent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10 w-full max-w-2xl text-center py-12 flex flex-col items-center"
                    >

                        {/* The Cinematic Rendering based on Tier */}
                        {isSubscription && tier ? (
                            <div className="w-full mb-16 mt-8 min-h-[300px] flex items-center justify-center">
                                {renderTierAnimation()}
                            </div>
                        ) : (
                            <>
                                {renderTierAnimation()}
                                <h1 className="text-3xl font-serif text-cream mb-2 tracking-tight mt-8">
                                    Paiement <span className="gold-text italic">Validé</span>
                                </h1>
                                <p className="text-white/60 mb-8 max-w-sm mx-auto">
                                    {isSkyCoins ? (
                                        <>Ton compte vient d'être rechargé de <strong className="text-gold">{coins} SkyCoins</strong>.</>
                                    ) : (
                                        "Ta transaction a bien été enregistrée et ton compte mis à jour."
                                    )}
                                </p>
                            </>
                        )}

                        {isSkyCoins && (
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 mb-10 w-full max-w-md mx-auto">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-cream">Solde mis à jour</h3>
                                        <p className="text-xs text-white/40">Découvre les Muses et débloque le contenu interactif.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.5, duration: 1 }}
                            className="space-y-4 w-full max-w-sm mx-auto z-20 relative"
                        >
                            <Link href="/dashboard" className="block w-full">
                                <PremiumButton variant="gold" fullWidth className="py-4 uppercase tracking-[0.2em] text-[10px] font-bold">
                                    Accéder à mon tableau de bord <ArrowRight size={14} className="ml-2 inline-block" />
                                </PremiumButton>
                            </Link>
                            <Link href={isSubscription ? "/muses" : "/skycoins"} className="block w-full">
                                <button className="w-full py-4 bg-transparent border border-white/10 text-white/50 rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:text-white hover:bg-white/5 transition-all">
                                    {isSubscription ? "Pénétrer dans le sanctuaire" : "Retour à la boutique"}
                                </button>
                            </Link>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
