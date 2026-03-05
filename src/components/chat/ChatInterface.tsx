'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Sparkles, MessageSquare, ChevronRight, ChevronLeft, Lock, Image as ImageIcon, Video, Send, Heart, DollarSign } from 'lucide-react';
import { MILAN_NAME, MILAN_AVATARS } from '@/lib/constants';

interface Message {
    id: string;
    content: string | null;
    sender: 'USER' | 'MILAN';
    messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'LOCKED_IMAGE' | 'LOCKED_VIDEO' | 'TIP';
    mediaUrl: string | null;
    isLocked: boolean;
    price: number;
    isPaid: boolean;
    createdAt: string;
}

export default function ChatInterface() {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [remaining, setRemaining] = useState<number | null>(null);
    const [dailyLimit, setDailyLimit] = useState(5);
    const [showTipModal, setShowTipModal] = useState(false);
    const [tipAmount, setTipAmount] = useState(50);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const userTier = session?.user?.subscription?.tier || 'VOYEUR';
    const mAvatar = (MILAN_AVATARS as any)[userTier] || MILAN_AVATARS.GUEST;

    useEffect(() => {
        if (session) {
            fetchMessages();
        }
    }, [session]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/chat/messages');
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages);
                setRemaining(data.remaining);
                setDailyLimit(data.dailyLimit);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const sendMessage = async (text?: string) => {
        const content = text || input.trim();
        if (!content || sending) return;

        if (remaining !== null && remaining <= 0) {
            toast.error('Limite de messages atteinte. Upgradez votre compte !');
            return;
        }

        setSending(true);
        setInput('');

        // Optimistic User Message
        const tempId = `temp-${Date.now()}`;
        const newUserMsg: Message = {
            id: tempId,
            content,
            sender: 'USER',
            messageType: 'TEXT',
            mediaUrl: null,
            isLocked: false,
            price: 0,
            isPaid: false,
            createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, newUserMsg]);

        try {
            const res = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessages(prev => [
                    ...prev.filter(m => m.id !== tempId),
                    data.userMessage,
                    data.milanMessage,
                ]);
                setRemaining(data.remaining);
            } else {
                setMessages(prev => prev.filter(m => m.id !== tempId));
                toast.error(data.error || 'Erreur lors de l\'envoi');
            }
        } catch (e) {
            setMessages(prev => prev.filter(m => m.id !== tempId));
            toast.error('Erreur réseau');
        } finally {
            setSending(false);
        }
    };

    const handleUnlock = async (messageId: string, price: number) => {
        try {
            const res = await fetch('/api/chat/unlock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messageId }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isPaid: true } : m));
                toast.success('Contenu débloqué ! 🔥');
            } else {
                toast.error(data.error || 'Erreur');
            }
        } catch (e) {
            toast.error('Erreur réseau');
        }
    };

    const handleSendTip = async () => {
        try {
            const res = await fetch('/api/chat/tip', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: tipAmount }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessages(prev => [...prev, data.message]);
                setShowTipModal(false);
                toast.success(`Merci pour les ${tipAmount} SkyCoins ! 😘`);
            } else {
                toast.error(data.error || 'Erreur');
            }
        } catch (e) {
            toast.error('Erreur réseau');
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] md:h-[calc(100dvh-5rem)] w-full md:max-w-2xl mx-auto bg-dark-500 md:bg-dark-200/50 md:backdrop-blur-xl md:rounded-2xl md:border md:border-white/5 shadow-2xl overflow-hidden fixed md:relative inset-0 md:mt-20 z-[150] md:z-auto pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] md:pb-0">
            {/* Header */}
            <div className="flex items-center gap-3 md:gap-4 p-4 border-b border-gold/10 bg-dark-300/40 shrink-0">
                <Link href="/" className="md:hidden w-10 h-10 min-h-[44px] min-w-[44px] rounded-full bg-white/5 flex items-center justify-center text-white/60 touch-manipulation active:scale-95 shrink-0">
                    <ChevronLeft size={20} />
                </Link>
                <div className="relative w-12 h-12">
                    <img src={mAvatar} alt={MILAN_NAME} className="w-full h-full rounded-full object-cover border border-gold/30" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-dark-300" />
                </div>
                <div className="flex-1">
                    <h2 className="font-serif text-cream text-lg leading-tight">{MILAN_NAME}</h2>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">Iconic Creator</p>
                </div>
                <div className="text-right">
                    <p className="text-gold/60 text-[10px] uppercase tracking-widest leading-none mb-1">
                        {remaining !== null ? `${remaining}/${dailyLimit} messages` : ''}
                    </p>
                    <Link href="/subscriptions" className="text-[10px] text-white/20 hover:text-gold transition-colors">Upgrade Tier</Link>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex flex-col max-w-[85%] ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}>
                            <div className={`relative px-4 py-3 rounded-2xl group ${msg.sender === 'USER'
                                ? 'bg-gradient-to-br from-gold/30 to-gold/10 text-cream rounded-tr-none border border-gold/20'
                                : 'glass text-white/90 rounded-tl-none border border-white/5'
                                }`}>
                                {/* Message Content */}
                                {msg.messageType === 'TEXT' && <div>{msg.content}</div>}

                                {(msg.messageType === 'IMAGE' || (msg.messageType === 'LOCKED_IMAGE' && msg.isPaid)) && (
                                    <div className="rounded-xl overflow-hidden mb-2 border border-white/10 shadow-lg">
                                        <img src={msg.mediaUrl || ''} alt="Media" className="max-w-full h-auto object-cover" />
                                    </div>
                                )}

                                {msg.messageType === 'LOCKED_IMAGE' && !msg.isPaid && (
                                    <div className="relative w-full aspect-square md:w-64 rounded-xl overflow-hidden bg-black/40 border border-gold/20 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="absolute inset-0 blur-xl opacity-20 pointer-events-none">
                                            <img src={mAvatar} className="w-full h-full object-cover" alt="blurred" />
                                        </div>
                                        <div className="relative z-10 flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30">
                                                <Lock className="text-gold" size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-gold text-sm font-medium">Contenu Exclusif</p>
                                                <p className="text-white/40 text-[11px] px-2">{msg.content || 'Photo privée de Milan'}</p>
                                            </div>
                                            <button
                                                onClick={() => handleUnlock(msg.id, msg.price)}
                                                className="mt-4 w-full bg-gold text-dark-400 text-xs font-bold py-2 px-4 rounded-full hover:bg-gold-light transition-all flex items-center justify-center gap-2"
                                            >
                                                Débloquer pour {msg.price} <DollarSign size={12} className="-mx-1" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {msg.messageType === 'TIP' && (
                                    <div className="flex items-center gap-3 py-1">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40">
                                            <Heart className="text-emerald-400 fill-emerald-400" size={14} />
                                        </div>
                                        <div className="text-xs font-medium text-emerald-400">
                                            Tip: {msg.price} SkyCoins
                                        </div>
                                    </div>
                                )}

                                <p className={`text-[10px] mt-2 ${msg.sender === 'USER' ? 'text-gold/40' : 'text-white/20'} font-mono`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {sending && (
                    <div className="flex justify-start">
                        <div className="glass px-4 py-3 rounded-2xl rounded-tl-none border border-white/5">
                            <div className="flex gap-1.5">
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="p-4 bg-dark-400/80 border-t border-white/5">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowTipModal(true)}
                        className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    >
                        <DollarSign size={20} />
                    </button>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Envoyer un message à Milan..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-cream placeholder:text-white/20 focus:outline-none focus:border-gold/30 transition-all"
                        />
                    </div>

                    <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || sending}
                        className="w-10 h-10 min-h-[44px] min-w-[44px] rounded-xl bg-gold flex items-center justify-center text-dark-400 disabled:opacity-30 transition-all touch-manipulation active:scale-95"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>

            {/* Tip Modal */}
            <AnimatePresence>
                {showTipModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-dark-300 border border-gold/20 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
                        >
                            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 border border-gold/20">
                                <Heart className="text-gold fill-gold/20" size={32} />
                            </div>
                            <h3 className="font-serif text-2xl text-cream mb-2">Envoyer un Pourboire</h3>
                            <p className="text-white/40 text-sm mb-6">Soutiens Milan et obtiens son attention prioritaire.</p>

                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {[50, 100, 500].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setTipAmount(val)}
                                        className={`py-3 rounded-xl border transition-all ${tipAmount === val ? 'bg-gold border-gold text-dark-400' : 'bg-white/5 border-white/10 text-white/60 hover:border-gold/30'}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setShowTipModal(false)} className="flex-1 py-3 text-white/40 text-sm">Annuler</button>
                                <button onClick={handleSendTip} className="flex-[2] btn-gold">Envoyer Tip</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
