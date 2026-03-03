'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="page-container flex items-center justify-center min-h-screen"><div className="animate-pulse text-white/30">Chargement...</div></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // If we have a token, show the new password form
  if (token) {
    return <NewPasswordForm token={token} />;
  }

  return <RequestResetForm />;
}

function RequestResetForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erreur');
      }
    } catch {
      toast.error('Erreur serveur');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-6">📧</div>
          <h1 className="font-serif text-3xl gold-text mb-4">Email envoyé</h1>
          <p className="text-white/50 mb-8">
            Si un compte existe avec cette adresse, vous recevrez un email de réinitialisation.
          </p>
          <Link href="/login" className="btn-outline">
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl gold-text mb-3">Mot de passe oublié</h1>
          <p className="text-white/40 text-sm">Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-white/50 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="votre@email.com"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-gold w-full text-center">
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>

        <p className="text-center mt-8 text-white/30 text-sm">
          <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}

function NewPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        toast.success('Mot de passe mis à jour');
      } else {
        toast.error(data.error || 'Erreur');
      }
    } catch {
      toast.error('Erreur serveur');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-6">✅</div>
          <h1 className="font-serif text-3xl gold-text mb-4">Mot de passe mis à jour</h1>
          <p className="text-white/50 mb-8">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
          <Link href="/login" className="btn-gold">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl gold-text mb-3">Nouveau mot de passe</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-white/50 mb-2">Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Min. 8 caractères"
              required
              minLength={8}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-gold w-full text-center">
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </form>
      </div>
    </div>
  );
}
