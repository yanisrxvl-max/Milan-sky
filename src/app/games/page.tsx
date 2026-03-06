'use client';

import { useState } from 'react';
import { useThemeMode } from '@/context/ThemeModeContext';
import { useI18n } from '@/context/I18nContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Brain, Flame, ChevronRight, X, Coins } from 'lucide-react';
import toast from 'react-hot-toast';

// Import Games
import SocialRadar from '@/components/games/SocialRadar';
import GuessTheSecret from '@/components/games/GuessTheSecret';
import OrbitReflex from '@/components/games/OrbitReflex';
import ConfessionRoom from '@/components/games/ConfessionRoom';
import TruthOrDesire from '@/components/games/TruthOrDesire';
import ChemistryTest from '@/components/games/ChemistryTest';

const DAY_GAMES = [
    {
        id: 'social-radar',
        title: 'Social Radar',
        description: 'Évaluez votre profil psychologique et votre aisance sociale grâce à ce quiz de personnalité rapide.',
        type: 'Quiz de Personnalité',
        imageUrl: '/images/muses/milan1.jpg',
        component: SocialRadar
    },
    {
        id: 'guess-secret',
        title: 'Guess the Secret',
        description: 'Je te raconte 3 anecdotes. Démêle le vrai du faux pour prouver ton instinct.',
        type: 'Déduction',
        imageUrl: '/images/muses/milan5.jpg',
        component: GuessTheSecret
    },
    {
        id: 'orbit-reflex',
        title: 'Orbit Reflex',
        description: 'Test d\'agilité mentale et visuelle. Appuyez au moment parfait pour marquer le point.',
        type: 'Mini-Jeu Réflexe',
        imageUrl: '/images/muses/milan4.jpg',
        component: OrbitReflex
    }
];

const NIGHT_GAMES = [
    {
        id: 'confession-room',
        title: 'Confession Room',
        description: 'Avouez vos secrets inavouables dans un espace 100% anonyme. Sans aucun jugement.',
        type: 'Social Anonyme',
        imageUrl: '/images/muses/milan3.jpg',
        component: ConfessionRoom
    },
    {
        id: 'truth-or-desire',
        title: 'Truth or Desire',
        description: 'La version la plus sombre d\'Action ou Vérité. Il n\'y a pas d\'échappatoire.',
        type: 'Action / Vérité',
        imageUrl: '/images/muses/milan6.jpg',
        component: TruthOrDesire
    },
    {
        id: 'chemistry-test',
        title: 'Chemistry Test',
        description: 'Teste ta compatibilité avec moi. Jusqu\'où iras-tu ?',
        type: 'Test de Compatibilité',
        imageUrl: '/images/muses/milan8.jpg',
        component: ChemistryTest
    }
];

export default function GamesPage() {
    const { mode } = useThemeMode();
    const { t } = useI18n();
    const isDay = mode === 'DAY';

    const [activeGameId, setActiveGameId] = useState<string | null>(null);

    const GAMES = isDay ? DAY_GAMES : NIGHT_GAMES;
    const activeGame = GAMES.find(g => g.id === activeGameId);

    const GameComponent = activeGame?.component;

    const handleReward = () => {
        toast.custom((t) => (
            <div className={`bg-dark-500/90 border border-gold/30 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-xl shadow-2xl ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                    <Coins size={20} />
                </div>
                <div>
                    <p className="text-white/80 font-bold text-sm">Récompense obtenue !</p>
                    <p className="text-gold text-xs font-bold uppercase tracking-widest">+5 SkyCoins ajoutés</p>
                </div>
            </div>
        ));
        setActiveGameId(null);
    };

    return (
        <div className="min-h-screen bg-dark-500 pt-32 pb-24 transition-colors duration-700">
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.div
                        key={`badge-${mode}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] uppercase tracking-[0.3em] font-black mb-8 ${isDay ? 'bg-gold/10 border-gold/20 text-gold' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
                    >
                        {isDay ? <Brain size={12} /> : <Flame size={12} />}
                        {isDay ? 'L\'Institut Lumina' : 'Le Sanctuaire Noctua'}
                    </motion.div>

                    <motion.h1
                        key={`title-${mode}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-5xl md:text-7xl text-cream mb-6 tracking-tight"
                    >
                        {t('games.title')} <span className={`italic ${isDay ? 'gold-text' : 'text-red-500'}`}>{t('games.title_accent')}</span>
                    </motion.h1>

                    <motion.p
                        key={`desc-${mode}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white/40 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
                    >
                        {isDay ? t('games.subtitle_day') : t('games.subtitle_night')}
                    </motion.p>
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {GAMES.map((game, idx) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`group relative bg-white/[0.02] backdrop-blur-md rounded-[2.5rem] border overflow-hidden transition-all duration-500 ${isDay ? 'border-gold/10 hover:border-gold/30' : 'border-red-500/10 hover:border-red-500/30'}`}
                        >
                            <div className="aspect-video relative overflow-hidden bg-dark-500">
                                {/* Fallback background if image fails */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                    <Gamepad2 size={64} />
                                </div>
                                <img
                                    src={game.imageUrl}
                                    alt={game.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-dark-500/40 to-transparent z-20" />
                            </div>

                            <div className="p-8 relative z-30 -mt-16">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border backdrop-blur-md ${isDay ? 'bg-gold/10 text-gold/80 border-gold/20' : 'bg-red-500/10 text-red-500/80 border-red-500/20'}`}>
                                        {game.type}
                                    </span>
                                </div>

                                <h3 className="font-serif text-2xl text-cream mb-3">{game.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed mb-8 h-16">
                                    {game.description}
                                </p>

                                <button
                                    onClick={() => setActiveGameId(game.id)}
                                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all active:scale-95 ${isDay ? 'bg-gold text-dark hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]' : 'bg-red-500 text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]'}`}
                                >
                                    {t('games.play')}
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Game Modal */}
            <AnimatePresence>
                {activeGameId && GameComponent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 overflow-y-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-dark-500 border border-white/10 rounded-[3rem] p-6 sm:p-12 w-full max-w-2xl relative shadow-[0_0_100px_rgba(0,0,0,0.8)] my-8"
                        >
                            <button
                                onClick={() => setActiveGameId(null)}
                                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors z-50"
                            >
                                <X size={20} />
                            </button>

                            <GameComponent onComplete={handleReward} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
