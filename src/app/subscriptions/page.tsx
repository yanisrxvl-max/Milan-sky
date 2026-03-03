'use client';

import { Suspense, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const plans = [
  {
    id: 'BASIC',
    name: 'BASIC',
    emoji: '⚡',
    price: '12,90€',
    period: '/mois',
    features: [
      'Accès contenu quotidien',
      'Bibliothèque standard',
      'Chat limité (10 msg/jour)',
      'Badge Basic',
    ],
    recommended: false,
    limited: false,
    color: 'border-white/10',
    bgHover: 'hover:border-white/20',
  },
  {
    id: 'ELITE',
    name: 'ELITE',
    emoji: '👑',
    price: '39,90€',
    period: '/mois',
    features: [
      'Tout le contenu Basic +',
      'Contenu exclusif illimité',
      'Chat illimité',
      'Accès drops en avant-première',
      'Réductions SkyCoins (15%)',
      'Badge Élite doré',
    ],
    recommended: true,
    limited: false,
    color: 'border-gold/40',
    bgHover: 'hover:border-gold/60',
  },
  {
    id: 'ICON',
    name: 'ICON',
    emoji: '✦',
    price: '89,90€',
    period: '/mois',
    features: [
      'Tout le contenu Elite +',
      'Accès VIP total',
      'Commandes privées prioritaires',
      'Chat prioritaire + vocal',
      'Contenu jamais publié',
      'Réductions SkyCoins (30%)',
      'Badge Icon platine',
      'Support dédié 24/7',
    ],
    recommended: false,
    limited: true,
    color: 'border-purple-500/30',
    bgHover: 'hover:border-purple-500/50',
  },
];

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={<div className="page-container flex items-center justify-center min-h-screen"><div className="animate-pulse text-white/30">Chargement...</div></div>}>
      <SubscriptionsContent />
    </Suspense>
  );
}

function SubscriptionsContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const cancelled = searchParams.get('cancelled');

  async function handleSubscribe(tier: string) {
    if (!session) {
      router.push('/register');
      return;
    }

    setLoadingTier(tier);

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Erreur');
      }
    } catch {
      toast.error('Erreur serveur');
    } finally {
      setLoadingTier(null);
    }
  }

  return (
    <div className="page-container max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-title mb-4"
        >
          Choisissez votre <span className="gold-text italic">accès</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/40 max-w-xl mx-auto text-lg"
        >
          Trois niveaux d&apos;exclusivité. Un seul objectif : vous offrir l&apos;inaccessible.
        </motion.p>
      </div>

      {cancelled && (
        <div className="mb-8 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm text-center">
          Paiement annulé. Vous pouvez réessayer à tout moment.
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-2xl border ${plan.color} ${plan.bgHover} bg-dark-100/50 backdrop-blur-sm p-8 transition-all duration-500 flex flex-col ${
              plan.recommended ? 'animate-halo md:scale-105 md:-translate-y-2' : ''
            } ${plan.recommended ? 'gold-border-animated' : ''}`}
          >
            {/* Recommended Badge */}
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black animate-pulse-soft">
                  ✦ Recommandé
                </span>
              </div>
            )}

            {/* Limited Badge */}
            {plan.limited && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Places limitées
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-8 pt-2">
              <span className="text-3xl mb-3 block">{plan.emoji}</span>
              <h3 className="font-sans text-lg font-bold tracking-[0.2em] mb-4">
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-serif text-4xl lg:text-5xl gold-text">
                  {plan.price}
                </span>
                <span className="text-white/30 text-sm">{plan.period}</span>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-white/60">
                  <span className="text-gold mt-0.5 shrink-0">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={loadingTier !== null}
              className={`w-full text-center py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                plan.recommended
                  ? 'btn-gold'
                  : 'btn-outline'
              }`}
            >
              {loadingTier === plan.id ? 'Redirection...' : 'Choisir ce plan'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Bottom Note */}
      <div className="text-center mt-12">
        <p className="text-white/20 text-sm">
          Paiement sécurisé par Stripe. Annulez à tout moment. Sans engagement.
        </p>
      </div>
    </div>
  );
}
