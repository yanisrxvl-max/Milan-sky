'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Wallet, Bitcoin, CheckCircle2, Copy, ExternalLink, Clock, Info, Upload, Loader2 } from 'lucide-react';
import { REVOLUT_LINK, PAYPAL_LINK, CRYPTO_QR_PATH, SUPPORT_EMAIL } from '@/lib/constants';
import { PremiumButton } from './ui/PremiumButton';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useState, useRef } from 'react';

interface PaymentBridgeModalProps {
    isOpen: boolean;
    onClose: () => void;
    tierName?: string;
    price?: string;
    type: 'subscription' | 'skycoins';
}

export function PaymentBridgeModal({ isOpen, onClose, tierName, price, type }: PaymentBridgeModalProps) {
    const [step, setStep] = useState<'selection' | 'upload' | 'success'>('selection');
    const [method, setMethod] = useState<'REVOLUT' | 'PAYPAL' | 'CRYPTO' | null>(null);
    const [uploading, setUploading] = useState(false);
    const [proofUrl, setProofUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copié !`);
    };

    const handleMethodSelect = (m: 'REVOLUT' | 'PAYPAL' | 'CRYPTO') => {
        setMethod(m);
        setStep('upload');
        if (m === 'REVOLUT') window.open(REVOLUT_LINK, '_blank');
        if (m === 'PAYPAL') window.open(PAYPAL_LINK, '_blank');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default'); // Assuming this exists

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (data.secure_url) {
                setProofUrl(data.secure_url);
                toast.success('Capture d\'écran chargée !');
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            toast.error('Erreur lors de l\'upload');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmitProof = async () => {
        if (!proofUrl || !method) return;

        try {
            const res = await fetch('/api/payments/proof', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: type.toUpperCase(),
                    targetId: tierName,
                    amount: parseFloat(price?.replace(/[^\d.]/g, '') || '0'),
                    method,
                    proofImageUrl: proofUrl,
                }),
            });

            if (res.ok) {
                setStep('success');
                toast.success('Demande enregistrée !');
            } else {
                throw new Error('Submit failed');
            }
        } catch (error) {
            toast.error('Erreur lors de l\'envoi');
        }
    };

    const currentStepInfo = {
        selection: { title: 'Démarrer le paiement', dot: 1 },
        upload: { title: 'Charger la preuve', dot: 2 },
        success: { title: 'Félicitations', dot: 3 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center md:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-dark-500/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: '100%' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100) onClose();
                        }}
                        className="relative w-full md:max-w-2xl bg-dark-400 border border-white/10 rounded-t-[32px] md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[95vh] mt-auto md:mt-0 pb-[env(safe-area-inset-bottom)]"
                    >
                        {/* Drag Handle (Mobile) */}
                        <div className="w-full flex justify-center pt-4 pb-2 md:hidden cursor-grab active:cursor-grabbing shrink-0">
                            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                        </div>

                        {/* Header */}
                        <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5">
                            <div>
                                <h2 className="text-2xl font-serif text-cream tracking-tight">
                                    {step === 'success' ? 'C\'est presque ' : 'Finalisez votre '}<span className="gold-text italic">{step === 'success' ? 'fini !' : (type === 'subscription' ? 'accès' : 'recharge')}</span>
                                </h2>
                                <p className="text-white/40 text-sm mt-1">
                                    {tierName ? `Offre ${tierName}` : 'Pack SkyCoins'} — <span className="text-gold font-bold">{price}</span>
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors touch-manipulation min-h-[44px]"
                            >
                                <X size={20} className="text-white/60" />
                            </button>
                        </div>

                        <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                            {/* Steps Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                {['selection', 'upload', 'success'].map((s) => (
                                    <div
                                        key={s}
                                        className={`p-4 rounded-2xl bg-white/5 border transition-all duration-500 text-center ${step === s ? 'border-gold/40' : 'border-white/5 opacity-50'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold ${step === s ? 'bg-gold text-dark' : 'bg-gold/20 text-gold'}`}>
                                            {s === 'selection' ? 1 : s === 'upload' ? 2 : 3}
                                        </div>
                                        <p className={`text-[10px] uppercase tracking-widest font-bold ${step === s ? 'text-white/80' : 'text-white/40'}`}>
                                            {currentStepInfo[s as keyof typeof currentStepInfo].title}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {step === 'selection' && (
                                <div className="space-y-6">
                                    {/* Revolut */}
                                    <div
                                        onClick={() => handleMethodSelect('REVOLUT')}
                                        className="group p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-gold/20 hover:bg-white/[0.04] transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                    <CreditCard size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-cream">Revolut</h3>
                                                    <p className="text-xs text-white/40">Activation prioritaire</p>
                                                </div>
                                            </div>
                                            <ExternalLink size={18} className="text-white/20 group-hover:text-gold transition-colors" />
                                        </div>
                                    </div>

                                    {/* PayPal */}
                                    <div
                                        onClick={() => handleMethodSelect('PAYPAL')}
                                        className="group p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-gold/20 hover:bg-white/[0.04] transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                                                    <Wallet size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-cream">PayPal</h3>
                                                    <p className="text-xs text-white/40">Simple et sécurisé</p>
                                                </div>
                                            </div>
                                            <ExternalLink size={18} className="text-white/20 group-hover:text-gold transition-colors" />
                                        </div>
                                    </div>

                                    {/* Crypto */}
                                    <div
                                        onClick={() => handleMethodSelect('CRYPTO')}
                                        className="group p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-gold/20 hover:bg-white/[0.04] transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                                                    <Bitcoin size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-cream">Bitcoin / Crypto</h3>
                                                    <p className="text-xs text-white/40">Anonymat total via Binance Pay</p>
                                                </div>
                                            </div>
                                            <div className="relative w-20 h-20 bg-white rounded-xl p-1.5 group-hover:scale-105 transition-transform">
                                                <Image src={CRYPTO_QR_PATH} alt="QR" width={80} height={80} className="w-full h-full object-contain" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 'upload' && (
                                <div className="space-y-6">
                                    <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 text-center">
                                        <p className="text-white/60 mb-6 text-sm italic">
                                            "Une fois votre transfert effectué, importez la capture d'écran ici pour validation immédiate par notre équipe."
                                        </p>

                                        <input
                                            type="file"
                                            hidden
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            accept="image/*"
                                        />

                                        {!proofUrl ? (
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="w-full h-40 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-gold/40 hover:bg-white/5 transition-all group disabled:opacity-50"
                                            >
                                                {uploading ? (
                                                    <Loader2 size={32} className="text-gold animate-spin" />
                                                ) : (
                                                    <>
                                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-gold group-hover:scale-110 transition-all">
                                                            <Upload size={24} />
                                                        </div>
                                                        <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Importer un Screenshot</span>
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-gold/40">
                                                <Image src={proofUrl} alt="Proof" fill className="object-cover" />
                                                <button
                                                    onClick={() => setProofUrl(null)}
                                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}

                                        <PremiumButton
                                            onClick={handleSubmitProof}
                                            disabled={!proofUrl}
                                            variant="gold"
                                            fullWidth
                                            className="mt-6 py-4 uppercase text-[10px] tracking-widest font-bold disabled:opacity-20"
                                        >
                                            Envoyer pour Validation
                                        </PremiumButton>

                                        <button
                                            onClick={() => setStep('selection')}
                                            className="mt-4 text-[10px] text-white/20 uppercase tracking-widest font-bold hover:text-white transition-colors"
                                        >
                                            Changer de méthode
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 'success' && (
                                <div className="text-center py-10">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center text-gold mx-auto mb-6"
                                    >
                                        <CheckCircle2 size={40} />
                                    </motion.div>
                                    <h3 className="text-2xl font-serif text-cream mb-4">Demande reçue !</h3>
                                    <p className="text-white/60 mb-8 max-w-sm mx-auto">
                                        Votre preuve a été transmise à Milan pour vérification                    Vous recevrez une notification d'ici 5 à 10 minutes maximum.
                                    </p>

                                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-3 text-left">
                                        <Info size={20} className="text-blue-400 shrink-0" />
                                        <p className="text-[11px] text-blue-400/80 leading-relaxed uppercase font-medium tracking-wider">
                                            Vous pouvez quitter cette fenêtre et continuer à consulter la plateforme en attendant.
                                        </p>
                                    </div>

                                    <PremiumButton
                                        onClick={onClose}
                                        variant="outline"
                                        fullWidth
                                        className="mt-10 py-4 uppercase text-[10px] tracking-widest font-bold"
                                    >
                                        Retour à l&apos;accueil
                                    </PremiumButton>
                                </div>
                            )}

                            {/* Note de réassurance */}
                            {step !== 'success' && (
                                <div className="mt-8 flex items-center gap-3 justify-center text-white/30 text-[10px] uppercase tracking-[0.2em]">
                                    <Clock size={14} />
                                    <span>Validation manuelle sous 5-10 minutes</span>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-dark-500/50 border-t border-white/5 text-center">
                            <p className="text-[10px] text-white/20 uppercase tracking-widest">
                                Milan Sky — L&apos;Exclusivité à portée de clic
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
