'use client';

import { useSession } from 'next-auth/react';
import ChatInterface from '@/components/chat/ChatInterface';
import Link from 'next/link';
import { MILAN_NAME } from '@/lib/constants';

export default function ChatPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-400">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen px-4 bg-dark-400">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/20">
            <span className="text-4xl">💬</span>
          </div>
          <h1 className="font-serif text-3xl gold-text mb-4 text-cream">Chat avec {MILAN_NAME}</h1>
          <p className="text-white/40 mb-8 text-sm leading-relaxed">Connecte-toi pour accéder à ton espace privé et échanger directement avec moi.</p>
          <Link href="/login?callbackUrl=/chat" className="btn-gold w-full block py-4 text-center rounded-xl font-bold tracking-widest uppercase text-xs">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-dark-400">
      <div className="max-w-7xl mx-auto px-0 md:px-6 lg:px-8">
        <ChatInterface />
      </div>
    </div>
  );
}
