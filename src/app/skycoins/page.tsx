'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PaymentBridgeModal } from '@/components/PaymentBridgeModal';
import { useI18n } from '@/context/I18nContext';
import { Crown, Sparkles, Trophy, Zap, Gift, CheckCircle2, Star, Shield, Play, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

const PACKS = [
    { id: 'starter', name: 'STARTER', coins: 100, price: '9,99€', bonus: 0, popular: false, glow: 'from-white/10 to-transparent' },
    { id: 'plus', name: 'PLUS', coins: 350, price: '29,99€', bonus: 50, popular: true, badge: 'LE PLUS PRISÉ', glow: 'from-gold/20 to-transparent' },
    { id: 'premium', name: 'PREMIUM', coins: 900, price: '69,99€', bonus: 200, popular: false, glow: 'from-gold/40 to-transparent' },
    { id: 'vip', name: 'VIP', coins: 2500, price: '179,99€', bonus: 700, popular: false, badge: 'MEILLEURE VALEUR', glow: 'from-purple-500/30 to-transparent' },
];

export default function SkyCoinsPage() {
    return (
        <Suspense fallback={<div className="page-container flex items-center justify-center min-h-screen"><div className="animate-pulse text-gold/50 text-xs font-bold uppercase tracking-widest">Chargement...</div></div>}>
            <SkyCoinsContent />
        </Suspense>
    );
}

function SkyCoinsContent() {
    const { data: session } = useSession();
    const router = useRouter();
    const { t } = useI18n();

    // State
    const [balance, setBalance] = useState<number | null>(null);
    const [missions, setMissions] = useState<any[]>([]);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [userRank, setUserRank] = useState<any>(null);
    const [rewards, setRewards] = useState<any[]>([]);
    const [claimingDaily, setClaimingDaily] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPack, setSelectedPack] = useState<typeof PACKS[0] | null>(null);

    useEffect(() => {
        if (session) {
            fetchBalance();
            fetchMissions();
            fetchLeaderboard();
            fetchRewards();
        }
    }, [session]);

    const fetchBalance = async () => {
        try {
            const res = await fetch('/api/skycoins');
            if (res.ok) setBalance((await res.json()).balance);
        } catch { }
    };

    const fetchMissions = async () => {
        try {
            const res = await fetch('/api/skycoins/missions');
            if (res.ok) setMissions(await res.json());
        } catch { }
    };

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch('/api/skycoins/leaderboard');
            if (res.ok) {
                const data = await res.json();
                setLeaderboard(data.leaderboard);
                setUserRank(data.userCurrentContext);
            }
        } catch { }
    };

    const fetchRewards = async () => {
        try {
            const res = await fetch('/api/skycoins/rewards');
            if (res.ok) setRewards(await res.json());
        } catch { }
    };

    const handleClaimDaily = async () => {
        if (claimingDaily) return;
        setClaimingDaily(true);
        try {
            const res = await fetch('/api/skycoins/daily-login', { method: 'POST' });
            const data = await res.json();
            if (res.ok) {
                toast.success(`+${data.bonus} SC ! (Multiplicateur x${data.multiplier})`);
                fetchBalance();
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error('Erreur Serveur');
        } finally {
            setClaimingDaily(false);
        }
    };

    const handleCompleteMission = async (key: string) => {
        try {
            const res = await fetch('/api/skycoins/missions/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ missionKey: key })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`Mission validée : +${data.reward} SC !`);
                fetchBalance();
                fetchMissions(); // Refresh status
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error('Erreur');
        }
    };

    const handleRedeemReward = async (rewardId: string, price: number) => {
        if (!balance || balance < price) {
            toast.error('Fonds insuffisants');
            return;
        }
        if (!confirm('Êtes-vous sûr de vouloir réclamer cette récompense ?')) return;

        try {
            const res = await fetch('/api/skycoins/rewards/redeem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rewardId })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Récompense réclamée ! Le support vous contactera.');
                fetchBalance();
            } else {
                toast.error(data.error);
            }
        } catch {
            toast.error('Erreur Serveur');
        }
    };

    function handleBuyPack(pack: typeof PACKS[0]) {
        if (!session) {
            router.push('/register');
            return;
        }
        setSelectedPack(pack);
        setIsModalOpen(true);
    }

    return (
        <div className="page-container max-w-6xl mx-auto px-4 py-8 pt-24 pb-32">

            {/* 1. HEADER & BALANCE */}
            <div className="text-center mb-16">
                <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-2 mb-8">
                    <span className="font-serif italic text-4xl md:text-5xl text-white">Programme</span>
                    <span className="gold-text-glow font-serif font-bold text-5xl md:text-7xl uppercase tracking-tighter shadow-gold">SkyCoins</span>
                </motion.h1>

                {session ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6">
                        <div className="inline-flex items-center gap-5 px-8 py-5 glass-gold rounded-[2rem] border border-gold/30 shadow-[0_0_30px_rgba(201,168,76,0.15)]">
                            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold text-2xl">✦</div>
                            <div className="text-left">
                                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Votre Solde</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-serif text-4xl gold-text leading-none">{balance ?? '...'}</span>
                                    <span className="text-gold/50 text-sm font-bold">SC</span>
                                </div>
                            </div>

                            {userRank && (
                                <div className="ml-6 pl-6 border-l border-gold/20 flex flex-col items-start hidden sm:flex">
                                    <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Statut Fan</p>
                                    <p className="font-bold text-sm text-cream flex items-center gap-1.5"><Crown size={14} className="text-gold" /> {userRank.badge}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <p className="text-white/40 mb-8 max-w-md mx-auto">Connectez-vous pour commencer à gagner des SkyCoins, accomplir des missions et monter dans le classement.</p>
                )}
            </div>

            {session && (
                <>
                    {/* 2. GAGNER DES SC (MISSIONS & DAILY) */}
                    <div className="mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <Zap className="text-gold" />
                            <h2 className="text-2xl font-serif text-cream">Gagner des SkyCoins</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Daily Login Card */}
                            <div className="card-premium relative overflow-hidden group col-span-1 border-gold/20 shadow-[0_0_20px_rgba(201,168,76,0.05)]">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Gift size={80} /></div>
                                <h3 className="text-cream font-bold text-lg mb-2 relative z-10">Récompense Quotidienne</h3>
                                <p className="text-white/40 text-xs mb-6 relative z-10">Connectez-vous tous les jours pour réclamer votre bonus gratuit.</p>
                                <PremiumButton
                                    onClick={handleClaimDaily}
                                    disabled={claimingDaily}
                                    className="w-full relative z-10"
                                    variant="gold"
                                >
                                    <Gift size={14} className="mr-2" /> {claimingDaily ? '...' : 'Réclamer +2 SC'}
                                </PremiumButton>
                                <p className="text-[9px] text-white/30 text-center mt-4 uppercase tracking-widest relative z-10">
                                    Bonus multiplié par votre abonnement (x1 à x5)
                                </p>
                            </div>

                            {/* Missions List */}
                            <div className="md:col-span-2 space-y-3">
                                <h3 className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-2 pl-2">Missions du Jour</h3>
                                {missions.map((mission) => (
                                    <div key={mission.key} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${mission.completed ? 'bg-green-500/5 border-green-500/20' : 'bg-dark-200/40 border-white/5 hover:border-white/20'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg">{mission.icon}</div>
                                            <div>
                                                <p className={`font-bold text-sm ${mission.completed ? 'text-green-400' : 'text-cream'}`}>{mission.title}</p>
                                                <p className="text-white/40 text-[10px]">{mission.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-gold text-sm">+{mission.reward} SC</span>
                                            <button
                                                onClick={() => handleCompleteMission(mission.key)}
                                                disabled={mission.completed}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${mission.completed ? 'bg-green-500 text-dark' : 'bg-white/10 text-white/40 hover:bg-gold hover:text-dark'}`}
                                            >
                                                {mission.completed ? <CheckCircle2 size={16} /> : <Play size={12} className="ml-0.5" />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. CLASSEMENT DES FANS */}
                    <div className="mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <Trophy className="text-gold" />
                            <h2 className="text-2xl font-serif text-cream">Classement des Fans</h2>
                        </div>

                        <div className="card-premium !p-0 overflow-hidden border-gold/10">
                            <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between items-center">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Top 50 Fans</span>
                                {userRank && (
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                                        Votre Rang : #{userRank.rank} ({userRank.badge})
                                    </span>
                                )}
                            </div>
                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                                {leaderboard.map((fan, i) => (
                                    <div key={i} className={`flex items-center gap-4 p-4 rounded-xl mb-1 ${fan.isCurrentUser ? 'bg-gold/10 border border-gold/30' : 'hover:bg-white/[0.02]'}`}>
                                        <div className={`w-8 font-serif font-bold text-lg text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-white/20'}`}>
                                            #{fan.rank}
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-dark bg-cover bg-center border border-white/10" style={{ backgroundImage: fan.avatarUrl ? `url(${fan.avatarUrl})` : 'none' }}>
                                            {!fan.avatarUrl && <div className="w-full h-full flex items-center justify-center text-white/20"><Star size={14} /></div>}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`font-bold text-sm ${fan.isCurrentUser ? 'text-gold' : 'text-cream'}`}>{fan.name} {fan.isCurrentUser && '(Vous)'}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-mono font-bold text-gold text-sm">{fan.score} SC</span>
                                        </div>
                                    </div>
                                ))}
                                {leaderboard.length === 0 && <p className="text-white/40 text-center py-8 text-sm">Le classement est en cours de calcul...</p>}
                            </div>
                        </div>
                    </div>

                    {/* 4. BOUTIQUE DE RECOMPENSES */}
                    <div className="mb-24">
                        <div className="flex items-center gap-3 mb-4">
                            <Gift className="text-gold" />
                            <h2 className="text-2xl font-serif text-cream">Boutique de Récompenses</h2>
                        </div>
                        <p className="text-white/40 text-sm mb-8">Échangez vos SkyCoins cumulés contre du contenu exclusif ou des objets physiques collectors.</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {rewards.map((reward) => (
                                <div key={reward.id} className="card-premium !p-5 flex flex-col justify-between hover:border-gold/30 transition-colors group">
                                    <div>
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                                            {reward.icon}
                                        </div>
                                        <span className="text-[8px] uppercase font-bold tracking-widest text-white/30 bg-white/5 px-2 py-1 rounded inline-block mb-3">
                                            {reward.type === 'DIGITAL' ? 'Contenu Digital' : 'Objet Physique'}
                                        </span>
                                        <h4 className="text-cream font-bold text-sm mb-6 leading-tight">{reward.title}</h4>
                                    </div>
                                    <button
                                        onClick={() => handleRedeemReward(reward.id, reward.price)}
                                        className="w-full py-3 rounded-xl border border-gold/20 bg-gold/5 text-gold text-[10px] uppercase font-bold tracking-widest hover:bg-gold hover:text-dark transition-all"
                                    >
                                        Réclamer — {reward.price} SC
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* 5. PACKS D'ACHAT */}
            <div className="mb-20">
                <div className="flex items-center gap-3 justify-center mb-12">
                    <Ticket className="text-gold" />
                    <h2 className="text-3xl font-serif text-cream text-center">Acheter des SkyCoins <span className="gold-text italic">Instantanés</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PACKS.map((pack) => (
                        <motion.div
                            key={pack.id}
                            onClick={() => handleBuyPack(pack)}
                            className={`group relative cursor-pointer overflow-hidden rounded-[2.5rem] border transition-all duration-500 p-8 flex flex-col items-center ${pack.popular ? 'bg-gold/5 border-gold/40 shadow-[0_15px_40px_rgba(201,168,76,0.15)] scale-[1.02] z-10' : 'bg-dark-200/40 border-white/5 hover:border-white/20'
                                }`}
                        >
                            {pack.badge && (
                                <div className="absolute top-5 inset-x-0 flex justify-center z-20">
                                    <span className={`text-[8px] uppercase tracking-[0.3em] px-3 py-1 rounded-full font-black ${pack.id === 'vip' ? 'bg-purple-600 text-white' : 'bg-gold text-dark'}`}>
                                        {pack.badge}
                                    </span>
                                </div>
                            )}

                            <div className="relative mb-8 mt-6">
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                    {pack.id === 'starter' ? '⭐' : pack.id === 'plus' ? '🔥' : pack.id === 'premium' ? '💎' : '👑'}
                                </div>
                                {pack.bonus > 0 && <div className="absolute -bottom-2 -right-3 bg-gold px-2.5 py-1 rounded-md text-[9px] font-black text-dark shadow-xl">+{pack.bonus}</div>}
                            </div>

                            <h3 className="font-serif text-lg text-white/40 mb-1 uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                                {pack.name}
                            </h3>

                            <div className="flex flex-col items-center mb-8">
                                <p className="font-serif text-4xl gold-text mb-2 tracking-tight">{pack.coins} SC</p>
                                <p className="text-white/60 text-sm font-light">{pack.price}</p>
                            </div>

                            <PremiumButton variant={pack.popular ? 'gold' : 'outline'} fullWidth className="!py-3 uppercase text-[10px] tracking-widest mt-auto">Sélectionner</PremiumButton>
                        </motion.div>
                    ))}
                </div>
            </div>

            {selectedPack && (
                <PaymentBridgeModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    tierName={`${selectedPack.name} (${selectedPack.coins} SC)`}
                    price={selectedPack.price}
                    type="skycoins"
                />
            )}

            {/* Multiplier Info Card */}
            <div className="max-w-3xl mx-auto card-premium !p-8 border-gold/20 flex flex-col md:flex-row gap-8 items-center bg-[url('/images/noise.png')]">
                <div className="w-24 h-24 shrink-0 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <Crown className="text-gold w-10 h-10" />
                </div>
                <div>
                    <h3 className="text-xl font-serif text-cream mb-2">Avantage Abonnés</h3>
                    <p className="text-white/50 text-sm leading-relaxed mb-4">
                        Avoir un abonnement actif vous permet de multiplier vos gains lors de vos connexions et accomplissements.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <span className="text-[10px] px-3 py-1.5 bg-white/5 border border-white/10 rounded uppercase font-bold text-white/40">Voyeur : x1</span>
                        <span className="text-[10px] px-3 py-1.5 bg-white/5 border border-white/10 rounded uppercase font-bold text-white/60">Initié : x2</span>
                        <span className="text-[10px] px-3 py-1.5 bg-gold/10 border border-gold/30 rounded uppercase font-bold text-gold">Privilège : x3</span>
                        <span className="text-[10px] px-3 py-1.5 bg-purple-500/20 border border-purple-500/40 rounded uppercase font-bold text-purple-400">SkyClub : x5</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
