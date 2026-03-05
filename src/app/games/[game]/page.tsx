'use client';

import { motion } from 'framer-motion';
import { Gamepad2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function GamePlaceholderPage({ params }: { params: { game: string } }) {
    const gameId = params.game;

    // Noms temporaires basés sur l'ID de la route
    const gameNames: Record<string, string> = {
        'signal': 'Signal de Milan',
        'orbital': 'Orbital',
        'confessions': 'Confessions'
    };

    const title = gameNames[gameId] || 'Jeu Secret';

    return (
        <main className="min-h-screen bg-dark flex flex-col items-center justify-center relative p-4">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark-500 to-dark z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 blur-[100px] rounded-full pointer-events-none z-10" />

            <div className="relative z-20 max-w-md w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="bg-dark-400/80 backdrop-blur-xl border border-white/5 p-10 md:p-14 rounded-[3rem] shadow-2xl"
                >
                    <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(201,168,76,0.15)]">
                        <Gamepad2 size={32} className="text-gold" />
                    </div>

                    <h1 className="font-serif text-3xl md:text-4xl text-cream mb-4">
                        {title}
                    </h1>

                    <div className="h-px w-12 bg-gold/30 mx-auto mb-6" />

                    <p className="text-white/50 text-sm font-light tracking-wide uppercase mb-12 animate-pulse">
                        Ce jeu arrive bientôt.
                    </p>

                    <Link href="/games" className="inline-block">
                        <button className="px-6 py-3 bg-white/5 rounded-full text-white/60 text-xs uppercase tracking-widest font-bold border border-white/10 hover:border-white/30 hover:text-white transition-all flex items-center gap-2 group min-h-[44px] touch-manipulation">
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Retour aux jeux
                        </button>
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
