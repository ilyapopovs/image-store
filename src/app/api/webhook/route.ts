import { stripe } from '@/common/stripe';
import { db } from '@/database';
import {
  stripe_customers,
  type StripeCustomerInsert,
} from '@/database/schema/app.schema';
import { eq } from 'drizzle-orm';
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
      const userId = session.metadata?.user_id!;

      const newStripeCustomer: StripeCustomerInsert = {
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
      const subscription: Stripe.Subscription = event.data.object;
      const planExpires = subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000)
        : null;

      console.log({
        subscription,
        subscription_cancel_at: subscription.cancel_at,
        planExpires,
      });

      // Update the plan_expires field in the stripe_customers table
      await db
        .update(stripe_customers)
        .set({ plan_expires: planExpires })
        .where(eq(stripe_customers.subscription_id, subscription.id));
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      console.log(subscription);

      await db
        .update(stripe_customers)
        .set({ plan_active: false, subscription_id: null, total_downloads: 0 })
        .where(eq(stripe_customers.subscription_id, subscription.id));
    }

    return NextResponse.json({ message: 'success' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
