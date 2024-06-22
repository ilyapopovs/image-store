import { auth } from '@/common/_/auth/next-auth';
import CheckoutButton from './_/checkout-button';

export default async function Home() {
  const session = await auth();

  return (
    <div className="space-y-6 p-10">
      <div className="space-y-4 text-center">
        <h1>Signup for a Plan</h1>
        <p>Clicking this button creates a new Stripe Checkout session</p>
        <CheckoutButton
          userId={session?.user?.id}
          email={session?.user?.email}
        />
      </div>
    </div>
  );
}
