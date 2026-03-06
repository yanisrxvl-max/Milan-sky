'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Activity, RotateCcw, Share2 } from 'lucide-react';

const QUESTIONS = [
    { q: "Quelle ambiance te fait craquer ?", options: ["Dîner privé face aux lumières de la ville", "Séance de cinéma intimiste", "Conduite nocturne sans destination", "Soirée rooftop sous les étoiles"] },
    { q: "Qu'est-ce qui te séduit en premier ?", options: ["L'assurance et le charisme", "L'intelligence mystérieuse", "Le style et le parfum", "Le regard et le sourire"] },
    { q: "Quel est ton point faible ?", options: ["La possessivité", "L'impatience", "Le besoin de validation", "La jalousie"] },
    { q: "Ton love language principal ?", options: ["Les mots doux", "Le contact physique", "Les cadeaux et attentions", "Le temps de qualité"] },
    { q: "Ce qui te repousse instantanément ?", options: ["Le manque d'hygiène", "L'arrogance vide", "La passivité totale", "Le mensonge"] },
    { q: "Ta position sur la fidélité ?", options: ["Absolue et non négociable", "Importante mais je comprends les nuances", "Plus émotionnelle que physique", "Ça dépend de la relation"] },
    { q: "Combien de temps avant de dire 'je t'aime' ?", options: ["Quelques semaines", "Quelques mois minimum", "Quand je le ressens vraiment", "Je ne le dis presque jamais"] },
    { q: "Ton fantasme récurrent ?", options: ["Voyage improvisé à deux", "Domination douce", "Être surpris(e) dans un lieu public", "Connexion émotionnelle intense"] },
    { q: "Comment tu gères un conflit en couple ?", options: ["Discussion directe et franche", "Le silence puis la résolution", "Le compromis systématique", "L'évitement élégant"] },
    { q: "L'amour idéal pour toi c'est…", options: ["Un feu d'artifice permanent", "Un fleuve tranquille et profond", "Un jeu de pouvoir équilibré", "Un mystère qui ne se résout jamais"] },
];

const PROFILES = [
    { name: "Flamme Intense", desc: "Tu brûles tout sur ton passage. Tes relations sont passionnelles, dévorantes. Tu veux tout, tout de suite, et tu n'acceptes rien de tiède. Avec toi, c'est l'incendie ou le néant.", icon: "🔥", traits: ['Passionné', 'Dévorant', 'Magnétique'] },
    { name: "Mystère Nocturne", desc: "Tu séduis par ce que tu ne dis pas. Ton silence est ton arme la plus puissante. Les gens veulent te percer à jour, mais tu restes toujours un pas en avance. L'ombre te va bien.", icon: "🌙", traits: ['Énigmatique', 'Profond', 'Insaisissable'] },
    { name: "Douceur Fatale", desc: "Derrière ta douceur se cache une force terrible. Tu attires par ta bienveillance mais tu retiens par ton intelligence émotionnelle. Personne ne s'attend à ce que tu sois aussi dangereux(se).", icon: "🌹", traits: ['Tendre', 'Stratège', 'Irrésistible'] },
    { name: "Électron Libre", desc: "Tu ne te laisses jamais enfermer. L'amour est un jeu et tu en connais toutes les règles. Tu veux quelqu'un qui te défie, pas quelqu'un qui te complète. L'intensité sans les chaînes.", icon: "⚡", traits: ['Indépendant', 'Audacieux', 'Imprévisible'] },
];

export default function ChemistryTest({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [finished, setFinished] = useState(false);

    const profile = useMemo(() => {
        if (!finished) return PROFILES[0];
        const scores = [0, 0, 0, 0];
        answers.forEach(a => scores[a]++);
        const maxIdx = scores.indexOf(Math.max(...scores));
        return PROFILES[maxIdx];
    }, [answers, finished]);

    const finalScore = useMemo(() => {
        if (!finished) return 0;
        // Generate a "chemistry" score between 72-98 based on answer variety
        const uniqueAnswers = new Set(answers).size;
        const base = 72;
        const variety = (uniqueAnswers / 4) * 26;
        return Math.min(Math.round(base + variety), 98);
    }, [answers, finished]);

    const handleAnswer = (index: number) => {
        const newAnswers = [...answers, index];
        setAnswers(newAnswers);
        if (step < QUESTIONS.length - 1) {
            setTimeout(() => setStep(step + 1), 300);
        } else {
            setTimeout(() => setFinished(true), 500);
        }
    };

    const reset = () => { setStep(0); setAnswers([]); setFinished(false); };

    if (finished) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-md mx-auto py-4">
                {/* Animated Score Circle */}
                <div className="relative w-36 h-36 mx-auto mb-8 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="72" cy="72" r="66" stroke="rgba(255,255,255,0.05)" strokeWidth="5" fill="none" />
                        <motion.circle
                            cx="72" cy="72" r="66"
                            stroke="rgba(239, 68, 68, 1)"
                            strokeWidth="5"
                            fill="none"
                            strokeDasharray={415}
                            initial={{ strokeDashoffset: 415 }}
                            animate={{ strokeDashoffset: 415 - (415 * finalScore) / 100 }}
                            transition={{ duration: 2.5, ease: "easeOut" }}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="flex flex-col items-center">
                        <motion.span
                            className="font-serif text-4xl text-cream"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            {finalScore}%
                        </motion.span>
                        <span className="text-[8px] uppercase tracking-widest text-red-400 font-bold">Alchimie</span>
                    </div>
                </div>

                {/* Profile */}
                <span className="text-4xl block mb-4">{profile.icon}</span>
                <h3 className="font-serif text-3xl text-cream mb-2 italic">{profile.name}</h3>
                <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto leading-relaxed px-4">{profile.desc}</p>

                <div className="flex justify-center gap-2 mb-8">
                    {profile.traits.map(t => (
                        <span key={t} className="text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                            {t}
                        </span>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-white/5 rounded-2xl text-white/40 text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all">
                        <RotateCcw size={14} /> Refaire
                    </button>
                    <button onClick={onComplete} className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-red-500 text-white rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-red-600 transition-all">
                        <Share2 size={14} /> Valider
                    </button>
                </div>
            </motion.div>
        );
    }

    const progress = ((step + 1) / QUESTIONS.length) * 100;

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
                <Activity className="text-red-500 mx-auto mb-3" size={20} />
                <h3 className="font-serif text-xl text-white mb-1">Chemistry Test</h3>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-red-500 text-[10px] uppercase font-bold tracking-widest">Question {step + 1}/{QUESTIONS.length}</span>
                <span className="text-white/20 text-[10px] font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-8">
                <motion.div className="h-full bg-red-500 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 mb-6">
                        <h4 className="font-serif text-xl text-cream text-center italic leading-snug">"{QUESTIONS[step].q}"</h4>
                    </div>
                    <div className="space-y-3">
                        {QUESTIONS[step].options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                className="w-full text-left px-6 py-4 bg-white/[0.03] border border-white/10 hover:border-red-500/50 hover:bg-red-500/5 rounded-2xl text-white/70 transition-all font-medium active:scale-[0.98] flex items-center gap-3"
                            >
                                <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-white/30 font-bold shrink-0">
                                    {String.fromCharCode(65 + i)}
                                </span>
                                {opt}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
