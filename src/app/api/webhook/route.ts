import { stripe } from '@/common/stripe';
import { db } from '@/database';
import { stripe_customers } from '@/database/schema/app.schema';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return NextResponse.json({ message: 'Webhook Error' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session: Stripe.Checkout.Session = event.data.object;
      const userId = session.metadata?.user_id ?? 'kek';

      type StripeCustomer = typeof stripe_customers.$inferInsert;
      const newStripeCustomer: StripeCustomer = {
        user_id: userId,
        stripe_customer_id: session.customer as string,
        subscription_id: session.subscription as string,
        plan_active: true,
        plan_expires: null,
      };

      const { stripe_customer_id, ...updatedStripeCustomer } =
        newStripeCustomer;

      // Create or update the stripe_customer_id in the stripe_customers table
      await db
        .insert(stripe_customers)
        .values(newStripeCustomer)
        .onConflictDoUpdate({
          target: stripe_customers.stripe_customer_id,
          set: updatedStripeCustomer,
        });
    }

    if (event.type === 'customer.subscription.updated') {
      // todo
    }

    if (event.type === 'customer.subscription.deleted') {
      // todo
    }

    return NextResponse.json({ message: 'success' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
