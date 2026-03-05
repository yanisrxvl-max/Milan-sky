'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
}

const TIER_DISPLAY: Record<string, { emoji: string; color: string; label: string }> = {
  BASIC: { emoji: '⚡', color: 'text-blue-400', label: 'Basic' },
  ELITE: { emoji: '👑', color: 'text-gold', label: 'Élite' },
  ICON: { emoji: '✦', color: 'text-purple-400', label: 'Icon' },
};

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  PENDING: { label: 'En attente', class: 'badge-pending' },
  VALIDATED: { label: 'Validé', class: 'badge-validated' },
  PAID: { label: 'Payé', class: 'badge-paid' },
  IN_PROGRESS: { label: 'En cours', class: 'badge-validated' },
  DELIVERED: { label: 'Livré', class: 'badge-delivered' },
  CANCELLED: { label: 'Annulé', class: 'badge-cancelled' },
};

type Tab = 'profile' | 'purchases' | 'orders' | 'history';

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="page-container flex items-center justify-center min-h-screen"><div className="animate-pulse text-white/30">Chargement...</div></div>}>
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
      toast.success('Abonnement activé avec succès !');
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
        toast.success('Nom mis à jour');
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
        toast.success('Avatar mis à jour');
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

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-white/30">Chargement...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <p className="text-white/50">Impossible de charger le profil.</p>
      </div>
    );
  }

  const tier = profile.subscription ? TIER_DISPLAY[profile.subscription.tier] : null;

  return (
    <div className="page-container max-w-4xl mx-auto px-4 py-8 pt-24">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium mb-8"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div
              className="w-24 h-24 rounded-full bg-dark-300 border-2 border-gold/30 overflow-hidden cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl text-white/20">
                  {profile.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div
              className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <span className="text-xs text-white">Modifier</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-serif text-2xl md:text-3xl mb-1">
              {profile.name || 'Membre'}
            </h1>
            <p className="text-white/40 text-sm mb-3">{profile.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              {tier ? (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border border-current/20 ${tier.color}`}>
                  {tier.emoji} {tier.label}
                </span>
              ) : (
                <Link
                  href="/subscriptions"
                  className="text-sm text-gold/60 hover:text-gold transition-colors"
                >
                  Pas d&apos;abonnement — S&apos;abonner
                </Link>
              )}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-gold/10 text-gold border border-gold/20">
                ✦ {profile.skyCoinsBalance} SC
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Link href="/skycoins" className="btn-outline !py-2 !px-4 text-sm text-center">
              Acheter des SC
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm text-white/30 hover:text-red-400 transition-colors py-2"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'profile' as Tab, label: 'Profil' },
          { id: 'purchases' as Tab, label: 'Bibliothèque' },
          { id: 'orders' as Tab, label: 'Commandes' },
          { id: 'history' as Tab, label: 'Historique' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                ? 'bg-gold/10 text-gold border border-gold/20'
                : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Edit Name */}
            <div className="card-premium">
              <h3 className="font-serif text-lg mb-4">Modifier le profil</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Votre nom"
                  maxLength={50}
                />
                <button
                  onClick={updateName}
                  disabled={saving || !editName.trim() || editName === profile.name}
                  className="btn-gold !py-2 !px-6 text-sm"
                >
                  {saving ? '...' : 'Sauver'}
                </button>
              </div>
            </div>

            {/* Subscription Info */}
            <div className="card-premium">
              <h3 className="font-serif text-lg mb-4">Abonnement</h3>
              {profile.subscription ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Plan</span>
                    <span className={tier?.color}>
                      {tier?.emoji} {tier?.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Statut</span>
                    <span className="text-green-400">
                      {profile.subscription.status === 'ACTIVE' ? 'Actif' : profile.subscription.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Renouvellement</span>
                    <span className="text-white/70">
                      {new Date(profile.subscription.currentPeriodEnd).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-white/40 mb-4">Aucun abonnement actif</p>
                  <Link href="/subscriptions" className="btn-gold !py-2 text-sm">
                    Découvrir les offres
                  </Link>
                </div>
              )}
            </div>

            {/* SkyCoins */}
            <div className="card-premium">
              <h3 className="font-serif text-lg mb-4">Solde SkyCoins</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-serif gold-text">{profile.skyCoinsBalance} SC</p>
                  <p className="text-white/30 text-sm mt-1">Disponibles</p>
                </div>
                <Link href="/skycoins" className="btn-outline !py-2 !px-5 text-sm">
                  Recharger
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div>
            <h3 className="font-serif text-lg mb-4">Contenus débloqués</h3>
            {profile.purchases.length === 0 ? (
              <div className="card-premium text-center py-12">
                <p className="text-white/40 mb-4">Aucun contenu débloqué</p>
                <Link href="/library" className="btn-gold text-sm !py-2">
                  Explorer la bibliothèque
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {profile.purchases.map((p) => (
                  <div key={p.id} className="card-premium flex items-center justify-between">
                    <div>
                      <p className="text-cream font-medium">{p.contentTitle}</p>
                      <p className="text-white/30 text-xs">
                        {p.contentType} — {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className="text-gold text-sm">{p.price} SC</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h3 className="font-serif text-lg mb-4">Commandes privées</h3>
            {profile.privateRequests.length === 0 ? (
              <div className="card-premium text-center py-12">
                <p className="text-white/40 mb-4">Aucune commande privée</p>
                <Link href="/private-requests" className="btn-gold text-sm !py-2">
                  Faire une demande
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {profile.privateRequests.map((r) => {
                  const status = STATUS_LABELS[r.status] || { label: r.status, class: '' };
                  return (
                    <div key={r.id} className="card-premium flex items-center justify-between">
                      <div>
                        <p className="text-cream font-medium">{r.orderNumber}</p>
                        <p className="text-white/30 text-xs">
                          {r.type} — {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${status.class}`}>
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
          <div>
            <h3 className="font-serif text-lg mb-4">Historique des transactions</h3>
            {profile.transactions.length === 0 ? (
              <div className="card-premium text-center py-12">
                <p className="text-white/40">Aucune transaction</p>
              </div>
            ) : (
              <div className="space-y-2">
                {profile.transactions.map((t) => (
                  <div key={t.id} className="card-premium flex items-center justify-between !py-3">
                    <div>
                      <p className="text-cream text-sm">{t.description || t.type}</p>
                      <p className="text-white/20 text-xs">
                        {new Date(t.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${t.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {t.amount >= 0 ? '+' : ''}{t.amount} SC
                      </span>
                      {t.euroAmount != null && t.euroAmount > 0 && (
                        <p className="text-white/20 text-xs">{t.euroAmount.toFixed(2)}€</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
