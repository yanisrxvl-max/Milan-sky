'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Delete, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface PasscodeLockProps {
    onSuccess: () => void;
}

export default function PasscodeLock({ onSuccess }: PasscodeLockProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const [mode, setMode] = useState<'LOADING' | 'SETUP' | 'VERIFY'>('LOADING');
    const [tempPIN, setTempPIN] = useState(''); // For initial setup confirmation

    useEffect(() => {
        checkPINStatus();
    }, []);

    async function checkPINStatus() {
        try {
            const res = await fetch('/api/vault/pin');
            const data = await res.json();
            setMode(data.hasPIN ? 'VERIFY' : 'SETUP');
        } catch {
            setMode('VERIFY'); // Fallback
        }
    }

    const handleNumberClick = async (num: string) => {
        if (code.length < 4) {
            const newCode = code + num;
            setCode(newCode);

            if (newCode.length === 4) {
                if (mode === 'VERIFY') {
                    const res = await fetch('/api/vault/pin', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pin: newCode })
                    });
                    const data = await res.json();

                    if (data.valid) {
                        toast.success("Accès autorisé");
                        onSuccess();
                    } else {
                        handleError();
                    }
                } else if (mode === 'SETUP') {
                    if (!tempPIN) {
                        setTempPIN(newCode);
                        setCode('');
                        toast.success("Confirmez votre code");
                    } else {
                        if (newCode === tempPIN) {
                            await fetch('/api/vault/pin', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ pin: newCode })
                            });
                            toast.success("Code secret enregistré");
                            onSuccess();
                        } else {
                            toast.error("Les codes ne correspondent pas");
                            setTempPIN('');
                            handleError();
                        }
                    }
                }
            }
        }
    };

    const handleError = () => {
        setError(true);
        setTimeout(() => {
            setError(false);
            setCode('');
        }, 500);
        if (mode === 'VERIFY') toast.error("Code incorrect");
    };

    const handleDelete = () => {
        setCode(code.slice(0, -1));
    };

    if (mode === 'LOADING') return (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
            <div className="animate-pulse gold-text font-serif italic">Sécurisation du coffre...</div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center backdrop-blur-xl">
            <div className="text-center mb-12">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/20">
                    <Lock className="text-gold w-6 h-6" />
                </div>
                <h2 className="font-serif text-2xl text-white tracking-widest uppercase mb-2">
                    {mode === 'SETUP' ? (tempPIN ? 'Confirmation' : 'Nouveau Code') : 'Coffre Verrouillé'}
                </h2>
                <p className="text-white/30 text-[9px] uppercase tracking-[0.4em]">
                    {mode === 'SETUP' ? 'Définissez votre accès privé unique' : 'Saisissez votre code personnel'}
                </p>
            </div>

            <motion.div
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                className="flex gap-4 mb-12"
            >
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`w-4 h-4 rounded-full border border-gold/40 transition-all duration-300 ${code.length > i ? 'bg-gold shadow-[0_0_15px_rgba(201,168,76,0.6)]' : 'bg-transparent'
                            } ${error ? 'border-red-500 bg-red-500' : ''}`}
                    />
                ))}
            </motion.div>

            <div className="grid grid-cols-3 gap-6">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleNumberClick(num)}
                        className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-xl font-light text-white flex items-center justify-center hover:bg-white/15 transition-all active:scale-95"
                    >
                        {num}
                    </button>
                ))}
                <div />
                <button
                    onClick={() => handleNumberClick('0')}
                    className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-xl font-light text-white flex items-center justify-center hover:bg-white/15 transition-all active:scale-95"
                >
                    0
                </button>
                <button
                    onClick={handleDelete}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-95"
                >
                    <Delete size={20} />
                </button>
            </div>

            <p className="mt-20 text-[11px] font-serif italic text-white/30 tracking-[0.4em]">Milan Sky <span className="gold-text not-italic text-[9px] uppercase tracking-[0.6em] ml-2 font-bold">Private Vault</span></p>
        </div>
    );
}
