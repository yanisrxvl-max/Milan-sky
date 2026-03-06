'use client';

import { motion } from 'framer-motion';
import { Crown, Shield, Eye, Heart, Star, ArrowRight, Play, Sparkles, MessageCircle, BookOpen, Brain } from 'lucide-react';
import Link from 'next/link';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { useThemeMode } from '@/context/ThemeModeContext';
import { useI18n } from '@/context/I18nContext';

export default function Home() {
  const { mode } = useThemeMode();
  const { t } = useI18n();

  const isDay = mode === 'DAY';

  const TESTIMONIALS = isDay ? [
    { text: "Milan Lumina a changé ma façon de voir l'IA. Ses conseils mode sont aussi très pointus.", name: 'Clara B.', tier: 'INITIÉ' },
    { text: "Enfin un contenu intelligent et inspirant. Sa vision du futur est fascinante.", name: 'Julien S.', tier: 'PRIVILÈGE' },
    { text: "Le Mentor Club m'accompagne dans ma transformation personnelle. Une pépite.", name: 'Marc A.', tier: 'SKYCLUB' },
  ] : [
    { text: "Les Muses IA sont incroyables. J'ai copié 'Milan Possessif' sur mon ChatGPT, c'est saisissant de réalisme.", name: 'Sarah M.', tier: 'INITIÉ' },
    { text: "Le chat avec Milan c'est quelque chose... On se sent vraiment privilégié, surtout avec les notes vocales.", name: 'Thomas D.', tier: 'PRIVILÈGE' },
    { text: "L'esthétique de la plateforme est folle. Le contenu Quotidirty vaut largement l'abonnement.", name: 'Alex R.', tier: 'SKYCLUB' },
  ];

  const heroContent = isDay ? {
    tag: t('hero.tag_day'),
    title1: "Milan",
    title2: "Sky",
    desc: t('hero.desc_day'),
    btn1: t('hero.btn1_day'),
    btn2: t('hero.btn2_day')
  } : {
    tag: t('hero.tag_night'),
    title1: "Milan",
    title2: "Sky",
    desc: t('hero.desc_night'),
    btn1: t('hero.btn1_night'),
    btn2: t('hero.btn2_night')
  };
  return (
    <main className="relative w-full bg-dark-500 overflow-hidden">
      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 1: HERO AVEC PARTICULES ET FOMO         */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20">
        {/* Vidéo et Overlays */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-dark-500">
          {/* Day Mode Solid Fallback Background (prevents black screen if video fails on iOS) */}
          <motion.div
            animate={{ opacity: isDay ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-[#2a1f14]"
          />

          {/* Night Video */}
          <motion.video
            key="night-video"
            autoPlay loop muted playsInline preload="auto"
            animate={{ opacity: isDay ? 0 : 0.8 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </motion.video>

          {/* Day Video */}
          <motion.video
            key="day-video"
            autoPlay loop muted playsInline preload="auto"
            animate={{ opacity: isDay ? 0.8 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video/videojour.mp4" type="video/mp4" />
          </motion.video>

          {/* Mode transition flash */}
          <motion.div
            key={`transition-${mode}`}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-black z-[5]"
          />

          {/* Global dark overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10" />
          {/* Day-specific warm brown tint */}
          <motion.div
            animate={{ opacity: isDay ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-[#1a1008]/60 z-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-500/90 via-dark-500/50 to-black/30 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.05)_0%,transparent_60%)] z-10" />

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
              <AnimatedCounter value={isDay ? 12 : 47} duration={2} /> {t('hero.members_active')}
            </span>
          </motion.div>

          {/* Titre Milan Sky / Lumina */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <h1 className="flex flex-col md:flex-row items-center gap-x-6 overflow-visible">
              <span className="font-serif italic text-6xl sm:text-7xl md:text-[140px] text-white leading-tight tracking-tight drop-shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                {heroContent.title1}
              </span>
              <span className={`${isDay ? 'gold-text-glow' : 'silver-text'} font-serif font-bold text-5xl sm:text-6xl md:text-[120px] leading-tight tracking-tighter md:mt-6 pb-4 transition-all duration-700`}>
                {heroContent.title2}
              </span>
            </h1>
          </motion.div>

          {/* Sous-titre Hero */}
          <motion.p
            key={`subtitle-${mode}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-white/50 text-sm md:text-base font-light tracking-wide mb-6 max-w-lg mx-auto"
          >
            {isDay
              ? 'Le créateur de contenu qui construit son propre univers.'
              : "L'accès ultime à l'interdit."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
          >
            <Link
              href={isDay ? "/login" : "/subscriptions"}
              className="w-full sm:w-auto group relative px-12 py-5 bg-gold rounded-full text-black font-bold tracking-widest uppercase text-[11px] hover:scale-105 active:scale-95 transition-all duration-500 outline-none gold-glow flex items-center justify-center gap-3 touch-manipulation min-h-[44px]"
            >
              {heroContent.btn1}
              {isDay ? (
                <Crown size={14} className="group-hover:rotate-12 transition-transform" />
              ) : (
                <div className="relative flex items-center justify-center w-[18px] h-[18px] rounded-full border-[1.5px] border-dark group-hover:bg-red-500 group-hover:border-red-500 transition-colors duration-300 overflow-hidden">
                  <span className="text-[8px] font-black leading-[1] mt-px group-hover:text-white transition-colors duration-300">18</span>
                  <div className="absolute top-1/2 left-1/2 w-full h-[1.5px] bg-white -translate-x-1/2 -translate-y-1/2 -rotate-45 origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                </div>
              )}
            </Link>

            <Link
              href="/library"
              className="w-full sm:w-auto px-12 py-5 glass rounded-full text-milan-text font-bold tracking-widest uppercase text-[11px] hover:bg-white/10 hover:border-gold/30 active:scale-95 transition-all duration-500 flex items-center justify-center gap-3 group touch-manipulation min-h-[44px]"
            >
              {heroContent.btn2} <Play size={12} className="text-gold group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Mode-specific bottom element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-16"
          >
            {isDay ? (
              /* Day Mode — New Content Notification */
              <Link href="/library">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-md cursor-pointer hover:bg-gold/15 hover:border-gold/40 transition-all group"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
                  </span>
                  <span className="text-gold text-[10px] uppercase tracking-[0.2em] font-bold">
                    {t('hero.new_content')}
                  </span>
                  <Play size={10} className="text-gold group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </Link>
            ) : (
              /* Night Mode — Quotidirty Countdown */
              <CountdownTimer offsetHours={3} label={t('hero.next_quotidirty')} variant="hero" />
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold/50 to-transparent mx-auto" />
          <p className="text-gold/40 text-[8px] uppercase tracking-[0.4em] mt-4 font-bold">{t('hero.scroll')}</p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 2: LES 3 PILIERS */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-32 px-4 bg-dark-500 border-t border-white/[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.04),transparent_70%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">L'univers Milan Sky</p>
            <h2 className="section-title mb-4">
              {isDay ? 'Tout ce dont tu' : 'Tout ce dont tu'} <span className="gold-text italic">as besoin</span>
            </h2>
            <p className="text-white/40 text-sm max-w-xl mx-auto">
              {isDay
                ? 'Milan Sky est bâti autour de 3 piliers qui ensemble créent une expérience unique.'
                : 'Trois espaces. Un univers. Une connexion sans filtre.'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pilier 1 — Contenu */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="group relative rounded-[2.5rem] border border-white/5 bg-dark-200/30 p-10 flex flex-col hover:border-gold/30 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -mr-10 -mt-10" />
              <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                {isDay ? <Sparkles size={24} className="text-gold" /> : <Eye size={24} className="text-gold" />}
              </div>
              <div className="mb-2">
                <span className="text-[9px] text-gold/60 uppercase tracking-widest font-bold">Pilier 01</span>
              </div>
              <h3 className="font-serif text-2xl text-cream mb-4">Contenu Exclusif</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8 flex-1">
                {isDay
                  ? 'Vlogs, masterclass, conseils de style et contenu pédagogique. Un univers pensé pour t\'inspirer.'
                  : 'Bibliothèque sans censure, drops quotidiens à 19h et archives jamais publiées nulle part ailleurs.'}
              </p>
              <Link
                href="/library"
                className="inline-flex items-center gap-2 text-gold text-[10px] uppercase tracking-widest font-bold hover:gap-4 transition-all"
              >
                {isDay ? 'Découvrir le Contenu' : 'Accéder à la Bibliothèque'} <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Pilier 2 — Chat & IA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="group relative rounded-[2.5rem] border border-gold/20 bg-gradient-to-br from-gold/[0.06] to-dark-200/30 p-10 flex flex-col hover:border-gold/50 transition-all duration-500 overflow-hidden shadow-[0_0_40px_rgba(201,168,76,0.07)]"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-full blur-[60px] opacity-60 group-hover:opacity-100 transition-opacity duration-700 -mr-10 -mt-10" />
              <div className="absolute -top-2 -right-2 bg-gold text-dark text-[8px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full">
                Le Cœur
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gold/20 border border-gold/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <MessageCircle size={24} className="text-gold" />
              </div>
              <div className="mb-2">
                <span className="text-[9px] text-gold/60 uppercase tracking-widest font-bold">Pilier 02</span>
              </div>
              <h3 className="font-serif text-2xl text-cream mb-4">Chat & IA Milan</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8 flex-1">
                {isDay
                  ? 'Conversations authentiques, Q&A, et l\'IA Milan Sky — ton accès direct à l\'univers.'
                  : 'Messages privés, notes vocales, Muses IA et réponses personnalisées. L\'illusion de proximité devient réelle.'}
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 text-gold text-[10px] uppercase tracking-widest font-bold hover:gap-4 transition-all"
              >
                Ouvrir le Chat <ArrowRight size={14} />
              </Link>
            </motion.div>

            {/* Pilier 3 — SkyCoins & Statut */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="group relative rounded-[2.5rem] border border-white/5 bg-dark-200/30 p-10 flex flex-col hover:border-purple-500/30 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -mr-10 -mt-10" />
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                <Crown size={24} className="text-purple-400" />
              </div>
              <div className="mb-2">
                <span className="text-[9px] text-purple-400/60 uppercase tracking-widest font-bold">Pilier 03</span>
              </div>
              <h3 className="font-serif text-2xl text-cream mb-4">SkyCoins & Statut</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-8 flex-1">
                Gagne des SkyCoins chaque jour. Monte dans le classement des fans. Débloque des récompenses exclusives que personne d&apos;autre ne peut avoir.
              </p>
              <Link
                href="/skycoins"
                className="inline-flex items-center gap-2 text-purple-400 text-[10px] uppercase tracking-widest font-bold hover:gap-4 transition-all"
              >
                Voir mon Statut <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 3: CAUSES (JOUR) / SOCIAL PROOF (NUIT) */}
      {/* ═══════════════════════════════════════════════ */}
      {isDay ? (
        <section className="py-32 px-4 relative border-t border-white/[0.03]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Un engagement concret</p>
              <h2 className="section-title mb-4">
                Nos <span className="gold-text italic">Causes</span>
              </h2>
              <p className="text-white/40 text-sm max-w-xl mx-auto">
                Milan Sky reverse une partie de ses revenus à des causes qui comptent. Chaque abonnement a un impact direct.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { icon: Shield, title: 'Protection des mineurs', desc: 'Lutte contre le trafic sexuel et l\'exploitation. 30% de l\'abonnement Ambitieux reversé.', color: 'text-blue-400', border: 'border-blue-500/20 hover:border-blue-500/40', bg: 'bg-blue-500/5' },
                { icon: Brain, title: 'Prévention des addictions', desc: 'Accompagnement psychologique et prévention. 30% de l\'abonnement Créateur reversé.', color: 'text-purple-400', border: 'border-purple-500/20 hover:border-purple-500/40', bg: 'bg-purple-500/5' },
                { icon: BookOpen, title: 'Éducation pour tous', desc: 'Soutien scolaire et accès à la culture pour les enfants défavorisés. 30% de l\'abonnement Visionnaire.', color: 'text-emerald-400', border: 'border-emerald-500/20 hover:border-emerald-500/40', bg: 'bg-emerald-500/5' },
              ].map((cause, i) => {
                const Icon = cause.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.6 }}
                    className={`card-premium relative overflow-hidden group ${cause.border} transition-all duration-500`}
                  >
                    <div className={`w-12 h-12 rounded-2xl ${cause.bg} border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ${cause.color}`}>
                      <Icon size={22} />
                    </div>
                    <h3 className="font-serif text-xl text-cream mb-3">{cause.title}</h3>
                    <p className="text-white/40 text-sm leading-relaxed">{cause.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* 2.5% Annual Commitment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mb-12 mx-auto max-w-2xl p-8 rounded-[2rem] bg-gradient-to-r from-gold/[0.06] to-transparent border border-gold/15 text-center"
            >
              <p className="font-serif text-3xl text-gold mb-2">2,5%</p>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold mb-4">des bénéfices annuels reversés</p>
              <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto">
                Chaque année, Milan Sky s&apos;engage à reverser 2,5% de ses bénéfices annuels aux associations et aux personnes dans le besoin. Un engagement personnel et inconditionnel.
              </p>
            </motion.div>

            <div className="text-center">
              <Link
                href="/engagement"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-gold/30 bg-gold/5 text-gold text-[10px] uppercase tracking-widest font-bold hover:bg-gold hover:text-dark transition-all duration-300"
              >
                <Heart size={14} /> Découvrir nos engagements <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 4: SOCIAL PROOF (TOUJOURS) */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-32 px-4 relative border-t border-white/[0.03]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-3">
              {t('testimonials.title')} <span className="gold-text italic">{t('testimonials.title_accent')}</span> {t('testimonials.title_end')}
            </h2>
            <p className="text-white/20 text-[10px] font-bold tracking-[0.3em] uppercase">{t('testimonials.subtitle')}</p>
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
                    <p className="text-gold/40 text-[9px] font-bold uppercase tracking-widest leading-normal">{t.tier}</p>
                  </div>
                </div>
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
            {t('cta.title')} <span className="gold-text italic block mt-2">{t('cta.title_accent')}</span> ?
          </h2>
          <p className="text-white/40 mb-12 text-sm uppercase tracking-widest font-bold">{t('cta.subtitle')}</p>
          <Link href="/register" className="inline-block relative w-full sm:w-auto px-4 sm:px-0">
            <div className="absolute -inset-1 bg-gold rounded-full opacity-30 blur-xl transition duration-500 hover:opacity-100 hidden sm:block" />
            <button className="relative px-12 sm:px-16 py-5 sm:py-6 bg-dark border border-gold/40 text-gold rounded-full font-bold tracking-[0.3em] uppercase text-[10px] sm:text-[11px] hover:bg-gold hover:text-dark active:scale-95 transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(201,168,76,0.2)] touch-manipulation min-h-[44px] w-full">
              <Crown size={16} /> {t('cta.button')}
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
            <Link href="/login" className="hover:text-gold transition-colors">{t('footer.login')}</Link>
            <Link href="/register" className="hover:text-gold transition-colors">{t('footer.register')}</Link>
            <span className="font-light opacity-50">© {new Date().getFullYear()} MILAN SKY</span>
          </div>
          <div className="flex items-center gap-3 text-gold/40 text-[9px] uppercase tracking-widest font-bold">
            <Shield size={14} className="opacity-70" /> {t('footer.luxury')}
          </div>
        </div>
      </footer>
    </main>
  );
}