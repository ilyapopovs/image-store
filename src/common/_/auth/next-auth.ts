import { db } from '@/database';
import {
  accounts,
  authenticators,
  sessions,
  users,
  verificationTokens,
} from '@/database/schema/auth.schema';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const BASE_PATH = '/api/auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  providers: [GitHub, Google],
  basePath: BASE_PATH,
});
