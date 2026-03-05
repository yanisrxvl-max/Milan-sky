'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, PlayCircle, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContentViewerPage() {
    return (
        <Suspense fallback={<div className="page-container flex items-center justify-center min-h-screen"><div className="animate-pulse text-gold/50">Chargement...</div></div>}>
            <ContentViewer />
        </Suspense>
    );
}

function ContentViewer() {
    const { status } = useSession();
    const router = useRouter();
    const params = useParams();
    const contentId = params.id as string;

    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchContentDetails();
        }
    }, [status, router, contentId]);

    async function fetchContentDetails() {
        try {
            const res = await fetch(`/api/content/${contentId}`);
            const data = await res.json();

            if (res.ok) {
                setContent(data.content);
            } else {
                setError(data.error || 'Erreur lors du chargement');
            }
        } catch (e) {
            setError('Erreur de connexion');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="page-container flex items-center justify-center min-h-screen"><div className="animate-pulse text-gold/50">Déchiffrement...</div></div>;
    }

    if (error || !content) {
        return (
            <div className="page-container flex flex-col items-center justify-center min-h-screen">
                <h2 className="font-serif text-2xl gold-text mb-4">Accès Restreint</h2>
                <p className="text-white/50 mb-8">{error}</p>
                <button onClick={() => router.push('/library')} className="btn-outline flex items-center gap-2">
                    <ArrowLeft size={16} /> Retour au coffre
                </button>
            </div>
        );
    }

    return (
        <div className="page-container max-w-5xl mx-auto px-4 py-8 pt-24">
            {/* Top Nav */}
            <button
                onClick={() => router.push('/library')}
                className="text-white/40 hover:text-white transition-colors flex items-center gap-2 mb-8"
            >
                <ArrowLeft size={18} /> Retour
            </button>

            {/* Main Content Area */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-dark-200 border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
            >
                <div className="aspect-video bg-black relative flex items-center justify-center">
                    {content.type === 'VIDEO' || content.type === 'SERIES' ? (
                        <video
                            src={content.mediaUrl}
                            poster={content.imageUrl}
                            controls
                            controlsList="nodownload"
                            className="w-full h-full object-contain"
                            autoPlay
                        />
                    ) : content.type === 'PHOTO' ? (
                        <img
                            src={content.mediaUrl}
                            alt={content.title}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="text-white/20"><PlayCircle size={64} /></div>
                    )}
                </div>

                {/* Info Section */}
                <div className="p-6 md:p-10 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                            <span className="text-xs font-semibold px-3 py-1 bg-gold/10 rounded-full text-gold border border-gold/20 mb-3 inline-block">
                                {content.type}
                            </span>
                            <h1 className="font-serif text-3xl md:text-4xl text-cream">{content.title}</h1>
                        </div>
                        <div className="text-white/30 text-sm">
                            Publié le {new Date(content.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <p className="text-white/60 leading-relaxed max-w-3xl">
                        {content.description || "Aucune description fournie."}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
