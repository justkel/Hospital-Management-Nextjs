import { cookies } from 'next/headers';

async function testAuth() {
  const res = await fetch(process.env.NEXT_PUBLIC_GATEWAY_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${(await cookies()).get('access_token')?.value}`,
    },
    body: JSON.stringify({
      query: `
        query WhoAmI {
            whoAmI
        }
      `,
    }),
  });

  return res.json();
}

export default async function DashboardPage() {
  const data = await testAuth();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
