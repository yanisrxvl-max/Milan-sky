'use client';

import { motion } from 'framer-motion';
import { Crown, Sparkles, Heart, Zap, Shield, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const SECTIONS = [
    {
        title: "L'Origine du Projet",
        content: "Milan Sky n'est pas qu'une plateforme, c'est une vision. Dans un monde saturé de contenu éphémère et impersonnel, j'ai voulu créer un sanctuaire. Un lieu où l'exclusivité rencontre l'intimité, et où la technologie s'efface devant l'émotion.",
        icon: <Sparkles className="text-gold" size={32} />
    },
    {
        title: "Pourquoi l'Interdit ?",
        content: "L'interdit n'est pas une provocation, c'est une invitation. C'est ce qui se cache derrière le voile, ce qui n'est réservé qu'à un cercle d'initiés. Chaque photo, chaque vidéo, chaque message est une pièce d'un puzzle que seuls mes membres peuvent assembler.",
        icon: <Shield className="text-gold" size={32} />
    },
    {
        title: "L'Intelligence Humaine",
        content: "Ici, l'IA ne remplace pas Milan, elle l'augmente. Elle me permet d'être présente pour vous 24h/24, de répondre à vos désirs les plus secrets tout en gardant cette étincelle d'authenticité que seule une relation humaine peut offrir.",
        icon: <Zap className="text-gold" size={32} />
    },
    {
        title: "L'Univers Sky",
        content: "Rejoindre Milan Sky, c'est entrer dans une dimension parallèle. C'est l'esthétique du luxe obscur, le frisson de la découverte, et le privilège de voir ce que le reste du monde ne verra jamais. Bienvenue chez moi.",
        icon: <Crown className="text-gold" size={32} />
    }
];

export default function StoryPage() {
    return (
        <main className="relative w-full bg-dark-500 overflow-hidden pt-24">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.1)_0%,transparent_70%)]" />
                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="text-center mb-32"
                    >
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-serif text-5xl md:text-8xl lg:text-9xl text-cream tracking-tight whitespace-nowrap overflow-visible leading-tight"
                        >
                            Qui est <span className="gold-text italic">Milan Sky</span> ?
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-red-500 text-[10px] uppercase tracking-[0.5em] font-bold mt-4"
                        >
                            L&apos;ÂME DERRIÈRE L&apos;IMAGE
                        </motion.p>
                    </motion.div>
                </div>

                {/* Animated Background Elements */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full"
                />
            </section>

            {/* Narrative Sections */}
            <div className="max-w-6xl mx-auto px-4 pb-40 space-y-40">
                {SECTIONS.map((section, i) => (
                    <motion.section
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-32`}
                    >
                        <div className="flex-1 space-y-8">
                            <div className="w-16 h-16 rounded-2xl bg-gold/5 border border-gold/10 flex items-center justify-center">
                                {section.icon}
                            </div>
                            <h2 className="text-3xl md:text-5xl font-serif text-cream tracking-tight leading-tight">
                                {section.title}
                            </h2>
                            <p className="text-white/50 text-lg leading-relaxed font-light italic border-l-2 border-gold/20 pl-8">
                                &quot;{section.content}&quot;
                            </p>
                        </div>
                        <div className="flex-1 relative aspect-[4/5] w-full max-w-md">
                            <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent rounded-3xl" />
                            <div className="absolute inset-0 border border-white/5 rounded-3xl" />
                            <div className="w-full h-full bg-dark-400 rounded-3xl overflow-hidden flex items-center justify-center text-white/5">
                                <span className="text-[100px] font-serif italic select-none">SKY</span>
                            </div>
                        </div>
                    </motion.section>
                ))}
            </div>

            {/* Final Invitation */}
            <section className="relative py-40 px-4 bg-dark-400/30 border-t border-white/[0.03]">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="space-y-12"
                    >
                        <h2 className="font-serif text-4xl md:text-6xl text-cream leading-tight">
                            Écrivons la suite <span className="gold-text italic block mt-2">ensemble</span>.
                        </h2>
                        <p className="text-white/30 text-lg font-light tracking-wide max-w-xl mx-auto">
                            L&apos;expérience est à portée de clic. Serez-vous du côté de ceux qui découvrent, ou de ceux qui attendent ?
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                            <Link href="/register" className="group relative w-full sm:w-auto">
                                <div className="absolute -inset-1 bg-gold rounded-full opacity-30 blur-lg group-hover:opacity-100 transition duration-500" />
                                <button className="relative w-full sm:w-auto px-12 py-5 bg-dark-400 text-cream rounded-full font-bold tracking-[0.2em] uppercase text-sm border border-gold/30 hover:bg-dark-300 transition-all flex items-center justify-center gap-3">
                                    Rejoindre Milan Sky <ChevronRight size={18} className="text-gold" />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
