'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface PremiumModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    showCloseButton?: boolean;
}

export function PremiumModal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'md',
    showCloseButton = true,
}: PremiumModalProps) {

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-[95vw]',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`relative w-full ${maxWidthClasses[maxWidth]} card-premium border-gold/20 bg-dark-100 shadow-[0_0_50px_rgba(201,168,76,0.15)] overflow-hidden`}
                    >
                        {/* Top decorative gradient line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />

                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                                {title ? (
                                    <h2 className="font-serif text-2xl gold-text">{title}</h2>
                                ) : <div />}

                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 text-white/50 hover:text-gold transition-colors rounded-full hover:bg-white/5"
                                        aria-label="Fermer"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Content body */}
                        <div className="relative z-10">
                            {children}
                        </div>

                        {/* Subtle bottom glow */}
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gold/10 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/5 rounded-full blur-[80px] pointer-events-none" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
