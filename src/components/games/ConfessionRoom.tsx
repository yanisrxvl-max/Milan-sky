'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Lock, Eye, MessageCircle, Heart, RotateCcw } from 'lucide-react';

const COMMUNITY_CONFESSIONS = [
    { text: "J'ai simulé pendant 2 ans avec mon ex. Il ne s'en est jamais rendu compte.", votes: 847 },
    { text: "Je fantasme sur mon prof de sport depuis la rentrée et je fais exprès d'arriver en avance.", votes: 1203 },
    { text: "J'ai couché avec le meilleur ami de mon ex pour me venger. Et j'ai adoré.", votes: 642 },
    { text: "Je regarde du contenu adulte tous les soirs mais je juge ceux qui en parlent ouvertement.", votes: 1580 },
    { text: "J'ai envoyé un nude à la mauvaise personne et j'ai fait semblant de rien.", votes: 923 },
    { text: "Mon plus grand fantasme impliquerait 3 personnes et un lieu public.", votes: 758 },
    { text: "J'ai quitté quelqu'un parce qu'il était trop gentil. La méchanceté m'excite.", votes: 1102 },
    { text: "J'ai un compte secret que personne ne connaît. Même pas mes meilleurs amis.", votes: 2041 },
];

const PROMPTS = [
    "Quel est ton fantasme le plus inavouable ?",
    "Quelle est la chose la plus folle que tu as faite par désir ?",
    "Quel secret portes-tu en toi et que tu n'as jamais dit à personne ?",
    "Si personne ne pouvait jamais savoir, que ferais-tu cette nuit ?",
    "Quelle est ta plus grande honte liée à ta vie intime ?",
];

export default function ConfessionRoom({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState<'read' | 'write' | 'done'>('read');
    const [currentConfIdx, setCurrentConfIdx] = useState(0);
    const [voted, setVoted] = useState<Set<number>>(new Set());
    const [confession, setConfession] = useState('');
    const [promptIdx, setPromptIdx] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [readCount, setReadCount] = useState(0);

    const handleVote = (idx: number) => {
        if (voted.has(idx)) return;
        setVoted(new Set(Array.from(voted).concat(idx)));
    };

    const nextConfession = () => {
        const newCount = readCount + 1;
        setReadCount(newCount);
        if (newCount >= 5) {
            setPhase('write');
            setPromptIdx(Math.floor(Math.random() * PROMPTS.length));
        } else {
            setCurrentConfIdx((currentConfIdx + 1) % COMMUNITY_CONFESSIONS.length);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (confession.trim().length > 10) {
            setSubmitted(true);
            setTimeout(() => setPhase('done'), 1500);
        }
    };

    if (phase === 'done') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 max-w-md mx-auto">
                <Lock size={40} className="text-red-500/50 mx-auto mb-6" />
                <h3 className="font-serif text-3xl text-cream mb-4 italic">Secret Scellé</h3>
                <p className="text-white/40 mb-4 max-w-sm mx-auto text-sm">
                    Ta confession a été cryptée et envoyée dans la Sphère. Personne ne saura que c'est toi, mais tout le monde la lira.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8 px-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-cream font-serif text-2xl mb-1">{readCount}</p>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Secrets lus</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-cream font-serif text-2xl mb-1">{voted.size}</p>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Votes</p>
                    </div>
                </div>
                <button onClick={onComplete} className="w-full py-4 rounded-2xl bg-red-500 text-white text-[10px] uppercase tracking-widest font-bold hover:bg-red-600 transition-all">
                    Quitter la Pièce
                </button>
            </motion.div>
        );
    }

    if (phase === 'write') {
        return (
            <div className="w-full max-w-md mx-auto relative">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full pointer-events-none" />
                <div className="text-center mb-6">
                    <Flame size={24} className="text-red-500 mx-auto mb-4" />
                    <h3 className="font-serif text-xl text-white mb-2">À ton tour.</h3>
                    <p className="text-white/30 text-xs uppercase tracking-widest font-bold">100% Anonyme</p>
                </div>

                <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 mb-6 text-center">
                    <p className="text-red-400 font-serif italic text-lg">"{PROMPTS[promptIdx]}"</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <textarea
                            value={confession}
                            onChange={(e) => setConfession(e.target.value)}
                            placeholder="Écris ici… personne ne saura."
                            className="w-full h-36 bg-dark-500/50 border border-white/5 rounded-2xl p-5 text-white/80 placeholder:text-white/20 focus:outline-none focus:border-red-500/50 resize-none font-serif italic transition-colors"
                        />
                        <div className="absolute bottom-3 right-4 text-[9px] font-bold text-white/20">{confession.length} car.</div>
                    </div>
                    <button
                        type="submit"
                        disabled={confession.length < 10 || submitted}
                        className="w-full py-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 font-bold uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {submitted ? 'Envoi en cours…' : 'Confesser'}
                    </button>
                </form>
            </div>
        );
    }

    // Phase: read
    const conf = COMMUNITY_CONFESSIONS[currentConfIdx];
    const hasVoted = voted.has(currentConfIdx);

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-6">
                <Eye size={20} className="text-red-500 mx-auto mb-3" />
                <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Confession {readCount + 1}/5 — Lis avant de te confesser</p>
            </div>

            <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-8">
                <motion.div className="h-full bg-red-500 rounded-full" animate={{ width: `${((readCount + 1) / 5) * 100}%` }} />
            </div>

            <AnimatePresence mode="wait">
                <motion.div key={currentConfIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-8">
                    <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-red-500/10 relative">
                        <div className="absolute top-4 right-4">
                            <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Anonyme</span>
                        </div>
                        <p className="font-serif text-lg text-white/80 italic leading-relaxed mb-6">"{conf.text}"</p>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <button
                                onClick={() => handleVote(currentConfIdx)}
                                className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold transition-all ${hasVoted ? 'text-red-500' : 'text-white/30 hover:text-red-500'}`}
                            >
                                <Heart size={14} fill={hasVoted ? 'currentColor' : 'none'} /> {conf.votes + (hasVoted ? 1 : 0)}
                            </button>
                            <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold flex items-center gap-1">
                                <MessageCircle size={12} /> Confession Sphère
                            </span>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <button onClick={nextConfession} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/50 text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all">
                {readCount >= 4 ? 'À mon tour →' : 'Confession suivante →'}
            </button>
        </div>
    );
}
