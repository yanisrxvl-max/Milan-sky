'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useThemeMode } from '@/context/ThemeModeContext';
import { useI18n } from '@/context/I18nContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle2, X, Copy, Info, MessageCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface Muse {
    id: string;
    title: string;
    description: string;
    price: number;
    category: 'MUSE' | 'ELIXIR' | 'RITUAL' | 'MOOD_PACK';
    isOwned: boolean;
    isActive: boolean;
    prompt?: string;
    imageUrl?: string;
    previewMessage?: string;
}

const getCategoryMap = (t: (key: string) => string): Record<string, { label: string; filter: string[] }> => ({
    ALL: { label: t('muses.all'), filter: [] },
    PERSONNALITES: { label: t('muses.personalities'), filter: ['MUSE'] },
    MOODS: { label: t('muses.moods'), filter: ['MOOD_PACK'] },
    EXPERIENCES: { label: t('muses.experiences'), filter: ['RITUAL'] },
});

export default function MusesPage() {
    const { data: session } = useSession();
    const { mode } = useThemeMode();
    const { t } = useI18n();
    const currentThemeMode = mode === 'DAY' ? 'LUMINA' : 'NOCTUA';

    const [muses, setMuses] = useState<Muse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [viewingPrompt, setViewingPrompt] = useState<Muse | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    useEffect(() => {
        fetchMuses();
    }, [mode]);

    async function fetchMuses() {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/muses?mode=${currentThemeMode}`);
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
        if (!session) {
            toast.error('Connecte-toi pour débloquer une Muse');
            return;
        }
        try {
            const res = await fetch('/api/muses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ museId }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Muse débloquée !');
                fetchMuses();
            } else {
                toast.error(data.error || 'Erreur');
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
                toast.success(isActive ? 'Muse désactivée' : 'Muse activée !');
                fetchMuses();
            } else {
                toast.error('Erreur');
            }
        } catch {
            toast.error('Erreur réseau');
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Prompt copié !');
    };

    const categoryMap = getCategoryMap(t);

    const filteredMuses = activeFilter === 'ALL'
        ? muses
        : muses.filter(m => categoryMap[activeFilter]?.filter.includes(m.category));

    const ownAllMuses = muses.filter(m => m.category === 'MUSE').every(m => m.isOwned);

    async function handleBuyPack() {
        if (!session) {
            toast.error('Connecte-toi pour débloquer le Pack All-Access');
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch('/api/muses/purchase-pack', {
                method: 'POST',
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Pack All-Access débloqué ! 🔥');
                fetchMuses();
            } else {
                toast.error(data.error || 'Erreur');
            }
        } catch {
            toast.error('Erreur réseau');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-dark-500 pb-32">

            {/* ═══════════════════════════════════ */}
            {/* HERO — Épuré et direct             */}
            {/* ═══════════════════════════════════ */}
            <section className="pt-36 pb-16 px-4 text-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.05),transparent_60%)] pointer-events-none" />
                <div className="max-w-3xl mx-auto relative z-10">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-6"
                    >
                        {t('muses.tag')}
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-5xl md:text-7xl text-cream mb-5 tracking-tight"
                    >
                        {t('muses.title')} <span className="italic gold-text">{t('muses.title_accent')}</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 text-sm md:text-base max-w-xl mx-auto leading-relaxed"
                    >
                        {t('muses.desc')}
                        <br />
                        {t('muses.desc2')}
                    </motion.p>
                </div>
            </section>

            {/* ═══════════════════════════════════ */}
            {/* FILTRES — 3 catégories + Toutes     */}
            {/* ═══════════════════════════════════ */}
            <div className="max-w-4xl mx-auto px-4 mb-14">
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                    {Object.entries(categoryMap).map(([key, { label }]) => (
                        <button
                            key={key}
                            onClick={() => setActiveFilter(key)}
                            className={`px-4 md:px-6 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 touch-manipulation min-h-[44px] active:scale-95 ${activeFilter === key
                                ? 'bg-gold text-dark shadow-[0_0_15px_rgba(201,168,76,0.2)]'
                                : 'bg-white/[0.03] border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Pack All-Access Banner */}
                {!ownAllMuses && activeFilter === 'ALL' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 bg-gradient-to-br from-gold/20 to-dark-200 border border-gold/30 rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:animate-[shimmer_2s_infinite]" />

                        <div className="relative z-10 flex-1 text-center md:text-left">
                            <h3 className="font-serif text-3xl text-cream mb-2 tracking-wide flex items-center justify-center md:justify-start gap-3">
                                <Sparkles className="text-gold" /> PACK ALL-ACCESS <span className="text-gold italic">L&apos;Univers Milan Sky</span>
                            </h3>
                            <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                                Débloque instantanément l&apos;intégralité des 7 Muses IA et change de personnalité selon ton humeur. Inclus un statut premium dans l&apos;écosystème Milan Sky.
                            </p>
                        </div>
                        <div className="relative z-10 shrink-0 text-center md:text-right">
                            <p className="text-gray-400 line-through text-sm mb-1 font-mono">1150 SC</p>
                            <button
                                onClick={handleBuyPack}
                                className="bg-gold text-dark font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-xl hover:shadow-[0_0_30px_rgba(201,168,76,0.4)] hover:bg-gold-light transition-all active:scale-95"
                            >
                                Tout Débloquer — 600 SC
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* ═══════════════════════════════════ */}
            {/* GRILLE DE MUSES                     */}
            {/* ═══════════════════════════════════ */}
            <div className="max-w-6xl mx-auto px-4">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-pulse text-gold/30 text-xs uppercase tracking-widest font-bold">{t('general.loading')}</div>
                    </div>
                ) : filteredMuses.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-white/30 text-sm">{t('muses.no_muse')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredMuses.map((muse, idx) => (
                                <motion.div
                                    key={muse.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                                    onMouseEnter={() => setHoveredId(muse.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    className={`group relative rounded-2xl border overflow-hidden transition-all duration-500 ${muse.isActive
                                        ? 'border-gold/50 bg-dark-200/80 shadow-[0_0_30px_rgba(201,168,76,0.1)]'
                                        : 'border-white/[0.06] bg-dark-200/40 hover:border-white/[0.12] hover:bg-dark-200/60'
                                        }`}
                                >
                                    {/* ── Image Cover ── */}
                                    <div className="relative h-52 overflow-hidden">
                                        {muse.imageUrl ? (
                                            <img
                                                src={muse.imageUrl}
                                                alt={muse.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-dark-400" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-200 via-dark-200/30 to-transparent" />

                                        {/* Prix — toujours en haut à droite */}
                                        <div className="absolute top-4 right-4">
                                            {muse.isOwned ? (
                                                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold text-dark text-[10px] font-bold tracking-wider uppercase shadow-lg">
                                                    <CheckCircle2 size={11} /> {t('muses.unlocked')}
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold tracking-wider">
                                                    {muse.price} SC
                                                </span>
                                            )}
                                        </div>

                                        {/* Active indicator */}
                                        {muse.isActive && (
                                            <div className="absolute top-4 left-4">
                                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/90 text-white text-[9px] font-bold uppercase tracking-wider shadow-lg">
                                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Active
                                                </span>
                                            </div>
                                        )}

                                        {/* ── Preview Message (hover) ── */}
                                        <AnimatePresence>
                                            {hoveredId === muse.id && muse.previewMessage && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 5 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="absolute bottom-3 left-3 right-3"
                                                >
                                                    <div className="bg-black/80 backdrop-blur-xl rounded-xl px-4 py-3 border border-white/[0.08]">
                                                        <div className="flex items-start gap-2.5">
                                                            <MessageCircle size={14} className="text-gold shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="text-gold text-[10px] font-bold uppercase tracking-wider mb-1">Milan :</p>
                                                                <p className="text-white/80 text-[13px] leading-relaxed italic">
                                                                    &quot;{muse.previewMessage}&quot;
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* ── Contenu carte ── */}
                                    <div className="p-6 flex flex-col">
                                        <h3 className="font-serif text-xl text-cream mb-2 tracking-wide">
                                            {muse.title}
                                        </h3>
                                        <p className="text-white/40 text-[13px] leading-relaxed mb-6 line-clamp-2 min-h-[40px]">
                                            {muse.description}
                                        </p>

                                        {/* ── Bouton — toujours en bas ── */}
                                        {muse.isOwned ? (
                                            <div className="flex gap-2 mt-auto">
                                                <button
                                                    onClick={() => handleActivate(muse.id, muse.category, muse.isActive)}
                                                    className={`flex-1 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 touch-manipulation min-h-[44px] active:scale-95 ${muse.isActive
                                                        ? 'bg-gold text-dark shadow-[0_0_15px_rgba(201,168,76,0.2)]'
                                                        : 'bg-white/[0.04] border border-white/[0.08] text-white/50 hover:bg-white/[0.08] hover:text-white'
                                                        }`}
                                                >
                                                    {muse.isActive ? t('muses.deactivate') : t('muses.activate')}
                                                </button>
                                                <button
                                                    onClick={() => setViewingPrompt(muse)}
                                                    className="w-12 min-h-[44px] rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gold hover:bg-gold/10 transition-all touch-manipulation active:scale-95"
                                                    title="Voir le Prompt"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handlePurchase(muse.id)}
                                                className="w-full py-3.5 rounded-xl bg-gold text-dark text-[10px] uppercase tracking-[0.2em] font-bold hover:shadow-[0_0_20px_rgba(201,168,76,0.25)] active:scale-[0.96] transition-all duration-300 mt-auto touch-manipulation min-h-[44px]"
                                            >
                                                {t('muses.unlock_muse')}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════ */}
            {/* MODALE PROMPT SYSTÈME               */}
            {/* ═══════════════════════════════════ */}
            <AnimatePresence>
                {viewingPrompt && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setViewingPrompt(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-2xl bg-dark-400 border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col max-h-[85vh]"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/[0.05] flex items-center justify-between shrink-0">
                                <div>
                                    <p className="text-gold text-[9px] uppercase tracking-[0.4em] font-bold mb-1 flex items-center gap-1.5">
                                        <Lock size={10} /> {t('muses.prompt_unlocked')}
                                    </p>
                                    <h2 className="font-serif text-2xl text-cream">{viewingPrompt.title}</h2>
                                </div>
                                <button
                                    onClick={() => setViewingPrompt(null)}
                                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30 hover:bg-white/10 hover:text-white transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Prompt Content */}
                            <div className="p-6 overflow-y-auto flex-1">
                                <div className="bg-black/50 rounded-xl p-5 border border-white/[0.04]">
                                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/60">
                                        {viewingPrompt.prompt}
                                    </pre>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-white/[0.05] shrink-0">
                                <button
                                    onClick={() => viewingPrompt.prompt && copyToClipboard(viewingPrompt.prompt)}
                                    className="w-full py-4 rounded-xl bg-gold text-dark text-[10px] uppercase tracking-[0.2em] font-bold hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] min-h-[44px] active:scale-95 touch-manipulation transition-all flex items-center justify-center gap-2"
                                >
                                    <Copy size={14} /> {t('muses.copy_prompt')}
                                </button>
                                <p className="mt-3 text-center text-[9px] text-white/20 uppercase tracking-[0.15em] flex items-center justify-center gap-1.5">
                                    <Info size={10} /> {t('muses.paste_hint')}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
