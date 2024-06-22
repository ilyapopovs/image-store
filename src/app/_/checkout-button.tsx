'use client';

import { Button } from '@/common/_/ui/button';
import { useToast } from '@/common/_/ui/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import type { User } from 'next-auth';

export default function CheckoutButton({
  userId,
  email,
}: {
  userId: User['id'];
  email: User['email'];
}) {
  const { toast } = useToast();

  const initCheckout = async () => {
    try {
      if (!userId || !email) {
        toast({
          title: "Can't start Stripe Checkout!",
          description: 'Please log in to create a new Stripe Checkout session',
          variant: 'destructive',
        });

        return;
      }

      const stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
      );
      const stripe = await stripePromise;
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID!,
          userId,
          email,
        }),
      });
      const stripeSession = await response.json();
      await stripe?.redirectToCheckout({ sessionId: stripeSession.id });
    } catch (e) {
      toast({
        title: 'Something went wrong!',
        description: 'Please contact developers / check console',
        variant: 'destructive',
      });
      console.error(e);
    }
  };

  return <Button onClick={initCheckout}>Buy Now</Button>;
}
