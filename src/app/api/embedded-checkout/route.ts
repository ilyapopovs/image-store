import { auth } from '@/common/_/auth/next-auth';
import { stripe } from '@/common/stripe';
import { getStripeCustomer } from '@/common/stripe-customer-utils.server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const authSession = await auth();
    const stripeCustomer = await getStripeCustomer(authSession?.user?.id);

    let customerReference: any = {};

    if (stripeCustomer) {
      customerReference['customer'] = stripeCustomer.stripe_customer_id;
    } else {
      customerReference['customer_email'] = authSession?.user?.email;
    }

    const { priceId } = await request.json();

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      metadata: {
        user_id: authSession?.user?.id,
      },
      ...customerReference, // stripe doesn't allow specifying both `customer` and `customer_email`
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
        },
        {
          // one-time setup fee
          price: process.env.NEXT_PUBLIC_STRIPE_SETUP_FEE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      return_url: `${request.headers.get('origin')}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
