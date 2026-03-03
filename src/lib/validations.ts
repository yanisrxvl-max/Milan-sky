import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email invalide').max(255),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(128)
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  name: z.string().min(2, 'Nom trop court').max(50).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

export const newPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(128)
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[a-z]/, 'Au moins une minuscule')
    .regex(/[0-9]/, 'Au moins un chiffre'),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
});

export const privateRequestSchema = z.object({
  type: z.enum(['VIDEO', 'PHOTO', 'CALL', 'CUSTOM']),
  description: z.string().min(10, 'Description trop courte (min 10 caractères)').max(1000),
  budget: z.number().min(0).max(10000).optional(),
});

export const chatMessageSchema = z.object({
  content: z.string().min(1, 'Message vide').max(500, 'Message trop long (max 500 caractères)'),
});

export const skycoinsPurchaseSchema = z.object({
  packId: z.enum(['pack_35', 'pack_100', 'pack_250', 'pack_600']),
});

export const subscriptionSchema = z.object({
  tier: z.enum(['BASIC', 'ELITE', 'ICON']),
});
