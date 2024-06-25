'use server';

import { auth } from '@/common/_/auth/next-auth';
import { stripe } from '@/common/stripe';
import { getStripeCustomer } from '@/common/stripe-customer-utils.server';

export async function createPortalSession() {
  const session = await auth();
  const stripeCustomer = await getStripeCustomer(session?.user?.id);

  if (!stripeCustomer) {
    throw 'Missing Stripe customer!';
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomer.stripe_customer_id,
    return_url: `http://localhost:3000`,
  });

  return { id: portalSession.id, url: portalSession.url };
}
