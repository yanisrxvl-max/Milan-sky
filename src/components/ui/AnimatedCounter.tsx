'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, motion } from 'framer-motion';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export default function AnimatedCounter({
    value,
    duration = 1.2,
    decimals = 0,
    prefix = '',
    suffix = '',
    className = '',
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!isInView) return;
        let start = 0;
        const step = value / (duration * 60);
        const timer = setInterval(() => {
            start += step;
            if (start >= value) {
                setCurrent(value);
                clearInterval(timer);
            } else {
                setCurrent(start);
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [isInView, value, duration]);

    return (
        <motion.span
            ref={ref}
            className={className}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {prefix}
            {current.toFixed(decimals)}
            {suffix}
        </motion.span>
    );
}
