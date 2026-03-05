"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, ShieldCheck, Loader2, Sparkles } from "lucide-react";

interface AdUnlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    itemName: string;
}

export default function AdUnlockModal({ isOpen, onClose, onComplete, itemName }: AdUnlockModalProps) {
    const [status, setStatus] = useState<"READY" | "PLAYING" | "COMPLETING">("READY");
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (status === "PLAYING" && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0 && status === "PLAYING") {
            setStatus("COMPLETING");
            setTimeout(() => {
                onComplete();
                onClose();
            }, 2000);
        }
        return () => clearInterval(timer);
    }, [status, timeLeft]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-dark-200 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(220,38,38,0.2)]"
                    >
                        <div className="p-8 sm:p-12 text-center">
                            {status === "READY" && (
                                <>
                                    <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20 text-red-500">
                                        <Play size={32} />
                                    </div>
                                    <h2 className="text-3xl font-serif text-white mb-4 uppercase tracking-wider">Accès Instantané</h2>
                                    <p className="text-white/40 text-sm mb-10 leading-relaxed px-4">
                                        Regardez une courte vidéo de nos partenaires pour débloquer <span className="text-white font-bold tracking-widest">{itemName}</span> gratuitement.
                                    </p>
                                    <div className="flex flex-col gap-4">
                                        <button
                                            onClick={() => setStatus("PLAYING")}
                                            className="w-full btn-gold !py-5 text-sm flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(201,168,76,0.3)]"
                                        >
                                            Lancer le déblocage (30s)
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="text-white/20 text-[10px] uppercase tracking-widest hover:text-white transition-colors"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </>
                            )}

                            {status === "PLAYING" && (
                                <div className="space-y-8 py-10">
                                    <div className="relative w-32 h-32 mx-auto">
                                        <svg className="w-full h-full -rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="60"
                                                fill="transparent"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                className="text-white/5"
                                            />
                                            <motion.circle
                                                cx="64"
                                                cy="64"
                                                r="60"
                                                fill="transparent"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                strokeDasharray="377"
                                                initial={{ strokeDashoffset: 377 }}
                                                animate={{ strokeDashoffset: (timeLeft / 30) * 377 }}
                                                className="text-red-500"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center text-3xl font-serif text-white">
                                            {timeLeft}s
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-red-500 text-[10px] uppercase tracking-[0.4em] font-bold animate-pulse">Déblocage en cours...</p>
                                        <p className="text-white/20 text-xs italic tracking-wide">&quot;Le luxe n&apos;attend que vous.&quot;</p>
                                    </div>
                                </div>
                            )}

                            {status === "COMPLETING" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="py-10"
                                >
                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 text-emerald-500">
                                        <ShieldCheck size={40} />
                                    </div>
                                    <h2 className="text-3xl font-serif text-white mb-4 uppercase tracking-wider">Succès !</h2>
                                    <p className="text-emerald-500 text-[10px] uppercase tracking-[0.4em] font-bold">Accès autorisé par Milan Sky</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
