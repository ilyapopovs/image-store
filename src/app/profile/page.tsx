import { auth } from '@/common/_/auth/next-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/_/ui/card';
import { getStripeCustomer } from '@/common/stripe-customer-utils.server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import PortalButton from './_/portal-button';

export default async function Profile() {
  const session = await auth();

  if (!session) {
    return redirect('/');
  }

  const stripeCustomer = await getStripeCustomer(session.user?.id!);
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
            {stripeCustomer ? (
              <div className="space-y-6">
                <div className="whitespace-pre-wrap">
                  {JSON.stringify(stripeCustomer, undefined, 2)}
                </div>
                <div className="flex justify-end">
                  <PortalButton />
                </div>
              </div>
            ) : (
              <div>
                <div>No Stripe data.</div>
                <div>
                  Create by{' '}
                  <Link href="/" className="underline underline-offset-4">
                    making an order
                  </Link>
                  !
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
