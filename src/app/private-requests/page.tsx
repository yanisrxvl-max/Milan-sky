'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Play, Camera, Mic, Lock, ChevronRight, List, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PrivateRequest {
  id: string;
  orderNumber: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function PrivateRequestsPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [requests, setRequests] = useState<PrivateRequest[]>([]);
  const { data: session } = useSession();
  const router = useRouter();

  const services = [
    { id: 'VIDEO', title: 'Vidéo Exclusive', icon: <Play size={24} />, price: '400 SC', desc: 'Une mise en scène personnalisée, rien que pour vos yeux.' },
    { id: 'PHOTO', title: 'Set Photo Privé', icon: <Camera size={24} />, price: '150 SC', desc: 'Une série de clichés uniques capturant l\'instant désiré.' },
    { id: 'CALL', title: 'Call Privé (Voice)', icon: <Mic size={24} />, price: '1200 SC', desc: 'Une connexion directe. Entendez sa voix murmurer vos envies.' },
    { id: 'CUSTOM', title: 'Demande Sur-Mesure', icon: <Lock size={24} />, price: '1500+ SC', desc: 'Laissez libre cours à votre imagination la plus sauvage.' },
  ];

  useEffect(() => {
    if (session) fetchRequests();
  }, [session]);

  async function fetchRequests() {
    try {
      const res = await fetch('/api/private-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (e) { }
  }

  async function handleSubmit() {
    if (!description || !selectedType) {
      toast.error('Veuillez compléter votre demande.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/private-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          description: description
        })
      });

      if (res.ok) {
        toast.success('Demande transmise à l\'agence.');
        setShowHistory(true);
        fetchRequests();
        setActiveStep(1);
        setSelectedType(null);
        setDescription('');
      } else {
        toast.error('Erreur lors de la transmission.');
      }
    } catch (e) {
      toast.error('Erreur de connexion.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!session) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen">
        <div className="text-center p-12 card-premium max-w-sm">
          <Lock className="mx-auto mb-6 text-gold" size={48} />
          <h1 className="font-serif text-2xl gold-text mb-4">Espace Privé</h1>
          <p className="text-white/40 mb-8 text-sm">Connecte-toi pour accéder à ma conciergerie privée.</p>
          <Link href="/login" className="btn-gold block">Se connecter</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-7xl mx-auto px-4 py-12 pt-24 min-h-screen">
      <div className="text-center mb-20 relative">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="absolute top-0 right-0 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <List size={14} /> {showHistory ? 'Nouvelle Demande' : `Mes Demandes (${requests.length})`}
        </button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-4"
        >
          Milan Sky Agency — Conciergerie Privée
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-5xl md:text-7xl text-cream uppercase mb-6 tracking-tight"
        >
          Demandes <span className="italic">Privées</span>
        </motion.h1>
        <p className="text-white/40 max-w-xl mx-auto text-sm">
          Faites part de vos désirs les plus exclusifs. Milan étudiera chaque demande avec la plus grande attention et une discrétion absolue.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {showHistory ? (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {requests.length === 0 ? (
                <div className="text-center py-20 text-white/20 uppercase tracking-widest text-sm italic">
                  Aucune demande en cours...
                </div>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="card-premium !p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                        <Star size={20} />
                      </div>
                      <div>
                        <p className="text-gold text-[10px] uppercase tracking-[0.2em] font-bold mb-1">{req.type}</p>
                        <p className="text-white/80 text-sm line-clamp-1">{req.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-white/20 mb-1">Statut</p>
                        <p className="text-cream text-xs font-bold uppercase tracking-widest">{req.status}</p>
                      </div>
                      <div className="w-px h-8 bg-white/5" />
                      <p className="text-white/20 font-mono text-xs">{req.orderNumber}</p>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="booking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex justify-center mb-16 gap-4">
                {[1, 2].map((step) => (
                  <div
                    key={step}
                    className={`h-1 w-12 rounded-full transition-all duration-500 ${activeStep >= step ? 'bg-gold' : 'bg-white/10'}`}
                  />
                ))}
              </div>

              {activeStep === 1 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service, idx) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => {
                        setSelectedType(service.id);
                        setActiveStep(2);
                      }}
                      className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/5 bg-dark-200/40 p-10 hover:border-gold/30 transition-all duration-500"
                    >
                      <div className="absolute top-0 right-0 p-8 text-gold flex flex-col items-end">
                        <span className="text-[10px] uppercase tracking-widest font-bold mb-1 opacity-40">À partir de</span>
                        <span className="font-serif text-xl">{service.price}</span>
                      </div>

                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold mb-8 group-hover:scale-110 transition-transform duration-500">
                        {service.icon}
                      </div>

                      <h3 className="font-serif text-2xl text-cream mb-4">{service.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed max-w-[200px]">
                        {service.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card-premium !p-12 max-w-2xl mx-auto"
                >
                  <button
                    onClick={() => setActiveStep(1)}
                    className="text-white/20 text-[10px] uppercase tracking-widest hover:text-white mb-10 block"
                  >
                    ← Retour au catalogue
                  </button>

                  <h2 className="font-serif text-3xl text-cream mb-2">Votre Demande</h2>
                  <p className="text-gold text-[10px] uppercase tracking-widest font-bold mb-10">
                    Type : {services.find(s => s.id === selectedType)?.title}
                  </p>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez votre envie avec précision..."
                    className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-6 text-white text-sm focus:border-gold/40 focus:outline-none transition-all placeholder:text-white/10 mb-8"
                  />

                  <PremiumButton
                    variant="gold"
                    fullWidth
                    onClick={handleSubmit}
                    isLoading={submitting}
                    className="!py-5 uppercase text-[10px] tracking-[0.3em] font-bold"
                  >
                    Transmettre la demande
                  </PremiumButton>

                  <div className="flex items-center justify-center gap-3 mt-10 text-[10px] text-white/20 uppercase tracking-[0.3em]">
                    <Lock size={12} className="text-emerald-500" />
                    Garantie de Discrétion Totale
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
