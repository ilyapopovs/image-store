import { auth } from '@/common/_/auth/next-auth';

export default async function Home() {
  const session = await auth();

  return (
    <main className="space-y-6 p-10">
      <h1>Public page</h1>
      <div>
        <h3>Session Data:</h3>
        <div className="whitespace-pre-wrap">
          {JSON.stringify(session, undefined, 2)}
        </div>
      </div>
    </main>
  );
}
