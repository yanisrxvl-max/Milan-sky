'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { ThemeModeProvider } from '@/context/ThemeModeContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeModeProvider>
      <SessionProvider>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1A1A',
              color: '#F5F0E8',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#C9A84C', secondary: '#000' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </SessionProvider>
    </ThemeModeProvider>
  );
}
