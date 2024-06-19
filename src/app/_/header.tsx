'use client';

import { SignIn, SignOut } from '@/common/_/auth/buttons';
import { useSession } from 'next-auth/react';
import type { ReactNode } from 'react';

export function Header() {
  const session = useSession();

  if (session.status === 'unauthenticated') {
    return (
      <HeaderLine>
        <SignIn />
      </HeaderLine>
    );
  }

  return (
    <HeaderLine>
      {session.data?.user?.name}
      <SignOut />
    </HeaderLine>
  );
}

function HeaderLine({ children }: { children: ReactNode }) {
  return (
    <header className="flex items-center justify-end gap-4 border-y p-4">
      {children}
    </header>
  );
}
