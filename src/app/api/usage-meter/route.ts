import { auth } from '@/common/_/auth/next-auth';
import { getStripeCustomer } from '@/common/stripe-customer-utils.server';
import { db } from '@/database';
import {
  downloads,
  stripe_customers,
  type DownloadInsert,
} from '@/database/schema/app.schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Check the user is signed in and has an active plan
    const session = await auth();

    if (!session?.user?.id) {
      throw 'Session missing!';
    }

    const user = session.user;

    const stripeCustomer = await getStripeCustomer(user.id);

    if (!stripeCustomer || !stripeCustomer.subscription_id) {
      throw 'Please subscribe to a plan to download the image.';
    }

    // Update internal downloads counter
    const { image } = await request.json();

    await db.insert(downloads).values({
      user_id: stripeCustomer.user_id,
      image,
    } satisfies DownloadInsert);

    await db
      .update(stripe_customers)
      .set({ total_downloads: stripeCustomer.total_downloads + 1 })
      .where(eq(stripe_customers.user_id, stripeCustomer.user_id));

    // update Stripe's downloads counter (meter)
    // todo

    return NextResponse.json(
      {
        message: 'Usage record created successfully!',
        total_downloads: stripeCustomer.total_downloads + 1,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
