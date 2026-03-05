'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Mode = 'DAY' | 'NIGHT';

interface ThemeModeContextType {
    mode: Mode;
    toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<Mode>('NIGHT');

    useEffect(() => {
        const savedMode = localStorage.getItem('milan-mode') as Mode;
        if (savedMode) {
            setMode(savedMode);
            document.documentElement.setAttribute('data-mode', savedMode);
        } else {
            document.documentElement.setAttribute('data-mode', 'NIGHT');
        }
    }, []);

    const toggleMode = () => {
        const newMode = mode === 'DAY' ? 'NIGHT' : 'DAY';
        setMode(newMode);
        localStorage.setItem('milan-mode', newMode);
        document.documentElement.setAttribute('data-mode', newMode);
    };

    return (
        <ThemeModeContext.Provider value={{ mode, toggleMode }}>
            {children}
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
