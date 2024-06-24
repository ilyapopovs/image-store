import { db } from '@/database';
import {
  stripe_customers,
  type StripeCustomer,
} from '@/database/schema/app.schema';
import { eq } from 'drizzle-orm';
import { auth } from './_/auth/next-auth';

export async function getStripeCustomer(
  userId?: string,
): Promise<StripeCustomer | undefined> {
  let uId = userId;

  if (!uId) {
    const session = await auth();
    uId = session?.user?.id;

    if (!uId) {
      throw 'Authentication missing!';
    }
  }

  const result = await db
    .select()
    .from(stripe_customers)
    .where(eq(stripe_customers.user_id, uId));

  return result.length > 0 ? result[0] : undefined;
}
