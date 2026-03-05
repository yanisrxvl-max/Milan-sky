'use client';

import { motion } from 'framer-motion';
import { Crown, Shield, Eye, Zap, Heart, Star, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import FlippableCard from '@/components/ui/FlippableCard';
import LogoMarquee from '@/components/ui/LogoMarquee';

const FEATURES = [
  {
    icon: <Eye size={24} />,
    title: 'Contenu Exclusif',
    desc: 'Photos, vidéos et séries que vous ne trouverez nulle part ailleurs.',
    story: "Né de la volonté de briser les codes du contenu digital classique, le 'Vault' de Milan Sky regroupe des moments volés, des séances sans filtre et des archives jamais publiées sur les réseaux sociaux. C'est le cœur battant de l'interdit.",
    specs: ['4K Native', 'Sans censure', 'Quotidien', 'Multi-support']
  },
  {
    icon: <Heart size={24} />,
    title: 'Chat Intime',
    desc: 'Discutez directement avec Milan. Des conversations authentiques, privées.',
    story: "Parce que l'exclusivité passe par la connexion. J'ai voulu créer un espace où la barrière entre le créateur et son cercle se brise. Ici, chaque message est une conversation réelle, sans intermédiaire.",
    specs: ['Crypté', 'Vocal', 'Prioritaire', 'Authentique']
  },
  {
    icon: <Crown size={24} />,
    title: 'Club V.I.P',
    desc: 'Demandes personnalisées, accès anticipé, et traitement prioritaire.',
    story: "Le sommet de l'expérience. Le Club VIP a été pensé pour ceux qui veulent plus qu'un simple accès : ils veulent influencer l'univers Milan Sky. C'est ici que vos désirs deviennent mes projets.",
    specs: ['Direct Milan', 'Privé', 'Sur mesure', 'Ultra-Rare']
  },
  {
    icon: <Zap size={24} />,
    title: 'SkyCoins',
    desc: 'Débloquez du contenu à la demande avec la monnaie exclusive de la plateforme.',
    story: "La monnaie de la liberté. Les SkyCoins permettent d'accéder au contenu spécifique sans engagement de longue durée. Une économie circulaire pensée pour la micro-exclusivité.",
    specs: ['Instantané', 'À vie', 'Bonus VIP', 'Partout']
  },
];

const TIERS = [
  {
    name: 'VOYEUR',
    price: '9.90',
    color: 'border-white/10',
    accent: 'text-white/50',
    features: ['Bibliothèque avec publicité', 'Le Quotidirty (19h-6h)', 'Milan IA (Découverte)', 'Lives Mensuels'],
  },
  {
    name: 'INITIÉ',
    price: '19.90',
    color: 'border-gold/40',
    accent: 'text-gold',
    badge: 'Plus Choisi',
    features: ['Bibliothèque sans publicité', 'Le Quotidirty Complet', 'Milan IA Illimité', 'Drops Spéciaux Hebdo'],
  },
  {
    name: 'PRIVILÈGE',
    price: '49.90',
    color: 'border-gold/60',
    accent: 'text-gold',
    features: ['Accès Total Bibliothèque', 'Quotidirty Exclusifs', 'SkyCoins Mensuels Offerts', 'Priorité Chat Milan'],
  },
  {
    name: 'SKYCLUB',
    price: '299',
    color: 'border-purple-500/40',
    accent: 'text-purple-400',
    badge: '50 Membres Max',
    features: ['Plateforme 100% Débloquée', 'Ligne Privée Milan', 'Invitations Événements', 'Statut Membre SkyClub'],
  },
];

const TESTIMONIALS = [
  { text: "Un univers totalement à part. J'ai jamais vu une plateforme aussi premium.", name: 'Lucas M.', tier: 'ICON' },
  { text: "Le chat avec Milan c'est quelque chose... On se sent vraiment privilégié.", name: 'Thomas D.', tier: 'ELITE' },
  { text: "Les drops exclusifs sont incroyables. Ça vaut chaque centime.", name: 'Alex R.', tier: 'ICON' },
];

export default function Home() {
  return (
    <main className="relative w-full bg-dark-500 overflow-hidden">
      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 1: HERO WITH VIDEO (NEW LUXURY REDESIGN) */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          {/* Suble dark overlay for luxury feel */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-500/90 via-transparent to-black/20 z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
          {/* Logo Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <h1 className="flex flex-col md:flex-row items-center gap-x-6 overflow-visible py-4">
              <span className="font-serif italic text-7xl md:text-[140px] text-white leading-tight tracking-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                Milan
              </span>
              <span className="gold-text font-serif font-bold text-6xl md:text-[120px] leading-tight tracking-tighter drop-shadow-[0_10px_35px_rgba(201,168,76,0.2)] md:mt-6 pb-4">
                Sky
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] mb-12 max-w-3xl leading-relaxed"
          >
            L&apos;accès ultime à l&apos;interdit, là où l&apos;exclusivité n&apos;a plus de limites.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <Link href="/subscriptions">
              <button className="group relative px-12 py-5 bg-gold rounded-full text-black font-bold tracking-widest uppercase text-[11px] shadow-2xl hover:scale-105 transition-all duration-500 flex items-center justify-center gap-2">
                S&apos;abonner <Crown size={14} className="group-hover:rotate-12 transition-transform" />
              </button>
            </Link>

            <Link href="/library">
              <button className="px-12 py-5 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full text-white font-bold tracking-widest uppercase text-[11px] hover:bg-black/80 hover:border-gold/30 transition-all duration-500 flex items-center justify-center gap-2">
                Voir Quotidirty <ArrowRight size={14} />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold/50 to-transparent mx-auto" />
          <p className="text-gold/30 text-[8px] uppercase tracking-[0.4em] mt-4 font-bold">Scroll</p>
        </motion.div>
      </section>

      <LogoMarquee />

      {/* ═════════════════════════════ */}
      {/* SECTION 2: FEATURES (Flippable) */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-32 px-4 bg-dark-500">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f, i) => (
              <FlippableCard
                key={i}
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
      <section className="py-24 px-4 relative border-t border-white/[0.03]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-cream mb-3">
              Ce qu&apos;ils en <span className="gold-text italic">disent</span>
            </h2>
            <p className="text-white/20 text-sm font-light tracking-widest uppercase">La communauté qui ne dort jamais.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-dark-200/30 border border-white/[0.04] rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4 text-gold">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-4 italic font-light">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold ring-1 ring-gold/20">{t.name[0]}</div>
                  <div>
                    <p className="text-cream text-sm font-medium">{t.name}</p>
                    <p className="text-gold/40 text-[9px] uppercase tracking-widest">{t.tier}</p>
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
      <section className="py-32 px-4 relative border-t border-white/[0.03]">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-cream mb-4 tracking-tight">
              Choisissez votre <span className="gold-text italic">niveau</span>
            </h2>
            <p className="text-white/25 text-sm font-light">Plus vous montez, plus l&apos;expérience devient intime.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {TIERS.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`relative bg-dark-200/40 backdrop-blur border ${tier.color} rounded-3xl p-8 hover:bg-dark-200/60 transition-all duration-500 ${i === 1 ? 'lg:scale-105 border-gold shadow-[0_0_30px_rgba(201,168,76,0.1)]' : ''}`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <span className="text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full bg-gold text-dark font-bold whitespace-nowrap">
                      {tier.badge}
                    </span>
                  </div>
                )}
                <div className="text-center mb-10">
                  <h3 className={`font-serif text-2xl tracking-widest uppercase mb-1 ${tier.accent}`}>{tier.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-serif text-cream">{tier.price}</span>
                    <span className="text-white/20 text-xs">€/mois</span>
                  </div>
                </div>
                <div className="space-y-4 mb-10">
                  {tier.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold/50" />
                      <span className="text-white/40 text-[11px] uppercase tracking-wide">{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/subscriptions">
                  <button className={`w-full py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-500 ${i === 1 ? 'bg-gold text-dark hover:opacity-90' : 'bg-white/5 text-white/40 border border-white/10 hover:border-gold/30 hover:text-gold'}`}>
                    Choisir
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
      <section className="py-40 px-4 relative border-t border-white/[0.03]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-cream mb-8 leading-tight">
            Prêt à entrer dans <span className="gold-text italic block">l&apos;interdit</span> ?
          </h2>
          <Link href="/register" className="group relative inline-block">
            <div className="absolute -inset-1 bg-gold rounded-full opacity-40 blur-lg group-hover:opacity-100 transition duration-500" />
            <button className="relative flex items-center gap-4 px-16 py-6 bg-dark-400 text-cream rounded-full font-bold tracking-[0.2em] uppercase text-sm border border-gold/30 hover:bg-dark-300 transition-all">
              <Crown size={20} className="text-gold" /> Rejoindre Milan Sky
            </button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.04] py-16 px-4 pb-32">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-4 py-8 overflow-visible">
            <span className="inline-block font-serif text-2xl text-white tracking-[0.2em] uppercase italic py-2 overflow-visible">Milan <span className="gold-text pb-2">Sky</span></span>
          </div>
          <div className="flex items-center gap-10 text-white/20 text-[10px] uppercase tracking-[0.2em]">
            <Link href="/login" className="hover:text-gold transition-colors">Connexion</Link>
            <Link href="/register" className="hover:text-gold transition-colors">S&apos;inscrire</Link>
            <span className="font-light">© {new Date().getFullYear()} MILAN SKY</span>
          </div>
          <div className="flex items-center gap-3 text-white/10 text-[9px] uppercase tracking-widest">
            <Shield size={14} className="opacity-50" /> LUXURY DIGITAL EXPERIENCE
          </div>
        </div>
      </footer>
    </main>
  );
}