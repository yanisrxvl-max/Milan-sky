'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Tag, User } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/context/I18nContext';

// Template structure for future articles — no content needed yet
const ARTICLE_CATEGORIES = [
    { id: 'lifestyle', label: 'Lifestyle', color: 'text-gold' },
    { id: 'tech', label: 'Tech & IA', color: 'text-blue-400' },
    { id: 'engagement', label: 'Engagement', color: 'text-emerald-400' },
    { id: 'mindset', label: 'Mindset', color: 'text-purple-400' },
];

// Placeholder articles — to be replaced with real content later
const PLACEHOLDER_ARTICLES = [
    {
        id: 'coming-1',
        title: 'Bientôt disponible',
        excerpt: 'Un nouveau contenu sera publié prochainement. Restez connectés.',
        category: 'lifestyle',
        readTime: '5 min',
        date: 'À venir',
        imageUrl: '/images/milan_basic.jpg',
    },
    {
        id: 'coming-2',
        title: 'Bientôt disponible',
        excerpt: 'Un nouveau contenu sera publié prochainement. Restez connectés.',
        category: 'engagement',
        readTime: '7 min',
        date: 'À venir',
        imageUrl: '/images/milan_elite.jpg',
    },
    {
        id: 'coming-3',
        title: 'Bientôt disponible',
        excerpt: 'Un nouveau contenu sera publié prochainement. Restez connectés.',
        category: 'tech',
        readTime: '10 min',
        date: 'À venir',
        imageUrl: '/images/milan_icon.jpg',
    },
];

function ArticleCard({ article, idx }: { article: typeof PLACEHOLDER_ARTICLES[0]; idx: number }) {
    const category = ARTICLE_CATEGORIES.find(c => c.id === article.category);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group cursor-pointer"
        >
            {/* Thumbnail */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-dark-200 mb-5">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60"
                    style={{ backgroundImage: `url(${article.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-dark-500/50 to-transparent" />

                {/* Category */}
                <div className="absolute top-4 left-4">
                    <span className={`text-[9px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 ${category?.color || 'text-white/50'}`}>
                        {category?.label || article.category}
                    </span>
                </div>

                {/* Read time */}
                <div className="absolute bottom-4 right-4">
                    <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded">
                        <Clock size={10} /> {article.readTime}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="px-1">
                <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                    <User size={10} /> Milan Sky
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    {article.date}
                </p>
                <h3 className="font-serif text-xl text-cream mb-2 group-hover:text-gold transition-colors leading-snug">
                    {article.title}
                </h3>
                <p className="text-white/30 text-sm leading-relaxed">{article.excerpt}</p>
            </div>
        </motion.div>
    );
}

export default function BlogPage() {
    const { t } = useI18n();
    return (
        <main className="relative w-full bg-dark-500 overflow-hidden min-h-screen">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-dark-500/95" />
            </div>

            {/* Header */}
            <section className="relative z-10 pt-32 pb-12 border-b border-white/[0.04]">
                <div className="max-w-6xl mx-auto px-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-gold text-[10px] uppercase tracking-widest font-bold mb-8 transition-colors">
                        <ArrowLeft size={14} /> {t('general.back')}
                    </Link>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-4xl md:text-6xl text-cream tracking-tight mb-4"
                    >
                        {t('blog.title')} <span className="gold-text italic">{t('blog.title_accent')}</span>
                    </motion.h1>
                    <p className="text-white/40 text-sm max-w-lg">
                        {t('blog.subtitle')}
                    </p>
                </div>
            </section>

            {/* Category Filters */}
            <section className="relative z-10 max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    <button className="px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-gold text-dark">
                        {t('blog.all')}
                    </button>
                    {ARTICLE_CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            className="px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 transition-all whitespace-nowrap"
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Articles Grid */}
            <section className="relative z-10 max-w-6xl mx-auto px-4 py-8 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PLACEHOLDER_ARTICLES.map((article, idx) => (
                        <ArticleCard key={article.id} article={article} idx={idx} />
                    ))}
                </div>

                {/* Empty state hint */}
                <div className="mt-16 text-center p-12 rounded-3xl border border-dashed border-white/10 bg-white/[0.01]">
                    <Tag className="text-white/15 mx-auto mb-4" size={28} />
                    <p className="text-white/20 text-xs uppercase tracking-widest font-bold mb-2">{t('blog.coming_soon')}</p>
                    <p className="text-white/10 text-[10px]">{t('blog.coming_soon_long')}</p>
                </div>
            </section>
        </main>
    );
}
