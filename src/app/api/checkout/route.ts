import { stripe } from '@/common/stripe';
import { db } from '@/database';
import { stripe_customers } from '@/database/schema/app.schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { priceId, email, userId } = await request.json();
    const result = await db
      .select()
      .from(stripe_customers)
      .where(eq(stripe_customers.user_id, userId));
    const stripeCustomer = result.length > 0 ? result[0] : undefined;

    let customerReference: any = {};

    if (stripeCustomer) {
      customerReference['customer'] = stripeCustomer.stripe_customer_id;
    } else {
      customerReference['customer_email'] = email;
    }

    const session = await stripe.checkout.sessions.create({
      metadata: {
        user_id: userId,
      },
      ...customerReference, // stripe doesn't allow specifying both `customer` and `customer_email`
      payment_method_types: ['card'],
      line_items: [
        {
          // base subscription
          price: priceId,
        },
        {
          // one-time setup fee
          price: process.env.NEXT_PUBLIC_STRIPE_SETUP_FEE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/success`,
      cancel_url: `${request.headers.get('origin')}/cancel`,
    });

    return NextResponse.json({ id: session.id });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
