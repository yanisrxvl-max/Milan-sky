'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  tier: string;
  price: number;
  imageUrl: string | null;
  unlocked: boolean;
}

const TYPE_EMOJI: Record<string, string> = {
  VIDEO: '🎬',
  PHOTO: '📸',
  SERIES: '🎭',
  COLLABORATION: '🤝',
};

const TIER_BADGE: Record<string, { label: string; class: string }> = {
  BASIC: { label: 'Basic', class: 'bg-blue-500/20 text-blue-400' },
  ELITE: { label: 'Élite', class: 'bg-gold/20 text-gold' },
  ICON: { label: 'Icon', class: 'bg-purple-500/20 text-purple-400' },
};

const FILTERS = ['all', 'VIDEO', 'PHOTO', 'SERIES', 'COLLABORATION'] as const;
const FILTER_LABELS: Record<string, string> = {
  all: 'Tout',
  VIDEO: 'Vidéos',
  PHOTO: 'Photos',
  SERIES: 'Séries',
  COLLABORATION: 'Collabs',
};

export default function LibraryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState<string | null>(null);
  const [confirmItem, setConfirmItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    try {
      const res = await fetch('/api/library');
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
      }
    } catch {
      toast.error('Erreur chargement bibliothèque');
    } finally {
      setLoading(false);
    }
  }

  async function handleUnlock(item: ContentItem) {
    if (!session) {
      router.push('/login?callbackUrl=/library');
      return;
    }
    setConfirmItem(item);
  }

  async function confirmUnlock() {
    if (!confirmItem) return;
    setUnlocking(confirmItem.id);

    try {
      const res = await fetch('/api/library/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId: confirmItem.id }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Contenu débloqué !');
        setContent((prev) =>
          prev.map((c) => (c.id === confirmItem.id ? { ...c, unlocked: true } : c))
        );
      } else {
        toast.error(data.error || 'Erreur');
      }
    } catch {
      toast.error('Erreur serveur');
    } finally {
      setUnlocking(null);
      setConfirmItem(null);
    }
  }

  const filtered = filter === 'all' ? content : content.filter((c) => c.type === filter);

  return (
    <div className="page-container max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-title mb-4"
        >
          <span className="gold-text italic">Bibliothèque</span>
        </motion.h1>
        <p className="text-white/40">Explorez et débloquez du contenu exclusif avec vos SkyCoins.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 justify-center mb-10 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === f
                ? 'bg-gold/10 text-gold border border-gold/20'
                : 'text-white/40 hover:text-white/60 hover:bg-white/5 border border-transparent'
            }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center py-20 text-white/30 animate-pulse">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-white/40">
          Aucun contenu disponible dans cette catégorie.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const badge = TIER_BADGE[item.tier];
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative card-premium !p-0 overflow-hidden cursor-pointer"
                  onClick={() => !item.unlocked && handleUnlock(item)}
                >
                  {/* Thumbnail */}
                  <div className="aspect-[3/4] bg-dark-300 relative overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
                        {TYPE_EMOJI[item.type] || '🔒'}
                      </div>
                    )}

                    {/* Lock Overlay */}
                    {!item.unlocked && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-3xl mb-2">🔒</span>
                        <span className="text-gold text-sm font-semibold">{item.price} SC</span>
                      </div>
                    )}

                    {/* Unlocked badge */}
                    {item.unlocked && (
                      <div className="absolute top-2 right-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                          Débloqué
                        </span>
                      </div>
                    )}

                    {/* Tier badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${badge?.class}`}>
                        {badge?.label}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-cream text-sm font-medium truncate">{item.title}</p>
                    <p className="text-white/30 text-xs mt-0.5 truncate">{item.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white/20 text-[10px] uppercase">
                        {FILTER_LABELS[item.type] || item.type}
                      </span>
                      {!item.unlocked && (
                        <span className="text-gold text-xs">{item.price} SC</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Unlock Confirmation Modal */}
      <AnimatePresence>
        {confirmItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setConfirmItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-8 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-4xl mb-4 block">
                {TYPE_EMOJI[confirmItem.type] || '🔒'}
              </span>
              <h3 className="font-serif text-xl mb-2">{confirmItem.title}</h3>
              <p className="text-white/40 text-sm mb-6">{confirmItem.description}</p>

              <div className="p-4 rounded-xl bg-gold/5 border border-gold/20 mb-6">
                <p className="text-white/50 text-xs mb-1">Prix</p>
                <p className="text-2xl font-serif gold-text">{confirmItem.price} SC</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmItem(null)}
                  className="btn-dark flex-1"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmUnlock}
                  disabled={unlocking !== null}
                  className="btn-gold flex-1"
                >
                  {unlocking ? 'Déblocage...' : 'Débloquer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
