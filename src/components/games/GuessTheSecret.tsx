'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Shield, Key, RotateCcw, Trophy, Timer } from 'lucide-react';

const ROUNDS = [
    {
        intro: "Milan prend une gorgée de son verre et te regarde dans les yeux…",
        options: [
            "J'ai déjà infiltré un gala parisien sous une fausse identité.",
            "Je n'ai jamais bu une seule goutte d'alcool de ma vie.",
            "J'ai refusé un contrat à un million pour préserver mon indépendance.",
        ],
        truthIndex: 2,
        reveal: "L'indépendance est mon seul véritable luxe. Le reste n'est que du spectacle.",
    },
    {
        intro: "Il se penche vers toi et murmure…",
        options: [
            "J'ai dormi trois mois dans ma voiture avant de réussir.",
            "Mon premier business a généré 100K en 30 jours.",
            "J'ai appris à coder en regardant des tutos YouTube à 14 ans.",
        ],
        truthIndex: 0,
        reveal: "Trois mois dans une Clio, un sac de couchage, et une obsession : ne plus jamais dépendre de personne.",
    },
    {
        intro: "Un sourire en coin, il continue…",
        options: [
            "J'ai eu un rendez-vous avec un politicien célèbre sans le savoir.",
            "J'ai été banni de trois réseaux sociaux avant d'en créer un.",
            "Ma mère ne sait pas ce que je fais comme métier.",
        ],
        truthIndex: 1,
        reveal: "Deux fois banni de Twitter, une fois d'Instagram. Alors j'ai construit Milan Sky. Personne ne peut me bannir de chez moi.",
    },
    {
        intro: "Il repose son verre. Son regard change…",
        options: [
            "J'ai pleuré en public une seule fois dans ma vie.",
            "Je n'ai pas parlé à mon père depuis 6 ans.",
            "Ma plus grande peur c'est de finir seul.",
        ],
        truthIndex: 2,
        reveal: "Derrière l'image, derrière le business, derrière la carapace — la solitude est mon ennemi invisible. C'est aussi pour ça que Milan Sky existe.",
    },
    {
        intro: "Dernière confidence. Son regard est intense…",
        options: [
            "J'ai sauvé quelqu'un de la noyade quand j'avais 17 ans.",
            "Je joue du piano à un niveau concert mais personne ne le sait.",
            "J'ai un tatouage caché que personne n'a jamais vu.",
        ],
        truthIndex: 0,
        reveal: "Été 2017, plage de Nice. Un gamin emporté par le courant. Je n'ai pas réfléchi, j'ai sauté. C'est le seul acte dont je suis vraiment fier.",
    },
];

export default function GuessTheSecret({ onComplete }: { onComplete: () => void }) {
    const [round, setRound] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [revealed, setRevealed] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const current = ROUNDS[round];

    const handleGuess = (index: number) => {
        if (selected !== null) return;
        setSelected(index);
        const correct = index === current.truthIndex;
        if (correct) setScore(s => s + 1);
        setTimeout(() => setRevealed(true), 1500);
    };

    const nextRound = () => {
        if (round < ROUNDS.length - 1) {
            setRound(r => r + 1);
            setSelected(null);
            setRevealed(false);
        } else {
            setGameOver(true);
        }
    };

    const reset = () => { setRound(0); setSelected(null); setRevealed(false); setScore(0); setGameOver(false); };

    if (gameOver) {
        const ratio = Math.round((score / ROUNDS.length) * 100);
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto rounded-full bg-gold/20 flex items-center justify-center mb-6">
                    <Trophy size={36} className="text-gold" />
                </div>
                <h3 className="font-serif text-4xl text-cream mb-2 italic">Résultat Final</h3>
                <p className="text-gold text-3xl font-serif font-bold mb-2">{score}/{ROUNDS.length}</p>
                <p className="text-white/40 mb-4 text-sm">Taux de réussite : {ratio}%</p>
                <p className="text-white/50 mb-8 max-w-sm mx-auto text-sm px-4">
                    {ratio >= 80 ? "Instinct redoutable. Tu vois à travers les masques. Milan est impressionné." :
                        ratio >= 60 ? "Pas mal du tout. Ton intuition est aiguisée, mais Milan garde encore quelques secrets." :
                            ratio >= 40 ? "Tu t'es laissé piéger par le charme. Normal, c'est exactement son arme." :
                                "Milan t'a complètement berné. Mais ne t'inquiète pas, c'est ce qu'il fait de mieux."}
                </p>
                <div className="flex gap-3">
                    <button onClick={reset} className="flex-1 px-4 py-4 bg-white/5 rounded-2xl text-white/40 text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        <RotateCcw size={14} /> Rejouer
                    </button>
                    <button onClick={onComplete} className="flex-1 px-4 py-4 bg-gold text-dark rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all">
                        Réclamer SkyCoins
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Progress */}
            <div className="flex items-center justify-between mb-6">
                <span className="text-gold text-[10px] uppercase font-bold tracking-widest">Round {round + 1}/{ROUNDS.length}</span>
                <span className="text-white/30 text-[10px] font-bold flex items-center gap-1.5">
                    <Key size={12} /> Score : {score}
                </span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-8">
                <motion.div className="h-full bg-gold rounded-full" animate={{ width: `${((round + 1) / ROUNDS.length) * 100}%` }} />
            </div>

            <AnimatePresence mode="wait">
                {!revealed ? (
                    <motion.div key={`q-${round}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <p className="text-white/30 text-sm italic mb-6 text-center">"{current.intro}"</p>
                        <h3 className="font-serif text-xl text-cream mb-8 text-center">Laquelle de ces trois déclarations est vraie ?</h3>

                        <div className="space-y-3">
                            {current.options.map((opt, i) => (
                                <button
                                    key={i}
                                    disabled={selected !== null}
                                    onClick={() => handleGuess(i)}
                                    className={`w-full p-5 rounded-2xl border transition-all duration-300 font-serif italic text-left ${selected === i
                                            ? 'bg-gold/20 border-gold shadow-[0_0_20px_rgba(201,168,76,0.3)] text-gold'
                                            : selected !== null ? 'opacity-40 border-white/5 text-white/40' : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/10 active:scale-[0.98]'
                                        }`}
                                >
                                    "{opt}"
                                </button>
                            ))}
                        </div>

                        {selected !== null && !revealed && (
                            <p className="mt-6 text-gold text-[10px] uppercase tracking-widest font-bold animate-pulse text-center">Vérification en cours…</p>
                        )}
                    </motion.div>
                ) : (
                    <motion.div key={`r-${round}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${selected === current.truthIndex ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-red-500/20 text-red-500 border border-red-500/50'}`}>
                            {selected === current.truthIndex ? <Key size={28} /> : <Eye size={28} />}
                        </div>
                        <h3 className="font-serif text-2xl text-cream mb-4 italic">
                            {selected === current.truthIndex ? "Bien joué." : "Raté."}
                        </h3>
                        <p className="text-white/50 text-sm mb-8 max-w-sm mx-auto italic">"{current.reveal}"</p>
                        <button onClick={nextRound} className="px-8 py-4 bg-gold text-dark rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]">
                            {round < ROUNDS.length - 1 ? 'Round Suivant' : 'Voir le Score Final'}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
