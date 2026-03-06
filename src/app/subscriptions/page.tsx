'use client';

import { Suspense, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PaymentBridgeModal } from '@/components/PaymentBridgeModal';
import { CheckCircle2, Shield, Zap, Info, Clock } from 'lucide-react';

import { useThemeMode } from '@/context/ThemeModeContext';
import { useI18n } from '@/context/I18nContext';

const nightPlans = [
  {
    id: 'VOYEUR',
    name: 'VOYEUR',
    emoji: '👁️',
    price: '9.90',
    period: '€ / mois',
    subtitle: 'Découvrir la plateforme',
    features: [
      'Accès bibliothèque (avec publicités)',
      'Accès à LE QUOTIDIRTY (19h-6h)',
      'Accès aux Lives Mensuels',
      'Accès basique au Chat public',
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
    price: '19.90',
    period: '€ / mois',
    subtitle: 'L\'Expérience Complète',
    features: [
      'Bibliothèque sans aucune publicité',
      'Accès illimité à LE QUOTIDIRTY',
      'Accès illimité aux Muses IA (Possessif, Jaloux)',
      'Déblocages prioritaires (Vault)',
    ],
    recommended: true,
    limited: false,
    color: 'border-gold shadow-[0_0_40px_rgba(201,168,76,0.15)] bg-dark-200/90',
    accent: 'text-gold',
    badge: 'LE PLUS POPULAIRE',
    savings: 'Économisez 30% d\'énergie vs à la carte'
  },
  {
    id: 'PRIVILEGE',
    name: 'PRIVILÈGE',
    emoji: '💎',
    price: '49.90',
    period: '€ / mois',
    subtitle: 'Statut Haut-de-Gamme',
    features: [
      'Tout de l\'abonnement Initié',
      'Contenus Vidéos Premium Débloqués',
      '50 SkyCoins offerts chaque mois',
      'Priorité absolue sur le Chat Privé',
    ],
    recommended: false,
    limited: false,
    color: 'border-gold/50',
    accent: 'text-gold-light',
  },
  {
    id: 'SKYCLUB',
    name: 'SKYCLUB',
    emoji: '👑',
    price: '299',
    period: '€',
    subtitle: 'Accès à Vie (Paiement Unique)',
    features: [
      'Accès total, perpétuel et inconditionnel',
      'Demandes de médias personnalisés incluses',
      'Ligne directe avec notifications SMS',
      'Invitations réelles (Événements Privés)',
    ],
    recommended: false,
    limited: true,
    spotsLeft: 17,
    color: 'border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.15)] bg-purple-900/10',
    accent: 'text-purple-400',
    badge: 'CERCLE REÇU',
  },
];

const dayPlans = [
  {
    id: 'VOYEUR',
    name: 'CURIEUX',
    emoji: '🌱',
    price: '0.00',
    period: '€ / mois',
    subtitle: 'L\'Étincelle',
    features: [
      'Accès public Milan',
      'Vlogs Hebdomadaires',
      'Conseils Mode & Lifestyle',
      'Accès aux Lives Publics',
    ],
    recommended: false,
    limited: false,
    color: 'border-white/10',
    accent: 'text-white/40',
  },
  {
    id: 'INITIE',
    name: 'AMBITIEUX',
    emoji: '⚡',
    price: '9.90',
    period: '€ / mois',
    subtitle: 'Engagement Solidaire',
    features: [
      'Accès Premium Lumina (sans pub)',
      'Workshops Intelligence Artificielle',
      'Masterclass Style & Étiquette',
      'Drops Pédagogiques Exclusifs',
    ],
    recommended: true,
    limited: false,
    color: 'border-gold shadow-[0_0_40px_rgba(201,168,76,0.15)] bg-dark-200/90',
    accent: 'text-gold',
    badge: 'PLUS CHOISI',
    savings: '30% reversé à une cause',
    charity: { icon: '🛡️', name: 'Lutte contre le trafic sexuel & protection des mineurs', percent: 30, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  },
  {
    id: 'PRIVILEGE',
    name: 'CRÉATEUR',
    emoji: '🧠',
    price: '29.90',
    period: '€ / mois',
    subtitle: 'Conscience & Impact',
    features: [
      'Tout de l\'abonnement Ambitieux',
      'Coaching Privé (Sessions de Groupe)',
      'Accès Direct au Mentorat',
      'Priorité absolue sur le Chat Lumina',
    ],
    recommended: false,
    limited: false,
    color: 'border-gold/50',
    accent: 'text-gold-light',
    charity: { icon: '💜', name: 'Prévention des addictions au camsex & accompagnement psychologique', percent: 30, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  },
  {
    id: 'SKYCLUB',
    name: 'VISIONNAIRE',
    emoji: '🌍',
    price: '199',
    period: '€',
    subtitle: 'Impact Maximum',
    features: [
      'Accès complet à vie',
      'Ligne Privée Prioritaire',
      'Invitations Événements & Masterminds',
      'Statut Visionnaire à Vie',
    ],
    recommended: false,
    limited: true,
    spotsLeft: 5,
    color: 'border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.15)] bg-emerald-900/10',
    accent: 'text-emerald-400',
    badge: 'IMPACT MAXIMUM',
    charity: { icon: '📚', name: 'Éducation & fournitures scolaires pour enfants défavorisés en France', percent: 30, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  },
];

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={<div className="page-container flex items-center justify-center min-h-screen"><div className="animate-pulse text-gold/40 tracking-widest text-xs uppercase font-bold">Chargement de l'Interdit...</div></div>}>
      <SubscriptionsContent />
    </Suspense>
  );
}

function SubscriptionsContent() {
  const { data: session } = useSession();
  const { mode } = useThemeMode();
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof nightPlans[0] | null>(null);

  const cancelled = searchParams.get('cancelled');
  const isDay = mode === 'DAY';
  const plans = isDay ? dayPlans : nightPlans;

  function handleSubscribe(plan: typeof nightPlans[0]) {
    if (!session) {
      router.push('/register');
      return;
    }
    setSelectedPlan(plan);
    setIsModalOpen(true);
  }

  return (
    <div className="page-container overflow-hidden pb-32">
      {/* HEADER IMMERSIF */}
      <div className="relative pt-32 pb-20 border-b border-white/[0.04] bg-dark-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.06),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            key={`shield-${mode}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-6"
          >
            <Shield size={12} /> {t('subs.tag')}
          </motion.div>
          <motion.h1
            key={`title-${mode}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif text-cream mb-6 tracking-tight"
          >
            {isDay ? (
              <>{t('subs.title')} <span className="gold-text italic">{t('subs.title_accent')}</span></>
            ) : (
              <>Passez du côté <span className="gold-text italic">Privé</span></>
            )}
          </motion.h1>
          <motion.p
            key={`desc-${mode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/40 max-w-2xl mx-auto text-sm leading-relaxed"
          >
            {isDay
              ? t('subs.subtitle_day')
              : t('subs.subtitle_night')}
          </motion.p>
        </div>
      </div>

      {cancelled && (
        <div className="max-w-md mx-auto mt-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-bold uppercase tracking-widest backdrop-blur-md">
          Paiement annulé. Nous vous attendons.
        </div>
      )}

      {/* PLANS GRID */}
      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className={`relative rounded-[2.5rem] border ${plan.color} bg-dark-100/40 backdrop-blur-xl p-8 transition-all duration-500 flex flex-col hover:-translate-y-2 ${plan.recommended ? 'lg:scale-105 z-20' : 'z-10'}`}
            >
              {/* BADGES */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center">
                  <span className={`text-[10px] tracking-[0.2em] uppercase px-6 py-2 rounded-full font-black shadow-2xl ${plan.id === 'SKYCLUB' ? 'bg-purple-500 text-white shadow-purple-500/40' : 'bg-gold text-dark shadow-gold/40'}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* LIMITED STOCK FOMO */}
              {plan.limited && plan.spotsLeft && (
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-[9px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-widest animate-pulse">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {plan.spotsLeft} Places
                  </div>
                </div>
              )}

              <div className="text-center mb-10 mt-6 relative">
                <span className="text-4xl mb-4 block drop-shadow-2xl">
                  {plan.emoji}
                </span>
                <h3 className={`font-serif text-3xl tracking-widest uppercase mb-1 ${plan.accent}`}>
                  {plan.name}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-6">
                  {plan.subtitle}
                </p>

                <div className="flex flex-col items-center justify-center relative">
                  <div className="flex items-baseline gap-1">
                    <span className={`font-serif text-5xl font-bold ${plan.recommended ? 'gold-text' : 'text-cream'}`}>
                      {plan.price}
                    </span>
                  </div>
                  <span className="text-white/30 text-[10px] uppercase font-bold tracking-widest mt-2">{plan.period}</span>
                </div>

                {plan.savings && (
                  <div className="mt-4 text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-400/10 py-1.5 px-3 rounded-full inline-block border border-green-400/20">
                    {plan.savings}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <ul className="space-y-5 mb-10">
                  {plan.features.map((feature, j) => (
                    <li key={feature} className="flex items-start gap-3 group">
                      <div className={`shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center ${plan.recommended ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/60'} transition-colors`}>
                        <CheckCircle2 size={10} />
                      </div>
                      <span className="text-[11px] text-white/60 leading-relaxed font-medium uppercase tracking-wider group-hover:text-white/90 transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Charity Badge (Day Mode Only) */}
                {isDay && (plan as any).charity && (
                  <div className={`p-4 rounded-2xl border ${(plan as any).charity.bg} mb-6`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{(plan as any).charity.icon}</span>
                      <span className={`text-[10px] uppercase tracking-widest font-black ${(plan as any).charity.color}`}>
                        {(plan as any).charity.percent}% reversé
                      </span>
                    </div>
                    <p className="text-white/50 text-[11px] leading-relaxed">
                      {(plan as any).charity.name}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-6 border-t border-white/[0.04]">
                <PremiumButton
                  onClick={() => handleSubscribe(plan)}
                  variant={plan.recommended ? 'gold' : 'outline'}
                  fullWidth
                  className={`py-5 font-bold tracking-[0.2em] uppercase text-[10px] rounded-2xl ${plan.id === 'SKYCLUB' ? 'border-purple-500/40 text-purple-400 hover:bg-purple-500 hover:text-white' : ''}`}
                >
                  Sélectionner
                </PremiumButton>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* REASSURANCE BLOCK */}
      <div className="max-w-4xl mx-auto px-4 mt-20">
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent pointer-events-none" />
          <div className="flex-1 relative z-10 flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shrink-0 border border-gold/20">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="text-white font-serif tracking-widest uppercase mb-1">Activation Flash</h4>
              <p className="text-white/40 text-xs leading-relaxed">
                Le paiement se fait manuellement (Revolut, PayPal, Crypto) pour garantir un anonymat total.
                Validation express en moins de 10 minutes par notre équipe dédiée (H24).
              </p>
            </div>
          </div>
          <div className="shrink-0 relative z-10">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-dark-500 bg-white/10 flex items-center justify-center text-white/30 backdrop-blur-sm">
                  <Shield size={14} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Bridge Modal */}
      {selectedPlan && (
        <PaymentBridgeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tierName={selectedPlan.name}
          price={`${selectedPlan.price}${selectedPlan.period.replace('mois', 'mo')}`}
          type="subscription"
        />
      )}
    </div>
  );
}
