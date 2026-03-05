'use client';

import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstall, setShowInstall] = useState(false);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            if (localStorage.getItem('milan-pwa-dismissed') !== 'true') {
                setShowInstall(true);
            }
        });

        // Détection iOS pour tutoriel manuel
        const isIos = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(userAgent);
        };
        const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator as any).standalone;

        if (isIos() && !isInStandaloneMode() && localStorage.getItem('milan-pwa-dismissed') !== 'true') {
            setShowInstall(true);
        }
    }, []);

    const handleInstallClick = () => {
        if (!deferredPrompt) {
            toast('Sur iOS : Touchez l\'icône Partager, puis "Sur l\'écran d\'accueil"', {
                icon: '📱',
                duration: 5000,
            });
            setShowInstall(false);
            return;
        }

        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === 'accepted') {
                setShowInstall(false);
            }
            setDeferredPrompt(null);
        });
    };

    const handleDismiss = () => {
        localStorage.setItem('milan-pwa-dismissed', 'true');
        setShowInstall(false);
    };

    if (!showInstall) return null;

    return (
        <div className="fixed top-0 left-0 w-full bg-dark-400/90 backdrop-blur-xl border-b border-gold/20 p-4 pt-[calc(1rem+env(safe-area-inset-top))] z-[200] flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                    <Download size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-serif text-cream">Milan Sky App</h4>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest">Installer pour une meilleure expérience</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={handleInstallClick}
                    className="px-4 py-2 bg-gold text-dark text-[10px] font-bold uppercase tracking-widest rounded-lg active:scale-95 transition-transform"
                >
                    Installer
                </button>
                <button
                    onClick={handleDismiss}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 active:scale-95 transition-transform"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
