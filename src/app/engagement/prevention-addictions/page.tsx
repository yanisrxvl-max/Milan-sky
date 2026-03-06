'use client';

import { Brain, ExternalLink, Heart, AlertTriangle, MessageCircle, ShieldCheck, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import CauseHero from '@/components/engagement/CauseHero';
import SectionReveal from '@/components/engagement/SectionReveal';
import InfoTooltip from '@/components/engagement/InfoTooltip';
import { motion } from 'framer-motion';

const STATS = [
    { value: '20M+', label: 'personnes touchées par les addictions en France', icon: AlertTriangle },
    { value: '70%', label: 'souffrent en silence sans demander d\'aide', icon: MessageCircle },
    { value: '1/4', label: 'des jeunes adultes concernés', icon: Brain },
    { value: '30%', label: 'de l\'abonnement Créateur reversé', icon: Heart },
];

export default function PreventionAddictionsPage() {
    return (
        <main className="relative w-full bg-dark-500 overflow-hidden min-h-screen">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-dark-500/95" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.06),transparent_50%)]" />
            </div>

            <CauseHero
                icon={Brain}
                title="Prévention des addictions et accompagnement psychologique"
                subtitle="Les addictions ne sont pas une question de volonté. Elles méritent un accompagnement réel."
                accentColor="text-purple-400"
                gradientFrom="from-purple-500/20"
                borderColor="border-purple-500/30"
            />

            {/* ── COMPRENDRE ── */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 py-16">
                <SectionReveal>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-purple-400/60 font-bold mb-4">Comprendre le problème</p>
                    <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">Les addictions modernes</h2>
                </SectionReveal>

                <SectionReveal delay={0.1}>
                    <p className="text-white/50 text-base leading-[1.9] mb-8">
                        Le monde numérique et les transformations sociales ont profondément changé notre rapport au plaisir, à la consommation et aux relations.
                    </p>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                    <p className="text-white/50 text-base leading-[1.9] mb-8">
                        Certaines pratiques peuvent devenir problématiques lorsqu&apos;elles prennent toute la place dans la vie d&apos;une personne.
                    </p>
                </SectionReveal>

                <SectionReveal delay={0.3}>
                    <p className="text-white/50 text-base leading-[1.9] mb-8">
                        Les <InfoTooltip term="addictions" definition="Dépendance physique ou psychologique à une substance ou un comportement, caractérisée par une perte de contrôle et une poursuite malgré les conséquences négatives." /> peuvent concerner :
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        {[
                            'Les substances',
                            'Certains comportements',
                            'Certaines pratiques numériques ou sexuelles'
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-5 rounded-2xl bg-white/[0.02] border border-purple-500/10 text-center"
                            >
                                <span className="text-white/50 text-sm">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </SectionReveal>

                <SectionReveal delay={0.4}>
                    <p className="text-white/50 text-base leading-[1.9]">
                        Ces situations ne sont pas seulement une question de volonté. Elles sont souvent liées à des <InfoTooltip term="mécanismes complexes" definition="Les addictions impliquent souvent des facteurs neurobiologiques, psychologiques et sociaux : circuits de récompense du cerveau, traumatismes, isolement social." /> mêlant stress, solitude, anxiété ou traumatismes.
                    </p>
                </SectionReveal>
            </section>

            {/* ── RÉALITÉ ── */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 py-16">
                <SectionReveal>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-purple-400/60 font-bold mb-4">La réalité aujourd&apos;hui</p>
                    <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">L&apos;importance de l&apos;accompagnement</h2>
                </SectionReveal>

                <SectionReveal delay={0.1}>
                    <p className="text-white/50 text-base leading-[1.9] mb-8">
                        Sortir d&apos;une <InfoTooltip term="dépendance" definition="État dans lequel une personne ne peut plus se passer d'une substance ou d'un comportement, malgré ses conséquences néfastes sur sa santé ou sa vie sociale." /> ne se résume pas à arrêter un comportement. Cela nécessite souvent :
                    </p>
                    <div className="space-y-4 mb-8">
                        {[
                            { icon: Brain, text: 'Un accompagnement psychologique' },
                            { icon: ShieldCheck, text: 'Un environnement sécurisé' },
                            { icon: Heart, text: 'Un soutien social' },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/20 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                        <Icon size={18} />
                                    </div>
                                    <span className="text-white/60 text-sm font-medium">{item.text}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                    <p className="text-white/50 text-base leading-[1.9]">
                        De nombreuses associations travaillent pour offrir cet accompagnement : écoute, groupes de soutien, suivi thérapeutique, programmes de réhabilitation.
                    </p>
                </SectionReveal>
            </section>

            {/* ── STATISTIQUES ── */}
            <section className="relative z-10 max-w-5xl mx-auto px-4 py-16">
                <SectionReveal>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-purple-400/60 font-bold mb-4 text-center">Statistiques clés</p>
                </SectionReveal>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {STATS.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12, duration: 0.6 }}
                                className="text-center p-6 rounded-2xl bg-white/[0.02] border border-purple-500/10 group hover:border-purple-500/30 transition-all"
                            >
                                <Icon size={20} className="text-purple-400/40 mx-auto mb-3 group-hover:text-purple-400 transition-colors" />
                                <p className="font-serif text-2xl md:text-3xl text-cream mb-2">{stat.value}</p>
                                <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold leading-relaxed">{stat.label}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ── TABOU ── */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 py-16">
                <SectionReveal>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-purple-400/60 font-bold mb-4">Pourquoi agir</p>
                    <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">Un sujet encore trop tabou</h2>
                </SectionReveal>

                <SectionReveal delay={0.1}>
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-purple-500/[0.06] to-transparent border border-purple-500/15 mb-8">
                        <Lightbulb size={24} className="text-purple-400 mb-4" />
                        <p className="text-white/60 text-base leading-[1.9] italic">
                            Beaucoup de personnes souffrent en silence par peur du jugement. Briser ce tabou est essentiel. Reconnaître qu&apos;une difficulté existe est souvent la première étape vers la reconstruction.
                        </p>
                    </div>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                    <p className="text-white/50 text-base leading-[1.9]">
                        Soutenir ces initiatives permet de financer des structures qui aident concrètement des personnes à retrouver un équilibre de vie.
                    </p>
                </SectionReveal>
            </section>

            {/* ── ASSOCIATIONS ── */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 py-16">
                <SectionReveal>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-purple-400/60 font-bold mb-4">Associations soutenues</p>
                    <h2 className="font-serif text-3xl text-cream mb-8">Nos partenaires</h2>
                </SectionReveal>

                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        { name: 'SOS Amitié', url: 'https://www.sos-amitie.com', desc: 'Écoute anonyme et bienveillante pour les personnes en détresse psychologique.' },
                        { name: 'Fil Santé Jeunes', url: 'https://www.filsantejeunes.com', desc: 'Service d\'écoute et d\'information pour les jeunes de 12 à 25 ans.' },
                    ].map((assoc, i) => (
                        <SectionReveal key={i} delay={i * 0.1}>
                            <a
                                href={assoc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-6 rounded-2xl bg-white/[0.02] border border-purple-500/10 hover:border-purple-500/30 transition-all group"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <ExternalLink size={14} className="text-purple-400/40 group-hover:text-purple-400 transition-colors" />
                                    <h3 className="font-serif text-lg text-cream group-hover:text-purple-400 transition-colors">{assoc.name}</h3>
                                </div>
                                <p className="text-white/40 text-sm leading-relaxed">{assoc.desc}</p>
                            </a>
                        </SectionReveal>
                    ))}
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
                <SectionReveal>
                    <Brain size={32} className="text-purple-400 mx-auto mb-6" />
                    <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4">
                        Agir avec <span className="text-purple-400 italic">moi</span>
                    </h2>
                    <p className="text-white/40 text-sm mb-10 max-w-lg mx-auto">
                        30% de chaque abonnement Créateur est reversé à la prévention des addictions. S&apos;abonner, c&apos;est aussi accompagner.
                    </p>
                    <Link href="/subscriptions" className="btn-gold !py-4 !px-10 text-xs uppercase tracking-widest font-bold">
                        Voir les abonnements
                    </Link>
                </SectionReveal>
            </section>
        </main>
    );
}
