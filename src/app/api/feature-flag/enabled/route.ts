import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  IsFeatureFlagEnabledDocument,
  IsFeatureFlagEnabledQuery,
  IsFeatureFlagEnabledQueryVariables,
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
    const flagKey = searchParams.get('flagKey') as FeatureFlagKey;

    if (!flagKey) {
      return NextResponse.json(
        { error: 'flagKey is required' },
        { status: 400 }
      );
    }

    const variables: IsFeatureFlagEnabledQueryVariables = {
      flagKey,
    };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(IsFeatureFlagEnabledDocument),
        variables,
      }),
    });

    const json: {
      data?: IsFeatureFlagEnabledQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (json.data?.isFeatureFlagEnabled === undefined) {
      return NextResponse.json(
        { error: 'Failed to fetch feature flag status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      enabled: json.data.isFeatureFlagEnabled,
      flagKey,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}