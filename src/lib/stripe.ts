import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export const SKYCOINS_PACKS = [
  { id: 'starter', name: 'Pack Découverte', coins: 50, price: 990, priceDisplay: '9,90€', bonus: 0 },
  { id: 'plus', name: 'Pack Habitué', coins: 120, price: 1990, priceDisplay: '19,90€', bonus: 10 },
  { id: 'premium', name: 'Pack Collectionneur', coins: 350, price: 4990, priceDisplay: '49,90€', bonus: 50 },
  { id: 'vip', name: 'Pack Investisseur', coins: 800, price: 9990, priceDisplay: '99,90€', bonus: 150 },
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
  packName: string;
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
            name: `${params.packName} — ${params.coins} SkyCoins`,
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
  const isOneTime = params.tier === 'SKYCLUB';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: isOneTime ? `Accès à Vie ${params.tier}` : `Abonnement ${params.tier}`,
            description: isOneTime ? `Accès perpétuel Milan Sky — ${params.tier}` : `Abonnement mensuel Milan Sky — ${params.tier}`,
          },
          unit_amount: params.priceAmount,
          ...(isOneTime ? {} : { recurring: { interval: 'month' } }),
        },
        quantity: 1,
      },
    ],
    mode: isOneTime ? 'payment' : 'subscription',
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
