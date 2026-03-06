'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ArrowRight, Share2, RotateCcw, Trophy } from 'lucide-react';

const QUESTIONS = [
    { q: "En société, tu es plutôt…", options: ["L'observateur discret", "Le centre de l'attention", "Celui qui pose les questions", "Le stratège silencieux"] },
    { q: "Ton plus grand moteur dans la vie ?", options: ["L'ambition", "La curiosité", "La connexion humaine", "Le contrôle"] },
    { q: "Face à l'inconnu, tu…", options: ["Analyses le risque", "Fonces tête baissée", "Cherches un allié", "Transformes l'obstacle en levier"] },
    { q: "Ta plus grande force en soirée ?", options: ["Mon humour", "Mon écoute", "Mon énergie", "Mon mystère"] },
    { q: "Ce qui t'agace chez les gens ?", options: ["L'hypocrisie", "La passivité", "Le manque d'ambition", "L'égoïsme"] },
    { q: "Ta vision du réseau social parfait ?", options: ["Un espace de création pure", "Une salle de débat", "Un club exclusif", "Un miroir amélioré"] },
    { q: "Si tu devais choisir un pouvoir ?", options: ["Lire les pensées", "Voyager dans le temps", "L'invisibilité", "Le charisme absolu"] },
    { q: "Face à un conflit, tu…", options: ["Confrontes directement", "Analyses et attends", "Cherches le compromis", "Disparais et reviens plus fort"] },
    { q: "Ton rapport à l'argent ?", options: ["Un outil de liberté", "Un symbole de réussite", "Un moyen de faire le bien", "Un jeu à maîtriser"] },
    { q: "En une phrase, la vie c'est…", options: ["Un combat à gagner", "Une expérience à savourer", "Un puzzle à résoudre", "Un spectacle à orchestrer"] },
];

const PROFILES = [
    {
        name: "L'Architecte",
        desc: "Tu construis ta vie comme un empire. Chaque décision est calculée, chaque relation a un sens. Tu ne laisses rien au hasard. Le cercle Lumina a besoin de cerveaux comme le tien.",
        traits: ['Stratège', 'Visionnaire', 'Ambitieux'],
        color: 'text-gold',
    },
    {
        name: "Le Catalyseur",
        desc: "Tu es l'étincelle qui enflamme les groupes. Ton énergie est contagieuse et tu transformes chaque situation en opportunité. Tu es la personne que tout le monde veut à sa table.",
        traits: ['Charismatique', 'Audacieux', 'Inspirant'],
        color: 'text-emerald-400',
    },
    {
        name: "Le Décodeur",
        desc: "Tu vois ce que les autres ne voient pas. Derrière chaque mot, tu lis une intention. Ton intelligence émotionnelle est ton arme secrète. Tu es dangereux — dans le meilleur sens du terme.",
        traits: ['Empathique', 'Analytique', 'Intuitif'],
        color: 'text-blue-400',
    },
    {
        name: "L'Électron Libre",
        desc: "Les règles ne sont que des suggestions pour toi. Tu traces ton propre chemin avec une élégance déconcertante. Imprévisible, fascinant, impossible à enfermer dans une case.",
        traits: ['Créatif', 'Indépendant', 'Magnétique'],
        color: 'text-purple-400',
    },
];

export default function SocialRadar({ onComplete }: { onComplete: () => void }) {
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

    const handleAnswer = (idx: number) => {
        const newAnswers = [...answers, idx];
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
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, delay: 0.2 }}
                    className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <Trophy size={36} className="text-gold" />
                </motion.div>

                <h3 className={`font-serif text-4xl mb-2 italic ${profile.color}`}>{profile.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-8 px-4">{profile.desc}</p>

                <div className="flex justify-center gap-2 mb-10">
                    {profile.traits.map(t => (
                        <span key={t} className="text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                            {t}
                        </span>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-white/5 rounded-2xl text-white/40 hover:bg-white/10 text-[10px] uppercase tracking-widest font-bold transition-all">
                        <RotateCcw size={14} /> Refaire
                    </button>
                    <button onClick={onComplete} className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-gold text-dark rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-all">
                        <Share2 size={14} /> Valider
                    </button>
                </div>
            </motion.div>
        );
    }

    const progress = ((step + 1) / QUESTIONS.length) * 100;

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-gold text-[10px] uppercase font-bold tracking-widest">Question {step + 1}/{QUESTIONS.length}</span>
                    <span className="text-white/20 text-[10px] font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gold rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                >
                    <h3 className="font-serif text-2xl text-cream mb-8 leading-snug">{QUESTIONS[step].q}</h3>
                    <div className="space-y-3">
                        {QUESTIONS[step].options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                className="w-full text-left px-6 py-4 bg-white/[0.03] border border-white/10 hover:border-gold/50 hover:bg-gold/10 rounded-2xl text-white/70 transition-all font-medium flex justify-between items-center group active:scale-[0.98]"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-white/30 font-bold group-hover:bg-gold/20 group-hover:text-gold transition-colors">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    {opt}
                                </span>
                                <ArrowRight size={16} className="text-gold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
