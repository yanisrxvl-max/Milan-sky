import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: 'USER' | 'ADMIN';
      ageVerified: boolean;
      subscription?: {
        tier: string;
        status: string;
      } | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'USER' | 'ADMIN';
    ageVerified: boolean;
    subscription?: {
      tier: string;
      status: string;
    } | null;
  }
}
