import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = ['/dashboard', '/chat', '/private-requests', '/library'];
const authRoutes = ['/login', '/register'];
const adminRoutes = ['/admin'];

const TIER_LEVELS = {
  'NONE': 0,
  'VOYEUR': 1,
  'INITIE': 2,
  'PRIVILEGE': 3,
  'SKYCLUB': 4,
};

// Define minimum tier required for specific routes
const routeRequirements: Record<string, number> = {
  '/chat': 1, // Accessible from VOYEUR
  '/library': 1, // Accessible from VOYEUR
  '/private-requests': 3, // Requires PRIVILEGE or higher
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CSRF protection for API routes (non-GET)
  if (pathname.startsWith('/api/') && request.method !== 'GET') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // Allow Stripe webhooks
    if (pathname === '/api/stripe/webhook') {
      return NextResponse.next();
    }

    if (origin && host) {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        return NextResponse.json({ error: 'CSRF rejected' }, { status: 403 });
      }
    }
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Redirect authenticated users away from auth pages
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protect authenticated routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // TIER CHECK FOR PREMIUM ROUTES (Zero-Leak Logic)
    let requiredTier = 0;
    for (const [route, level] of Object.entries(routeRequirements)) {
      if (pathname.startsWith(route)) {
        requiredTier = level;
        break;
      }
    }

    if (requiredTier > 0) {
      const userTier = token.subscription?.tier as keyof typeof TIER_LEVELS | undefined;
      const userLevel = userTier ? TIER_LEVELS[userTier] || 0 : 0;

      if (userLevel < requiredTier) {
        // User does not have high enough tier, redirect to subscriptions
        const upgradeUrl = new URL('/subscriptions', request.url);
        upgradeUrl.searchParams.set('reason', 'upgrade_required');
        return NextResponse.redirect(upgradeUrl);
      }
    }
  }

  // Protect admin routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|uploads|api/auth).*)',
  ],
};
