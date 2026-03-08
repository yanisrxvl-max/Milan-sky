import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: {
            subscription: true,
            skyCoinsBalance: true
          },
        });

        if (!user) {
          throw new Error('Identifiants invalides');
        }

        if (!user.emailVerified) {
          throw new Error('Veuillez vérifier votre email avant de vous connecter');
        }

        const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!passwordMatch) {
          throw new Error('Identifiants invalides');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
          role: user.role,
          ageVerified: user.ageVerified,
          subscription: user.subscription ? {
            tier: user.subscription.tier,
            status: user.subscription.status,
          } : null,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.subscription = (user as any).subscription;
        token.ageVerified = (user as any).ageVerified;
      }

      // Handle session update (manual trigger)
      if (trigger === "update" && session?.ageVerified !== undefined) {
        token.ageVerified = session.ageVerified;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'USER' | 'ADMIN';
        session.user.subscription = token.subscription as any;
        session.user.ageVerified = token.ageVerified as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
