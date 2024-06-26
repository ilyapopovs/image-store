import { SignIn } from '@/common/_/auth/buttons';
import { auth } from '@/common/_/auth/next-auth';
import { getStripeCustomer } from '@/common/stripe-customer-utils.server';
import { type StripeCustomer } from '@/database/schema/app.schema';
import CheckoutButton from './_/checkout-button';

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    return (
      <div className="space-y-6 p-10">
        <GuestView />
      </div>
    );
  }

  const stripeCustomer = await getStripeCustomer(session.user.id);

  if (!stripeCustomer?.subscription_id) {
    return (
      <div className="space-y-6 p-10">
        <BuyPlanView userId={session.user.id} email={session.user.email} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-10">
      <PlanView {...stripeCustomer} />
    </div>
  );
}

function PlanView({
  subscription_id,
  total_downloads,
  plan_active,
  plan_expires,
}: StripeCustomer) {
  return (
    <div>
      <h1>Subscription is active!</h1>
      <div className="whitespace-pre-wrap">
        {JSON.stringify(
          {
            subscription_id,
            total_downloads,
            plan_active,
            plan_expires,
          },
          undefined,
          2,
        )}
      </div>
    </div>
  );
}

function BuyPlanView({ userId, email }: { userId: string; email: string }) {
  return (
    <div className="space-y-4 text-center">
      <h1>Signup for a Plan</h1>
      <p>Clicking this button creates a new Stripe Checkout session</p>
      <CheckoutButton userId={userId} email={email} />
    </div>
  );
}

function GuestView() {
  return (
    <div className="space-y-4 text-center">
      <h1>Signup for a Plan</h1>
      <p>Start by signing in!</p>
      <SignIn />
    </div>
  );
}
