'use client';

import { BookOpen, ExternalLink, Heart, GraduationCap, Users, Palette, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import CauseHero from '@/components/engagement/CauseHero';
import SectionReveal from '@/components/engagement/SectionReveal';
import InfoTooltip from '@/components/engagement/InfoTooltip';
import { motion } from 'framer-motion';

const STATS = [
    { value: '3M', label: 'enfants en situation de pauvreté en France', icon: Users },
    { value: '1/5', label: 'des enfants n\'ont pas accès au soutien scolaire', icon: BookOpen },
    { value: '40%', label: 'des inégalités se construisent avant 6 ans', icon: GraduationCap },
    { value: '50%', label: 'de l\'abonnement Visionnaire reversé', icon: Heart },
];

export default function EducationPourTousPage() {
    return (
        <main className="relative w-full bg-dark-500 overflow-hidden min-h-screen">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-dark-500/95" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.06),transparent_50%)]" />
            </div>

            <CauseHero
                icon={BookOpen}
                title="Éducation et accès à la culture pour tous"
                subtitle="L'éducation reste le levier le plus puissant pour transformer une vie."
                accentColor="text-emerald-400"
                gradientFrom="from-emerald-500/20"
                borderColor="border-emerald-500/30"
            />

            {/* ── COMPRENDRE ── */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 py-16">
                <SectionReveal>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-emerald-400/60 font-bold mb-4">Comprendre le problème</p>
                    <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">L&apos;éducation reste la base de l&apos;égalité</h2>
                </SectionReveal>

                <SectionReveal delay={0.1}>
                    <p className="text-white/50 text-base leading-[1.9] mb-8">
                        Dans toutes les sociétés, l&apos;accès à l&apos;éducation reste l&apos;un des facteurs les plus puissants pour transformer des vies.
                    </p>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                    <p className="text-white/50 text-base leading-[1.9] mb-8">
                        Pourtant, même dans des pays développés, certaines familles rencontrent encore de grandes difficultés pour offrir à leurs enfants des conditions d&apos;apprentissage équitables.
                    </p>
                </SectionReveal>

                <SectionReveal delay={0.3}>
                    <p className="text-white/50 text-base leading-[1.9] mb-8">
                        Le manque de ressources peut concerner :
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        {[
                            { icon: BookOpen, text: 'Les fournitures scolaires' },
                            { icon: Palette, text: 'L\'accès aux activités culturelles' },
                            { icon: GraduationCap, text: 'Le soutien éducatif' },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-5 rounded-2xl bg-white/[0.02] border border-emerald-500/10 text-center flex flex-col items-center gap-3"
                                >
                                    <Icon size={20} className="text-emerald-400/50" />
                                    <span className="text-white/50 text-sm">{item.text}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </SectionReveal>

                <SectionReveal delay={0.4}>
                    <p className="text-white/50 text-base leading-[1.9]">
                        Ces <InfoTooltip term="inégalités" definition="Différences dans l'accès aux ressources éducatives et culturelles, qui impactent durablement les parcours scolaires et professionnels des enfants." /> peuvent créer un écart durable dans les parcours scolaires et professionnels.
                    </p>
                </SectionReveal>
            </section>

            {/* ── STATISTIQUES ── */}
            <section className="relative z-10 max-w-5xl mx-auto px-4 py-16">
                <SectionReveal>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-emerald-400/60 font-bold mb-4 text-center">Statistiques clés</p>
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
                                className="text-center p-6 rounded-2xl bg-white/[0.02] border border-emerald-500/10 group hover:border-emerald-500/30 transition-all"
                            >
                                <Icon size={20} className="text-emerald-400/40 mx-auto mb-3 group-hover:text-emerald-400 transition-colors" />
                                <p className="font-serif text-2xl md:text-3xl text-cream mb-2">{stat.value}</p>
                                <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold leading-relaxed">{stat.label}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ── POURQUOI AGIR ── */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 py-16">
                <SectionReveal>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-emerald-400/60 font-bold mb-4">Pourquoi agir</p>
                    <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">Soutenir les enfants aujourd&apos;hui</h2>
                </SectionReveal>

                <SectionReveal delay={0.1}>
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-500/[0.06] to-transparent border border-emerald-500/15 mb-8">
                        <Lightbulb size={24} className="text-emerald-400 mb-4" />
                        <p className="text-white/60 text-base leading-[1.9] italic">
                            Aider les enfants à accéder à l&apos;éducation, c&apos;est investir dans l&apos;avenir. C&apos;est donner à chaque enfant les moyens de construire sa propre vie avec dignité.
                        </p>
                    </div>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                    <p className="text-white/50 text-base leading-[1.9] mb-8">
                        Les associations engagées dans ce domaine agissent notamment pour :
                    </p>
                    <div className="space-y-4 mb-8">
                        {[
                            { icon: BookOpen, text: 'Fournir du matériel scolaire' },
                            { icon: GraduationCap, text: 'Proposer du soutien éducatif' },
                            { icon: Palette, text: 'Faciliter l\'accès à la culture' },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                                        <Icon size={18} />
                                    </div>
                                    <span className="text-white/60 text-sm font-medium">{item.text}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </SectionReveal>

                <SectionReveal delay={0.3}>
                    <p className="text-white/50 text-base leading-[1.9]">
                        Ces initiatives permettent de donner à chaque enfant les moyens de construire son avenir.
                    </p>
                </SectionReveal>
            </section>

            {/* ── ASSOCIATIONS ── */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 py-16">
                <SectionReveal>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-emerald-400/60 font-bold mb-4">Associations soutenues</p>
                    <h2 className="font-serif text-3xl text-cream mb-8">Nos partenaires</h2>
                </SectionReveal>

                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        { name: 'Secours Populaire', url: 'https://www.secourspopulaire.fr', desc: 'Association qui lutte contre la pauvreté et l\'exclusion en France et dans le monde.' },
                        { name: 'Les Restos du Cœur', url: 'https://www.restosducoeur.org', desc: 'Aide alimentaire et accès à la culture, au logement et à l\'éducation pour les plus démunis.' },
                    ].map((assoc, i) => (
                        <SectionReveal key={i} delay={i * 0.1}>
                            <a
                                href={assoc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-6 rounded-2xl bg-white/[0.02] border border-emerald-500/10 hover:border-emerald-500/30 transition-all group"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <ExternalLink size={14} className="text-emerald-400/40 group-hover:text-emerald-400 transition-colors" />
                                    <h3 className="font-serif text-lg text-cream group-hover:text-emerald-400 transition-colors">{assoc.name}</h3>
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
                    <BookOpen size={32} className="text-emerald-400 mx-auto mb-6" />
                    <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4">
                        Agir avec <span className="text-emerald-400 italic">Milan Sky</span>
                    </h2>
                    <p className="text-white/40 text-sm mb-10 max-w-lg mx-auto">
                        50% de chaque abonnement Visionnaire est reversé à l&apos;éducation des enfants. S&apos;abonner, c&apos;est aussi construire l&apos;avenir.
                    </p>
                    <Link href="/subscriptions" className="btn-gold !py-4 !px-10 text-xs uppercase tracking-widest font-bold">
                        Voir les abonnements
                    </Link>
                </SectionReveal>
            </section>
        </main>
    );
}
