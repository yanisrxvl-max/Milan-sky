'use client';

import { motion } from 'framer-motion';
import { Crown, Shield, Eye, Zap, Heart, Star, Compass, ArrowRight, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';
import FlippableCard from '@/components/ui/FlippableCard';
import LogoMarquee from '@/components/ui/LogoMarquee';
import CountdownTimer from '@/components/ui/CountdownTimer';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

const FEATURES = [
  {
    icon: <Eye size={24} />,
    title: 'Vue Plongeante',
    desc: 'Des moments volés, sans filtre. Le Vault de Milan recèle des archives jamais diffusées.',
    story: "Né de la volonté de briser les codes du contenu digital classique, le 'Vault' de Milan Sky regroupe des moments volés, des séances sans filtre et des archives jamais publiées sur les réseaux sociaux. C'est le cœur battant de l'interdit.",
    specs: ['4K Native', 'Sans censure', 'Mises à jour quotidiennes', 'Accès Multi-support']
  },
  {
    icon: <Sparkles size={24} />,
    title: 'Muses IA',
    desc: 'Injectez des personnalités Milan Premium (Possessif, Jaloux) dans votre propre IA.',
    story: "L'avatar ne suffit plus. J'ai créé des empreintes psychologiques. Le Milan Nuit à Paris, le Milan Confident... Ces Muses sont des Prompts Systèmes calibrés au millimètre pour transformer votre ChatGPT en compagnon exclusif.",
    specs: ['Prompts Système', 'Role-Play Immersif', 'Copie en 1 Clic', 'Différents Moods']
  },
  {
    icon: <Heart size={24} />,
    title: 'Chat Intime',
    desc: 'Discutez directement avec Milan. Des conversations authentiques, vocales et privées.',
    story: "Parce que l'exclusivité passe par la connexion. J'ai voulu créer un espace où la barrière entre le créateur et son cercle se brise. Ici, chaque message est une conversation réelle, sans intermédiaire.",
    specs: ['Messagerie Cryptée', 'Notes Vocales', 'Réponse Prioritaire', '100% Authentique']
  },
  {
    icon: <Crown size={24} />,
    title: 'Club V.I.P',
    desc: 'Demandes personnalisées, accès anticipé, et traitement prioritaire pour l\'élite.',
    story: "Le sommet de l'expérience. Le Club VIP a été pensé pour ceux qui veulent plus qu'un simple accès : ils veulent influencer l'univers Milan Sky. C'est ici que vos désirs deviennent mes projets.",
    specs: ['Ligne Directe', 'Contenu Sur-mesure', 'Demandes Privées', 'Statut Ultra-Rare']
  },
];

const TIERS = [
  {
    name: 'VOYEUR',
    price: '9.90',
    color: 'border-white/10 hover:border-white/30',
    accent: 'text-white/50',
    features: ['Bibliothèque avec publicité', 'Le Quotidirty (19h-6h)', 'Milan IA (Découverte)', 'Lives Mensuels'],
  },
  {
    name: 'INITIÉ',
    price: '19.90',
    color: 'border-gold/40 hover:border-gold shadow-[0_0_30px_rgba(201,168,76,0.1)]',
    accent: 'text-gold-light',
    badge: 'Plus Choisi',
    features: ['Bibliothèque sans publicité', 'Le Quotidirty Complet', 'Accès Muses Premium', 'Drops Spéciaux Hebdo'],
  },
  {
    name: 'PRIVILÈGE',
    price: '49.90',
    color: 'border-gold/60 hover:border-gold',
    accent: 'text-gold',
    features: ['Accès Total Bibliothèque', 'Quotidirty Exclusifs', '50 SkyCoins par mois', 'Priorité Chat Milan'],
  },
  {
    name: 'SKYCLUB',
    price: '299',
    color: 'border-purple-500/40 hover:border-purple-400',
    accent: 'text-purple-400',
    badge: '17 Places Restantes',
    features: ['Plateforme 100% Débloquée', 'Ligne Privée Milan', 'Invitations Événements', 'Statut Membre SkyClub'],
  },
];

const TESTIMONIALS = [
  { text: "Les Muses IA sont incroyables. J'ai copié 'Milan Possessif' sur mon ChatGPT, c'est saisissant de réalisme.", name: 'Sarah M.', tier: 'INITIÉ' },
  { text: "Le chat avec Milan c'est quelque chose... On se sent vraiment privilégié, surtout avec les notes vocales.", name: 'Thomas D.', tier: 'PRIVILÈGE' },
  { text: "L'esthétique de la plateforme est folle. Le contenu Quotidirty vaut largement l'abonnement.", name: 'Alex R.', tier: 'SKYCLUB' },
];

export default function Home() {
  return (
    <main className="relative w-full bg-dark-500 overflow-hidden">
      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 1: HERO AVEC PARTICULES ET FOMO         */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20">
        {/* Vidéo et Overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-500/95 via-dark-500/60 to-black/30 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.08)_0%,transparent_60%)] z-10" />

          {/* Particules CSS */}
          <div className="absolute inset-0 z-20 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${10 + Math.random() * 20}s`,
                  animationDelay: `${Math.random() * 10}s`,
                  width: `${Math.random() * 3}px`,
                  height: `${Math.random() * 3}px`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Contenu Hero */}
        <div className="relative z-30 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto mt-[-5vh]">
          {/* Social Proof Live Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 backdrop-blur-md"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-red-400 text-[10px] uppercase tracking-widest font-bold">
              <AnimatedCounter value={47} duration={2} /> membres actifs maintenant
            </span>
          </motion.div>

          {/* Titre Milan Sky */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <h1 className="flex flex-col md:flex-row items-center gap-x-6 overflow-visible">
              <span className="font-serif italic text-6xl sm:text-7xl md:text-[140px] text-white leading-tight tracking-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                Milan
              </span>
              <span className="gold-text-glow font-serif font-bold text-5xl sm:text-6xl md:text-[120px] leading-tight tracking-tighter md:mt-6">
                Sky
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-white/70 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-12 max-w-2xl leading-relaxed"
          >
            L&apos;accès ultime à l&apos;interdit. <br className="hidden md:block" />
            Là où l&apos;exclusivité n&apos;a plus de limites.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
          >
            <Link href="/subscriptions" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto group relative px-12 py-5 bg-gold rounded-full text-black font-bold tracking-widest uppercase text-[11px] hover:scale-105 transition-all duration-500 outline-none gold-glow flex items-center justify-center gap-3">
                S&apos;abonner <Crown size={14} className="group-hover:rotate-12 transition-transform" />
              </button>
            </Link>

            <Link href="/library" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-12 py-5 glass rounded-full text-white font-bold tracking-widest uppercase text-[11px] hover:bg-white/10 hover:border-gold/30 transition-all duration-500 flex items-center justify-center gap-3 group">
                Le Vault <Play size={12} className="text-gold group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>

          {/* Countdown d'Urgence (FOMO) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-16"
          >
            <CountdownTimer offsetHours={3} label="Prochain Drop Exclusif Quotidirty dans :" variant="hero" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold/50 to-transparent mx-auto" />
          <p className="text-gold/40 text-[8px] uppercase tracking-[0.4em] mt-4 font-bold">Scroll</p>
        </motion.div>
      </section>

      <LogoMarquee />

      {/* ═════════════════════════════ */}
      {/* SECTION 2: FEATURES (Flippable) */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-32 px-4 bg-dark-500">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.03),transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">L&apos;Expérience <span className="gold-text italic">Premium</span></h2>
            <p className="text-white/30 text-xs uppercase tracking-[0.2em] font-bold">Bien plus qu'une simple plateforme</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f, i) => (
              <FlippableCard
                key={i}
                index={i}
                frontIcon={f.icon}
                frontTitle={f.title}
                frontDesc={f.desc}
                backStory={f.story}
                backSpecs={f.specs}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 3: SOCIAL PROOF */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-32 px-4 relative border-t border-white/[0.03]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-3">
              Ce que <span className="gold-text italic">l'Élite</span> en dit
            </h2>
            <p className="text-white/20 text-[10px] font-bold tracking-[0.3em] uppercase">Rejoignez un cercle intime.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="card-premium relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-[40px] rounded-full -mr-12 -mt-12 group-hover:bg-gold/10 transition-colors" />
                <div className="flex gap-1 mb-6 text-gold">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-6 italic font-light">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gold/5 flex items-center justify-center text-gold text-lg font-serif border border-gold/20">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-cream text-sm font-bold">{t.name}</p>
                    <p className="text-gold/40 text-[9px] font-bold uppercase tracking-widest">{t.tier}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 4: PRICING */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-32 px-4 relative border-t border-white/[0.03] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(201,168,76,0.05)_0%,transparent_60%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">
              Choisissez votre <span className="gold-text italic">accès</span>
            </h2>
            <p className="text-white/30 text-xs tracking-widest uppercase font-bold">Un investissement sur l'exclusivité.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {TIERS.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`card-premium flex flex-col items-center relative group ${tier.color} ${i === 1 ? 'lg:scale-105 z-20 bg-dark-200/80 shadow-2xl' : 'z-10'}`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <span className={`text-[9px] tracking-[0.2em] uppercase px-4 py-1.5 rounded-full font-bold whitespace-nowrap shadow-lg ${tier.name === 'SKYCLUB' ? 'bg-purple-500 text-white shadow-purple-500/30' : 'bg-gold text-black shadow-gold/30'}`}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-10 mt-4 w-full">
                  <h3 className={`font-serif text-2xl tracking-[0.2em] uppercase mb-4 ${tier.accent}`}>{tier.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-serif text-cream">{tier.price}</span>
                    <span className="text-white/30 text-xs font-bold uppercase">€/mois</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10 w-full flex-1">
                  {tier.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 1 ? 'bg-gold' : 'bg-gold/40 group-hover:bg-gold/60'}`} />
                      <span className="text-white/50 text-[11px] uppercase tracking-wider font-medium">{f}</span>
                    </div>
                  ))}
                </div>

                <Link href="/subscriptions" className="w-full">
                  <button className={`w-full py-4 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${i === 1 ? 'bg-gold text-dark hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:scale-[1.02]' : 'bg-white/5 border border-white/10 text-white/60 hover:border-gold/30 hover:text-gold'}`}>
                    Sélectionner
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* FINAL CTA */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-40 px-4 relative border-t border-white/[0.03] flex justify-center">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-gold/10 to-transparent" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-serif text-cream mb-8 leading-tight tracking-tight">
            Prêt à franchir <span className="gold-text italic block mt-2">la limite</span> ?
          </h2>
          <p className="text-white/40 mb-12 text-sm uppercase tracking-widest font-bold">L'accès n'est autorisé qu'aux membres validés.</p>
          <Link href="/register" className="inline-block relative">
            <div className="absolute -inset-1 bg-gold rounded-full opacity-30 blur-xl transition duration-500 hover:opacity-100" />
            <button className="relative px-16 py-6 bg-dark border border-gold/40 text-gold rounded-full font-bold tracking-[0.3em] uppercase text-[11px] hover:bg-gold hover:text-dark transition-all duration-500 flex items-center gap-3 shadow-[0_0_40px_rgba(201,168,76,0.2)]">
              <Crown size={16} /> Rejoindre le Cercle
            </button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.04] py-16 px-4 pb-32 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-4 py-8 overflow-visible">
            <span className="inline-block font-serif text-2xl text-white tracking-[0.2em] uppercase italic py-2">Milan <span className="gold-text">Sky</span></span>
          </div>
          <div className="flex items-center gap-8 text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold">
            <Link href="/login" className="hover:text-gold transition-colors">Connexion</Link>
            <Link href="/register" className="hover:text-gold transition-colors">Inscription</Link>
            <span className="font-light opacity-50">© {new Date().getFullYear()} MILAN SKY</span>
          </div>
          <div className="flex items-center gap-3 text-gold/40 text-[9px] uppercase tracking-widest font-bold">
            <Shield size={14} className="opacity-70" /> DIGITAL LUXURY EXPERIENCE
          </div>
        </div>
      </footer>
    </main>
  );
}