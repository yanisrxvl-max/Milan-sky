'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function CancelPage() {
    return (
        <Suspense fallback={<div className="page-container flex items-center justify-center min-h-screen"><div className="animate-pulse text-red-500/50 text-xs font-bold uppercase tracking-widest">Retour...</div></div>}>
            <CancelContent />
        </Suspense>
    );
}

function CancelContent() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');

    return (
        <div className="page-container min-h-screen flex items-center justify-center relative overflow-hidden px-4">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-lg card-premium text-center p-12 overflow-hidden border-red-500/10 shadow-[0_0_80px_rgba(255,0,0,0.05)]"
            >
                {/* Decorative top border */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30" />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
                    className="w-24 h-24 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-8 shadow-[0_0_30px_rgba(255,0,0,0.1)]"
                >
                    <XCircle size={48} />
                </motion.div>

                <h1 className="text-3xl font-serif text-cream mb-2 tracking-tight">
                    Paiement <span className="text-red-400 italic">Interrompu</span>
                </h1>

                <p className="text-white/60 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                    Votre processus de paiement a été annulé.<br />Aucun montant n'a été débité de votre compte.
                </p>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 mb-8 flex items-start gap-4 text-left">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 shrink-0 mt-1">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-cream mb-1">Un problème de connexion ?</h3>
                        <p className="text-xs text-white/40 leading-relaxed">
                            Si vous avez rencontré une erreur, essayez avec un autre moyen de paiement ou contactez le support.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <Link href={type === 'subscription' ? "/subscriptions" : "/skycoins"} className="block w-full">
                        <button className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <ArrowLeft size={14} /> Retourner à la sélection
                        </button>
                    </Link>
                    <Link href="/dashboard" className="block w-full">
                        <button className="w-full py-4 bg-transparent text-white/40 hover:text-white rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-colors">
                            Aller au Dashboard
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
