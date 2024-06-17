'use server';

import { signIn, signOut } from './next-auth';

export async function signInAction() {
  return await signIn();
}

export async function signOutAction() {
  return await signOut();
}
