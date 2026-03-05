'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Crown, Eye, EyeOff, Shield, Check, Sparkles } from 'lucide-react';

const PERKS = [
  'Accès au chat privé avec Milan',
  'Bibliothèque de contenu exclusif',
  'SkyCoins offerts à l\'inscription',
  'Drops et avant-premières réservés',
];

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        toast.success('Compte créé ! Bienvenue dans le cercle 👑');
        router.push('/login');
      } else {
        toast.error(data.error || 'Erreur lors de l\'inscription');
      }
    } catch {
      toast.error('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-500" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.06)_0%,transparent_60%)]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/3 rounded-full blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-lg px-6"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <span className="font-serif text-3xl text-white tracking-widest">MILAN <span className="gold-text italic">SKY</span></span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-dark-200/60 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-8 shadow-2xl shadow-black/40">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 mb-5">
              <Sparkles size={12} className="text-gold animate-pulse" />
              <span className="text-[11px] tracking-[0.15em] text-gold uppercase">Accès Limité</span>
            </div>
            <h1 className="font-serif text-2xl text-cream tracking-wide mb-2">Rejoindre le Cercle</h1>
            <p className="text-white/25 text-sm">Seuls les membres sélectionnés accèdent à l&apos;univers Milan Sky</p>
          </div>

          {/* Perks List */}
          <div className="bg-dark-300/50 rounded-xl p-4 mb-6 border border-white/[0.03]">
            {PERKS.map((perk, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 py-2"
              >
                <div className="w-5 h-5 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-gold" />
                </div>
                <span className="text-white/50 text-sm">{perk}</span>
              </motion.div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 mb-2 tracking-wide uppercase">Nom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Comment doit-on vous appeler ?"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-2 tracking-wide uppercase">Email</label>
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
              <label className="block text-xs text-white/40 mb-2 tracking-wide uppercase">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field !pr-12"
                  placeholder="Minimum 8 caractères"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="relative w-full py-4 rounded-xl font-medium tracking-wide overflow-hidden group mt-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold via-yellow-200 to-gold opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="relative text-dark-500 flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-dark-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Crown size={16} />
                    Demander l&apos;accès
                  </>
                )}
              </span>
            </motion.button>
          </form>
        </div>

        {/* Bottom */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-white/20 text-sm">
            Déjà membre ?{' '}
            <Link href="/login" className="text-gold hover:text-gold-light transition-colors font-medium">
              Se connecter
            </Link>
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-white/10 text-xs flex items-center justify-center gap-1"
          >
            <Shield size={10} /> Inscription sécurisée &bull; Données chiffrées
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
