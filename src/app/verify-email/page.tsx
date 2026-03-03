'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="page-container flex items-center justify-center min-h-screen"><div className="animate-pulse text-white/30">Vérification...</div></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
    }
  }, [token]);

  async function verifyEmail(verifyToken: string) {
    try {
      const res = await fetch(`/api/verify-email?token=${verifyToken}`);
      if (res.ok || res.redirected) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="page-container flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md text-center">
        {status === 'loading' && (
          <>
            <div className="animate-pulse text-4xl mb-6">⏳</div>
            <h1 className="font-serif text-3xl gold-text mb-3">Vérification en cours...</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-5xl mb-6">✅</div>
            <h1 className="font-serif text-3xl gold-text mb-3">Email vérifié !</h1>
            <p className="text-white/50 mb-8">Votre compte est maintenant actif.</p>
            <Link href="/login" className="btn-gold">
              Se connecter
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-5xl mb-6">❌</div>
            <h1 className="font-serif text-3xl text-red-400 mb-3">Lien invalide</h1>
            <p className="text-white/50 mb-8">Ce lien de vérification est invalide ou a expiré.</p>
            <Link href="/register" className="btn-outline">
              Créer un nouveau compte
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
