'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, X, Save, Trash2, Eye, EyeOff,
    Upload, ArrowLeft, Sparkles, Image as ImageIcon,
    Edit3, ToggleLeft, ToggleRight, MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Muse {
    id: string;
    title: string;
    description: string;
    prompt: string;
    price: number;
    category: string;
    isActive: boolean;
    imageUrl: string | null;
    backgroundImage: string | null;
    previewMessage: string | null;
    createdAt: string;
    _count?: { purchases: number };
}

const EMPTY_MUSE: Omit<Muse, 'id' | 'createdAt' | '_count'> = {
    title: '',
    description: '',
    prompt: '',
    price: 0,
    category: 'MUSE',
    isActive: true,
    imageUrl: null,
    backgroundImage: null,
    previewMessage: null,
};

export default function AdminMusesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [muses, setMuses] = useState<Muse[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingMuse, setEditingMuse] = useState<Muse | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Form state
    const [form, setForm] = useState(EMPTY_MUSE);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [bgFile, setBgFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [bgPreview, setBgPreview] = useState<string | null>(null);

    const imageRef = useRef<HTMLInputElement>(null);
    const bgRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (status === 'unauthenticated' || (session && (session.user as any).role !== 'ADMIN')) {
            router.push('/dashboard');
        }
    }, [session, status, router]);

    useEffect(() => {
        fetchMuses();
    }, []);

    async function fetchMuses() {
        try {
            const res = await fetch('/api/admin/muses');
            if (res.ok) {
                const data = await res.json();
                setMuses(data.muses || []);
            }
        } catch {
            toast.error('Erreur de chargement');
        } finally {
            setLoading(false);
        }
    }

    function openCreate() {
        setForm({ ...EMPTY_MUSE });
        setImageFile(null);
        setBgFile(null);
        setImagePreview(null);
        setBgPreview(null);
        setEditingMuse(null);
        setIsCreating(true);
    }

    function openEdit(muse: Muse) {
        setForm({
            title: muse.title,
            description: muse.description,
            prompt: muse.prompt,
            price: muse.price,
            category: muse.category,
            isActive: muse.isActive,
            imageUrl: muse.imageUrl,
            backgroundImage: muse.backgroundImage,
            previewMessage: muse.previewMessage,
        });
        setImageFile(null);
        setBgFile(null);
        setImagePreview(muse.imageUrl);
        setBgPreview(muse.backgroundImage);
        setEditingMuse(muse);
        setIsCreating(true);
    }

    function closeForm() {
        setIsCreating(false);
        setEditingMuse(null);
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'bg') {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        if (type === 'image') {
            setImageFile(file);
            setImagePreview(url);
        } else {
            setBgFile(file);
            setBgPreview(url);
        }
    }

    async function handleSave() {
        if (!form.title || !form.description || !form.prompt) {
            toast.error('Titre, description et prompt sont obligatoires');
            return;
        }

        setSaving(true);
        try {
            const fd = new FormData();
            if (editingMuse) fd.append('id', editingMuse.id);
            fd.append('title', form.title);
            fd.append('description', form.description);
            fd.append('prompt', form.prompt);
            fd.append('price', String(form.price));
            fd.append('category', form.category);
            fd.append('previewMessage', form.previewMessage || '');
            fd.append('isActive', String(form.isActive));
            if (imageFile) fd.append('image', imageFile);
            if (bgFile) fd.append('backgroundImage', bgFile);

            const res = await fetch('/api/admin/muses', {
                method: editingMuse ? 'PUT' : 'POST',
                body: fd,
            });

            if (res.ok) {
                toast.success(editingMuse ? 'Muse mise à jour !' : 'Muse créée !');
                closeForm();
                fetchMuses();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Erreur');
            }
        } catch {
            toast.error('Erreur réseau');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        try {
            const res = await fetch(`/api/admin/muses?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Muse supprimée');
                setDeleteConfirm(null);
                fetchMuses();
            } else {
                toast.error('Erreur suppression');
            }
        } catch {
            toast.error('Erreur réseau');
        }
    }

    async function toggleActive(muse: Muse) {
        try {
            const res = await fetch('/api/admin/muses', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: muse.id, isActive: !muse.isActive }),
            });
            if (res.ok) {
                toast.success(muse.isActive ? 'Muse désactivée' : 'Muse activée');
                fetchMuses();
            }
        } catch {
            toast.error('Erreur');
        }
    }

    if (status === 'loading' || !session || (session.user as any).role !== 'ADMIN') {
        return (
            <div className="min-h-screen bg-dark-500 flex items-center justify-center">
                <div className="animate-pulse text-gold/40 text-xs uppercase tracking-[0.3em]">Vérification des accès...</div>
            </div>
        );
    }

    // ═══════════════════════════════════════════
    // FORMULAIRE CRÉATION / ÉDITION
    // ═══════════════════════════════════════════
    if (isCreating) {
        return (
            <div className="min-h-screen bg-dark-500 pt-28 pb-32 px-4">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <button onClick={closeForm} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                                <ArrowLeft size={18} />
                            </button>
                            <div>
                                <h1 className="font-serif text-3xl text-cream">
                                    {editingMuse ? 'Modifier la Muse' : 'Nouvelle Muse'}
                                </h1>
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mt-1">
                                    {editingMuse ? `Édition de "${editingMuse.title}"` : 'Création d\'une personnalité IA'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">

                        {/* Images upload */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Image principale */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block">Image Principale</label>
                                <div
                                    onClick={() => imageRef.current?.click()}
                                    className={`relative h-48 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all group ${imagePreview ? 'border-gold/30' : 'border-white/10 hover:border-gold/30'}`}
                                >
                                    <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'image')} />
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Upload size={24} className="text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                                            <ImageIcon size={32} className="mb-2" />
                                            <span className="text-[10px] uppercase tracking-widest">Cliquez pour uploader</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Image de fond */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block">Image de Fond</label>
                                <div
                                    onClick={() => bgRef.current?.click()}
                                    className={`relative h-48 rounded-2xl border-2 border-dashed cursor-pointer overflow-hidden transition-all group ${bgPreview ? 'border-gold/30' : 'border-white/10 hover:border-gold/30'}`}
                                >
                                    <input ref={bgRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'bg')} />
                                    {bgPreview ? (
                                        <>
                                            <img src={bgPreview} alt="Background" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Upload size={24} className="text-white" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                                            <ImageIcon size={32} className="mb-2" />
                                            <span className="text-[10px] uppercase tracking-widest">Image d&apos;arrière-plan</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Title + Price + Category + Active */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block">Titre *</label>
                                <input
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Milan Possessif"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-cream placeholder-white/15 focus:outline-none focus:border-gold/40 transition-all font-serif text-lg"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block">Prix (SC) *</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-cream focus:outline-none focus:border-gold/40 transition-all font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block">Catégorie</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-cream focus:outline-none focus:border-gold/40 transition-all text-[11px] uppercase tracking-widest font-bold appearance-none"
                                    >
                                        <option value="MUSE">Personnalité</option>
                                        <option value="MOOD_PACK">Mood</option>
                                        <option value="RITUAL">Expérience</option>
                                        <option value="ELIXIR">Elixir</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block">Description *</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={2}
                                placeholder="Une version intense de Milan..."
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-cream placeholder-white/15 focus:outline-none focus:border-gold/40 transition-all resize-none leading-relaxed"
                            />
                        </div>

                        {/* Preview Message */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
                                <MessageCircle size={12} /> Message de Preview (hover)
                            </label>
                            <input
                                value={form.previewMessage || ''}
                                onChange={(e) => setForm({ ...form, previewMessage: e.target.value })}
                                placeholder="Tu pensais vraiment passer ta soirée sans moi ?"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3.5 text-cream placeholder-white/15 focus:outline-none focus:border-gold/40 transition-all italic"
                            />
                        </div>

                        {/* Prompt IA */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
                                <Sparkles size={12} /> Prompt IA (System Prompt) *
                            </label>
                            <textarea
                                value={form.prompt}
                                onChange={(e) => setForm({ ...form, prompt: e.target.value })}
                                rows={12}
                                placeholder="SYSTEM PROMPT — MUSE : MILAN POSSESSIF&#10;&#10;Identité :&#10;Tu incarnes Milan dans une version..."
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-4 text-white/70 placeholder-white/10 focus:outline-none focus:border-gold/40 transition-all resize-none font-mono text-sm leading-relaxed"
                            />
                        </div>

                        {/* Active toggle */}
                        <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-xl px-6 py-4">
                            <div>
                                <p className="text-cream text-sm font-bold">Muse Active</p>
                                <p className="text-white/30 text-[10px] uppercase tracking-widest">Visible sur la boutique publique</p>
                            </div>
                            <button
                                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                                className="transition-all"
                            >
                                {form.isActive ? (
                                    <ToggleRight size={36} className="text-gold" />
                                ) : (
                                    <ToggleLeft size={36} className="text-white/20" />
                                )}
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={closeForm}
                                disabled={saving}
                                className="flex-1 py-4 rounded-xl border border-white/10 text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white/5 transition-all disabled:opacity-30"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-4 rounded-xl bg-gold text-dark text-[10px] uppercase tracking-[0.2em] font-bold hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <div className="animate-spin w-4 h-4 border-2 border-dark border-t-transparent rounded-full" />
                                ) : (
                                    <><Save size={14} /> {editingMuse ? 'Sauvegarder' : 'Créer la Muse'}</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════
    // LISTE DES MUSES
    // ═══════════════════════════════════════════
    return (
        <div className="min-h-screen bg-dark-500 pt-28 pb-32 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 border-b border-white/[0.03] pb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <button onClick={() => router.push('/admin')} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-all">
                                <ArrowLeft size={16} />
                            </button>
                            <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-gold/60">Administration</span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl text-cream tracking-tight">
                            Gestion des <span className="gold-text italic">Muses</span>
                        </h1>
                        <p className="text-white/30 text-sm mt-2">{muses.length} personnalités IA en base</p>
                    </div>

                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gold text-dark text-[10px] uppercase tracking-[0.2em] font-bold hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all shrink-0"
                    >
                        <Plus size={16} /> Créer une Muse
                    </button>
                </div>

                {/* Liste */}
                {loading ? (
                    <div className="flex items-center justify-center py-32">
                        <div className="animate-spin w-10 h-10 border-2 border-gold border-t-transparent rounded-full" />
                    </div>
                ) : muses.length === 0 ? (
                    <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-3xl">
                        <Sparkles size={40} className="text-white/5 mx-auto mb-6" />
                        <h3 className="font-serif text-2xl text-cream mb-2">Aucune Muse</h3>
                        <p className="text-white/30 text-sm mb-8">Commencez par créer votre première personnalité IA</p>
                        <button onClick={openCreate} className="px-8 py-3 rounded-xl bg-gold text-dark text-[10px] uppercase tracking-[0.2em] font-bold">
                            Créer ma première Muse
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {muses.map((muse) => (
                            <motion.div
                                key={muse.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex items-center gap-6 p-5 rounded-2xl border transition-all ${muse.isActive
                                        ? 'bg-dark-200/40 border-white/[0.06] hover:border-white/[0.12]'
                                        : 'bg-dark-200/20 border-white/[0.03] opacity-50'
                                    }`}
                            >
                                {/* Image */}
                                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-dark-400">
                                    {muse.imageUrl ? (
                                        <img src={muse.imageUrl} alt={muse.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/10">
                                            <ImageIcon size={20} />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-serif text-lg text-cream truncate">{muse.title}</h3>
                                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 uppercase tracking-wider font-bold shrink-0">
                                            {muse.category === 'MUSE' ? 'Personnalité' : muse.category === 'MOOD_PACK' ? 'Mood' : muse.category === 'RITUAL' ? 'Expérience' : muse.category}
                                        </span>
                                        {!muse.isActive && (
                                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 uppercase tracking-wider font-bold shrink-0">Inactive</span>
                                        )}
                                    </div>
                                    <p className="text-white/30 text-[12px] truncate">{muse.description}</p>
                                </div>

                                {/* Stats */}
                                <div className="text-right shrink-0 hidden sm:block">
                                    <p className="text-gold font-serif text-lg">{muse.price} SC</p>
                                    <p className="text-[9px] text-white/20 uppercase tracking-widest">{muse._count?.purchases || 0} ventes</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => toggleActive(muse)}
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${muse.isActive ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-white/5 text-white/20 hover:bg-white/10'
                                            }`}
                                        title={muse.isActive ? 'Désactiver' : 'Activer'}
                                    >
                                        {muse.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>

                                    <button
                                        onClick={() => openEdit(muse)}
                                        className="w-9 h-9 rounded-lg bg-white/5 text-white/30 hover:text-gold hover:bg-gold/10 flex items-center justify-center transition-all"
                                        title="Modifier"
                                    >
                                        <Edit3 size={16} />
                                    </button>

                                    <button
                                        onClick={() => setDeleteConfirm(muse.id)}
                                        className="w-9 h-9 rounded-lg bg-white/5 text-white/20 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all"
                                        title="Supprimer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de confirmation de suppression */}
            <AnimatePresence>
                {deleteConfirm && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteConfirm(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-dark-400 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center"
                        >
                            <Trash2 size={32} className="text-red-400 mx-auto mb-4" />
                            <h3 className="font-serif text-xl text-cream mb-2">Supprimer cette Muse ?</h3>
                            <p className="text-white/40 text-sm mb-6">
                                Cette action est irréversible. Les achats associés seront également supprimés.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white/5 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    className="flex-1 py-3 rounded-xl bg-red-500 text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-red-600 transition-all"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
