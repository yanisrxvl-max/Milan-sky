'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CreatorChatDashboard from '@/components/chat/CreatorChatDashboard';
import { useEffect } from 'react';

export default function AdminChatPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/chat');
        }
    }, [session, status]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-400">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!session || session.user.role !== 'ADMIN') {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen bg-dark-400">
            <CreatorChatDashboard />
        </div>
    );
}
