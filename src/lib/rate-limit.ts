import { NextRequest, NextResponse } from 'next/server';

const rateMap = new Map<string, { count: number; resetTime: number }>();

const CLEANUP_INTERVAL = 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  const keysToDelete: string[] = [];
  rateMap.forEach((value, key) => {
    if (now > value.resetTime) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach((key) => rateMap.delete(key));
}

export function rateLimit(options: {
  maxRequests: number;
  windowMs: number;
}) {
  return function check(identifier: string): { success: boolean; remaining: number } {
    cleanup();
    const now = Date.now();
    const entry = rateMap.get(identifier);

    if (!entry || now > entry.resetTime) {
      rateMap.set(identifier, { count: 1, resetTime: now + options.windowMs });
      return { success: true, remaining: options.maxRequests - 1 };
    }

    if (entry.count >= options.maxRequests) {
      return { success: false, remaining: 0 };
    }

    entry.count++;
    return { success: true, remaining: options.maxRequests - entry.count };
  };
}

// Pre-configured rate limiters
export const authLimiter = rateLimit({ maxRequests: 5, windowMs: 15 * 60 * 1000 }); // 5 per 15 min
export const apiLimiter = rateLimit({ maxRequests: 60, windowMs: 60 * 1000 }); // 60 per min
export const chatLimiter = rateLimit({ maxRequests: 30, windowMs: 60 * 1000 }); // 30 per min

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function rateLimitResponse() {
  return NextResponse.json(
    { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
    { status: 429 }
  );
}
