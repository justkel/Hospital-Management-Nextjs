import { graphqlFetch, AuthError } from '@/shared/graphql/fetcher';
import { WhoAmIDocument, WhoAmIQuery, WhoAmIQueryVariables } from '@/shared/graphql/generated/graphql';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  let data: WhoAmIQuery;

  try {
    data = await graphqlFetch<WhoAmIQuery, WhoAmIQueryVariables>(WhoAmIDocument, {});
  } catch (err: unknown) {
    if (err instanceof AuthError || (err as { message?: string }).message === 'UNAUTHENTICATED') {
      redirect('/login');
    }
    throw err;
  }

  const raw = data.whoAmI || '';
  const [emailPart, rolesPart] = raw.split(' and ');
  const email = emailPart?.replace('Your email is ', '').trim() ?? 'Unknown';
  const roles = rolesPart?.replace('your roles are ', '').split(',').map((r) => r.trim()) ?? [];

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Hospital Dashboard</h1>

      <div style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Welcome</h2>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Roles:</strong> {roles.join(', ')}
        </p>
      </div>

      <h3>Raw GraphQL Response (for debugging)</h3>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
