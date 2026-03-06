'use client';

import { motion } from 'framer-motion';
import { Heart, Shield, Brain, BookOpen, ExternalLink, TrendingUp, Users, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useThemeMode } from '@/context/ThemeModeContext';
import { useI18n } from '@/context/I18nContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const CAUSES = [
    {
        icon: Shield,
        slug: 'lutte-exploitation',
        title: 'Lutte contre le trafic sexuel',
        subtitle: 'Protection des mineurs',
        description: 'Soutien direct aux associations qui combattent l\'exploitation sexuelle et protègent les enfants. Chaque abonnement Ambitieux reverse 30% à cette cause.',
        stats: '30%',
        plan: 'Abonnement AMBITIEUX',
        color: 'from-blue-500/20 to-blue-900/20',
        border: 'border-blue-500/20 hover:border-blue-500/40',
        accent: 'text-blue-400',
        links: [
            { label: 'ECPAT France', url: 'https://ecpat-france.fr' },
            { label: 'Association contre la Prostitution des Enfants', url: 'https://acpe-asso.org' },
        ],
    },
    {
        icon: Brain,
        slug: 'prevention-addictions',
        title: 'Prévention des addictions',
        subtitle: 'Accompagnement psychologique',
        description: 'Financement de la prévention des addictions liées au contenu adulte, du dépistage et de l\'accompagnement psychologique pour les personnes dépendantes.',
        stats: '30%',
        plan: 'Abonnement CRÉATEUR',
        color: 'from-purple-500/20 to-purple-900/20',
        border: 'border-purple-500/20 hover:border-purple-500/40',
        accent: 'text-purple-400',
        links: [
            { label: 'SOS Amitié', url: 'https://www.sos-amitie.com' },
            { label: 'Fil Santé Jeunes', url: 'https://www.filsantejeunes.com' },
        ],
    },
    {
        icon: BookOpen,
        slug: 'education-pour-tous',
        title: 'Éducation pour tous',
        subtitle: 'Enfants défavorisés en France',
        description: 'Contribution directe à l\'éducation des enfants défavorisés : fournitures scolaires, soutien scolaire et accès à la culture. Parce que l\'avenir se construit à l\'école.',
        stats: '30%',
        plan: 'Abonnement VISIONNAIRE',
        color: 'from-emerald-500/20 to-emerald-900/20',
        border: 'border-emerald-500/20 hover:border-emerald-500/40',
        accent: 'text-emerald-400',
        links: [
            { label: 'Secours Populaire', url: 'https://www.secourspopulaire.fr' },
            { label: 'Les Restos du Cœur', url: 'https://www.restosducoeur.org' },
        ],
    },
];

function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="text-center"
        >
            <p className="font-serif text-4xl md:text-5xl text-gold mb-2">{value}</p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">{label}</p>
        </motion.div>
    );
}

