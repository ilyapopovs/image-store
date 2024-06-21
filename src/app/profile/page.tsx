import { auth } from '@/common/_/auth/next-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/_/ui/card';
import { db } from '@/database';
import { stripe_customers } from '@/database/schema/app.schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function Profile() {
  const session = await auth();

  if (!session) {
    return redirect('/');
  }

  const stripeCustomer = await getStripeCustomerData(session.user?.id!);
  console.log('stripeCustomer', stripeCustomer);

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-center gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Auth data</CardTitle>
          </CardHeader>
          <CardContent>
            <div>Name: {session?.user?.name}</div>
            <div>Email: {session?.user?.email}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stripe data</CardTitle>
          </CardHeader>
          <CardContent>
            {stripeCustomer
              ? JSON.stringify(stripeCustomer, undefined, 2)
              : 'empty'}
          </CardContent>
        </Card>
      </div>
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
