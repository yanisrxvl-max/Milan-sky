'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AgeVerificationModal from '@/components/ui/AgeVerificationModal';

type Mode = 'DAY' | 'NIGHT';

interface ThemeModeContextType {
    mode: Mode;
    toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<Mode>('DAY'); // Default is always DAY
    const [transitioning, setTransitioning] = useState(false);
    const [transitionTarget, setTransitionTarget] = useState<Mode | null>(null);

    const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);

    useEffect(() => {
        let initialMode: Mode = 'DAY';

        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('mode') === 'night') {
                initialMode = 'NIGHT';
            }
        }

        setMode(initialMode);
        document.documentElement.setAttribute('data-mode', initialMode);
        localStorage.setItem('milan-mode', initialMode);
    }, []);

    const executeTransition = useCallback((newMode: Mode) => {
        setTransitionTarget(newMode);
        setTransitioning(true);

        setTimeout(() => {
            setMode(newMode);
            localStorage.setItem('milan-mode', newMode);
            document.documentElement.setAttribute('data-mode', newMode);
        }, 400);

        setTimeout(() => {
            setTransitioning(false);
            setTransitionTarget(null);
        }, 900);
    }, []);

    const toggleMode = useCallback(() => {
        const newMode = mode === 'DAY' ? 'NIGHT' : 'DAY';

        if (newMode === 'NIGHT') {
            const isVerified = localStorage.getItem('age_verified') === 'true';
            if (!isVerified) {
                setIsAgeModalOpen(true);
                return;
            }
        }

        executeTransition(newMode);
    }, [mode, executeTransition]);

    return (
        <ThemeModeContext.Provider value={{ mode, toggleMode }}>
            {children}

            <AgeVerificationModal
                isOpen={isAgeModalOpen}
                onClose={() => setIsAgeModalOpen(false)}
                onSuccess={() => {
                    localStorage.setItem('age_verified', 'true');
                    setIsAgeModalOpen(false);
                    executeTransition('NIGHT');
                }}
            />

            {/* Cinematic Transition Overlay */}
            {transitioning && (
                <div className="fixed inset-0 z-[9999] pointer-events-none">
                    {/* Black curtain */}
                    <div
                        className="absolute inset-0 animate-mode-curtain"
                        style={{ background: 'black' }}
                    />
                    {/* Color flash */}
                    <div
                        className="absolute inset-0 animate-mode-flash"
                        style={{
                            background: transitionTarget === 'NIGHT'
                                ? 'radial-gradient(circle at center, rgba(128,90,213,0.4) 0%, transparent 70%)'
                                : 'radial-gradient(circle at center, rgba(201,168,76,0.4) 0%, transparent 70%)'
                        }}
                    />
                </div>
            )}
        </ThemeModeContext.Provider>
    );
}

export function useThemeMode() {
    const context = useContext(ThemeModeContext);
    if (context === undefined) {
        throw new Error('useThemeMode must be used within a ThemeModeProvider');
    }
    return context;
}
