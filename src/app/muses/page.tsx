
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Ghost, Music, Crown, Lock, CheckCircle2, ShoppingCart, Info, X, Copy, User, MapPin, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { PremiumButton } from '@/components/ui/PremiumButton';
import AdUnlockModal from '@/components/modals/AdUnlockModal';

interface Muse {
    id: string;
    title: string;
    description: string; // Catchphrase
    bio?: string;
    age?: number;
    location?: string;
    traits?: string[];
    price: number;
    category: 'MUSE' | 'ELIXIR' | 'RITUAL' | 'MOOD_PACK';
    isOwned: boolean;
    isActive: boolean;
    prompt?: string;
    imageUrl?: string;
}

const CATEGORY_ICONS = {
    MUSE: <User className="w-5 h-5" />, // User icon for profiles
    ELIXIR: <Zap className="w-5 h-5" />,
    RITUAL: <Sparkles className="w-5 h-5" />,
    MOOD_PACK: <Music className="w-5 h-5" />,
};

const CATEGORY_LABELS = {
    MUSE: 'Profils — Agence Exclusive',
    ELIXIR: 'Élixirs — Injections Tempo',
    RITUAL: 'Rituels — Scénarios',
    MOOD_PACK: 'Mood Packs — Immersion',
};

export default function MusesPage() {
    const { data: session } = useSession();
    const [muses, setMuses] = useState<Muse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<Muse['category'] | 'ALL'>('ALL');
    const [viewingPrompt, setViewingPrompt] = useState<Muse | null>(null);
    const [adTarget, setAdTarget] = useState<Muse | null>(null);

    useEffect(() => {
        fetchMuses();
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Prompt copié !');
    };

    async function fetchMuses() {
        try {
            const res = await fetch('/api/muses');
            if (res.ok) {
                const data = await res.json();
                setMuses(data.muses);
            }
        } catch {
            toast.error('Erreur de chargement');
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePurchase(museId: string) {
        try {
            const res = await fetch('/api/muses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ museId }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Achat réussi !');
                fetchMuses();
            } else {
                toast.error(data.error || 'Erreur lors de l\'achat');
            }
        } catch {
            toast.error('Erreur réseau');
        }
    }

    async function handleActivate(museId: string, category: string, isActive: boolean) {
        try {
            const res = await fetch('/api/muses/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    museId,
                    category,
                    action: isActive ? 'DEACTIVATE' : 'ACTIVATE'
                }),
            });
            if (res.ok) {
                toast.success(isActive ? 'Désactivé' : 'Activé !');
                fetchMuses();
            } else {
                toast.error('Erreur lors de l\'activation');
            }
        } catch {
            toast.error('Erreur réseau');
        }
    }

    const filteredMuses = selectedCategory === 'ALL'
        ? muses
        : muses.filter(m => m.category === selectedCategory);

    return (
        <div className="page-container pb-20 pt-24">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-[0.3em] font-bold mb-6"
                    >
                        Boutique Digitale Exclusive
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif mb-6"
                    >
                        Les <span className="crimson-text italic">Muses</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 max-w-2xl mx-auto leading-relaxed"
                    >
                        Achetez des configurations de personnalité premium pour Milan.
                        Modifiez son ton, son énergie et son intimité instantanément.
                    </motion.p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {['ALL', 'MUSE', 'ELIXIR', 'RITUAL', 'MOOD_PACK'].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat as any)}
                            className={`px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat
                                ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                                : 'bg-white/5 text-white/40 hover:bg-white/10'
                                }`}
                        >
                            {cat === 'ALL' ? 'Tout voir' : cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredMuses.map((muse, idx) => (
                            <motion.div
                                key={muse.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`group relative h-full bg-dark-200/40 backdrop-blur-md border rounded-[2rem] p-8 overflow-hidden transition-all duration-500 ${muse.isActive ? 'border-red-500/60 shadow-[0_0_40px_rgba(220,38,38,0.15)]' : 'border-white/[0.05] hover:border-red-500/20'
                                    }`}
                            >
                                {/* Glow Effect */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-red-600/10 transition-colors" />

                                <div className="relative mb-6">
                                    <div className="flex items-center justify-between">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${muse.isActive ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-white/5 text-red-500 group-hover:bg-red-500/10'}`}>
                                            {CATEGORY_ICONS[muse.category]}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gold font-bold text-lg">{muse.price} SC</p>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="text-3xl font-serif text-white tracking-widest uppercase mb-1">
                                            {muse.title}
                                            {muse.age && <span className="text-white/20 text-xl font-sans ml-3 font-light">, {muse.age}</span>}
                                        </h3>
                                        {muse.location && (
                                            <p className="text-[10px] text-white/40 flex items-center gap-1 uppercase tracking-widest mb-4">
                                                <MapPin size={10} className="text-red-500" /> {muse.location}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <p className="text-white/60 text-sm leading-relaxed italic font-light">
                                        &quot;{muse.description}&quot;
                                    </p>

                                    {muse.traits && (
                                        <div className="flex flex-wrap gap-2">
                                            {muse.traits.map(trait => (
                                                <span key={trait} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[8px] uppercase tracking-widest text-white/40">
                                                    {trait}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-auto flex flex-col gap-3">
                                    {muse.isOwned ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleActivate(muse.id, muse.category, muse.isActive)}
                                                className={`flex-1 py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center justify-center gap-2 ${muse.isActive
                                                    ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                                                    : 'bg-white/10 text-white hover:bg-white/20'
                                                    }`}
                                            >
                                                {muse.isActive ? <CheckCircle2 size={14} /> : null}
                                                {muse.isActive ? 'Active' : 'Activer'}
                                            </button>
                                            <button
                                                onClick={() => setViewingPrompt(muse)}
                                                className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                                title="Voir le prompt"
                                            >
                                                <Info size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => handlePurchase(muse.id)}
                                                className="w-full py-4 rounded-xl bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gold hover:text-white transition-all duration-500 flex items-center justify-center gap-2"
                                            >
                                                <ShoppingCart size={14} /> Acquérir — {muse.price} SC
                                            </button>
                                            <button
                                                onClick={() => setAdTarget(muse)}
                                                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] text-white/40 uppercase tracking-[0.2em] font-bold hover:bg-white/10 hover:text-white transition-all duration-500 flex items-center justify-center gap-2"
                                            >
                                                <Play size={12} className="text-red-500" /> Débloquer via Pub
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Status Indicator */}
                                {muse.isActive && (
                                    <div className="absolute top-4 left-4">
                                        <span className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* PROMPT MODAL */}
            <AnimatePresence>
                {viewingPrompt && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setViewingPrompt(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-dark-200 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_25px_100px_rgba(0,0,0,0.8)]"
                        >
                            <div className="p-8 sm:p-12">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-3xl font-serif text-white mb-1 uppercase tracking-wider">{viewingPrompt.title}</h2>
                                        <p className="text-red-500 text-[10px] uppercase tracking-[0.3em] font-bold">System Prompt — Injection IA</p>
                                    </div>
                                    <button
                                        onClick={() => setViewingPrompt(null)}
                                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="bg-black/40 rounded-3xl p-6 border border-white/5 mb-8 group relative">
                                    <p className="text-white/60 text-sm leading-relaxed italic">
                                        &quot;{viewingPrompt.prompt}&quot;
                                    </p>
                                    <button
                                        onClick={() => viewingPrompt.prompt && copyToClipboard(viewingPrompt.prompt)}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                                        title="Copier le prompt"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => viewingPrompt.prompt && copyToClipboard(viewingPrompt.prompt)}
                                        className="flex-1 btn-gold !py-4 flex items-center justify-center gap-3"
                                    >
                                        <Copy size={18} /> Copier pour ChatGPT / Claude
                                    </button>
                                    <button
                                        onClick={() => setViewingPrompt(null)}
                                        className="px-8 py-4 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-all"
                                    >
                                        Fermer
                                    </button>
                                </div>

                                <p className="mt-8 text-center text-[10px] text-white/20 uppercase tracking-widest">
                                    Utilisez ce prompt pour recréer l&apos;intimité de Milan ailleurs.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AdUnlockModal
                isOpen={!!adTarget}
                onClose={() => setAdTarget(null)}
                onComplete={async () => {
                    if (adTarget) {
                        try {
                            const res = await fetch('/api/muses', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ museId: adTarget.id, paymentMethod: 'AD' }), // Special payment method
                            });

                            if (res.ok) {
                                toast.success(`${adTarget.title} débloqué avec succès !`);
                                fetchMuses();
                            } else {
                                toast.error('Une erreur est survenue.');
                            }
                        } catch (error) {
                            toast.error('Erreur de connexion.');
                        }
                    }
                }}
                itemName={adTarget?.title || ''}
            />
        </div>
    );
}
