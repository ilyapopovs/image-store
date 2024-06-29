'use client';

import { Button } from '@/common/_/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/common/_/ui/dialog';
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCallback, useState } from 'react';

export function EmbeddedCheckoutButton() {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  );
  const [isOpen, setIsOpen] = useState(false);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch('/api/embedded-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID,
      }),
    })
      .then((res) => res.json())
      .then((data) => data.client_secret);
  }, []);

  const options = { fetchClientSecret };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Buy Now</Button>
      </DialogTrigger>
      <DialogContent className="h-full max-w-full sm:h-[calc(100dvh-96px)] sm:max-w-[calc(100dvw-96px)]">
        <DialogHeader>
          <DialogTitle>Stripe Checkout</DialogTitle>
        </DialogHeader>
        <div className="h-full overflow-auto rounded-sm">
          {isOpen && (
            <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
