'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        toast.success('Vérifiez votre email pour activer votre compte');
      } else {
        toast.error(data.error || 'Erreur lors de l\'inscription');
      }
    } catch {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="page-container flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-6">✉️</div>
          <h1 className="font-serif text-3xl gold-text mb-4">Vérifiez votre email</h1>
          <p className="text-white/50 mb-8 leading-relaxed">
            Un email de vérification a été envoyé à <span className="text-cream">{email}</span>.
            Cliquez sur le lien pour activer votre compte.
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
          <h1 className="font-serif text-4xl md:text-5xl gold-text mb-3">Créer un compte</h1>
          <p className="text-white/40">Rejoignez l&apos;expérience Milan Sky</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-white/50 mb-2">Nom (optionnel)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Votre nom"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="block text-sm text-white/50 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="votre@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm text-white/50 mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Min. 8 caractères, 1 majuscule, 1 chiffre"
              required
              minLength={8}
              autoComplete="new-password"
            />
            <p className="text-white/20 text-xs mt-1.5">
              Minimum 8 caractères avec majuscule, minuscule et chiffre
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full text-center"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center mt-8 text-white/30 text-sm">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
