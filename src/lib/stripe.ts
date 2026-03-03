import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export const SKYCOINS_PACKS = [
  { id: 'pack_35', name: 'Pack Découverte', coins: 35, price: 900, priceDisplay: '9€', bonus: null },
  { id: 'pack_100', name: 'Pack Essentiel', coins: 100, price: 2400, priceDisplay: '24€', bonus: null },
  { id: 'pack_250', name: 'Pack Immersion', coins: 250, price: 4900, priceDisplay: '49€', bonus: null },
  { id: 'pack_600', name: 'Pack Ultimate', coins: 600, price: 9900, priceDisplay: '99€', bonus: 'Bonus inclus' },
] as const;

export const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'BASIC',
    tier: 'BASIC' as const,
    price: 1290,
    priceDisplay: '12,90€',
    priceMonthly: '12,90€/mois',
    features: [
      'Accès contenu quotidien',
      'Bibliothèque standard',
      'Chat limité (10 msg/jour)',
      'Badge Basic',
    ],
    recommended: false,
    limited: false,
  },
  {
    id: 'elite',
    name: 'ELITE',
    tier: 'ELITE' as const,
    price: 3990,
    priceDisplay: '39,90€',
    priceMonthly: '39,90€/mois',
    features: [
      'Tout le contenu Basic +',
      'Contenu exclusif illimité',
      'Chat illimité',
      'Accès drops en avant-première',
      'Réductions SkyCoins (15%)',
      'Badge Élite doré',
    ],
    recommended: true,
    limited: false,
  },
  {
    id: 'icon',
    name: 'ICON',
    tier: 'ICON' as const,
    price: 8990,
    priceDisplay: '89,90€',
    priceMonthly: '89,90€/mois',
    features: [
      'Tout le contenu Elite +',
      'Accès VIP total',
      'Commandes privées prioritaires',
      'Chat prioritaire + vocal',
      'Contenu jamais publié',
      'Réductions SkyCoins (30%)',
      'Badge Icon platine',
      'Support dédié 24/7',
    ],
    recommended: false,
    limited: true,
  },
] as const;

export async function createCheckoutSession(params: {
  userId: string;
  email: string;
  packId: string;
  coins: number;
  price: number;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${params.coins} SkyCoins`,
            description: `Pack de ${params.coins} SkyCoins pour Milan Sky`,
          },
          unit_amount: params.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.email,
    metadata: {
      userId: params.userId,
      packId: params.packId,
      coins: params.coins.toString(),
      type: 'skycoins',
    },
  });

  return session;
}

export async function createSubscriptionCheckout(params: {
  userId: string;
  email: string;
  tier: string;
  priceAmount: number;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Abonnement ${params.tier}`,
            description: `Abonnement mensuel Milan Sky — ${params.tier}`,
          },
          unit_amount: params.priceAmount,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.email,
    metadata: {
      userId: params.userId,
      tier: params.tier,
      type: 'subscription',
    },
  });

  return session;
}
