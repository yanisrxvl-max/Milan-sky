'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Trophy, Users } from 'lucide-react';

const TRUTHS = [
    "Quel est le message le plus embarrassant que tu as envoyé à la mauvaise personne ?",
    "As-tu déjà fantasmé sur quelqu'un de strictement interdit ?",
    "Quelle est la dernière chose que tu as cherchée sur internet à 3h du matin ?",
    "As-tu déjà menti à un partenaire sur ton nombre de partenaires ?",
    "Quel est ton plus gros red flag en couple que tu assumes ?",
    "As-tu déjà fait semblant de dormir pour éviter une conversation ?",
    "Quel est le truc le plus creepy que tu as fait par amour ?",
    "Si tes amis voyaient ton historique de recherche, qu'est-ce qu'ils penseraient ?",
    "As-tu déjà pleuré à cause d'un film ou d'une série sans l'avouer ?",
    "Quelle est ta plus grande insécurité que tu caches derrière ton assurance ?",
    "As-tu déjà stalké un ex en secret ? Jusqu'où es-tu allé(e) ?",
    "Quelle est la chose la plus folle que tu as faite pour impressionner quelqu'un ?",
    "Quel est ton plus grand regret amoureux ?",
    "À quel moment de ta vie as-tu eu le plus honte de toi ?",
    "Quel est le mensonge le plus gros que tu as dit et qu'on a cru ?",
];

const DESIRES = [
    "Envoie un message risqué à la dernière personne avec qui tu as discuté.",
    "Fais une story Instagram mystérieuse sans aucune explication.",
    "Envoie un vocal de 30 secondes où tu murmures quelque chose d'audacieux.",
    "Bloque et débloque immédiatement ton crush pour qu'il/elle reçoive la notification.",
    "Écris un poème érotique en 2 lignes et lis-le à voix haute.",
    "Mets ton téléphone en mode avion pendant 1 heure. Pas de triche.",
    "Envoie le emoji le plus suggestif possible à quelqu'un sans contexte.",
    "Fais 10 pompes ou avoue un secret supplémentaire.",
    "Change ta photo de profil pour la photo la plus audacieuse que tu as.",
    "Appelle quelqu'un au hasard dans tes contacts et dis-lui que tu penses à lui/elle.",
    "Raconte ton pire date Tinder sans censure.",
    "Fais un compliment totalement excessif à la personne en face de toi.",
    "Mime ta dernière scène intime en slow-motion.",
    "Texte à ton ex 'je pense encore à toi' puis screenshot et montre le résultat.",
    "Danse sensuellement pendant 30 secondes sans musique.",
];

