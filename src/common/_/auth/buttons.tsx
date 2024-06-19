'use client';

import { signOut } from 'next-auth/react';
import { Button } from '../ui/button';
import { signInAction } from './actions';

export function SignIn(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form action={signInAction}>
      <Button {...props}>Sign In</Button>
    </form>
  );
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <Button variant="ghost" {...props} onClick={() => signOut()}>
      Sign Out
    </Button>
  );
}
