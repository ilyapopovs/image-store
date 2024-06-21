import { auth } from '@/common/_/auth/next-auth';
import { db } from '@/database';
import { stripe_customers } from '@/database/schema/app.schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function Profile() {
  const session = await auth();

  if (!session) {
    return redirect('/');
  }

  const stripeCustomer = await getStripeCustomerData(session.user?.id!);
  console.log('stripeCustomer', stripeCustomer);

  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-center gap-8">
        <ProfileCard>
          <div>Name: {session?.user?.name}</div>
          <div>Email: {session?.user?.email}</div>
        </ProfileCard>
        <ProfileCard>
          <div>Stripe data:</div>
          <div>
            {stripeCustomer
              ? JSON.stringify(stripeCustomer, undefined, 2)
              : 'empty'}
          </div>
        </ProfileCard>
      </div>
    </div>
  );
}

function ProfileCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-max rounded-md border bg-card p-4 text-card-foreground">
      <div className="space-y-2 whitespace-pre-wrap">{children}</div>
    </div>
  );
}

async function getStripeCustomerData(userId: string) {
  const data = await db
    .select()
    .from(stripe_customers)
    .where(eq(stripe_customers.user_id, userId));

  if (data.length < 1) {
    return undefined;
  }

  return data[0];
}
