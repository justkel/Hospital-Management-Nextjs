import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetOrganizationFeatureFlagHistoryDocument,
  GetOrganizationFeatureFlagHistoryQuery,
  GetOrganizationFeatureFlagHistoryQueryVariables,
  FeatureFlagKey,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const flagKey = searchParams.get('flagKey') as FeatureFlagKey | null;

    const variables: GetOrganizationFeatureFlagHistoryQueryVariables = {
      flagKey: flagKey ?? undefined,
    };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(GetOrganizationFeatureFlagHistoryDocument),
        variables,
      }),
    });

    const json: {
      data?: GetOrganizationFeatureFlagHistoryQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.organizationFeatureFlagHistory) {
      return NextResponse.json(
        { error: 'Failed to fetch feature flag history' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      history: json.data.organizationFeatureFlagHistory,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}