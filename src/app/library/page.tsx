'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { LockedContentCard } from '@/components/ui/LockedContentCard';
import { PremiumModal } from '@/components/ui/PremiumModal';
import { PremiumButton } from '@/components/ui/PremiumButton';
import PasscodeLock from '@/components/PasscodeLock';

function ContentItem({ item, idx, handleCardClick }: { item: any; idx: number; handleCardClick: (item: any) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      whileHover={{ y: -10 }}
      className="transition-all duration-500"
    >
      {item.isUnlocked ? (
        <div
          className="group relative rounded-2xl overflow-hidden bg-dark-200 border border-gold/10 aspect-[4/5] cursor-pointer hover:border-gold/40 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(201,168,76,0.1)]"
          onClick={() => handleCardClick(item)}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-400 via-dark-400/50 to-transparent opacity-80" />

          <div className="absolute inset-0 flex flex-col p-5">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-semibold px-3 py-1 bg-gold/20 backdrop-blur-md rounded-full text-gold border border-gold/30">
                {item.type}
              </span>
              <span className="text-[10px] text-white/50 bg-black/40 px-2 py-1 rounded backdrop-blur">Débloqué</span>
            </div>
            <div className="mt-auto">
              <h3 className="font-serif text-xl text-cream mb-1">{item.title}</h3>
              <p className="text-xs text-white/40 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" /> Accessible
              </p>
            </div>
          </div>
        </div>
      ) : (
        <LockedContentCard
          title={item.title}
          type={item.type}
          price={item.price > 0 ? item.price : undefined}
          tier={item.price === 0 ? item.tier : undefined}
          thumbnailUrl={item.imageUrl}
          onUnlockClick={() => handleCardClick(item)}
        />
      )}
    </motion.div>
  );
}

