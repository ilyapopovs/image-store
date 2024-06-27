'use client';

import { SignIn, SignOut } from '@/common/_/auth/buttons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import type { ReactNode } from 'react';

export function Header() {
  const session = useSession();

  if (session.status === 'unauthenticated') {
    return (
      <HeaderLine>
        <Link href="/">Payments</Link>
        <SignIn />
      </HeaderLine>
    );
  }

  return (
    <HeaderLine>
      <div className="space-x-8">
        <Link href="/">Payments</Link>
        <Link href="/photos">Photos</Link>
      </div>
      <div className="space-x-4">
        <Link href="/profile">{session.data?.user?.name}</Link>
        <SignOut />
      </div>
    </HeaderLine>
  );
}

function HeaderLine({ children }: { children: ReactNode }) {
  return (
    <header className="border-b p-4 pl-8">
      <div className="container flex items-center justify-between gap-4">
        {children}
      </div>
    </header>
  );
}
