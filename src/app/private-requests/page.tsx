'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface PrivateRequest {
  id: string;
  orderNumber: string;
  type: string;
  description: string;
  budget: number | null;
  status: string;
  createdAt: string;
}

const REQUEST_TYPES = [
  { id: 'VIDEO', label: 'Vidéo', emoji: '🎬' },
  { id: 'PHOTO', label: 'Photo', emoji: '📸' },
  { id: 'CALL', label: 'Appel', emoji: '📞' },
  { id: 'CUSTOM', label: 'Sur mesure', emoji: '✨' },
];

const STATUS_MAP: Record<string, { label: string; class: string; icon: string }> = {
  PENDING: { label: 'En attente', class: 'badge-pending', icon: '⏳' },
  VALIDATED: { label: 'Validé', class: 'badge-validated', icon: '✅' },
  PAID: { label: 'Payé', class: 'badge-paid', icon: '💳' },
  IN_PROGRESS: { label: 'En cours', class: 'badge-validated', icon: '🔧' },
  DELIVERED: { label: 'Livré', class: 'badge-delivered', icon: '🎁' },
  CANCELLED: { label: 'Annulé', class: 'badge-cancelled', icon: '❌' },
};

export default function PrivateRequestsPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<PrivateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('VIDEO');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successOrder, setSuccessOrder] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (session) fetchRequests();
  }, [session]);

  async function fetchRequests() {
    try {
      const res = await fetch('/api/private-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    try {
      const res = await fetch('/api/private-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          description: description.trim(),
          budget: budget ? parseFloat(budget) : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessOrder(data.request.orderNumber);
        setDescription('');
        setBudget('');
        fetchRequests();
        toast.success('Demande envoyée !');
      } else {
        toast.error(data.error || 'Erreur');
      }
    } catch {
      toast.error('Erreur serveur');
    } finally {
      setSubmitting(false);
    }
  }

  if (!session) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <span className="text-5xl mb-4 block">🔐</span>
          <h1 className="font-serif text-3xl gold-text mb-3">Commandes privées</h1>
          <p className="text-white/40 mb-6">Connectez-vous pour accéder aux commandes privées.</p>
          <Link href="/login?callbackUrl=/private-requests" className="btn-gold">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-title mb-4"
        >
          Commandes <span className="gold-text italic">privées</span>
        </motion.h1>
        <p className="text-white/40">
          Demandez du contenu personnalisé et suivez vos commandes en temps réel.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 justify-center mb-8">
        <button
          onClick={() => setShowForm(true)}
          className={`px-5 py-2 rounded-lg text-sm transition-all ${
            showForm ? 'bg-gold/10 text-gold border border-gold/20' : 'text-white/40 hover:bg-white/5'
          }`}
        >
          Nouvelle demande
        </button>
        <button
          onClick={() => setShowForm(false)}
          className={`px-5 py-2 rounded-lg text-sm transition-all ${
            !showForm ? 'bg-gold/10 text-gold border border-gold/20' : 'text-white/40 hover:bg-white/5'
          }`}
        >
          Mes commandes ({requests.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Success Message */}
            {successOrder && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-premium text-center mb-8 !border-green-500/20"
              >
                <span className="text-4xl mb-3 block">✅</span>
                <h3 className="font-serif text-xl mb-2 text-cream">Demande envoyée !</h3>
                <p className="text-white/50 text-sm mb-2">
                  Numéro de commande : <span className="text-gold font-mono">{successOrder}</span>
                </p>
                <p className="text-white/30 text-xs">
                  Vous serez notifié par email lorsque votre commande sera traitée.
                </p>
                <button
                  onClick={() => setSuccessOrder(null)}
                  className="mt-4 text-sm text-gold/60 hover:text-gold transition-colors"
                >
                  Nouvelle demande
                </button>
              </motion.div>
            )}

            {/* Request Form */}
            {!successOrder && (
              <form onSubmit={handleSubmit} className="card-premium max-w-xl mx-auto">
                <h3 className="font-serif text-lg mb-6">Décrivez votre demande</h3>

                {/* Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm text-white/50 mb-3">Type de contenu</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {REQUEST_TYPES.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`p-3 rounded-xl text-center transition-all ${
                          selectedType === type.id
                            ? 'bg-gold/10 border border-gold/30 text-gold'
                            : 'border border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xl block mb-1">{type.emoji}</span>
                        <span className="text-xs">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm text-white/50 mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field min-h-[120px] resize-none"
                    placeholder="Décrivez en détail ce que vous souhaitez..."
                    required
                    minLength={10}
                    maxLength={1000}
                  />
                  <p className="text-white/20 text-xs mt-1 text-right">{description.length}/1000</p>
                </div>

                {/* Budget */}
                <div className="mb-8">
                  <label className="block text-sm text-white/50 mb-2">Budget (optionnel)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="input-field !pr-12"
                      placeholder="Ex: 50"
                      min="0"
                      max="10000"
                      step="0.01"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">€</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || description.trim().length < 10}
                  className="btn-gold w-full text-center"
                >
                  {submitting ? 'Envoi...' : 'Envoyer la demande'}
                </button>
              </form>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Orders List */}
            {loading ? (
              <div className="text-center py-12 text-white/30 animate-pulse">Chargement...</div>
            ) : requests.length === 0 ? (
              <div className="card-premium text-center py-12">
                <p className="text-white/40 mb-4">Aucune commande privée</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn-gold text-sm !py-2"
                >
                  Faire une demande
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => {
                  const status = STATUS_MAP[req.status] || { label: req.status, class: '', icon: '❓' };
                  return (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card-premium"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-cream font-mono text-sm">{req.orderNumber}</p>
                          <p className="text-white/20 text-xs mt-0.5">
                            {new Date(req.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <span className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 ${status.class}`}>
                          {status.icon} {status.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/40">
                          {REQUEST_TYPES.find((t) => t.id === req.type)?.emoji}{' '}
                          {REQUEST_TYPES.find((t) => t.id === req.type)?.label || req.type}
                        </span>
                        {req.budget && (
                          <span className="text-xs text-gold/60">Budget: {req.budget}€</span>
                        )}
                      </div>

                      <p className="text-white/50 text-sm line-clamp-2">{req.description}</p>

                      {/* Progress Bar */}
                      <div className="mt-4 flex gap-1">
                        {['PENDING', 'VALIDATED', 'PAID', 'IN_PROGRESS', 'DELIVERED'].map((step, idx) => {
                          const steps = ['PENDING', 'VALIDATED', 'PAID', 'IN_PROGRESS', 'DELIVERED'];
                          const currentIdx = steps.indexOf(req.status);
                          const isCompleted = idx <= currentIdx;
                          const isCancelled = req.status === 'CANCELLED';
                          return (
                            <div
                              key={step}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                isCancelled
                                  ? 'bg-red-500/30'
                                  : isCompleted
                                  ? 'bg-gold'
                                  : 'bg-white/10'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
