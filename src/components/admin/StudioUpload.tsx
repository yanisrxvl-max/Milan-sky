'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Video, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { PremiumButton } from '@/components/ui/PremiumButton';

export default function StudioUpload({ onSuccess, onCancel }: { onSuccess: () => void; onCancel?: () => void }) {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState<File | null>(null);

    // Simulated progress for better UX on large files
    useEffect(() => {
        if (loading && progress < 90) {
            const timer = setInterval(() => {
                setProgress(prev => Math.min(prev + (100 - prev) / 20, 95));
            }, 800);
            return () => clearInterval(timer);
        }
    }, [loading, progress]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!file) { return toast.error('Veuillez sélectionner un fichier'); }

        setLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/content', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setProgress(100);
                setTimeout(() => {
                    toast.success('Lancement réussi ! Le média est dans la Sphère. 🔥');
                    onSuccess();
                    setFile(null);
                    setLoading(false);
                    setProgress(0);
                }, 500);
            } else {
                const data = await res.json();
                toast.error(data.error || 'Erreur lors de la mise en ligne');
                setLoading(false);
            }
        } catch {
            toast.error('Erreur Critique du Serveur');
            setLoading(false);
        }
    }

    return (
        <div className="card-premium !p-6 md:!p-10">
            <div className="flex items-center justify-between mb-8 border-b border-white/[0.05] pb-6">
                <div>
                    <h3 className="font-serif text-2xl text-cream">Studio Créateur</h3>
                    <p className="text-[10px] text-gold/60 uppercase tracking-[0.3em] font-bold mt-1">Publier dans la Sphère</p>
                </div>
                {onCancel && (
                    <button onClick={onCancel} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/20">
                        <X size={16} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* File Upload Area */}
                <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block ml-1">Fichier Source</label>
                    <div className={`relative border-2 border-dashed rounded-3xl p-8 transition-all duration-500 text-center ${file ? 'border-gold/50 bg-gold/5' : 'border-white/10 hover:bg-white/[0.03] hover:border-gold/30'}`}>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={loading}
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <div className="relative z-0">
                            {file ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                                        {file.type.startsWith('video') ? <Video size={28} /> : <ImageIcon size={28} />}
                                    </div>
                                    <div className="max-w-[200px] overflow-hidden">
                                        <span className="text-cream font-bold block text-sm truncate">{file.name}</span>
                                        <span className="text-[9px] text-gold/60 uppercase tracking-widest font-bold">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/10">
                                        <Upload size={28} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-cream text-sm font-medium block">Choisir un média 4K</span>
                                        <span className="text-[9px] text-white/20 uppercase tracking-[0.2em]">Photos ou Vidéos</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Fields Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block ml-1">Titre</label>
                            <input name="title" required placeholder="Titre..." className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-cream text-sm focus:border-gold/50 transition-all font-serif" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block ml-1">Prix (SkyCoins)</label>
                            <div className="relative">
                                <input name="price" type="number" min="0" defaultValue="0" required className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-cream text-sm focus:border-gold/50 transition-all font-mono" />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gold/60 uppercase font-bold tracking-widest">SC</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block ml-1">Tier Requis</label>
                            <select name="tier" className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-gold/50 appearance-none transition-all uppercase tracking-widest font-bold text-[10px]">
                                <option value="VOYEUR">VOYEUR (Basic)</option>
                                <option value="INITIE">INITIÉ (Plus)</option>
                                <option value="PRIVILEGE">PRIVILÈGE (Elite)</option>
                                <option value="SKYCLUB">SKYCLUB (Limited)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block ml-1">Catégorie</label>
                            <select name="type" className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-gold/50 appearance-none transition-all uppercase tracking-widest font-bold text-[10px]">
                                <option value="PHOTO">Photographie</option>
                                <option value="VIDEO">Vidéo Production</option>
                                <option value="SERIES">Série Narrative</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block ml-1">Description</label>
                    <textarea name="description" rows={3} placeholder="Légende du post..." className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-cream text-sm focus:border-gold/50 transition-all resize-none font-light"></textarea>
                </div>

                {/* Progress & Submit */}
                <div className="pt-4 space-y-4">
                    {loading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-[8px] uppercase tracking-widest font-bold text-gold/60">
                                <span>Transmission...</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gold"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                    <PremiumButton type="submit" variant="gold" isLoading={loading} className="w-full !py-4 text-[10px] font-bold tracking-[0.2em] uppercase">
                        Publier l&apos;Exclusivité
                    </PremiumButton>
                </div>
            </form>
        </div>
    );
}