export default function EngagementPage() {
    const { mode } = useThemeMode();
    const { t } = useI18n();
    const router = useRouter();

    // Redirect to private-requests if in Night mode
    useEffect(() => {
        if (mode === 'NIGHT') {
            router.push('/private-requests');
        }
    }, [mode, router]);

    if (mode === 'NIGHT') return null;

    return (
        <main className="relative w-full bg-dark-500 overflow-hidden min-h-screen">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-dark-500/95" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.08),transparent_50%)]" />
            </div>

            {/* ── HERO ── */}
            <section className="relative z-10 pt-32 pb-20 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold/10 border border-gold/20 mb-8"
                >
                    <Heart size={14} className="text-gold" />
                    <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold">{t('engagement.tag')}</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="font-serif text-5xl md:text-7xl text-cream tracking-tight mb-6"
                >
                    {t('engagement.title')} <br className="hidden md:block" />
                    <span className="gold-text italic">{t('engagement.title_accent')}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/40 max-w-2xl mx-auto text-sm leading-relaxed mb-16"
                >
                    {t('engagement.desc')}
                </motion.p>

                {/* Stats */}
                <div className="flex items-center justify-center gap-12 md:gap-20">
                    <AnimatedStat value="3" label={t('engagement.causes_supported')} delay={0.2} />
                    <div className="w-px h-12 bg-white/10" />
                    <AnimatedStat value="30%" label={t('engagement.donated_per_sub')} delay={0.4} />
                    <div className="w-px h-12 bg-white/10 hidden md:block" />
                    <div className="hidden md:block">
                        <AnimatedStat value="100%" label={t('engagement.transparency')} delay={0.6} />
                    </div>
                </div>
            </section>

            {/* ── CAUSES ── */}
            <section className="relative z-10 max-w-6xl mx-auto px-4 py-20 space-y-12">
                <div className="text-center mb-16">
                    <h2 className="text-sm uppercase tracking-[0.4em] font-black text-white/40 flex items-center justify-center gap-3">
                        <Target size={16} className="text-gold" /> {t('engagement.causes_title')}
                    </h2>
                </div>

                {CAUSES.map((cause, i) => {
                    const Icon = cause.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative rounded-[2.5rem] border ${cause.border} bg-white/[0.02] backdrop-blur-md overflow-hidden transition-all duration-500 group`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${cause.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                            <div className="relative z-10 p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-center">
                                <div>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${cause.accent}`}>
                                            <Icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-2xl text-cream">{cause.title}</h3>
                                            <p className="text-white/30 text-xs uppercase tracking-widest font-bold">{cause.subtitle}</p>
                                        </div>
                                    </div>

                                    <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xl">{cause.description}</p>

                                    {/* Progress bar */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-[9px] uppercase tracking-widest font-bold mb-2">
                                            <span className="text-white/30">{t('engagement.quarterly_goal')}</span>
                                            <span className={cause.accent}>{t('engagement.in_progress')}</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${30 + i * 20}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.5, delay: 0.3 }}
                                                className={`h-full rounded-full ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-purple-500' : 'bg-emerald-500'
                                                    }`}
                                            />
                                        </div>
                                        <p className="text-[9px] text-white/20 mt-2">Les montants exacts seront publiés dans les rapports trimestriels</p>
                                    </div>

                                    {/* Association Links */}
                                    <div className="flex flex-wrap gap-3">
                                        {cause.links.map((link, j) => (
                                            <a
                                                key={j}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-gold/30 hover:bg-white/10 transition-all text-[10px] uppercase tracking-widest font-bold text-white/50 hover:text-white"
                                            >
                                                <ExternalLink size={12} /> {link.label}
                                            </a>
                                        ))}
                                    </div>

                                    {/* Lien vers la page immersive */}
                                    <Link
                                        href={`/engagement/${cause.slug}`}
                                        className={`inline-flex items-center gap-2 mt-4 ${cause.accent} text-[10px] uppercase tracking-widest font-bold hover:gap-4 transition-all`}
                                    >
                                        Découvrir cette cause <ArrowRight size={14} />
                                    </Link>
                                </div>

                                {/* Big stat */}
                                <div className="text-center md:text-right">
                                    <div className="inline-flex flex-col items-center bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10">
                                        <div className={`mb-3 ${cause.accent}`}><Icon size={36} /></div>
                                        <span className={`font-serif text-4xl font-bold ${cause.accent}`}>{cause.stats}</span>
                                        <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold mt-2">{t('subs.donated')}</span>
                                        <div className="h-px w-12 bg-white/10 my-3" />
                                        <span className="text-[8px] uppercase tracking-widest text-white/20 font-bold">{cause.plan}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </section>

            {/* ── ENGAGEMENT 2,5% ── */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center p-12 rounded-[2.5rem] bg-gradient-to-br from-gold/[0.08] to-dark-200/30 border border-gold/20 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.06),transparent_60%)] pointer-events-none" />
                    <div className="relative z-10">
                        <Heart className="text-gold mx-auto mb-4" size={28} />
                        <p className="font-serif text-5xl md:text-6xl text-gold mb-3">2,5%</p>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold mb-6">
                            des bénéfices annuels reversés chaque année
                        </p>
                        <p className="text-white/50 text-sm leading-relaxed max-w-lg mx-auto mb-8">
                            Au-delà des causes spécifiques soutenues par chaque abonnement, Milan Sky s&apos;engage à reverser
                            chaque année <span className="text-gold font-bold">2,5% de ses bénéfices annuels</span> aux
                            associations et aux personnes dans le besoin. C&apos;est un engagement personnel, inconditionnel et permanent.
                        </p>
                        <div className="flex items-center justify-center gap-8">
                            <div className="text-center">
                                <p className="font-serif text-xl text-cream">Annuel</p>
                                <p className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Fréquence</p>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="text-center">
                                <p className="font-serif text-xl text-cream">Inconditionnel</p>
                                <p className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Type</p>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div className="text-center">
                                <p className="font-serif text-xl text-cream">Permanent</p>
                                <p className="text-[8px] uppercase tracking-widest text-white/30 font-bold">Durée</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── TRANSPARENCE ── */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center p-12 rounded-[2.5rem] bg-white/[0.02] border border-gold/10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <TrendingUp className="text-gold mx-auto mb-6" size={36} />
                        <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4">{t('engagement.total_transparency')}</h2>
                        <p className="text-white/40 text-sm leading-relaxed max-w-xl mx-auto mb-10">
                            {t('engagement.transparency_desc')}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="font-serif text-2xl text-gold mb-1">Q1</p>
                                <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{t('engagement.next_report')}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="font-serif text-2xl text-cream mb-1">3</p>
                                <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{t('engagement.associations')}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="font-serif text-2xl text-cream mb-1">30%</p>
                                <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{t('engagement.revenue')}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <p className="font-serif text-2xl text-emerald-400 mb-1">✓</p>
                                <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{t('engagement.certified')}</p>
                            </div>
                        </div>

                        {/* Placeholder for future proofs */}
                        <div className="p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                            <Users className="text-white/20 mx-auto mb-3" size={24} />
                            <p className="text-white/20 text-xs uppercase tracking-widest font-bold">{t('engagement.proof_space')}</p>
                            <p className="text-white/15 text-[10px] mt-1">{t('engagement.proof_desc')}</p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── CTA ── */}
            <section className="relative z-10 max-w-4xl mx-auto px-4 pb-32 text-center">
                <h2 className="font-serif text-3xl md:text-4xl text-cream mb-4">
                    {t('engagement.cta_title')} <span className="gold-text italic">{t('engagement.cta_accent')}</span>
                </h2>
                <p className="text-white/40 text-sm mb-10 max-w-lg mx-auto">
                    {t('engagement.cta_desc')}
                </p>
                <Link href="/subscriptions" className="btn-gold !py-4 !px-10 text-xs uppercase tracking-widest font-bold">
                    {t('engagement.see_subs')}
                </Link>
            </section>
        </main>
    );
}
