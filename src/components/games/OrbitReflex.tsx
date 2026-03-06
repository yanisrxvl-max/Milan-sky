'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Trophy, RotateCcw } from 'lucide-react';

const LEVELS = [
    { name: 'Échauffement', speed: 120, targetSize: 20, color: 'text-emerald-400' },
    { name: 'Concentration', speed: 160, targetSize: 18, color: 'text-blue-400' },
    { name: 'Adrénaline', speed: 220, targetSize: 15, color: 'text-gold' },
    { name: 'Précision Extrême', speed: 280, targetSize: 12, color: 'text-orange-400' },
    { name: 'Mode Milan', speed: 350, targetSize: 10, color: 'text-red-500' },
];

export default function OrbitReflex({ onComplete }: { onComplete: () => void }) {
    const [level, setLevel] = useState(0);
    const [angle, setAngle] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [result, setResult] = useState<'success' | 'fail' | null>(null);
    const [scores, setScores] = useState<number[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [bestAngle, setBestAngle] = useState(0);

    const currentLevel = LEVELS[level];

    useEffect(() => {
        let frame: number;
        let lastTime = performance.now();

        if (playing) {
            const update = (time: number) => {
                const delta = time - lastTime;
                lastTime = time;
                setAngle(a => (a + (currentLevel.speed * delta) / 1000) % 360);
                frame = requestAnimationFrame(update);
            };
            frame = requestAnimationFrame(update);
        }
        return () => cancelAnimationFrame(frame);
    }, [playing, currentLevel.speed]);

    const handleTap = useCallback(() => {
        if (!playing && !result && !gameOver) {
            setPlaying(true);
            return;
        }
        if (playing) {
            setPlaying(false);
            const dist = Math.min(Math.abs(angle), Math.abs(360 - angle));
            setBestAngle(dist);
            const isHit = dist < currentLevel.targetSize;
            setResult(isHit ? 'success' : 'fail');

            if (isHit) {
                const precision = Math.round((1 - dist / currentLevel.targetSize) * 100);
                setScores(s => [...s, precision]);
            }
        }
    }, [playing, result, gameOver, angle, currentLevel.targetSize]);

    const nextLevel = () => {
        if (level < LEVELS.length - 1) {
            setLevel(l => l + 1);
            setAngle(0);
            setResult(null);
        } else {
            setGameOver(true);
        }
    };

    const retry = () => { setAngle(0); setResult(null); };
    const reset = () => { setLevel(0); setAngle(0); setResult(null); setScores([]); setGameOver(false); };

    if (gameOver) {
        const avgPrecision = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-md mx-auto py-8">
                <Trophy size={40} className="text-gold mx-auto mb-6" />
                <h3 className="font-serif text-3xl text-cream mb-2 italic">Résultat Final</h3>
                <p className="text-gold text-4xl font-serif font-bold mb-2">{scores.length}/{LEVELS.length}</p>
                <p className="text-white/40 text-sm mb-4">Niveaux réussis — Précision moy. {avgPrecision}%</p>

                <div className="grid grid-cols-5 gap-2 mb-8 px-4">
                    {LEVELS.map((lvl, i) => (
                        <div key={i} className={`p-2 rounded-xl border text-center ${i < scores.length ? 'bg-gold/10 border-gold/30' : 'bg-white/5 border-white/10 opacity-40'}`}>
                            <p className="text-[8px] uppercase tracking-widest text-white/50 font-bold">{lvl.name.split(' ')[0]}</p>
                            <p className={`text-sm font-bold ${i < scores.length ? 'text-gold' : 'text-white/20'}`}>
                                {i < scores.length ? `${scores[i]}%` : '—'}
                            </p>
                        </div>
                    ))}
                </div>

                <p className="text-white/40 text-sm mb-8">
                    {scores.length === 5 ? "Parfait. Tu as les réflexes d'un sniper digital. Milan est impressionné." :
                        scores.length >= 3 ? "Pas mal du tout. Tes réflexes sont au-dessus de la moyenne." :
                            "Il va falloir t'entraîner encore. Le timing, ça se travaille."}
                </p>

                <div className="flex gap-3">
                    <button onClick={reset} className="flex-1 px-4 py-4 bg-white/5 rounded-2xl text-white/40 text-[10px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        <RotateCcw size={14} /> Recommencer
                    </button>
                    <button onClick={onComplete} className="flex-1 px-4 py-4 bg-gold text-dark rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all">
                        Réclamer SkyCoins
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-sm mx-auto text-center py-4">
            {/* Level Info */}
            <div className="flex items-center justify-between mb-6">
                <span className={`text-[10px] uppercase font-bold tracking-widest ${currentLevel.color}`}>
                    Niv. {level + 1} — {currentLevel.name}
                </span>
                <span className="text-white/20 text-[10px] font-bold">{scores.length}/{LEVELS.length} ✓</span>
            </div>

            <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-8">
                <motion.div className="h-full bg-gold rounded-full" animate={{ width: `${((level + 1) / LEVELS.length) * 100}%` }} />
            </div>

            {/* Orbit */}
            <div className="relative w-52 h-52 mx-auto mb-10">
                <div className="absolute inset-0 rounded-full border-2 border-white/5" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-gold flex items-center justify-center bg-dark-500 z-10">
                    <Target size={12} className="text-gold" />
                </div>
                <div className="absolute inset-0 rounded-full z-20" style={{ transform: `rotate(${angle}deg)` }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cream shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                </div>
                <div className="absolute inset-6 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center flex-col">
                    {result === 'success' && <Zap size={28} className="text-gold" />}
                    {result === 'fail' && <Zap size={28} className="text-red-500 opacity-50" />}
                    {!result && <span className="text-white/20 text-xs font-bold uppercase tracking-widest">{playing ? 'GO !' : 'PRÊT ?'}</span>}
                </div>
            </div>

            {!result ? (
                <button onClick={handleTap} className="w-full btn-gold !py-4 font-bold tracking-widest uppercase text-xs active:scale-95 transition-transform">
                    {playing ? '⚡ STOP !' : 'DÉMARRER'}
                </button>
            ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <p className={`font-serif text-xl italic mb-2 ${result === 'success' ? 'text-gold' : 'text-red-400'}`}>
                        {result === 'success' ? `Précision : ${scores[scores.length - 1]}%` : `Écart : ${bestAngle.toFixed(1)}°`}
                    </p>
                    <p className="text-white/30 text-xs mb-6">
                        {result === 'success' ? 'Timing parfait.' : 'Trop lent ou trop rapide.'}
                    </p>
                    <div className="flex gap-3">
                        {result === 'fail' && (
                            <button onClick={retry} className="flex-1 px-4 py-3 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 uppercase tracking-widest text-[10px] font-bold flex items-center justify-center gap-2">
                                <RotateCcw size={12} /> Réessayer
                            </button>
                        )}
                        <button onClick={result === 'success' ? nextLevel : retry} className={`flex-1 px-4 py-3 rounded-xl uppercase tracking-widest text-[10px] font-bold transition-all ${result === 'success' ? 'bg-gold text-dark' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                            {result === 'success' ? (level < LEVELS.length - 1 ? 'Niveau Suivant →' : 'Score Final') : 'Réessayer'}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
