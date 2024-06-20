import { auth } from '@/common/_/auth/next-auth';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function Profile() {
  const session = await auth();

  if (!session) {
    return redirect('/');
  }

  return (
    <div className="p-8">
      <div className="flex flex-wrap justify-center gap-8">
        <ProfileCard>
          <div>Name: {session?.user?.name}</div>
          <div>Email: {session?.user?.email}</div>
        </ProfileCard>
        <ProfileCard>Stripe data: ...</ProfileCard>
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
