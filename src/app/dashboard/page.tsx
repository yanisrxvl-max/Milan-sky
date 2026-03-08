'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Zap, Clock, Shield, Upload, LogOut, ChevronRight, CheckCircle2, ShoppingCart, Send, CreditCard, Camera, Trophy, Gift } from 'lucide-react';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import StudioUpload from '@/components/admin/StudioUpload';
import SkyCoinsShop from '@/components/ui/SkyCoinsShop';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
  subscription: {
    tier: string;
    status: string;
    currentPeriodEnd: string;
  } | null;
  skyCoinsBalance: number;
  fanRank: string;
  purchases: Array<{
    id: string;
    contentTitle: string;
    contentType: string;
    price: number;
    createdAt: string;
  }>;
  privateRequests: Array<{
    id: string;
    orderNumber: string;
    type: string;
    status: string;
    createdAt: string;
  }>;
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    euroAmount: number | null;
    description: string | null;
    createdAt: string;
  }>;
  skyPoints: number;
  proximityGauge: number;
  ageVerified: boolean;
}

const TIER_DISPLAY: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  VOYEUR: { icon: <Shield size={14} />, color: 'text-white/50 bg-white/5 border-white/10', label: 'Voyeur' },
  INITIE: { icon: <Zap size={14} />, color: 'text-gold-light bg-gold/10 border-gold/20', label: 'Initié' },
  PRIVILEGE: { icon: <Sparkles size={14} />, color: 'text-gold bg-gold/20 border-gold/40', label: 'Privilège' },
  SKYCLUB: { icon: <Crown size={14} />, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', label: 'SkyClub' },
};

