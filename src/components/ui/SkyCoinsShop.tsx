'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PremiumButton } from '@/components/ui/PremiumButton';

const PACKS = [
    { id: 'starter', name: 'Pack Découverte', coins: 50, price: '9,90 €', bonus: 0, popular: false },
    { id: 'plus', name: 'Pack Habitué', coins: 120, price: '19,90 €', bonus: 10, popular: true, badge: 'Populaire' },
    { id: 'premium', name: 'Pack Collectionneur', coins: 350, price: '49,90 €', bonus: 50, popular: false },
    { id: 'vip', name: 'Pack Investisseur', coins: 800, price: '99,90 €', bonus: 150, popular: false, badge: 'VIP' }
];

export default function SkyCoinsShop() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loadingPack, setLoadingPack] = useState<string | null>(null);

    async function handleBuyPack(pack: typeof PACKS[0]) {
        if (!session) {
            router.push('/register');
            return;
        }

        setLoadingPack(pack.id);
        try {
            const res = await fetch('/api/skycoins', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packId: pack.id }),
            });
            const data = await res.json();
            if (res.ok && data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || 'Erreur lors de la redirection');
            }
        } catch (err) {
            toast.error('Erreur de connexion');
        } finally {
            setLoadingPack(null);
        }
    }

    return (
        <div className="w-full max-w-6xl mx-auto py-12 px-4">
            <div className="flex flex-col items-center gap-3 justify-center mb-12">
                <Ticket className="text-gold" size={32} />
                <h2 className="text-3xl md:text-4xl font-serif text-cream text-center">Acheter des SkyCoins <span className="gold-text italic">Instantanés</span></h2>
                <p className="text-white/40 text-sm max-w-lg text-center mt-2">Recharge ton solde pour accéder aux Muses, collections privées et Archives Floues.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {PACKS.map((pack) => (
                    <motion.div
                        key={pack.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onClick={() => handleBuyPack(pack)}
                        className={`group relative cursor-pointer overflow-hidden rounded-[2.5rem] border transition-all duration-500 p-8 flex flex-col items-center ${pack.popular ? 'bg-gold/5 border-gold/40 shadow-[0_15px_40px_rgba(201,168,76,0.15)] scale-[1.02] z-10' : 'bg-dark-200/40 border-white/5 hover:border-white/20'}`}
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

                        <h3 className="font-serif text-lg text-white/40 mb-1 uppercase tracking-[0.3em] group-hover:text-white transition-colors text-center">
                            {pack.name}
                        </h3>

                        <div className="flex flex-col items-center mb-6">
                            <p className="font-serif text-4xl gold-text mb-2 tracking-tight text-center">{pack.coins} SC</p>
                            <p className="text-white/60 text-sm font-light text-center">{pack.price}</p>
                        </div>

                        <PremiumButton
                            onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleBuyPack(pack); }}
                            disabled={loadingPack === pack.id}
                            variant={pack.popular ? 'gold' : 'outline'}
                            fullWidth
                            className="!py-3 uppercase text-[10px] tracking-widest mt-auto z-20 relative w-full"
                        >
                            {loadingPack === pack.id ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Sélectionner'}
                        </PremiumButton>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
