'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    Users, MessageSquare, Star, DollarSign, Filter, Search,
    Send, Lock, Image as ImageIcon, CheckCheck, Clock, Archive
} from 'lucide-react';
import { MILAN_NAME } from '@/lib/constants';

interface Conversation {
    id: string;
    userId: string;
    unreadCount: number;
    isPriority: boolean;
    lastMessageAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string;
        totalSpentInChat: number;
        subscription: { tier: string } | null;
    };
    messages: any[];
}

export default function CreatorChatDashboard() {
    const { data: session } = useSession();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Locked Content Modal state
    const [showLockModal, setShowLockModal] = useState(false);
    const [lockPrice, setLockPrice] = useState(100);
    const [lockMediaUrl, setLockMediaUrl] = useState('');
    const [lockDesc, setLockDesc] = useState('');

    useEffect(() => {
        if (session?.user?.role === 'ADMIN') {
            fetchConversations();
        }
    }, [session, filter]);

    useEffect(() => {
        if (selectedConv) {
            fetchMessages(selectedConv.userId);
            markAsRead(selectedConv.id);
        }
    }, [selectedConv]);

    const fetchConversations = async () => {
        try {
            const res = await fetch(`/api/chat/admin/conversations?filter=${filter}`);
            if (res.ok) {
                const data = await res.json();
                setConversations(data.conversations);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchMessages = async (userId: string) => {
        try {
            // Re-using the same messages route but passing userId would requires update to the route or a separate admin message route
            // For now, let's assume we fetch them via a query param or separate route
            const res = await fetch(`/api/chat/messages?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const markAsRead = async (convId: string) => {
        try {
            await fetch('/api/chat/admin/conversations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: convId, unreadCount: 0 }),
            });
            setConversations(prev => prev.map(c => c.id === convId ? { ...c, unreadCount: 0 } : c));
        } catch (e) { }
    };

    const sendMessage = async (type: string = 'TEXT', extra: any = {}) => {
        if (!selectedConv || isSending) return;
        setIsSending(true);

        try {
            const res = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedConv.userId, // Creator sending TO user
                    content: extra.content || input,
                    messageType: type,
                    isLocked: extra.isLocked || false,
                    price: extra.price || 0,
                    mediaUrl: extra.mediaUrl || null,
                    sender: 'MILAN',
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessages(prev => [...prev, data.milanMessage]);
                setInput('');
                setShowLockModal(false);
                toast.success('Envoyé !');
            } else {
                toast.error(data.error);
            }
        } catch (e) {
            toast.error('Erreur');
        } finally {
            setIsSending(false);
        }
    };

    const togglePriority = async (conv: Conversation) => {
        try {
            const res = await fetch('/api/chat/admin/conversations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: conv.id, isPriority: !conv.isPriority }),
            });
            if (res.ok) {
                setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, isPriority: !c.isPriority } : c));
                toast.success(conv.isPriority ? 'Retiré des priorités' : 'Marqué comme priorité ⭐');
            }
        } catch (e) { }
    };

    const filteredConversations = conversations.filter(c =>
        c.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100dvh-5rem)] bg-dark-400 mt-20 border-t border-white/5 overflow-hidden">
            {/* Sidebar - Conversation List */}
            <div className="w-80 md:w-96 border-r border-white/5 flex flex-col bg-dark-300/30">
                <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="font-serif text-xl text-cream">Messages</h1>
                        <div className="flex gap-2">
                            <button onClick={() => setFilter('all')} className={`p-1.5 rounded-lg transition-all ${filter === 'all' ? 'bg-gold/20 text-gold' : 'text-white/20'}`}><Users size={18} /></button>
                            <button onClick={() => setFilter('vip')} className={`p-1.5 rounded-lg transition-all ${filter === 'vip' ? 'bg-gold/20 text-gold' : 'text-white/20'}`}><Star size={18} /></button>
                            <button onClick={() => setFilter('unread')} className={`p-1.5 rounded-lg transition-all ${filter === 'unread' ? 'bg-gold/20 text-gold' : 'text-white/20'}`}><MessageSquare size={18} /></button>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input
                            type="text"
                            placeholder="Rechercher un fan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-cream focus:outline-none focus:border-gold/30"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                    {filteredConversations.map(conv => (
                        <button
                            key={conv.id}
                            onClick={() => setSelectedConv(conv)}
                            className={`w-full p-4 flex gap-4 transition-all hover:bg-white/5 ${selectedConv?.id === conv.id ? 'bg-gold/5 border-l-4 border-gold' : 'border-l-4 border-transparent'}`}
                        >
                            <div className="relative shrink-0">
                                <img src={conv.user.avatarUrl || '/images/default_avatar.jpg'} className="w-12 h-12 rounded-full object-cover border border-white/10" alt="" />
                                {conv.unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-dark-400 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-dark-300">
                                        {conv.unreadCount}
                                    </span>
                                )}
                            </div>
                            <div className="flex-1 text-left overflow-hidden">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-cream font-medium text-sm truncate">{conv.user.name || 'Anonyme'}</span>
                                    <span className="text-white/20 text-[10px] uppercase font-mono">{conv.user.subscription?.tier || 'FREE'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className={`truncate ${conv.unreadCount > 0 ? 'text-white font-medium' : 'text-white/30'}`}>
                                        {conv.messages[0]?.content || 'Pas de message'}
                                    </span>
                                    <div className="flex items-center gap-2 shrink-0 ml-2">
                                        {conv.isPriority && <Star size={10} className="text-gold fill-gold" />}
                                        <span className="text-white/20">{new Date(conv.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            {selectedConv ? (
                <div className="flex-1 flex flex-col bg-dark-400/50 relative">
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-dark-300/20">
                        <div className="flex items-center gap-3">
                            <div>
                                <h3 className="text-cream font-medium">{selectedConv.user.name || selectedConv.user.email}</h3>
                                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest">
                                    <span className="text-gold flex items-center gap-1"><DollarSign size={10} /> {selectedConv.user.totalSpentInChat} total</span>
                                    <span className="text-white/20">|</span>
                                    <span className="text-emerald-400">En ligne</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => togglePriority(selectedConv)}
                                className={`p-2 rounded-xl border transition-all ${selectedConv.isPriority ? 'bg-gold/20 border-gold text-gold' : 'bg-white/5 border-white/10 text-white/20'}`}
                            >
                                <Star size={18} fill={selectedConv.isPriority ? 'currentColor' : 'none'} />
                            </button>
                            <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/20 hover:text-red-400 transition-all">
                                <Archive size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'MILAN' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-4 rounded-2xl ${msg.sender === 'MILAN' ? 'bg-gold text-dark-400 rounded-tr-none' : 'bg-white/5 text-cream border border-white/10 rounded-tl-none'}`}>
                                    {msg.messageType.startsWith('LOCKED') && (
                                        <div className="flex items-center gap-2 mb-2 bg-black/20 p-2 rounded text-[10px] font-bold uppercase tracking-widest">
                                            <Lock size={12} /> LOCKED CONTENT ({msg.price} SC)
                                            {msg.isPaid && <span className="text-emerald-400 ml-auto">PAID</span>}
                                        </div>
                                    )}
                                    <p className="text-sm">{msg.content}</p>
                                    {msg.mediaUrl && (
                                        <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
                                            <img src={msg.mediaUrl} alt="media" className="max-w-full h-auto" />
                                        </div>
                                    )}
                                    <div className={`text-[9px] mt-2 opacity-40 font-mono ${msg.sender === 'MILAN' ? 'text-dark-400' : 'text-white'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString()} {msg.isAI ? '(AI REPLY)' : ''}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-dark-300/40 border-t border-white/5">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowLockModal(true)}
                                className="p-3 rounded-xl bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-all"
                                title="Send Locked Content"
                            >
                                <Lock size={20} />
                            </button>
                            <div className="flex-1 relative">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Répondre au fan..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-cream focus:outline-none focus:border-gold/30 min-h-[44px] max-h-32"
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                />
                            </div>
                            <button
                                disabled={!input.trim() || isSending}
                                onClick={() => sendMessage()}
                                className="p-3 rounded-xl bg-gold text-dark-400 disabled:opacity-30 transition-all"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-20">
                    <MessageSquare size={64} className="mb-4" />
                    <h2 className="font-serif text-2xl">Sélectionnez une conversation</h2>
                    <p>Milan, tes fans attendent tes réponses...</p>
                </div>
            )}

            {/* Locked Content Modal */}
            <AnimatePresence>
                {showLockModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-dark-300 border border-gold/20 p-8 rounded-3xl w-full max-w-md shadow-2xl">
                            <h3 className="font-serif text-2xl text-gold mb-6 text-center">Envoyer un Contenu Verrouillé</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Media URL (Image/Video)</label>
                                    <input value={lockMediaUrl} onChange={e => setLockMediaUrl(e.target.value)} type="text" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm" placeholder="URL Cloudinary..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Prix (SkyCoins)</label>
                                        <input value={lockPrice} onChange={e => setLockPrice(Number(e.target.value))} type="number" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Type</label>
                                        <select className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm appearance-none">
                                            <option value="LOCKED_IMAGE">Photo 📸</option>
                                            <option value="LOCKED_VIDEO">Vidéo 🎬</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Description / Teasing</label>
                                    <textarea value={lockDesc} onChange={e => setLockDesc(e.target.value)} className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm" rows={3} placeholder="Petit aperçu pour le fan..." />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button onClick={() => setShowLockModal(false)} className="flex-1 py-3 text-white/30 text-sm">Annuler</button>
                                <button onClick={() => sendMessage('LOCKED_IMAGE', { isLocked: true, price: lockPrice, mediaUrl: lockMediaUrl, content: lockDesc })} className="flex-[2] btn-gold">Envoyer le Drop</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
