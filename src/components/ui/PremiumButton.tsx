'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface PremiumButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
    children: ReactNode;
    variant?: 'gold' | 'outline' | 'dark' | 'ghost';
    isLoading?: boolean;
    fullWidth?: boolean;
}

export function PremiumButton({
    children,
    variant = 'gold',
    isLoading = false,
    fullWidth = false,
    className = '',
    disabled,
    ...props
}: PremiumButtonProps) {
    const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg overflow-hidden group';

    const variants = {
        gold: 'bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black shadow-[0_0_15px_rgba(201,168,76,0.2)] hover:shadow-[0_0_25px_rgba(201,168,76,0.4)]',
        outline: 'border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold',
        dark: 'bg-dark-300 text-cream border border-white/10 hover:bg-dark-200 hover:border-white/20',
        ghost: 'text-gold-light hover:text-gold hover:bg-gold/5',
    };

    const sizes = 'py-3 px-8 text-sm md:text-base';
    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled || isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:scale-[1.02] active:scale-[0.98]';

    return (
        <motion.button
            whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
            className={`${baseClasses} ${variants[variant]} ${sizes} ${widthClass} ${disabledClass} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {/* Shimmer effect for gold variant */}
            {variant === 'gold' && !disabled && !isLoading && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            )}

            <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : children}
            </span>
        </motion.button>
    );
}
