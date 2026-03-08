'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeMode } from '@/context/ThemeModeContext';
import { useI18n, Locale } from '@/context/I18nContext';
import { Play, Globe, ChevronRight } from 'lucide-react';

export default function WelcomeOverlay() {
    const [show, setShow] = useState(false);
    const [step, setStep] = useState<0 | 1 | 2>(0); // 0: Lang, 1: Mode, 2: Age
    const [hoveredSide, setHoveredSide] = useState<'DAY' | 'NIGHT' | null>(null);
    const { toggleMode } = useThemeMode();
    const { setLocale, t } = useI18n();
    const { update } = useSession();

    const languages: { code: Locale; label: string; flag: string }[] = [
        { code: 'fr', label: 'Français', flag: '🇫🇷' },
        { code: 'en', label: 'English', flag: '🇺🇸' },
        { code: 'ar', label: 'العربية', flag: '🇦🇪' },
        { code: 'pt', label: 'Português', flag: '🇧🇷' },
    ];

    useEffect(() => {
        const visited = sessionStorage.getItem('milan_sky_visited');
        if (!visited) {
            setShow(true);
            document.body.style.overflow = 'hidden';
        }
    }, []);

    const handleSelectLanguage = (code: Locale) => {
        setLocale(code);
        setStep(1);
    };

    const handleSelectDay = () => {
        sessionStorage.setItem('milan_sky_visited', 'true');
        setShow(false);
        document.body.style.overflow = 'unset';
    };

    const handleSelectNight = () => {
        setStep(2);
    };

    const [birthDate, setBirthDate] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const confirmAge = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsVerifying(true);

        try {
            const res = await fetch('/api/auth/age-verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ birthDate }),
            });

            if (res.ok) {
                const data = await res.json();

                // Update session state only if authenticated
                if (data.authenticated) {
                    await update({ ageVerified: true });
                }

                sessionStorage.setItem('milan_sky_visited', 'true');
                localStorage.setItem('milan_age_verified', 'true');
                toggleMode();
                setShow(false);
                document.body.style.overflow = 'unset';
            } else {
                const data = await res.json();
                setError(data.error || 'Erreur de vérification');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
        } finally {
            setIsVerifying(false);
        }
    };

    const cancelAge = () => {
        setStep(1);
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[300] bg-black text-white flex flex-col items-center justify-center overflow-hidden"
            >
                {step !== 0 && (
                    <div className="absolute inset-0 pointer-events-none transition-colors duration-1000">
                        <div className={`absolute inset-0 opacity-40 transition-opacity duration-1000 ${hoveredSide === 'DAY' ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'radial-gradient(circle at 30% 50%, rgba(201,168,76,0.15), transparent 60%)' }} />
                        <div className={`absolute inset-0 opacity-40 transition-opacity duration-1000 ${hoveredSide === 'NIGHT' ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'radial-gradient(circle at 70% 50%, rgba(255,0,50,0.15), transparent 60%)' }} />
                        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-20 mix-blend-overlay" />
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="language-step"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="relative z-10 flex flex-col items-center justify-center p-6 w-full max-w-2xl px-4"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                    scale: 1,
                                    opacity: 1,
                                    y: [0, -10, 0]
                                }}
                                transition={{
                                    opacity: { delay: 0.2, duration: 1 },
                                    scale: { delay: 0.2, duration: 1 },
                                    y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="relative w-32 h-32 mb-10 flex items-center justify-center group"
                            >
                                {/* Animated Apple Sequence */}
                                <div className="relative w-20 h-20">
                                    <motion.img
                                        src="/images/milan_logo_transparent.png"
                                        alt="Milan Sky Lumina"
                                        className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_25px_rgba(201,168,76,0.3)]"
                                        animate={{
                                            opacity: [1, 1, 0, 0, 1],
                                        }}
                                        transition={{ duration: 8, repeat: Infinity, times: [0, 0.45, 0.5, 0.95, 1], ease: "easeInOut" }}
                                    />
                                    <motion.img
                                        src="/images/milan_logo_bitten.png"
                                        alt="Milan Sky Noctua"
                                        className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_0_25px_rgba(255,0,50,0.3)]"
                                        animate={{
                                            opacity: [0, 0, 1, 1, 0],
                                        }}
                                        transition={{ duration: 8, repeat: Infinity, times: [0, 0.45, 0.5, 0.95, 1], ease: "easeInOut" }}
                                    />
                                </div>
                            </motion.div>

                            <h1 className="font-serif text-3xl md:text-5xl text-cream mb-4 text-center">{t('welcome.lang_title')}</h1>
                            <p className="text-white/40 text-xs md:text-sm uppercase tracking-[0.3em] mb-12 text-center">{t('welcome.lang_subtitle')}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                {languages.map((lang, idx) => (
                                    <motion.button
                                        key={lang.code}
                                        initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + idx * 0.1 }}
                                        onClick={() => handleSelectLanguage(lang.code)}
                                        className="group relative flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl">{lang.flag}</span>
                                            <span className="text-sm font-bold tracking-widest uppercase">{lang.label}</span>
                                        </div>
                                        <ChevronRight size={18} className="text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                                    </motion.button>
                                ))}
                            </div>

                            <p className="mt-16 text-[9px] text-white/20 uppercase tracking-[0.4em] font-medium">Digital Luxury Experience — 2026</p>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="mode-step"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full flex flex-col items-center justify-center"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="absolute top-8 md:top-20 text-center z-20 px-4 w-full"
                            >
                                <h1 className="font-serif text-2xl md:text-5xl text-cream tracking-wide mb-2 md:mb-3">
                                    <span className="italic font-light">{t('welcome.title').split(' ').slice(0, 2).join(' ')}</span> {t('welcome.title').split(' ').slice(2).join(' ')}
                                </h1>
                                <p className="text-white/40 text-[10px] md:text-base max-w-[280px] md:max-w-lg mx-auto uppercase tracking-widest font-light">
                                    {t('welcome.subtitle')}
                                </p>
                            </motion.div>

                            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-stretch justify-center h-full gap-4 md:gap-4 px-4 pt-32 pb-16 md:py-0 overflow-y-auto">
                                {/* DAY MODE CHOICE */}
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                                    onHoverStart={() => setHoveredSide('DAY')}
                                    onHoverEnd={() => setHoveredSide(null)}
                                    onClick={handleSelectDay}
                                    className="flex-1 w-full flex flex-col items-center justify-center cursor-pointer group p-4 md:p-8 rounded-[2rem] md:rounded-3xl transition-all duration-700 md:bg-transparent active:scale-[0.98] md:active:scale-100"
                                >
                                    <div className="relative w-24 h-24 md:w-56 md:h-56 mb-4 md:mb-10 transition-all duration-1000 group-hover:scale-110 pointer-events-none">
                                        <div className="absolute inset-0 bg-gold/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                        <img src="/images/milan_logo_transparent.png" alt="Pomme Intacte" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(201,168,76,0.2)] group-hover:drop-shadow-[0_0_60px_rgba(201,168,76,0.6)] transition-all duration-1000" />
                                    </div>
                                    <div className="text-center pointer-events-none transition-all duration-700 group-hover:translate-y-[-5px]">
                                        <h2 className="text-xl md:text-4xl font-serif text-gold mb-2 md:mb-4 flex items-center justify-center gap-3">
                                            <Play size={20} fill="currentColor" className="text-gold md:w-6 md:h-6" />
                                            {t('welcome.day_title')}
                                        </h2>
                                        <h3 className="text-[10px] md:text-sm tracking-[0.4em] uppercase text-white/40 group-hover:text-white/80 mb-3 md:mb-6 font-bold transition-colors">{t('welcome.day_subtitle')}</h3>
                                        <p className="hidden md:block text-white/30 text-[11px] md:text-sm leading-relaxed max-w-[280px] md:max-w-md mx-auto group-hover:text-white/60 transition-colors">
                                            {t('welcome.day_desc')}
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Divider Line */}
                                <motion.div
                                    initial={{ opacity: 0, scaleY: 0 }}
                                    animate={{ opacity: 1, scaleY: 1 }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                    className="hidden md:block w-px h-[50vh] bg-gradient-to-b from-transparent via-white/10 to-transparent shrink-0 mx-8"
                                />

                                {/* NIGHT MODE CHOICE */}
                                <motion.div
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                                    onHoverStart={() => setHoveredSide('NIGHT')}
                                    onHoverEnd={() => setHoveredSide(null)}
                                    onClick={handleSelectNight}
                                    className="flex-1 w-full flex flex-col items-center justify-center cursor-pointer group p-4 md:p-8 rounded-[2rem] md:rounded-3xl transition-all duration-700 md:bg-transparent active:scale-[0.98] md:active:scale-100"
                                >
                                    <div className="relative w-24 h-24 md:w-56 md:h-56 mb-4 md:mb-10 transition-all duration-1000 group-hover:scale-110 pointer-events-none">
                                        <div className="absolute inset-0 bg-red-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                        <img src="/images/milan_logo_bitten.png" alt="Pomme Croquée" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(255,0,0,0.1)] group-hover:drop-shadow-[0_0_60px_rgba(255,0,0,0.4)] transition-all duration-1000" />
                                    </div>
                                    <div className="text-center pointer-events-none transition-all duration-700 group-hover:translate-y-[-5px]">
                                        <h2 className="text-xl md:text-4xl font-serif text-[#ff4d4d] mb-2 md:mb-4 flex items-center justify-center gap-3">
                                            {t('welcome.night_title')}
                                            <span className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-[#ff4d4d] text-[10px] md:text-[12px] font-black tracking-tighter ml-2">18+</span>
                                        </h2>
                                        <h3 className="text-[10px] md:text-sm tracking-[0.4em] uppercase text-white/40 group-hover:text-white/80 mb-3 md:mb-6 font-bold transition-colors">{t('welcome.night_subtitle')}</h3>
                                        <p className="hidden md:block text-white/30 text-[11px] md:text-sm leading-relaxed max-w-[280px] md:max-w-md mx-auto group-hover:text-white/60 transition-colors">
                                            {t('welcome.night_desc')}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 1 }}
                                className="absolute bottom-4 md:bottom-12 text-center z-20 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-4"
                            >
                                <p className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">{t('welcome.change_hint')}</p>
                            </motion.div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="age-step"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative z-20 max-w-sm w-full bg-dark-400 p-8 md:p-10 rounded-3xl border border-red-500/20 shadow-[0_0_80px_rgba(255,0,0,0.15)] text-center"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/10 blur-[60px] rounded-full pointer-events-none" />

                            <span className="text-5xl font-serif text-[#ff4d4d] mb-4 block drop-shadow-[0_0_15px_rgba(255,0,0,0.3)]">{t('welcome.age_title')}</span>
                            <h2 className="text-sm font-serif text-white mb-3 tracking-[0.2em] uppercase">
                                {t('welcome.age_warning')}
                            </h2>

                            <p className="text-white/50 text-[12px] leading-relaxed mb-6 max-w-[240px] mx-auto">
                                {t('welcome.age_desc')}
                            </p>

                            <form onSubmit={confirmAge} className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-white/30 block text-left ml-1">Date de naissance</label>
                                    <input
                                        type="date"
                                        required
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-red-500/50 outline-none transition-all"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-500 text-[10px] uppercase tracking-widest bg-red-500/10 p-2 rounded-lg">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isVerifying || !birthDate}
                                    className="w-full py-4 bg-[#ff4d4d] text-white rounded-2xl text-[10px] uppercase font-black tracking-[0.2em] hover:bg-[#ff3333] hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isVerifying ? 'Vérification...' : t('welcome.age_confirm')}
                                </button>

                                <button
                                    type="button"
                                    onClick={cancelAge}
                                    className="w-full py-4 bg-transparent border border-white/10 text-white/50 rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:text-white hover:bg-white/5 transition-all active:scale-[0.98]"
                                >
                                    {t('welcome.age_cancel')}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
}
