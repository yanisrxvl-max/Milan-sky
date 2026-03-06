'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

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

    useEffect(() => {
        let initialMode: Mode = 'DAY';

        // Check URL for specific mode override (e.g. ?mode=night)
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

    const toggleMode = useCallback(() => {
        const newMode = mode === 'DAY' ? 'NIGHT' : 'DAY';
        setTransitionTarget(newMode);
        setTransitioning(true);

        // Switch mode at the peak of the transition (halfway)
        setTimeout(() => {
            setMode(newMode);
            localStorage.setItem('milan-mode', newMode);
            document.documentElement.setAttribute('data-mode', newMode);
        }, 400);

        // Clear transition
        setTimeout(() => {
            setTransitioning(false);
            setTransitionTarget(null);
        }, 900);
    }, [mode]);

    return (
        <ThemeModeContext.Provider value={{ mode, toggleMode }}>
            {children}

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
