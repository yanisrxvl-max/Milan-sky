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
    id: 'voyeur',
    name: 'VOYEUR',
    tier: 'VOYEUR' as const,
    price: 990,
    priceDisplay: '9,90€',
    priceMonthly: '9,90€/mois',
    features: [
      'Bibliothèque médias sensuels (avec Pub)',
      'Accès LE QUOTIDIRTY (19h-6h)',
      'Milan IA version découverte',
      'Lives collectifs mensuels',
    ],
    recommended: false,
    limited: false,
  },
  {
    id: 'initie',
    name: 'INITIÉ',
    tier: 'INITIE' as const,
    price: 1990,
    priceDisplay: '19,90€',
    priceMonthly: '19,90€/mois',
    features: [
      'Bibliothèque sans publicité',
      'Accès complet LE QUOTIDIRTY',
      'Accès complet Milan IA',
      'Drops spéciaux hebdomadaires',
    ],
    recommended: true,
    limited: false,
  },
  {
    id: 'privilege',
    name: 'PRIVILÈGE',
    tier: 'PRIVILEGE' as const,
    price: 4990,
    priceDisplay: '49,90€',
    priceMonthly: '49,90€/mois',
    features: [
      'Accès complet bibliothèque Milan Sky',
      'Quotidirty exclusifs Privilege',
      'SkyCoins mensuels offerts',
      'Priorité dans le chat Milan',
    ],
    recommended: false,
    limited: false,
  },
  {
    id: 'skyclub',
    name: 'SKYCLUB',
    tier: 'SKYCLUB' as const,
    price: 29900,
    priceDisplay: '299,00€',
    priceMonthly: '299€/mois',
    features: [
      'Accès total plateforme Milan Sky',
      'Ligne privée Milan',
      'Invitations événements et rencontres',
      'Statut membre SkyClub',
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
