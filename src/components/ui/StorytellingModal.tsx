'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';

interface StorytellingModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    story: string;
    specs: string[];
}

export default function StorytellingModal({ isOpen, onClose, title, story, specs }: StorytellingModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="max-w-2xl w-full glass p-8 rounded-3xl border border-gold/20 shadow-2xl relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background Accent */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/10 blur-[100px] rounded-full" />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-white/30 hover:text-gold transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                                    <Info size={20} />
                                </div>
                                <h2 className="text-2xl font-serif gold-text tracking-widest uppercase">
                                    {title}
                                </h2>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold/60 mb-3 font-bold">L&apos;Histoire</h3>
                                    <p className="text-white/70 leading-relaxed italic text-sm md:text-base">
                                        &quot;{story}&quot;
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-gold/60 mb-4 font-bold">Fiche Technique</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {specs.map((spec, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                                                <span className="text-xs text-white/50">{spec}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-white/5 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-8 py-3 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest hover:bg-gold/20 transition-all"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