export default function TruthOrDesire({ onComplete }: { onComplete: () => void }) {
    const [cards, setCards] = useState<{ type: 'Truth' | 'Desire', text: string }[]>([]);
    const [currentCard, setCurrentCard] = useState<{ type: 'Truth' | 'Desire', text: string } | null>(null);
    const [usedTruths, setUsedTruths] = useState<Set<number>>(new Set());
    const [usedDesires, setUsedDesires] = useState<Set<number>>(new Set());
    const [totalPlayed, setTotalPlayed] = useState(0);
    const [truthCount, setTruthCount] = useState(0);
    const [desireCount, setDesireCount] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const drawCard = (type: 'Truth' | 'Desire') => {
        const list = type === 'Truth' ? TRUTHS : DESIRES;
        const used = type === 'Truth' ? usedTruths : usedDesires;

        const available = list.filter((_, i) => !used.has(i));
        if (available.length === 0) return;

        const randomIdx = Math.floor(Math.random() * available.length);
        const originalIdx = list.indexOf(available[randomIdx]);
        const text = available[randomIdx];

        if (type === 'Truth') {
            setUsedTruths(new Set([...Array.from(used), originalIdx]));
            setTruthCount(c => c + 1);
        } else {
            setUsedDesires(new Set([...Array.from(used), originalIdx]));
            setDesireCount(c => c + 1);
        }

        const card = { type, text };
        setCurrentCard(card);
        setCards(prev => [...prev, card]);
        setTotalPlayed(t => t + 1);
    };

    const done = () => setCurrentCard(null);
    const finish = () => setShowResult(true);

    if (showResult) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-md mx-auto py-8">
                <Trophy size={36} className="text-red-500 mx-auto mb-6" />
                <h3 className="font-serif text-3xl text-cream mb-4 italic">Session Terminée</h3>
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-cream font-serif text-2xl mb-1">{totalPlayed}</p>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Cartes jouées</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gold/5 border border-gold/20">
                        <p className="text-gold font-serif text-2xl mb-1">{truthCount}</p>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Vérités</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20">
                        <p className="text-red-500 font-serif text-2xl mb-1">{desireCount}</p>
                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Désirs</p>
                    </div>
                </div>
                <p className="text-white/40 text-sm mb-8">
                    {desireCount > truthCount ? "Tu préfères l'action à la parole. Audacieux." :
                        truthCount > desireCount ? "Tu n'as pas peur de la vérité. Respect." :
                            "Parfaitement équilibré. Tu maîtrises le jeu."}
                </p>
                <button onClick={onComplete} className="w-full py-4 bg-red-500 text-white rounded-2xl text-[10px] uppercase tracking-widest font-bold hover:bg-red-600 transition-all">
                    Réclamer SkyCoins
                </button>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto text-center py-4">
            <h3 className="font-serif text-2xl text-cream mb-1 italic">Vérité ou Désir</h3>
            <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center justify-center gap-2">
                <Users size={12} /> Jouable entre amis
            </p>
            <p className="text-white/40 mb-6 text-xs">Pas d&apos;échappatoire. Choisis ton poison.</p>

            {totalPlayed > 0 && (
                <div className="flex items-center justify-center gap-4 mb-6 text-[10px] tracking-widest">
                    <span className="text-gold font-bold">{truthCount} V</span>
                    <span className="text-white/20">|</span>
                    <span className="text-red-500 font-bold">{desireCount} D</span>
                    <span className="text-white/20">|</span>
                    <span className="text-white/30">{totalPlayed} tours</span>
                </div>
            )}

            <AnimatePresence mode="wait">
                {!currentCard ? (
                    <motion.div key="choices" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="space-y-4">
                        <div className="flex gap-4">
                            <button
                                onClick={() => drawCard('Truth')}
                                disabled={usedTruths.size >= TRUTHS.length}
                                className="flex-1 aspect-[3/4] rounded-3xl bg-dark-500 border border-gold/20 flex flex-col items-center justify-center gap-4 hover:bg-gold/5 transition-all group relative overflow-hidden disabled:opacity-30"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="font-serif text-4xl text-gold group-hover:scale-110 transition-transform">V</span>
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 group-hover:text-gold">Vérité</span>
                                <span className="text-[8px] text-white/20">{TRUTHS.length - usedTruths.size} restantes</span>
                            </button>
                            <button
                                onClick={() => drawCard('Desire')}
                                disabled={usedDesires.size >= DESIRES.length}
                                className="flex-1 aspect-[3/4] rounded-3xl bg-dark-500 border border-red-500/20 flex flex-col items-center justify-center gap-4 hover:bg-red-500/5 transition-all group relative overflow-hidden disabled:opacity-30"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <span className="font-serif text-4xl text-red-500 group-hover:scale-110 transition-transform">D</span>
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 group-hover:text-red-500">Désir</span>
                                <span className="text-[8px] text-white/20">{DESIRES.length - usedDesires.size} restantes</span>
                            </button>
                        </div>

                        {totalPlayed >= 3 && (
                            <button onClick={finish} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white/30 text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all mt-4">
                                Terminer la session ({totalPlayed} tours)
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key={`card-${totalPlayed}`}
                        initial={{ opacity: 0, y: 30, rotateX: 90 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", damping: 15 }}
                        className={`rounded-3xl p-8 relative overflow-hidden min-h-[300px] flex flex-col justify-between ${currentCard.type === 'Truth' ? 'bg-gradient-to-br from-gold/90 to-yellow-700 text-dark' : 'bg-gradient-to-br from-red-900 to-red-700 text-red-100'
                            }`}
                    >
                        <div className="flex justify-between items-center opacity-40">
                            <Sparkles size={16} />
                            <span className="text-[10px] uppercase font-black tracking-widest">{currentCard.type === 'Truth' ? 'VÉRITÉ' : 'DÉSIR'}</span>
                        </div>
                        <p className="font-serif text-xl italic leading-relaxed text-center my-auto py-8">"{currentCard.text}"</p>
                        <button onClick={done} className="w-full py-3 bg-black/20 hover:bg-black/30 rounded-xl text-xs font-bold uppercase tracking-widest backdrop-blur-md transition-all">
                            {currentCard.type === 'Truth' ? "J'ai répondu ✓" : "Défi accompli ✓"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
