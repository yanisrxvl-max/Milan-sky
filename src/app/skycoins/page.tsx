'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PaymentBridgeModal } from '@/components/PaymentBridgeModal';

const packs = [
  {
    id: 'starter',
    name: 'STARTER',
    coins: 100,
    price: '9,99€',
    bonus: 0,
    popular: false,
    glow: 'from-white/10 to-transparent',
  },
  {
    id: 'plus',
    name: 'PLUS',
    coins: 350,
    price: '29,99€',
    bonus: 50,
    popular: true,
    badge: 'LE PLUS PRISÉ',
    glow: 'from-gold/20 to-transparent',
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    coins: 900,
    price: '69,99€',
    bonus: 200,
    popular: false,
    glow: 'from-gold/40 to-transparent',
  },
  {
    id: 'vip',
    name: 'VIP',
    coins: 2500,
    price: '179,99€',
    bonus: 700,
    popular: false,
    badge: 'MEILLEURE VALEUR',
    glow: 'from-purple-500/30 to-transparent',
  },
];

export default function SkyCoinsPage() {
  return (
    <Suspense fallback={<div className="page-container flex items-center justify-center min-h-screen"><div className="animate-pulse text-white/30">Chargement...</div></div>}>
      <SkyCoinsContent />
    </Suspense>
  );
}

function SkyCoinsContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState<typeof packs[0] | null>(null);

  useEffect(() => {
    if (session) fetchBalance();
  }, [session]);

  const fetchBalance = async () => {
    try {
      const res = await fetch('/api/skycoins');
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
      }
    } catch { }
  }

  function handleBuy(pack: typeof packs[0]) {
    if (!session) {
      router.push('/register');
      return;
    }
    setSelectedPack(pack);
    setIsModalOpen(true);
  }

  return (
    <div className="page-container max-w-6xl mx-auto px-4 py-12 pt-24">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-title mb-4"
        >
          Boutique <span className="gold-text italic">SkyCoins</span>
        </motion.h1>

        {/* Balance Display */}
        {session && balance !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-4 px-8 py-4 glass-gold rounded-full border border-gold/20"
          >
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm">✦</div>
            <div className="text-left">
              <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold">Votre solde actuel</p>
              <p className="font-serif text-2xl gold-text leading-tight">{balance} SC</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
        {packs.map((pack, i) => (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleBuy(pack)}
            className={`group relative cursor-pointer overflow-hidden rounded-[3rem] border transition-all duration-700 p-10 flex flex-col items-center ${pack.popular
                ? 'bg-gold/5 border-gold/40 shadow-[0_20px_60px_rgba(201,168,76,0.15)] scale-105 z-10'
                : 'bg-dark-200/40 border-white/5 hover:border-white/20'
              }`}
          >
            {/* Badges */}
            {pack.badge && (
              <div className="absolute top-6 inset-x-0 flex justify-center z-20">
                <span className={`text-[8px] uppercase tracking-[0.3em] px-4 py-1.5 rounded-full font-black ${pack.id === 'vip' ? 'bg-purple-600 text-white' : 'bg-gold text-dark'
                  }`}>
                  {pack.badge}
                </span>
              </div>
            )}

            {/* High-End Visual */}
            <div className="relative mb-12 mt-4">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                {pack.id === 'starter' ? '⭐' : pack.id === 'plus' ? '🔥' : pack.id === 'premium' ? '💎' : '👑'}
              </div>
              {pack.bonus > 0 && (
                <div className="absolute -bottom-2 -right-4 bg-gold px-3 py-1 rounded-lg text-[10px] font-black text-dark shadow-lg">
                  +{pack.bonus} BONUS
                </div>
              )}
            </div>

            <h3 className="font-serif text-xl text-white/40 mb-2 uppercase tracking-[0.4em] group-hover:text-white transition-colors">
              {pack.name}
            </h3>

            <div className="flex flex-col items-center mb-10">
              <p className="font-serif text-5xl gold-text mb-2 tracking-tight">{pack.coins} SC</p>
              <div className="h-px w-8 bg-white/10 mb-4" />
              <p className="text-white/60 text-lg font-light">{pack.price}</p>
            </div>

            <div className="w-full pt-6 border-t border-white/5 flex flex-col gap-3">
              <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium text-center italic">
                {pack.bonus > 0 ? `Inclus ${pack.bonus} SC offerts` : 'Accès immédiat'}
              </p>
              <PremiumButton
                variant={pack.popular ? 'gold' : 'outline'}
                fullWidth
                className="!py-4 uppercase text-[10px] tracking-widest"
              >
                Sélectionner
              </PremiumButton>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Payment Bridge Modal */}
      {selectedPack && (
        <PaymentBridgeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tierName={`${selectedPack.name} (${selectedPack.coins} SC)`}
          price={selectedPack.price}
          type="skycoins"
        />
      )}

      {/* Why SkyCoins */}
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-2xl text-center mb-8">
          Pourquoi les <span className="gold-text">SkyCoins</span> ?
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: '🔓', title: 'Accès à la carte', desc: 'Débloquez uniquement le contenu qui vous intéresse.' },
            { icon: '🎯', title: 'Flexibilité totale', desc: 'Pas d\'abonnement obligatoire pour accéder au contenu.' },
            { icon: '💎', title: 'Économies', desc: 'Plus vous achetez, plus le prix par SkyCoins diminue.' },
            { icon: '⚡', title: 'Instantané', desc: 'Crédit immédiat après paiement, accès direct.' },
          ].map((item) => (
            <div key={item.title} className="card-premium !p-5 flex gap-4 items-start">
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <p className="text-cream font-medium mb-1 text-sm">{item.title}</p>
                <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-12">
        <p className="text-white/20 text-[10px] uppercase tracking-widest">
          Paiement manuel via Revolut, PayPal ou Crypto. Validation sous 5-10 min.
        </p>
      </div>
    </div>
  );
}