function Sparkles(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
  )
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'En attente', class: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  VALIDATED: { label: 'Validé', class: 'bg-green-500/10 text-green-400 border-green-500/20' },
  PAID: { label: 'Payé', class: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  IN_PROGRESS: { label: 'En cours', class: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  DELIVERED: { label: 'Livré', class: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  CANCELLED: { label: 'Annulé', class: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

type Tab = 'profile' | 'purchases' | 'orders' | 'history' | 'studio';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="page-container flex items-center justify-center min-h-screen"><div className="animate-pulse text-gold/40 text-xs uppercase tracking-widest font-bold">Chargement du Sanctuaire...</div></div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const subscribed = searchParams.get('subscribed');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (subscribed === 'true') {
      toast.success('Clés du sanctuaire remises avec succès !');
    }
  }, [subscribed]);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditName(data.name || '');
      }
    } catch {
      toast.error('Erreur chargement profil');
    } finally {
      setLoading(false);
    }
  }

  async function updateName() {
    if (!editName.trim() || editName === profile?.name) return;
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => prev ? { ...prev, name: data.name } : prev);
        toast.success('Identité mise à jour');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erreur');
      }
    } catch {
      toast.error('Erreur serveur');
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setProfile((prev) => prev ? { ...prev, avatarUrl: data.avatarUrl } : prev);
        toast.success('Portrait mis à jour');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erreur upload');
      }
    } catch {
      toast.error('Erreur upload');
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Fichier trop volumineux (max 5 Mo)');
        return;
      }
      uploadAvatar(file);
    }
  }

  if (loading) return (
    <div className="page-container flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-gold/40 text-xs uppercase tracking-widest font-bold">Chargement du Sanctuaire...</div>
    </div>
  );

  if (!profile) return (
    <div className="page-container flex items-center justify-center min-h-screen">
      <p className="text-white/50 text-xs uppercase font-bold tracking-widest">Impossible de charger le profil.</p>
    </div>
  );

  const tier = profile.subscription ? TIER_DISPLAY[profile.subscription.tier] : null;

  const getBalanceColor = (balance: number) => {
    if (balance === 0) return 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white shadow-[0_0_15px_rgba(255,0,0,0.2)]';
    if (balance < 50) return 'bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500 hover:text-white shadow-[0_0_15px_rgba(249,115,22,0.2)]';
    return 'bg-gold/10 border-gold/30 text-gold hover:bg-gold hover:text-dark shadow-[0_0_15px_rgba(201,168,76,0.2)]';
  };

  return (
    <div className="page-container max-w-5xl mx-auto px-4 py-8 pt-28 pb-32">
      {/* PROFILE HEADER (GLASSMORPHISM PREMIUM) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[2.5rem] bg-dark-200/40 backdrop-blur-xl border border-white/[0.05] p-8 md:p-12 mb-10 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[100px] rounded-full pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Avatar Area */}
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-gold rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500" />
            <div
              className="relative w-32 h-32 rounded-full bg-dark-400 border-2 border-gold/30 overflow-hidden cursor-pointer flex items-center justify-center"
              onClick={() => fileRef.current?.click()}
            >
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-white/20 font-serif.">{profile.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || '?'}</span>
              )}

              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Upload size={20} className="text-white mb-1" />
                <span className="text-[10px] text-white uppercase font-bold tracking-widest">Modifier</span>
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-serif text-4xl md:text-5xl text-cream mb-2 tracking-tight">
              {profile.name || 'Membre Exclusif'}
            </h1>
            <p className="text-white/40 text-xs font-mono mb-4">{profile.email}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              {tier ? (
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest border ${tier.color}`}>
                  {tier.icon} {tier.label}
                </span>
              ) : (
                <Link href="/subscriptions" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-all">
                  <Shield size={12} /> Débloquer un Pass
                </Link>
              )}

              <Link href="/skycoins" className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${getBalanceColor(profile.skyCoinsBalance)}`}>
                <AnimatedCounter value={profile.skyCoinsBalance} /> SC
              </Link>

              {profile.fanRank && (
                <Link href="/skycoins" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-dark-400 border border-gold/20 text-cream hover:bg-gold/10 transition-all cursor-pointer">
                  <Trophy size={14} className="text-gold" /> {profile.fanRank}
                </Link>
              )}

              {profile.ageVerified && (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Shield size={14} /> Majeur Vérifié
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <Link href="/skycoins" className="w-full btn-gold justify-center !py-3 !px-6 text-[10px] min-h-[44px] touch-manipulation active:scale-95">
              Alimenter le Compte
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-red-500/20 text-red-500/70 hover:bg-red-500/10 hover:text-red-500 text-[10px] uppercase font-bold tracking-widest transition-all min-h-[44px] touch-manipulation active:scale-95"
            >
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        </div>
      </motion.div>

      {/* SECTION BOUTIQUE SKYCOINS (TOP Priority) */}
      <section className="mb-12">
        <SkyCoinsShop />
      </section>

      {/* TABS NAVIGATION */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-4 custom-scrollbar lg:justify-center">
        {[
          { id: 'profile' as Tab, label: 'Paramètres', icon: <Shield size={14} /> },
          { id: 'purchases' as Tab, label: 'La Sphère', icon: <CheckCircle2 size={14} /> },
          { id: 'orders' as Tab, label: 'Demandes Privées', icon: <Send size={14} /> },
          ...(session?.user?.role === 'ADMIN' ? [{ id: 'studio' as Tab, label: 'Studio Créateur', icon: <Camera size={14} /> }] : []),
          { id: 'history' as Tab, label: 'Registres', icon: <Clock size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 min-h-[44px] touch-manipulation active:scale-95 ${activeTab === tab.id
              ? 'text-gold'
              : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
          >
            {tab.icon} {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-gold/10 border border-gold/30 rounded-xl"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* CONTENT PANELS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'profile' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Identity Card */}
              <div className="card-premium">
                <h3 className="font-serif text-2xl text-cream mb-6 flex items-center gap-2">Identité</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2 block">Surnom / Alias</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="input-field flex-1 !py-3 min-h-[44px]"
                        placeholder="Votre nom"
                        maxLength={50}
                      />
                      <button
                        onClick={updateName}
                        disabled={saving || !editName.trim() || editName === profile.name}
                        className="btn-outline !py-3 !px-6 bg-dark-400 min-h-[44px] touch-manipulation active:scale-95 transition-all"
                      >
                        {saving ? '...' : 'Valider'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Card */}
              <div className="card-premium relative overflow-hidden group">
                {profile.subscription ? (
                  <>
                    <h3 className="font-serif text-2xl text-cream mb-6 flex items-center gap-2">Badge d&apos;Accès</h3>
                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                        <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Niveau</span>
                        <span className={`text-[10px] uppercase font-bold tracking-widest ${tier?.color} px-3 py-1 rounded-full border`}>
                          {tier?.label}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                        <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Statut</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                          {profile.subscription.status === 'ACTIVE' ? 'En vigueur' : profile.subscription.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                        <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Expiration</span>
                        <span className="text-white/70 text-sm font-mono">
                          {new Date(profile.subscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center text-white/20 mb-4">
                      <Shield size={24} />
                    </div>
                    <p className="text-white/40 text-sm mb-6">Tu ne possèdes aucun badge d'accès.</p>
                    <Link href="/subscriptions" className="btn-gold !py-3 min-h-[44px] touch-manipulation active:scale-95 justify-center">
                      Accéder au Cercle
                    </Link>
                  </div>
                )}
              </div>

              {/* Missions Widget */}
              <div className="card-premium md:col-span-2 bg-gradient-to-br from-dark-200/40 to-gold/5 border-gold/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-xl text-cream flex items-center gap-2">
                    <Zap size={18} className="text-gold" /> Missions Quotidiennes
                  </h3>
                  <Link href="/skycoins" className="text-[10px] uppercase font-bold tracking-widest text-gold hover:text-gold-light transition-colors flex items-center gap-1">
                    Voir tout <ChevronRight size={12} />
                  </Link>
                </div>
                <p className="text-white/40 text-xs mb-4">Gagnez des SkyCoins gratuits chaque jour en complétant vos objectifs.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/skycoins" className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold"><Gift size={14} /></div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-cream group-hover:text-gold transition-colors">Bonus de Connexion</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">+2 SC (multiplié)</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/skycoins" className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm">🎯</div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-cream group-hover:text-blue-400 transition-colors">3 Missions Disponibles</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Jusqu'à +18 SC</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Loyalty & Gamification Widget */}
              <div className="card-premium md:col-span-2 border-dashed border-white/10">
                <h3 className="font-serif text-xl text-cream mb-6 flex items-center justify-between">
                  <div className="flex flex-row items-center gap-2"><Trophy size={18} className="text-gold" /> Jauge de Fidélité</div>
                  <span className="text-xs font-mono text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">{profile.skyPoints} SkyPoints</span>
                </h3>

                <div className="space-y-6">
                  {/* Proximity Gauge */}
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white/40 uppercase tracking-widest font-bold">Proximité avec l'IA</span>
                      <span className="text-pink-500 font-mono">{profile.proximityGauge}%</span>
                    </div>
                    <div className="w-full bg-dark-400 rounded-full h-2 overflow-hidden border border-white/5">
                      <motion.div
                        className="h-full bg-gradient-to-r from-pink-900 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${profile.proximityGauge}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mt-2 text-right">À 100% : 1 Audio Secret débloqué</p>
                  </div>

                  {/* Archives Floues (FOMO) */}
                  <div className="mt-8">
                    <h4 className="text-xs uppercase tracking-widest text-white/50 mb-4 font-bold">Archives Manquées (FOMO)</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden group border border-white/5 cursor-pointer">
                          <div className="absolute inset-0 bg-dark blur-md z-0" style={{ backgroundImage: "url('/images/placeholders/blur-bg.jpg')", backgroundSize: 'cover' }} />
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl z-10 flex flex-col items-center justify-center p-2 text-center group-hover:bg-black/40 transition-colors">
                            <span className="text-[9px] uppercase tracking-widest text-white/40 mb-2">Exclusivité passée</span>
                            <div className="px-3 py-1.5 rounded-full bg-gold/20 text-gold text-[10px] border border-gold/30 font-bold group-hover:scale-110 transition-transform">
                              🔓 100 SC
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="space-y-4">
              {profile.purchases.length === 0 ? (
                <div className="card-premium flex flex-col items-center justify-center py-20 text-center border-dashed border-2 border-white/5">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-6">
                    <ShoppingCart size={32} />
                  </div>
                  <h3 className="font-serif text-2xl text-cream mb-2">La Sphère est vide</h3>
                  <p className="text-white/40 mb-8 max-w-sm">Aucun fragment d'intimité n'a encore été débloqué.</p>
                  <Link href="/library" className="btn-outline !py-3 bg-dark-400 min-h-[44px] touch-manipulation active:scale-95 justify-center">
                    Explorer la Bibliothèque
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {profile.purchases.map((p) => (
                    <div key={p.id} className="card-premium hover:-translate-y-1 !p-5 group">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-cream font-bold text-sm mb-1 group-hover:text-gold transition-colors">{p.contentTitle}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase tracking-widest text-white/30 bg-white/5 px-2 py-1 rounded-md">{p.contentType}</span>
                            <span className="text-white/20 text-[9px] font-mono">
                              {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-[10px] font-bold border border-gold/20 shrink-0">
                          {p.price} SC
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-end mb-6">
                <Link href="/private-requests" className="btn-gold !py-3 text-[10px] min-h-[44px] touch-manipulation active:scale-95 justify-center">
                  <Send size={14} className="mr-2" /> Soumettre une demande
                </Link>
              </div>

              {profile.privateRequests.length === 0 ? (
                <div className="card-premium flex flex-col items-center justify-center py-20 text-center border-dashed border-2 border-white/5">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-6">
                    <Send size={32} />
                  </div>
                  <p className="text-white/40 mb-4 max-w-sm">Tu n'as passé aucune commande de contenu sur-mesure.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.privateRequests.map((r) => {
                    const status = STATUS_LABELS[r.status] || { label: r.status, class: 'bg-white/5 text-white border-white/10' };
                    return (
                      <div key={r.id} className="card-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4 !p-5">
                        <div>
                          <p className="text-cream font-bold mb-1 font-mono tracking-wider">{r.orderNumber}</p>
                          <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                            {r.type} <span className="mx-2 opacity-30">•</span> {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className={`text-[9px] px-3 py-1.5 rounded-lg border font-bold uppercase tracking-widest w-fit ${status.class}`}>
                          {status.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {profile.transactions.length === 0 ? (
                <div className="card-premium text-center py-16">
                  <p className="text-white/40 text-xs uppercase font-bold tracking-widest">Le registre est vierge</p>
                </div>
              ) : (
                <div className="card-premium !p-0 overflow-hidden">
                  {profile.transactions.map((t, index) => (
                    <div key={t.id} className={`flex items-center justify-between p-5 ${index !== profile.transactions.length - 1 ? 'border-b border-white/[0.04]' : ''} hover:bg-white/[0.02] transition-colors`}>
                      <div>
                        <p className="text-cream text-sm mb-1">{t.description || t.type.replace('_', ' ')}</p>
                        <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">
                          {new Date(t.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-bold block mb-0.5 ${t.amount >= 0 ? 'text-emerald-400' : 'text-white/60'}`}>
                          {t.amount >= 0 ? '+' : ''}{t.amount} SC
                        </span>
                        {t.euroAmount != null && t.euroAmount > 0 && (
                          <span className="text-white/20 text-[10px] uppercase font-bold tracking-widest">≈ {t.euroAmount.toFixed(2)}€</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'studio' && session?.user?.role === 'ADMIN' && (
            <div className="max-w-2xl mx-auto">
              <StudioUpload
                onSuccess={() => setActiveTab('purchases')}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
