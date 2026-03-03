'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' },
  }),
};

export default function HomePage() {
  const { data: session } = useSession();

  const ctaHref = session ? '/dashboard' : '/register';
  const ctaLabel = session ? 'Accéder au dashboard' : 'Rejoindre l\'expérience';

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-dark z-10" />
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(/hero-bg.jpg)',
              filter: 'brightness(0.4) contrast(1.1)',
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-gold/80 font-sans text-sm md:text-base tracking-[0.3em] uppercase mb-6"
          >
            Collection exclusive
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-[1.1] mb-4 text-balance"
          >
            Bienvenue dans{' '}
            <span className="gold-text italic">l&apos;univers</span>
          </motion.h1>

          <motion.h2
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light gold-text mb-8"
          >
            Milan Sky
          </motion.h2>

          <motion.p
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-white/60 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            L&apos;accès ultime à l&apos;interdit, là où l&apos;exclusivité n&apos;a plus de limites.
          </motion.p>

          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href={ctaHref} className="btn-gold text-base sm:text-lg px-10 py-4">
              {ctaLabel}
            </Link>
            <Link href="/subscriptions" className="btn-outline text-base px-8 py-4">
              Voir les offres
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-gold rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8">
          {[
            { number: '500+', label: 'Membres actifs' },
            { number: '150+', label: 'Contenus exclusifs' },
            { number: '99%', label: 'Satisfaction' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-serif text-3xl md:text-5xl gold-text mb-2">{stat.number}</p>
              <p className="text-white/40 text-xs md:text-sm uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title mb-4">
              L&apos;expérience <span className="gold-text italic">premium</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Découvrez un univers conçu pour ceux qui n&apos;acceptent que l&apos;excellence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Contenu Exclusif',
                desc: 'Photos, vidéos et séries inédites réservées aux membres.',
                icon: '🔒',
              },
              {
                title: 'Accès Direct',
                desc: 'Chat privé et commandes personnalisées selon votre abonnement.',
                icon: '💬',
              },
              {
                title: 'SkyCoins',
                desc: 'Système de monnaie interne pour débloquer du contenu à la carte.',
                icon: '✦',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card-premium text-center group"
              >
                <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">
                  {feature.icon}
                </span>
                <h3 className="font-serif text-xl mb-3 text-cream">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Teaser */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="card-premium text-center py-16 px-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 shimmer pointer-events-none" />
            <h2 className="font-serif text-3xl md:text-4xl mb-4 relative z-10">
              Prêt à découvrir <span className="gold-text italic">l&apos;inaccessible</span> ?
            </h2>
            <p className="text-white/50 mb-8 max-w-lg mx-auto relative z-10">
              Rejoignez une communauté exclusive et accédez à du contenu que vous ne trouverez nulle part ailleurs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/subscriptions" className="btn-gold px-8 py-3">
                Voir les abonnements
              </Link>
              <span className="text-white/30 text-sm">À partir de 12,90€/mois</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-serif text-xl gold-text">Milan Sky</div>
          <div className="flex items-center gap-6 text-white/30 text-sm">
            <Link href="/subscriptions" className="hover:text-white/60 transition-colors">Abonnements</Link>
            <Link href="/skycoins" className="hover:text-white/60 transition-colors">SkyCoins</Link>
            <Link href="/library" className="hover:text-white/60 transition-colors">Bibliothèque</Link>
          </div>
          <p className="text-white/20 text-xs">&copy; {new Date().getFullYear()} Milan Sky. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
