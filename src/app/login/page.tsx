'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="page-container flex items-center justify-center min-h-screen"><div className="animate-pulse text-gold/50">Chargement...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const verified = searchParams.get('verified');
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('Bienvenue dans le cercle 👑');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-dark-500" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.08)_0%,transparent_60%)]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/">
            <span className="font-serif text-3xl text-white tracking-widest">MILAN <span className="gold-text italic">SKY</span></span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-dark-200/60 backdrop-blur-xl border border-white/[0.06] rounded-3xl p-8 shadow-2xl shadow-black/40">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 flex items-center justify-center mb-4">
              <Lock size={22} className="text-gold" />
            </div>
            <h1 className="font-serif text-2xl text-cream tracking-wide mb-2">{t('login.title')}</h1>
            <p className="text-white/30 text-sm">{t('login.subtitle')}</p>
          </div>

          {verified && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center"
            >
              ✅ {t('login.verified')}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-white/40 mb-2 tracking-wide uppercase">{t('login.email')}</label>
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
              <label className="block text-xs text-white/40 mb-2 tracking-wide uppercase">{t('login.password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field !pr-12"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
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

            <div className="text-right">
              <Link href="/reset-password" className="text-xs text-gold/40 hover:text-gold transition-colors">
                {t('login.forgot')}
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="relative w-full py-4 rounded-xl font-medium tracking-wide overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold via-yellow-200 to-gold opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="relative text-dark-500 flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-dark-300 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={16} />
                    {t('login.enter')}
                  </>
                )}
              </span>
            </motion.button>
          </form>
        </div>

        {/* Bottom Links */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-white/20 text-sm">
            {t('login.no_account')}{' '}
            <Link href="/register" className="text-gold hover:text-gold-light transition-colors font-medium">
              {t('login.request_access')}
            </Link>
          </p>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex items-center justify-center gap-2 text-white/15 text-xs"
          >
            <Sparkles size={12} className="text-gold/30" />
            <span>2,847 {t('login.members_count')}</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