export default function LibraryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [contents, setContents] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [buying, setBuying] = useState(false);
  const [quotidirty, setQuotidirty] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && isVaultUnlocked) {
      fetchContents();
      fetchBalance();
      fetchQuotidirty();
    }
  }, [status, router, isVaultUnlocked]);

  useEffect(() => {
    if (!quotidirty) return;
    const timer = setInterval(() => {
      const now = new Date();
      const expiry = new Date(quotidirty.expireTime);
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setQuotidirty(null);
        clearInterval(timer);
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [quotidirty]);

  async function fetchBalance() {
    try {
      const res = await fetch('/api/skycoins');
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
      }
    } catch { }
  }

  async function fetchContents() {
    setLoading(true);
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setContents(data.contents || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchQuotidirty() {
    try {
      const res = await fetch('/api/quotidirty');
      if (res.ok) {
        const data = await res.json();
        setQuotidirty(data.drop);
      }
    } catch { }
  }

  async function handleUnlockConfirm(id: string) {
    setBuying(true);
    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId: id })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Contenu Débloqué avec succès !");
        setSelectedContent(null);
        fetchContents();
        fetchBalance();
      } else {
        toast.error(data.error || "Erreur lors de l'achat");
        if (res.status === 402) {
          setTimeout(() => router.push('/skycoins'), 1000);
        }
      }
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setBuying(false);
    }
  }

  async function handleQuotidirtyUnlock() {
    if (!quotidirty) return;
    setBuying(true);
    try {
      const res = await fetch('/api/quotidirty/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dropId: quotidirty.id })
      });
      if (res.ok) {
        toast.success("Quotidirty débloqué !");
        fetchQuotidirty();
        fetchBalance();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erreur lors de l'achat");
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setBuying(false);
    }
  }

  function handleCardClick(item: any) {
    if (item.isUnlocked) {
      router.push(`/content/${item.id}`);
    } else {
      setSelectedContent(item);
    }
  }

  if (!isVaultUnlocked) {
    return <PasscodeLock onSuccess={() => setIsVaultUnlocked(true)} />;
  }

  if (loading && status === 'authenticated') {
    return <div className="page-container flex items-center justify-center min-h-screen"><div className="animate-pulse text-gold/50">Vérification des accès...</div></div>;
  }

  const hasEnough = selectedContent ? balance >= selectedContent.price : true;
  const remaining = selectedContent ? balance - selectedContent.price : 0;

  return (
    <Suspense fallback={<div className="page-container flex items-center justify-center min-h-screen text-white/20 uppercase tracking-widest text-[10px]">Chargement...</div>}>
      <div className="page-container max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Quotidirty Daily Drop - The Hook */}
        {quotidirty && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-20 group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-gold/40 via-purple-500/20 to-gold/40 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative bg-dark-200 border border-gold/20 rounded-[2.5rem] overflow-hidden">
              <div className="grid md:grid-cols-5 gap-0">
                <div className="md:col-span-2 relative aspect-video md:aspect-auto">
                  <img src={quotidirty.imageUrl} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Quotidirty" />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark-200 via-transparent to-transparent hidden md:block" />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-none group-hover:backdrop-blur-0 transition-all duration-700" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full animate-pulse shadow-xl tracking-tighter">LIVE DROP</span>
                  </div>
                </div>
                <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="font-serif text-3xl md:text-5xl text-cream tracking-tight italic">Le <span className="gold-text not-italic font-bold">Quotidirty</span></h2>
                  </div>
                  <p className="text-white/40 text-sm mb-10 max-w-md leading-relaxed uppercase tracking-widest text-[11px] font-medium">
                    {quotidirty.description || "L'exclusivité du jour. Disponible seulement quelques heures."}
                  </p>
                  <div className="flex flex-wrap items-center gap-8 md:gap-12">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.3em] text-gold font-bold mb-2">Disparaît dans</p>
                      <p className="font-mono text-3xl text-cream font-light tracking-[0.1em]">{timeLeft}</p>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      {quotidirty.isPurchased ? (
                        <PremiumButton variant="outline" fullWidth onClick={() => router.push(`/content/quotidirty/${quotidirty.id}`)}>
                          Voir le Drop
                        </PremiumButton>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <PremiumButton variant="gold" fullWidth onClick={handleQuotidirtyUnlock} isLoading={buying}>
                              Débloquer ({quotidirty.price} SC)
                            </PremiumButton>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] uppercase tracking-widest text-white/20">Prix Unique</p>
                            <p className="text-gold font-black text-sm italic">Limited</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="inline-block relative">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-4xl md:text-6xl text-cream mb-4"
            >
              La <span className="gold-text italic">Collection</span>
            </motion.h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto" />
          </div>
          <p className="text-white/30 max-w-xl mx-auto mt-6 text-sm font-light leading-relaxed">
            Archives exclusives & Contenus premium. Explorez l&apos;univers Milan Sky sans limites.
          </p>

          <div className="mt-10 inline-flex items-center gap-3 px-8 py-3 bg-dark-200 border border-white/5 rounded-full shadow-2xl">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black">Reserve</span>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-sm font-serif italic text-gold">{balance} SkyCoins</span>
          </div>
        </div>

        {contents.length === 0 ? (
          <div className="text-center py-20 bg-dark-200 border border-white/5 rounded-[2.5rem]">
            <p className="text-white/20 uppercase tracking-widest text-xs">La voûte est scellée pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-24">
            <section>
              <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-sm uppercase tracking-[0.4em] font-black text-white/40 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> Nouveautés
                </h3>
                <div className="h-px flex-1 bg-white/[0.05] mx-8 hidden md:block" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {contents.slice(0, 4).map((item, idx) => (
                  <ContentItem key={item.id} item={item} idx={idx} handleCardClick={handleCardClick} />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-sm uppercase tracking-[0.4em] font-black text-white/40 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Populaire <span className="text-gold italic ml-1">Today</span>
                </h3>
                <div className="h-px flex-1 bg-white/[0.05] mx-8 hidden md:block" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {contents.reverse().slice(0, 4).map((item, idx) => (
                  <ContentItem key={item.id} item={item} idx={idx} handleCardClick={handleCardClick} />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-sm uppercase tracking-[0.4em] font-black text-white/40 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" /> Toute la <span className="text-gold italic ml-1">Collection</span>
                </h3>
                <div className="h-px flex-1 bg-white/[0.05] mx-8 hidden md:block" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {contents.map((item, idx) => (
                  <ContentItem key={item.id} item={item} idx={idx} handleCardClick={handleCardClick} />
                ))}
              </div>
            </section>
          </div>
        )}

        <PremiumModal isOpen={!!selectedContent} onClose={() => setSelectedContent(null)} title="Contenu Verrouillé" maxWidth="sm">
          {selectedContent && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-3xl mx-auto mb-6">🔒</div>
              <p className="text-white/60 mb-8 text-sm leading-relaxed">
                {selectedContent.price > 0
                  ? `Ce contenu est protégé. Il requiert un paiement unique de ${selectedContent.price} SkyCoins pour y accéder à vie.`
                  : `Ce contenu exclusif est réservé aux membres du club ${selectedContent.tier}. Mettez à niveau votre abonnement.`}
              </p>
              {selectedContent.price > 0 && (
                <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex justify-between text-[11px] uppercase tracking-widest text-white/40 mb-2">
                    <span>Votre Solde</span>
                    <span>{balance} SC</span>
                  </div>
                  <div className="flex justify-between text-[11px] uppercase tracking-widest text-gold font-bold">
                    <span>Après achat</span>
                    <span>{remaining >= 0 ? remaining : 0} SC</span>
                  </div>
                  {!hasEnough && (
                    <p className="mt-4 text-[10px] text-red-400 font-bold uppercase tracking-widest animate-pulse">
                      Solde insuffisant. Il vous manque {selectedContent.price - balance} SC.
                    </p>
                  )}
                </div>
              )}
              {selectedContent.price > 0 ? (
                hasEnough ? (
                  <PremiumButton variant="gold" fullWidth onClick={() => handleUnlockConfirm(selectedContent.id)} isLoading={buying} className="!py-5 uppercase tracking-widest text-xs">
                    Débloquer ({selectedContent.price} SC)
                  </PremiumButton>
                ) : (
                  <PremiumButton variant="gold" fullWidth onClick={() => router.push('/skycoins')} className="!py-5 uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                    Recharger mon solde
                  </PremiumButton>
                )
              ) : (
                <PremiumButton variant="outline" fullWidth onClick={() => router.push('/subscriptions')} className="!py-5 uppercase tracking-widest text-xs">
                  Devenir {selectedContent.tier}
                </PremiumButton>
              )}
              <p className="mt-6 text-[9px] text-white/20 uppercase tracking-[0.2em]">Paiement unique · Accès illimité</p>
            </div>
          )}
        </PremiumModal>
      </div>
    </Suspense>
  );
}
