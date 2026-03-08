'use client';

import { motion } from 'framer-motion';
import { Trophy, Zap, Crown, Star, Gift, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FidelityShowcase() {
    const steps = [
        {
            icon: <Zap size={24} className="text-gold" />,
            title: "Dépensez & Accumulez",
            desc: "Chaque SkyCoin acheté ou dépensé vous rapporte des SkyPoints. 1€ investi = 10 points de base.",
            color: "gold"
        },
        {
            icon: <Crown size={24} className="text-purple-400" />,
            title: "Le Multiplicateur",
            desc: "Votre abonnement booste vos gains jusqu'à x5. Le SkyClub transforme chaque achat en pluie de points.",
            color: "purple"
        },
        {
            icon: <Gift size={24} className="text-emerald-400" />,
            title: "Récompenses Élite",
            desc: "Échangez vos points contre des accès VIP, des contenus exclusifs ou des items physiques Milan Sky.",
            color: "emerald"
        }
    ];

    const tiers = [
        { name: "Voyeur", boost: "x1", color: "text-white/40", border: "border-white/5" },
        { name: "Initié", boost: "x2", color: "text-white/70", border: "border-white/10" },
        { name: "Privilège", boost: "x3", color: "text-gold", border: "border-gold/30", glow: "shadow-[0_0_20px_rgba(201,168,76,0.2)]" },
        { name: "SkyClub", boost: "x5", color: "text-purple-400", border: "border-purple-500/40", glow: "shadow-[0_0_30px_rgba(168,85,247,0.3)]" },
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Aesthetic */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] uppercase font-black tracking-[0.3em] mb-6"
                    >
                        <Star size={12} fill="currentColor" /> Club Excellence Milan
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif text-cream mb-6 tracking-tight"
                    >
                        Plus qu&apos;une dépense, <br />
                        <span className="gold-text italic">un investissement.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 max-w-2xl mx-auto text-sm md:text-base leading-relaxed"
                    >
                        Le programme SkyPoints récompense votre fidélité à chaque étape. Accumulez une influence digitale sans pareille et débloquez les portes des Archives Floues.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * idx }}
                            className="p-8 rounded-[2.5rem] bg-dark-400 border border-white/5 hover:border-white/10 transition-all group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-serif text-cream mb-4">{step.title}</h3>
                            <p className="text-white/30 text-sm leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Boost Showcase */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative p-1 rounded-[3rem] bg-gradient-to-br from-gold/30 via-gold/5 to-purple-500/30"
                >
                    <div className="bg-dark-600 rounded-[2.9rem] p-8 md:p-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="max-w-md">
                                <h4 className="text-2xl font-serif text-cream mb-4">Accélérez votre ascension</h4>
                                <p className="text-white/40 text-sm mb-8">
                                    Détenez les clés de l&apos;Empire. Votre rang d&apos;abonné définit la vitesse à laquelle vous débloquez vos récompenses.
                                </p>
                                <div className="flex items-center gap-3 text-gold text-xs font-bold uppercase tracking-widest">
                                    <ShieldCheck size={16} /> Système de Multiplicateur Actif
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                                {tiers.map((tier, idx) => (
                                    <div key={idx} className={`p-6 rounded-3xl bg-black/40 border ${tier.border} ${tier.glow} flex flex-col items-center justify-center text-center`}>
                                        <span className={`text-[10px] uppercase tracking-widest font-black mb-1 ${tier.color}`}>{tier.name}</span>
                                        <span className="text-2xl font-serif text-cream">{tier.boost}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-16 text-center">
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-medium flex items-center justify-center gap-4">
                        <span className="w-12 h-px bg-white/10" />
                        Exclusivement sur Milan Sky
                        <span className="w-12 h-px bg-white/10" />
                    </p>
                </div>
            </div>
        </section>
    );
}
