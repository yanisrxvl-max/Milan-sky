'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const packs = [
  {
    id: 'pack_35',
    coins: 35,
    price: '9€',
    pricePerCoin: '0,26€/SC',
    bonus: null,
    popular: false,
  },
  {
    id: 'pack_100',
    coins: 100,
    price: '24€',
    pricePerCoin: '0,24€/SC',
    bonus: null,
    popular: false,
  },
  {
    id: 'pack_250',
    coins: 250,
    price: '49€',
    pricePerCoin: '0,20€/SC',
    bonus: null,
    popular: true,
  },
  {
    id: 'pack_600',
    coins: 600,
    price: '99€',
    pricePerCoin: '0,17€/SC',
    bonus: 'Meilleure offre',
    popular: false,
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
  const searchParams = useSearchParams();
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  const success = searchParams.get('success');
  const coins = searchParams.get('coins');

  useEffect(() => {
    if (session) fetchBalance();
  }, [session]);

  useEffect(() => {
    if (success === 'true' && coins) {
      toast.success(`${coins} SkyCoins ajoutés à votre compte !`);
    }
  }, [success, coins]);

  async function fetchBalance() {
    try {
      const res = await fetch('/api/skycoins');
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
      }
    } catch {
      // Silent fail
    }
  }

  async function handleBuy(packId: string) {
    if (!session) {
      router.push('/register');
      return;
    }

    setLoadingPack(packId);

    try {
      const res = await fetch('/api/skycoins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
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
      setLoadingPack(null);
    }
  }

  return (
    <div className="page-container max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-title mb-4"
        >
          <span className="gold-text italic">SkyCoins</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-white/40 max-w-lg mx-auto"
        >
          Votre monnaie exclusive pour débloquer du contenu premium à la carte.
        </motion.p>

        {/* Balance Display */}
        {session && balance !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-3 mt-8 px-8 py-4 glass-gold rounded-2xl"
          >
            <span className="text-2xl">✦</span>
            <div className="text-left">
              <p className="text-white/40 text-xs uppercase tracking-wider">Votre solde</p>
              <p className="font-serif text-3xl gold-text">{balance} SC</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Packs Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
        {packs.map((pack, i) => (
          <motion.div
            key={pack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`relative card-premium text-center group cursor-pointer transition-all duration-500 hover:scale-[1.03] ${
              pack.popular ? 'border-gold/30 animate-halo' : ''
            }`}
            onClick={() => handleBuy(pack.id)}
          >
            {pack.bonus && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-gold-dark to-gold text-black">
                  {pack.bonus}
                </span>
              </div>
            )}
            {pack.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="text-[10px] font-semibold px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/30">
                  Populaire
                </span>
              </div>
            )}

            <div className="pt-2">
              <p className="font-serif text-4xl gold-text mb-1">{pack.coins}</p>
              <p className="text-white/30 text-xs mb-4">SkyCoins</p>

              <div className="py-3 border-t border-white/5">
                <p className="text-2xl font-semibold text-cream mb-1">{pack.price}</p>
                <p className="text-white/20 text-xs">{pack.pricePerCoin}</p>
              </div>

              <button
                disabled={loadingPack !== null}
                className={`mt-4 w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pack.popular || pack.bonus
                    ? 'btn-gold'
                    : 'btn-outline'
                }`}
              >
                {loadingPack === pack.id ? 'Redirection...' : 'Acheter'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

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
        <p className="text-white/20 text-xs">
          Paiement sécurisé par Stripe. Les SkyCoins sont crédités instantanément après validation du paiement.
        </p>
      </div>
    </div>
  );
}
