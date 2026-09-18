import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { idempotencyHeaders } from '@/lib/idempotency';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

async function forward(query: string, request?: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      ...idempotencyHeaders(request),
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query }),
    cache: 'no-store',
  });

  const json = await response.json();
  if (json.errors?.length) {
    return NextResponse.json(
      { error: json.errors[0]?.message ?? 'Request failed' },
      { status: response.status >= 400 ? response.status : 400 },
    );
  }

  return NextResponse.json(json.data);
}

export async function GET() {
  return forward(`
    query GetOrganizationGuestAccessCode {
      organizationGuestAccessCode
    }
  `);
}

export async function POST(request: Request) {
  return forward(`
    mutation RegenerateOrganizationGuestAccessCode {
      regenerateOrganizationGuestAccessCode
    }
  `, request);
}
