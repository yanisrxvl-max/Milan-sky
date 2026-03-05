'use client';

import { useState, useEffect } from 'react';
import { useThemeMode } from '@/context/ThemeModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Sparkles, Brain, Flame, ChevronRight, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Game {
    id: string;
    title: string;
    description: string;
    type: string;
    imageUrl: string;
    mode: 'LUMINA' | 'NOCTUA';
}

export default function GamesPage() {
    const { mode } = useThemeMode();
    const isDay = mode === 'DAY';
    const currentThemeMode = isDay ? 'LUMINA' : 'NOCTUA';

    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchGames();
    }, [mode]);

    async function fetchGames() {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/games?mode=${currentThemeMode}`);
            if (res.ok) {
                const data = await res.json();
                setGames(data.games || []);
            }
        } catch (error) {
            toast.error('Erreur de chargement des jeux');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-milan-bg pt-32 pb-24 transition-colors duration-700">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-milan-accent/10 border border-milan-accent/20 text-milan-accent text-[10px] uppercase tracking-[0.3em] font-black mb-8"
                    >
                        {isDay ? <Brain size={12} /> : <Flame size={12} />}
                        {isDay ? 'L\'Institut Lumina' : 'Le Sanctuaire Noctua'}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-5xl md:text-7xl text-milan-text mb-6 tracking-tight"
                    >
                        Les Jeux de <span className="italic text-milan-accent">la Frange</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-milan-text/40 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
                    >
                        {isDay
                            ? "Affûtez votre esprit et votre vision du monde avec nos expériences interactives conçues pour l'excellence et le mentorat."
                            : "Plongez dans des expériences sensorielles et psychologiques où chaque choix révèle une nouvelle facette de votre intimité."}
                    </motion.p>
                </div>

                {/* Games Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin text-milan-accent">
                            <Gamepad2 size={32} />
                        </div>
                    </div>
                ) : games.length === 0 ? (
                    <div className="text-center py-20 bg-milan-glass rounded-[2.5rem] border border-milan-accent/10">
                        <p className="text-milan-text/20 uppercase tracking-[0.2em] text-xs">
                            {isDay
                                ? "Les modules de formation Lumina sont en cours de déploiement."
                                : "Les rituels de la nuit arrivent bientôt dans votre sphère."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {games.map((game, idx) => (
                            <motion.div
                                key={game.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-milan-glass rounded-[2.5rem] border border-milan-accent/10 overflow-hidden hover:border-milan-accent/30 transition-all duration-500"
                            >
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src={game.imageUrl}
                                        alt={game.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-milan-bg via-transparent to-transparent opacity-60" />
                                </div>

                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-milan-accent/60 px-3 py-1 rounded-full bg-milan-accent/5 border border-milan-accent/10">
                                            {game.type}
                                        </span>
                                        <Sparkles size={14} className="text-milan-accent/20" />
                                    </div>

                                    <h3 className="font-serif text-2xl text-milan-text mb-3">{game.title}</h3>
                                    <p className="text-milan-text/40 text-sm leading-relaxed mb-8 line-clamp-3">
                                        {game.description}
                                    </p>

                                    <button className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-milan-accent text-milan-bg font-bold text-[10px] uppercase tracking-widest hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-all active:scale-95">
                                        Commencer l&apos;expérience
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
