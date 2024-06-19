import { BASE_PATH, auth } from '@/common/_/auth/next-auth';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

export async function SessionProvider({ children }: { children: ReactNode }) {
  const session = await auth();

  // Can trim the session before it goes further / to the client
  // if (session && session.user) {
  //   session.user = {
  //     name: session.user.name,
  //     email: session.user.email,
  //   };
  // }

  return (
    <NextAuthSessionProvider basePath={BASE_PATH} session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
