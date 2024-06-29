import { stripe } from '@/common/stripe';

async function getSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId!);
  return session;
}

export default async function CheckoutReturn({ searchParams }: any) {
  const sessionId = searchParams.session_id;
  const session = await getSession(sessionId);

  console.log(session);

  if (session?.status === 'open') {
    return <p className="m-10">Payment did not work.</p>;
  }

  if (session?.status === 'complete') {
    return <h3 className="m-10">Payment completed!</h3>;
  }

  return null;
}
