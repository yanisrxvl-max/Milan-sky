'use client';

import { motion } from 'framer-motion';
import { Gamepad2, Target, Sparkles, Zap, ChevronRight, Lock } from 'lucide-react';
import GameCard from '@/components/games/GameCard';

const GAMES = [
    {
        id: 'signal',
        name: 'Signal de Milan',
        description: 'Chaque jour, Milan envoie un signal mystérieux dans la Sphère. Serez-vous capable de le décrypter ?',
        difficulty: 'Facile',
        rewards: ['SkyCoins', 'Contenu secret']
    },
    {
        id: 'orbital',
        name: 'Orbital',
        description: 'Synchronisez votre mouvement avec l\'orbite parfaite. Un jeu de précision et de timing pour s\'approcher d\'elle.',
        difficulty: 'Moyen',
        rewards: ['Score', 'Classement exclusif']
    },
    {
        id: 'confessions',
        name: 'Confessions',
        description: 'Un jeu narratif subtil où vos choix influencent directement votre relation et votre intimité avec Milan.',
        difficulty: 'Difficile',
        rewards: ['Expériences cachées', 'Messages audios']
    }
];

export default function GamesPage() {
    return (
        <main className="min-h-screen bg-dark pt-24 pb-40">
            {/* Section 1 - Hero */}
            <section className="relative px-4 max-w-5xl mx-auto text-center mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(201,168,76,0.2)]">
                        <Gamepad2 size={32} className="text-gold" />
                    </div>
                    <h1 className="font-serif text-5xl md:text-7xl text-cream tracking-tight leading-tight mb-8">
                        Les Jeux de la <span className="gold-text italic">Sphère</span>
                    </h1>
                    <div className="max-w-2xl mx-auto space-y-4">
                        <p className="text-white/60 text-lg font-light leading-relaxed">
                            Dans l'univers Milan Sky, chaque interaction peut devenir un jeu.
                        </p>
                        <p className="text-white/60 text-lg font-light leading-relaxed">
                            Les Jeux de la Sphère sont de petites expériences ludiques conçues pour explorer cet univers, gagner des récompenses et découvrir de nouvelles facettes de Milan.
                        </p>
                        <p className="text-white/60 text-lg font-light leading-relaxed pt-4">
                            Certains jeux testent votre intuition.<br />
                            D'autres votre curiosité.<br />
                            <span className="text-gold/80 italic">Et parfois... ils révèlent des secrets.</span>
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Section 2 - Présentation des jeux */}
            <section className="relative px-4 max-w-6xl mx-auto mb-32 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {GAMES.map((game, i) => (
                        <GameCard key={game.id} {...game} index={i} />
                    ))}
                </div>
            </section>

            {/* Section 3 - Explication */}
            <section className="relative px-4 max-w-4xl mx-auto mb-32">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-dark-400/50 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 md:p-16 text-center"
                >
                    <h2 className="font-serif text-3xl md:text-5xl text-cream mb-8">
                        Pourquoi des <span className="gold-text italic">jeux</span> ?
                    </h2>
                    <p className="text-white/60 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10">
                        Les Jeux de la Sphère ne sont pas seulement des divertissements. Ils font partie intégrante de l'univers Milan Sky. Chaque jeu est une manière différente d'explorer cet espace.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                        <div className="flex flex-col items-center gap-3">
                            <Zap size={24} className="text-white/30" />
                            <span className="text-xs uppercase tracking-widest text-white/50">Intuition</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <Sparkles size={24} className="text-white/30" />
                            <span className="text-xs uppercase tracking-widest text-white/50">Curiosité</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <Target size={24} className="text-white/30" />
                            <span className="text-xs uppercase tracking-widest text-white/50">Stratégie</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <Lock size={24} className="text-gold/50" />
                            <span className="text-xs uppercase tracking-widest text-gold/80">Connexion</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Section 4 - Futur */}
            <section className="relative px-4 max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <h2 className="font-serif text-2xl md:text-4xl text-cream">De nouveaux jeux arrivent.</h2>
                    <p className="text-white/40 font-light leading-relaxed max-w-xl mx-auto">
                        L'univers Milan Sky évolue constamment. De nouveaux jeux apparaîtront dans la Sphère au fil du temps. Chaque mise à jour peut révéler une nouvelle expérience. Restez attentif au signal.
                    </p>
                </motion.div>
            </section>
        </main>
    );
}
