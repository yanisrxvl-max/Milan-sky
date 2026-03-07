'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X } from 'lucide-react';

interface AgeVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AgeVerificationModal({ isOpen, onClose, onSuccess }: AgeVerificationModalProps) {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [error, setError] = useState('');

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setDay('');
            setMonth('');
            setYear('');
            setError('');
        }
    }, [isOpen]);

    const handleVerify = () => {
        const d = parseInt(day, 10);
        const m = parseInt(month, 10);
        const y = parseInt(year, 10);

        if (!d || !m || !y || isNaN(d) || isNaN(m) || isNaN(y)) {
            setError('Veuillez entrer une date valide.');
            return;
        }

        const today = new Date();
        const birthDate = new Date(y, m - 1, d);
        let age = today.getFullYear() - birthDate.getFullYear();
        const mDiff = today.getMonth() - birthDate.getMonth();

        if (mDiff < 0 || (mDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age >= 18 && age <= 120) {
            onSuccess();
        } else if (age > 120) {
            setError('Date invalide.');
        } else {
            setError("Accès refusé. Vous devez avoir au moins 18 ans pour accéder au mode Nuit.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-dark-500 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Background subtle glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[80px] rounded-full pointer-events-none -mr-32 -mt-32" />

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                                <ShieldAlert size={28} className="text-red-500" />
                            </div>

                            <h2 className="font-serif text-3xl text-cream mb-2">Vérification d'âge</h2>
                            <p className="text-white/40 text-sm mb-8">
                                Le mode nuit contient des éléments explicites réservés à un public averti de plus de 18 ans.
                            </p>

                            <div className="w-full flex gap-3 mb-4">
                                <input
                                    type="text"
                                    placeholder="JJ"
                                    maxLength={2}
                                    value={day}
                                    onChange={(e) => setDay(e.target.value.replace(/\D/g, ''))}
                                    className="flex-1 input-field text-center text-lg font-mono tracking-widest placeholder-white/20 bg-dark-400"
                                />
                                <span className="text-white/20 text-2xl font-light mt-2">/</span>
                                <input
                                    type="text"
                                    placeholder="MM"
                                    maxLength={2}
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value.replace(/\D/g, ''))}
                                    className="flex-1 input-field text-center text-lg font-mono tracking-widest placeholder-white/20 bg-dark-400"
                                />
                                <span className="text-white/20 text-2xl font-light mt-2">/</span>
                                <input
                                    type="text"
                                    placeholder="AAAA"
                                    maxLength={4}
                                    value={year}
                                    onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
                                    className="flex-[1.5] input-field text-center text-lg font-mono tracking-widest placeholder-white/20 bg-dark-400"
                                />
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-red-400 text-xs font-bold tracking-widest uppercase mb-4"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <button
                                onClick={handleVerify}
                                disabled={!day || !month || year.length < 4}
                                className="w-full py-4 mt-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 text-white text-[11px] font-bold tracking-[0.2em] uppercase rounded-xl transition-colors min-h-[44px]"
                            >
                                Je certifie avoir plus de 18 ans
                            </button>

                            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-6">
                                🔞 Interdit aux moins de 18 ans
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
