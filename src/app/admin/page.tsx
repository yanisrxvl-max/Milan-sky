'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, MessageSquare, Video, Settings, Users, Plus, X, Image as ImageIcon, CheckCircle2, AlertCircle, Info, CreditCard, ExternalLink, Sparkles } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { ContentType, SubscriptionTier } from '@prisma/client';
import toast from 'react-hot-toast';
import { Target, Flag, Rocket } from 'lucide-react'; // Added icons for Evolution

type AdminTab = 'content' | 'requests' | 'payments' | 'quotidirty' | 'analytics' | 'users' | 'settings' | 'evolution';

export default function AdminDashboardPage() {
    return (
        <Suspense fallback={<div className="page-container flex items-center justify-center min-h-screen"><div className="animate-pulse text-white/30 text-xs tracking-widest uppercase">Initialisation du Centre de Commandement...</div></div>}>
            <AdminContent />
        </Suspense>
    );
}

function AdminContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<AdminTab>('content');
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [contents, setContents] = useState<any[]>([]);
    const [isLoadingContents, setIsLoadingContents] = useState(true);
    const [adminRequests, setAdminRequests] = useState<any[]>([]);
    const [isLoadingRequests, setIsLoadingRequests] = useState(false);
    const [manualPayments, setManualPayments] = useState<any[]>([]);
    const [isLoadingPayments, setIsLoadingPayments] = useState(false);
    const [quotidirties, setQuotidirties] = useState<any[]>([]);
    const [isLoadingQuotidirty, setIsLoadingQuotidirty] = useState(false);
    const [analytics, setAnalytics] = useState<any>(null);

    // Evolution J-14 State
    const [launchMissions, setLaunchMissions] = useState<any[]>([]);
    const [isLoadingMissions, setIsLoadingMissions] = useState(false);

    useEffect(() => {
        if (activeTab === 'content') {
            fetchContents();
        } else if (activeTab === 'requests') {
            fetchAdminRequests();
        } else if (activeTab === 'payments') {
            fetchManualPayments();
        } else if (activeTab === 'quotidirty') {
            fetchQuotidirties();
        } else if (activeTab === 'analytics') {
            fetchAnalytics();
        } else if (activeTab === 'evolution') {
            fetchLaunchMissions();
        }
    }, [activeTab]);

    async function fetchLaunchMissions() {
        setIsLoadingMissions(true);
        try {
            const res = await fetch('/api/admin/launch-missions');
            if (res.ok) {
                const data = await res.json();
                setLaunchMissions(data.missions || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingMissions(false);
        }
    }

    async function updateMissionStatus(missionId: string, status: string) {
        try {
            const res = await fetch('/api/admin/launch-missions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ missionId, status }),
            });
            if (res.ok) {
                if (status === 'DONE') {
                    toast.success('Mission Accomplie ! 🚀', { icon: '🎯' });
                }
                fetchLaunchMissions();
            }
        } catch {
            toast.error('Erreur Serveur');
        }
    }

    async function fetchQuotidirties() {
        setIsLoadingQuotidirty(true);
        try {
            const res = await fetch('/api/admin/quotidirty');
            if (res.ok) {
                const data = await res.json();
                setQuotidirties(data.drops || []);
            }
        } catch { } finally { setIsLoadingQuotidirty(false); }
    }

    async function fetchAnalytics() {
        try {
            const res = await fetch('/api/admin/analytics');
            if (res.ok) {
                const data = await res.json();
                setAnalytics(data);
            }
        } catch { }
    }

    async function fetchAdminRequests() {
        setIsLoadingRequests(true);
        try {
            const res = await fetch('/api/admin/requests');
            if (res.ok) {
                const data = await res.json();
                setAdminRequests(data.requests || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingRequests(false);
        }
    }

    async function updateRequestStatus(requestId: string, status: string) {
        try {
            const res = await fetch('/api/admin/requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, status }),
            });
            if (res.ok) {
                toast.success(`Statut mis à jour : ${status}`);
                fetchAdminRequests();
            } else {
                toast.error('Erreur de mise à jour');
            }
        } catch {
            toast.error('Erreur serveur');
        }
    }

    async function fetchContents() {
        setIsLoadingContents(true);
        try {
            const res = await fetch('/api/admin/content');
            if (res.ok) {
                const data = await res.json();
                setContents(data.content || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingContents(false);
        }
    }

    async function fetchManualPayments() {
        setIsLoadingPayments(true);
        try {
            const res = await fetch('/api/admin/payments');
            if (res.ok) {
                const data = await res.json();
                setManualPayments(data || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingPayments(false);
        }
    }

    async function handlePaymentAction(requestId: string, status: 'VALIDATED' | 'REJECTED') {
        try {
            const res = await fetch('/api/admin/payments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestId, status }),
            });
            if (res.ok) {
                toast.success(status === 'VALIDATED' ? 'Paiement Validé !' : 'Paiement Refusé');
                fetchManualPayments();
            } else {
                toast.error('Erreur de traitement');
            }
        } catch {
            toast.error('Erreur serveur');
        }
    }

    useEffect(() => {
        if (status === 'unauthenticated' || (session && session.user.role !== 'ADMIN')) {
            router.push('/dashboard');
        }
    }, [session, status, router]);

    if (status === 'loading' || !session || session.user.role !== 'ADMIN') {
        return (
            <div className="page-container flex items-center justify-center min-h-screen">
                <div className="animate-pulse text-gold/50 text-xs tracking-[0.3em] uppercase">Vérification des Accès de Sécurité...</div>
            </div>
        );
    }

    const tabs = [
        { id: 'analytics', label: 'Analytiques', icon: <Info size={18} /> },
        { id: 'evolution', label: 'J-14 Évolution', icon: <Target size={18} /> },
        { id: 'content', label: 'Bibliothèque', icon: <Video size={18} /> },
        { id: 'muses', label: 'Muses IA', icon: <Sparkles size={18} />, href: '/admin/muses' },
        { id: 'quotidirty', label: 'Le Quotidirty', icon: <AlertCircle size={18} /> },
        { id: 'requests', label: 'Demandes V.I.P', icon: <MessageSquare size={18} /> },
        { id: 'payments', label: 'Paiements', icon: <CreditCard size={18} /> },
        { id: 'users', label: 'Communauté', icon: <Users size={18} /> },
        { id: 'settings', label: 'Système', icon: <Settings size={18} /> },
    ];

    return (
        <div className="page-container max-w-7xl mx-auto px-4 py-8 pt-28">
            {/* NEW PREMIUM HEADER */}
            <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-b border-white/[0.03] pb-12">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                        <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-gold/60">Milan Sky Admin OS v2.0</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream mb-4 tracking-tight"
                    >
                        Gestion des <span className="gold-text italic">Exclusivités</span>
                    </motion.h1>
                    <p className="text-white/30 max-w-lg text-sm leading-relaxed">
                        Bienvenue dans ton centre de commandement. Ici, tu orchestres mon univers avec précision et élégance.
                    </p>
                </div>

                <div className="flex gap-4">
                    {activeTab === 'content' && !showUploadForm && (
                        <PremiumButton variant="gold" className="shrink-0 gap-3 !px-10" onClick={() => setShowUploadForm(true)}>
                            <Plus size={18} />
                            Publier un Média
                        </PremiumButton>
                    )}
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="grid lg:grid-cols-12 gap-10">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-3 space-y-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { if ((tab as any).href) { router.push((tab as any).href); } else { setActiveTab(tab.id as AdminTab); setShowUploadForm(false); } }}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-500 group ${activeTab === tab.id
                                ? 'bg-gold/10 text-gold border border-gold/20 shadow-[0_0_20px_rgba(201,168,76,0.05)]'
                                : 'text-white/30 hover:bg-white/[0.03] hover:text-cream border border-transparent'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-gold/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                    {tab.icon}
                                </div>
                                <span className="font-semibold text-xs tracking-widest uppercase">{tab.label}</span>
                            </div>
                            {activeTab === tab.id && <motion.div layoutId="activeTab" className="w-1.5 h-1.5 rounded-full bg-gold" />}
                        </button>
                    ))}

                    <div className="pt-8 border-t border-white/[0.03] mt-8">
                        <div className="bg-dark-300/50 rounded-2xl p-5 border border-white/[0.05]">
                            <h4 className="text-[9px] uppercase tracking-[0.3em] text-white/40 mb-3 block">Statistiques Lives</h4>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-cream">Revenus SC</span>
                                <span className="text-gold font-mono">1.2k</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-gold w-2/3" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Content */}
                <div className="lg:col-span-9">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + (showUploadForm ? '-upload' : '')}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="bg-dark-300/30 backdrop-blur-sm border border-white/[0.05] rounded-[32px] min-h-[600px] overflow-hidden"
                        >
                            {activeTab === 'content' && !showUploadForm && (
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-serif text-2xl text-cream">Inventaire Numérique</h3>
                                        <span className="text-[10px] text-white/20 uppercase tracking-[0.2em]">{contents.length} fichiers en ligne</span>
                                    </div>

                                    {isLoadingContents ? (
                                        <div className="flex flex-col items-center justify-center py-40 gap-4">
                                            <div className="animate-spin h-10 w-10 border-2 border-gold border-t-transparent rounded-full" />
                                            <span className="text-[10px] text-gold/40 uppercase tracking-widest">Synchronisation...</span>
                                        </div>
                                    ) : contents.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center min-h-[400px] text-center border-2 border-dashed border-white/5 rounded-[24px]">
                                            <div className="w-20 h-20 rounded-3xl bg-dark-400 border border-white/5 flex items-center justify-center mb-6 text-white/10 group-hover:scale-110 transition-transform">
                                                <Video size={32} />
                                            </div>
                                            <h3 className="font-serif text-2xl text-cream mb-2">Bibliothèque Vide</h3>
                                            <p className="text-white/30 text-sm max-w-sm mb-8 leading-relaxed">
                                                Vos membres attendent du contenu exclusif. Commencez par importer votre première photo ou vidéo 4K.
                                            </p>
                                            <PremiumButton variant="gold" onClick={() => setShowUploadForm(true)}>Ajouter un Premier Média</PremiumButton>
                                        </div>
                                    ) : (
                                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {contents.map(c => (
                                                <div key={c.id} className="group bg-dark-400/50 border border-white/[0.05] rounded-3xl overflow-hidden hover:border-gold/30 transition-all duration-500">
                                                    <div className="aspect-[4/5] bg-dark-500 relative overflow-hidden">
                                                        {c.imageUrl ? (
                                                            <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center text-white/10"><Video size={48} /></div>
                                                        )}
                                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                            <span className="text-[9px] px-3 py-1 rounded-full bg-black/60 backdrop-blur text-gold border border-gold/20 font-bold tracking-widest uppercase">{c.tier}</span>
                                                            <span className="text-[9px] px-3 py-1 rounded-full bg-gold text-dark font-bold tracking-widest uppercase">{c.price} SC</span>
                                                        </div>
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all">Editer le Média</button>
                                                        </div>
                                                    </div>
                                                    <div className="p-5">
                                                        <h4 className="font-serif text-lg text-cream line-clamp-1 mb-1">{c.title}</h4>
                                                        <p className="text-[10px] text-white/30 uppercase tracking-[0.1em]">{new Date(c.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'content' && showUploadForm && (
                                <UploadContentForm onCancel={() => setShowUploadForm(false)} onSuccess={() => { setShowUploadForm(false); fetchContents(); }} />
                            )}

                            {activeTab === 'requests' && (
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-serif text-2xl text-cream">Requêtes Privées</h3>
                                        <div className="flex items-center gap-2 text-[10px] text-gold uppercase tracking-widest font-bold">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                                            {adminRequests.filter(r => r.status === 'PENDING').length} Nouvelles
                                        </div>
                                    </div>

                                    {isLoadingRequests ? (
                                        <div className="flex justify-center py-40"><div className="animate-spin h-10 w-10 border-2 border-gold border-t-transparent rounded-full"></div></div>
                                    ) : adminRequests.length === 0 ? (
                                        <div className="text-center py-40 bg-dark-400/20 rounded-3xl border border-white/5">
                                            <div className="w-16 h-16 rounded-full bg-dark-300 border border-white/5 flex items-center justify-center mb-6 text-white/5 mx-auto">
                                                <MessageSquare size={24} />
                                            </div>
                                            <p className="text-white/30 text-sm italic tracking-wide">Aucune demande active de vos membres V.I.P</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {adminRequests.map((req: any) => (
                                                <div key={req.id} className="bg-dark-400/40 border border-white/[0.06] rounded-3xl p-6 hover:bg-dark-400/60 transition-all">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/10">
                                                                {req.type === 'VIDEO' ? <Video size={20} /> : <ImageIcon size={20} />}
                                                            </div>
                                                            <div>
                                                                <p className="text-cream font-mono text-sm tracking-tighter">{req.orderNumber}</p>
                                                                <p className="text-white/30 text-[10px] mt-0.5 uppercase tracking-widest font-medium">
                                                                    {req.user?.name || req.user?.email || 'Membre Sky'} — {new Date(req.createdAt).toLocaleDateString('fr-FR')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[9px] px-3 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 uppercase tracking-widest font-bold">{req.type}</span>
                                                            {req.budget && <span className="text-sm text-gold font-serif tabular-nums tracking-wide">{req.budget} €</span>}
                                                        </div>
                                                    </div>
                                                    <div className="bg-black/20 rounded-2xl p-5 mb-6">
                                                        <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap font-light">&quot;{req.description}&quot;</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {[
                                                            { id: 'PENDING', label: 'En attente', color: 'bg-white/5 text-white/40' },
                                                            { id: 'VALIDATED', label: 'Validé', color: 'bg-blue-500/20 text-blue-400' },
                                                            { id: 'IN_PROGRESS', label: 'Processing', color: 'bg-purple-500/20 text-purple-400' },
                                                            { id: 'DELIVERED', label: 'Livré', color: 'bg-gold/20 text-gold' },
                                                            { id: 'CANCELLED', label: 'Refusé', color: 'bg-red-500/20 text-red-400' }
                                                        ].map(s => (
                                                            <button
                                                                key={s.id}
                                                                onClick={() => updateRequestStatus(req.id, s.id)}
                                                                className={`text-[9px] px-4 py-2 rounded-full transition-all uppercase tracking-[0.2em] font-bold border ${req.status === s.id
                                                                    ? `${s.color} border-current`
                                                                    : 'bg-white/5 text-white/30 border-transparent hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                {s.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'payments' && (
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-serif text-2xl text-cream">Vérification des Paiements</h3>
                                        <div className="flex items-center gap-2 text-[10px] text-gold uppercase tracking-widest font-bold">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                                            {manualPayments.filter(p => p.status === 'PENDING').length} À Valider
                                        </div>
                                    </div>

                                    {isLoadingPayments ? (
                                        <div className="flex justify-center py-40"><div className="animate-spin h-10 w-10 border-2 border-gold border-t-transparent rounded-full"></div></div>
                                    ) : manualPayments.length === 0 ? (
                                        <div className="text-center py-40 bg-dark-400/20 rounded-3xl border border-white/5">
                                            <div className="w-16 h-16 rounded-full bg-dark-300 border border-white/5 flex items-center justify-center mb-6 text-white/5 mx-auto">
                                                <CreditCard size={24} />
                                            </div>
                                            <p className="text-white/30 text-sm italic tracking-wide">Aucun paiement en attente</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {manualPayments.map((pay: any) => (
                                                <div key={pay.id} className="bg-dark-400/40 border border-white/[0.06] rounded-3xl p-6 hover:bg-dark-400/60 transition-all">
                                                    <div className="flex flex-col lg:flex-row gap-8">
                                                        {/* Screenshot Side */}
                                                        <div className="w-full lg:w-48 aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/10 group relative">
                                                            {pay.proofImageUrl ? (
                                                                <>
                                                                    <img src={pay.proofImageUrl} alt="Proof" className="w-full h-full object-cover" />
                                                                    <a href={pay.proofImageUrl} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                                        <ExternalLink size={20} className="text-white" />
                                                                    </a>
                                                                </>
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-white/10 italic text-[10px] uppercase tracking-widest">Pas d&apos;image</div>
                                                            )}
                                                        </div>

                                                        {/* Info Side */}
                                                        <div className="flex-1 space-y-4">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <span className={`text-[9px] px-3 py-1 rounded-full border mb-3 inline-block font-bold tracking-widest uppercase ${pay.status === 'PENDING' ? 'bg-gold/10 text-gold border-gold/20' : pay.status === 'VALIDATED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                                        {pay.status === 'PENDING' ? 'En Attente' : pay.status === 'VALIDATED' ? 'Validé' : 'Refusé'}
                                                                    </span>
                                                                    <h4 className="text-cream text-lg font-bold">{pay.user?.name || pay.user?.email}</h4>
                                                                    <p className="text-white/30 text-[10px] uppercase tracking-widest">{pay.user?.email}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-gold font-serif text-2xl">{pay.amount} €</p>
                                                                    <p className="text-[10px] text-white/20 uppercase tracking-widest">{pay.method}</p>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4 bg-black/20 rounded-2xl p-4">
                                                                <div>
                                                                    <p className="text-[9px] text-white/20 uppercase tracking-widest mb-1">Type d&apos;achat</p>
                                                                    <p className="text-cream text-xs font-bold tracking-tight uppercase">{pay.type}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] text-white/20 uppercase tracking-widest mb-1">Cible</p>
                                                                    <p className="text-gold text-xs font-bold tracking-tight uppercase">{pay.targetId}</p>
                                                                </div>
                                                            </div>

                                                            {pay.status === 'PENDING' && (
                                                                <div className="flex gap-4 pt-4">
                                                                    <button
                                                                        onClick={() => handlePaymentAction(pay.id, 'VALIDATED')}
                                                                        className="flex-1 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/20 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all"
                                                                    >
                                                                        Valider le Paiement
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handlePaymentAction(pay.id, 'REJECTED')}
                                                                        className="flex-1 py-3 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-white/5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all"
                                                                    >
                                                                        Rejeter
                                                                    </button>
                                                                </div>
                                                            )}

                                                            <p className="text-[9px] text-white/10 uppercase tracking-widest pt-4">Reçu le {new Date(pay.createdAt).toLocaleString('fr-FR')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'analytics' && (
                                <div className="p-10">
                                    <div className="flex items-center justify-between mb-12">
                                        <h3 className="font-serif text-3xl text-cream italic">Visualisation des <span className="gold-text">Performances</span></h3>
                                        <div className="px-5 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-[10px] font-black uppercase tracking-widest">Live Updates</div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                        {[
                                            { label: 'Revenus Totaux', value: `${analytics?.totalRevenue || 0} SC`, sub: '≈ ' + ((analytics?.totalRevenue || 0) * 0.1).toFixed(2) + ' €', trend: '+12%' },
                                            { label: 'Utilisateurs Actifs', value: analytics?.activeUsers || 0, sub: 'Dernières 24h', trend: '+5%' },
                                            { label: 'Ventes Muses', value: analytics?.museSales || 0, sub: 'SC convertis', trend: '+20%' }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-dark-400 p-8 rounded-3xl border border-white/[0.05] relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                    <CreditCard size={48} />
                                                </div>
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-4">{stat.label}</p>
                                                <p className="text-4xl font-serif text-cream mb-2">{stat.value}</p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-gold/60 font-medium tracking-tight uppercase">{stat.sub}</p>
                                                    <span className="text-[10px] font-black text-green-400">{stat.trend}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-dark-400 p-8 rounded-[2.5rem] border border-white/[0.05]">
                                        <h4 className="text-[11px] uppercase tracking-[0.3em] font-black text-white/30 mb-8 ml-2">Top Contenus Débloqués</h4>
                                        <div className="space-y-6">
                                            {(analytics?.topContent || []).map((c: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-dark-500 overflow-hidden">
                                                            <img src={c.imageUrl} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div>
                                                            <p className="text-cream text-sm font-bold tracking-tight">{c.title}</p>
                                                            <p className="text-[10px] text-white/30 uppercase tracking-widest">{c.purchases} Ventes</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-gold font-mono text-sm">{c.revenue} SC</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'evolution' && (
                                <div className="p-10 bg-dark-600/50 min-h-screen relative overflow-hidden">
                                    {/* Decorative background elements */}
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

                                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <Rocket size={18} className="text-gold" />
                                                <h3 className="font-serif text-3xl text-cream italic">J-14 <span className="gold-text">Évolution</span></h3>
                                            </div>
                                            <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-medium ml-1">Tableau de bord de Lancement Stratégique</p>
                                        </div>
                                        <div className="bg-dark-300 border border-white/5 rounded-2xl px-6 py-4 flex items-center gap-6">
                                            <div className="text-center">
                                                <p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Missions</p>
                                                <p className="text-cream font-mono text-xl">{launchMissions.filter(m => m.status === 'DONE').length} <span className="text-white/20 text-sm">/ {launchMissions.length}</span></p>
                                            </div>
                                            <div className="w-px h-8 bg-white/5" />
                                            <div className="w-48">
                                                <div className="flex justify-between text-[9px] font-bold tracking-widest uppercase mb-2">
                                                    <span className="text-gold">Progression</span>
                                                    <span className="text-white">{Math.round((launchMissions.filter(m => m.status === 'DONE').length / Math.max(1, launchMissions.length)) * 100)}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-gold/50 to-gold"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.round((launchMissions.filter(m => m.status === 'DONE').length / Math.max(1, launchMissions.length)) * 100)}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {isLoadingMissions ? (
                                        <div className="flex justify-center py-40">
                                            <div className="animate-spin h-10 w-10 border-2 border-gold border-t-transparent rounded-full" />
                                        </div>
                                    ) : (
                                        <div className="grid md:grid-cols-3 gap-6 relative z-10">
                                            {/* TODO Column */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between px-2 mb-6 text-white/40">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white/20" /> À FAIRE</span>
                                                    <span className="text-xs font-mono bg-white/5 px-2 py-0.5 rounded-lg">{launchMissions.filter(m => m.status === 'TODO').length}</span>
                                                </div>
                                                <AnimatePresence>
                                                    {launchMissions.filter(m => m.status === 'TODO').map(mission => (
                                                        <MissionCard key={mission.id} mission={mission} onUpdate={updateMissionStatus} />
                                                    ))}
                                                </AnimatePresence>
                                            </div>

                                            {/* IN PROGRESS Column */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between px-2 mb-6 text-gold/60">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gold/50 animate-pulse" /> EN COURS</span>
                                                    <span className="text-xs font-mono bg-gold/10 px-2 py-0.5 rounded-lg">{launchMissions.filter(m => m.status === 'IN_PROGRESS').length}</span>
                                                </div>
                                                <AnimatePresence>
                                                    {launchMissions.filter(m => m.status === 'IN_PROGRESS').map(mission => (
                                                        <MissionCard key={mission.id} mission={mission} onUpdate={updateMissionStatus} />
                                                    ))}
                                                </AnimatePresence>
                                            </div>

                                            {/* DONE Column */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between px-2 mb-6 text-green-400/60">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400" /> TERMINÉ</span>
                                                    <span className="text-xs font-mono bg-green-400/10 px-2 py-0.5 rounded-lg">{launchMissions.filter(m => m.status === 'DONE').length}</span>
                                                </div>
                                                <AnimatePresence>
                                                    {launchMissions.filter(m => m.status === 'DONE').map(mission => (
                                                        <MissionCard key={mission.id} mission={mission} onUpdate={updateMissionStatus} />
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'quotidirty' && (
                                <div className="p-10">
                                    <div className="flex items-center justify-between mb-12">
                                        <div>
                                            <h3 className="font-serif text-3xl text-cream italic mb-2">Le <span className="gold-text">Quotidirty</span> Drop</h3>
                                            <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Gestion des exclusivités éphémères</p>
                                        </div>
                                        <PremiumButton variant="gold" onClick={() => setShowUploadForm(true)} className="gap-3 !px-8">
                                            <Plus size={18} />
                                            Nouveau Drop
                                        </PremiumButton>
                                    </div>

                                    {isLoadingQuotidirty ? (
                                        <div className="flex justify-center py-40"><div className="animate-spin h-10 w-10 border-2 border-gold border-t-transparent rounded-full"></div></div>
                                    ) : quotidirties.length === 0 ? (
                                        <div className="text-center py-40 bg-dark-400 rounded-3xl border border-white/5 border-dashed">
                                            <AlertCircle size={48} className="text-white/5 mx-auto mb-6" />
                                            <p className="text-white/30 text-sm tracking-widest uppercase">Aucun Drop programmé</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {quotidirties.map(drop => (
                                                <div key={drop.id} className="bg-dark-400 p-6 rounded-3xl border border-white/[0.05] flex items-center gap-8">
                                                    <img src={drop.imageUrl} className="w-24 h-24 rounded-2xl object-cover grayscale" alt="" />
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h4 className="text-cream font-serif text-xl">{drop.title}</h4>
                                                            {new Date() < new Date(drop.expireTime) && new Date() >= new Date(drop.releaseTime) && (
                                                                <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
                                                            )}
                                                        </div>
                                                        <p className="text-white/30 text-xs mb-4">{drop.description}</p>
                                                        <div className="flex gap-6 items-center">
                                                            <div>
                                                                <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Release</p>
                                                                <p className="text-cream text-[10px] font-mono">{new Date(drop.releaseTime).toLocaleString()}</p>
                                                            </div>
                                                            <div className="w-px h-6 bg-white/10" />
                                                            <div>
                                                                <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Expiry</p>
                                                                <p className="text-red-400/60 text-[10px] font-mono">{new Date(drop.expireTime).toLocaleString()}</p>
                                                            </div>
                                                            <div className="w-px h-6 bg-white/10" />
                                                            <div>
                                                                <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">Price</p>
                                                                <p className="text-gold text-[10px] font-black">{drop.price} SC</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function UploadContentForm({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) {
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
                    toast.success('Lancement réussi ! Votre média est maintenant en ligne.');
                    onSuccess();
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
        <div className="p-10">
            <div className="flex items-center justify-between mb-10 border-b border-white/[0.05] pb-8">
                <div>
                    <h3 className="font-serif text-3xl text-cream">Nouveau Chef-d&apos;œuvre</h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-medium mt-1">Configuration du déploiement média</p>
                </div>
                <button onClick={onCancel} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:text-white hover:border-white/30 transition-all">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Advanced File Upload */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Configuration du Média Source</label>
                    <div className={`relative border-2 border-dashed rounded-[32px] p-12 transition-all duration-500 text-center ${file ? 'border-gold/50 bg-gold/5' : 'border-white/10 hover:bg-white/[0.03] hover:border-gold/30'}`}>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={loading}
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <div className="relative z-0">
                            {file ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 rounded-3xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-xl shadow-gold/10">
                                        {file.type.startsWith('video') ? <Video size={36} /> : <ImageIcon size={36} />}
                                    </div>
                                    <div>
                                        <span className="text-cream font-bold block mb-1 text-lg">{file.name}</span>
                                        <span className="text-[10px] text-gold/60 uppercase tracking-widest font-bold">{(file.size / (1024 * 1024)).toFixed(2)} Megabytes</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-6">
                                    <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-white/10">
                                        <Upload size={36} />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-cream text-lg font-medium block">Sélectionnez votre média 4K</span>
                                        <span className="text-[10px] text-white/20 uppercase tracking-[0.2em]">Glissez-déposez n&apos;importe quel fichier photo ou vidéo</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Information Grid */}
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block ml-1">Identifiant Public</label>
                            <input name="title" required placeholder="Titre de l'exclusivité..." className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-cream placeholder-white/10 focus:outline-none focus:border-gold/50 focus:bg-white/[0.04] transition-all font-serif text-lg" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block ml-1">Tarification (SkyCoins)</label>
                            <div className="relative">
                                <input name="price" type="number" min="0" defaultValue="0" required className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-cream focus:outline-none focus:border-gold/50 focus:bg-white/[0.04] transition-all font-mono" />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gold/60 uppercase tracking-widest">SC</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block ml-1">Niveau d&apos;Accès Requis</label>
                            <select name="tier" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-cream focus:outline-none focus:border-gold/50 appearance-none transition-all uppercase tracking-widest font-bold text-[11px]">
                                <option value="VOYEUR">VOYEUR (Basic Access)</option>
                                <option value="INITIE">INITIÉ (Plus Access)</option>
                                <option value="PRIVILEGE">PRIVILÈGE (Elite Access)</option>
                                <option value="SKYCLUB">SKYCLUB (Limited Access)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block ml-1">Classification du Média</label>
                            <select name="type" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-cream focus:outline-none focus:border-gold/50 appearance-none transition-all uppercase tracking-widest font-bold text-[11px]">
                                <option value="PHOTO">Photographie Unique</option>
                                <option value="VIDEO">Production Vidéo</option>
                                <option value="SERIES">Série Narrative</option>
                                <option value="COLLABORATION">Collaboration Spéciale</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block ml-1">Teasing (Description)</label>
                    <textarea name="description" rows={4} placeholder="Décrivez l'émotion derrière ce média..." className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-5 text-cream placeholder-white/10 focus:outline-none focus:border-gold/50 focus:bg-white/[0.04] transition-all resize-none font-light leading-relaxed"></textarea>
                </div>

                <div className="pt-8 flex flex-col gap-6">
                    {loading && (
                        <div className="space-y-3">
                            <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold text-gold/60">
                                <span>Transmission en cours...</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-gold-dark to-gold"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-6">
                        <button type="button" onClick={onCancel} disabled={loading} className="flex-1 py-5 rounded-2xl text-[11px] font-bold tracking-[0.3em] uppercase border border-white/10 text-white/40 hover:bg-white/5 hover:text-cream transition-all disabled:opacity-30">Abandonner</button>
                        <PremiumButton type="submit" variant="gold" isLoading={loading} className="flex-1 !py-5 !rounded-2xl text-[11px] font-bold tracking-[0.3em]">Lancer la Publication</PremiumButton>
                    </div>
                </div>
            </form>
        </div>
    );
}

// ----- Evolution UI Component -----

function MissionCard({ mission, onUpdate }: { mission: any, onUpdate: (id: string, st: string) => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-5 rounded-3xl border transition-all duration-300 group
                ${mission.status === 'DONE'
                    ? 'bg-green-500/5 border-green-500/20 opacity-60'
                    : mission.status === 'IN_PROGRESS'
                        ? 'bg-gold/5 border-gold/30 hover:bg-gold/10'
                        : 'bg-dark-300 border-white/5 hover:border-white/10'
                }
            `}
        >
            <div className="flex items-center gap-2 mb-3">
                <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-md 
                    ${mission.importance === 'HIGH' ? 'bg-red-500/10 text-red-400' : mission.importance === 'LOW' ? 'bg-white/5 text-white/40' : 'bg-blue-500/10 text-blue-400'}`}>
                    {mission.category}
                </span>
                {mission.status === 'DONE' && <CheckCircle2 size={12} className="text-green-400" />}
            </div>
            <h4 className={`font-serif text-lg mb-2 ${mission.status === 'DONE' ? 'text-white/50 line-through decoration-white/20' : 'text-cream'}`}>{mission.title}</h4>
            <p className="text-[11px] text-white/40 leading-relaxed font-light mb-5">{mission.description}</p>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {mission.status !== 'TODO' && (
                    <button onClick={() => onUpdate(mission.id, 'TODO')} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:bg-white/10 hover:text-white transition-all">
                        <X size={14} />
                    </button>
                )}
                {mission.status !== 'IN_PROGRESS' && mission.status !== 'DONE' && (
                    <button onClick={() => onUpdate(mission.id, 'IN_PROGRESS')} className="flex-1 py-2 rounded-xl bg-gold/10 text-gold text-[9px] font-bold uppercase tracking-widest border border-gold/20 hover:bg-gold hover:text-dark transition-all">
                        Démarrer
                    </button>
                )}
                {mission.status !== 'DONE' && (
                    <button onClick={() => onUpdate(mission.id, 'DONE')} className="flex-1 py-2 rounded-xl bg-green-500/10 text-green-400 text-[9px] font-bold uppercase tracking-widest border border-green-500/20 hover:bg-green-500 hover:text-dark transition-all">
                        Terminer
                    </button>
                )}
            </div>
        </motion.div>
    );
}
