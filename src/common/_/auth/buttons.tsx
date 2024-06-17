import { Button } from '../ui/button';
import { signInAction, signOutAction } from './actions';

export function SignIn(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form action={signInAction}>
      <Button {...props}>Sign In</Button>
    </form>
  );
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
  return (
    <form action={signOutAction} className="w-full">
      <Button variant="ghost" className="w-full p-0" {...props}>
        Sign Out
      </Button>
    </form>
  );
}
