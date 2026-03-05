'use client';

import { Suspense, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PaymentBridgeModal } from '@/components/PaymentBridgeModal';

const plans = [
  {
    id: 'VOYEUR',
    name: 'VOYEUR',
    emoji: '👁️',
    price: '9,90',
    period: '€/mois',
    subtitle: 'Découvrir l’univers',
    features: [
      'Accès bibliothèque médias sensuels avec publicité',
      'Accès à LE QUOTIDIRTY (19h-6h)',
      'Accès à Milan IA version découverte',
      'Accès aux lives collectifs mensuels',
    ],
    recommended: false,
    limited: false,
    color: 'border-white/10',
    accent: 'text-white/40',
  },
  {
    id: 'INITIE',
    name: 'INITIÉ',
    emoji: '🔥',
    price: '19,90',
    period: '€/mois',
    subtitle: 'Entrer dans l’expérience',
    features: [
      'Accès complet à la bibliothèque sans publicité',
      'Accès complet à LE QUOTIDIRTY',
      'Accès complet à Milan IA',
      'Accès aux drops spéciaux hebdomadaires',
    ],
    recommended: true,
    limited: false,
    color: 'border-gold shadow-[0_0_30px_rgba(201,168,76,0.15)]',
    accent: 'text-gold',
    badge: 'Plus Choisi',
  },
  {
    id: 'PRIVILEGE',
    name: 'PRIVILÈGE',
    emoji: '💎',
    price: '49,90',
    period: '€/mois',
    subtitle: 'Expérience premium',
    features: [
      'Accès complet à toute la bibliothèque Milan Sky',
      'Accès aux Quotidirty exclusifs Privilege',
      'SkyCoins mensuels offerts',
      'Priorité dans le chat Milan',
    ],
    recommended: false,
    limited: false,
    color: 'border-gold/60',
    accent: 'text-gold',
  },
  {
    id: 'SKYCLUB',
    name: 'SKYCLUB',
    emoji: '👑',
    price: '299',
    period: '€/mois',
    subtitle: 'Cercle privé',
    features: [
      'Accès total à toute la plateforme Milan Sky',
      'Ligne privée Milan',
      'Invitations événements et rencontres',
      'Statut membre SkyClub',
    ],
    recommended: false,
    limited: true,
    color: 'border-purple-500/40',
    accent: 'text-purple-400',
    badge: 'Limité à 50 membres',
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);

  const cancelled = searchParams.get('cancelled');

  function handleSubscribe(plan: typeof plans[0]) {
    if (!session) {
      router.push('/register');
      return;
    }

    setSelectedPlan(plan);
    setIsModalOpen(true);
  }

  return (
    <div className="page-container max-w-7xl mx-auto px-4 py-12 pt-24 pb-32">
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
          Quatre niveaux d&apos;exclusivité. Un seul objectif : vous offrir l&apos;inaccessible.
        </motion.p>
      </div>

      {cancelled && (
        <div className="mb-8 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm text-center">
          Paiement annulé. Vous pouvez réessayer à tout moment.
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative rounded-3xl border ${plan.color} bg-dark-100/50 backdrop-blur-md p-8 transition-all duration-500 flex flex-col hover:border-gold/20 ${plan.recommended ? 'lg:scale-105 border-gold shadow-[0_0_30px_rgba(201,168,76,0.15)]' : ''}`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center">
                <span className={`text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full font-bold shadow-xl ${plan.id === 'SKYCLUB' ? 'bg-purple-500 text-white' : 'bg-gold text-dark'}`}>
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="text-center mb-8">
              <span className="text-4xl mb-4 block animate-pulse">
                {plan.emoji}
              </span>
              <h3 className={`font-serif text-2xl tracking-widest uppercase mb-1 ${plan.accent}`}>
                {plan.name}
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-white/20 mb-6">{plan.subtitle}</p>

              {plan.id === 'SKYCLUB' && (
                <div className="absolute top-0 left-0 w-full animate-pulse z-20">
                  <div className="bg-red-600/90 text-[10px] text-white font-bold py-2.5 text-center uppercase tracking-[0.4em] shadow-[0_5px_20px_rgba(220,38,38,0.3)]">
                    ⚠ PLACES LIMITÉES : 17 DISPONIBLES
                  </div>
                </div>
              )}

              <div className="flex items-baseline justify-center gap-1">
                <span className="font-serif text-4xl gold-text">
                  {plan.price}
                </span>
                <span className="text-white/20 text-xs">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-[11px] text-white/50 leading-relaxed group">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${plan.accent.replace('text-', 'bg-') || 'bg-gold'}`} />
                  <span className="group-hover:text-white/80 transition-colors">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <PremiumButton
                onClick={() => handleSubscribe(plan)}
                variant={plan.recommended ? 'gold' : 'outline'}
                fullWidth
                className="py-5 font-bold tracking-widest uppercase text-[10px]"
              >
                Choisir
              </PremiumButton>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment Bridge Modal */}
      {selectedPlan && (
        <PaymentBridgeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tierName={selectedPlan.name}
          price={`${selectedPlan.price}${selectedPlan.period}`}
          type="subscription"
        />
      )}

      {/* Bottom Note */}
      <div className="text-center mt-20">
        <p className="text-white/20 text-[10px] uppercase tracking-[0.2em]">
          Paiement manuel via Revolut, PayPal ou Crypto. Validation sous 5-10 min.
        </p>
      </div>
    </div>
  );
}
