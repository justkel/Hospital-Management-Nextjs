import { idempotencyHeaders } from '@/lib/idempotency';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  SetOrganizationFeatureFlagDocument,
  SetOrganizationFeatureFlagMutation,
  SetOrganizationFeatureFlagMutationVariables,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { flagKey, enabled, reason } = await req.json();

    if (!flagKey || enabled === undefined || !reason) {
      return NextResponse.json(
        { error: 'Missing flagKey, enabled, or reason' },
        { status: 400 }
      );
    }

    const variables: SetOrganizationFeatureFlagMutationVariables = {
      flagKey,
      enabled,
      reason,
    };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        ...idempotencyHeaders(req),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(SetOrganizationFeatureFlagDocument),
        variables,
      }),
    });

    const json: {
      data?: SetOrganizationFeatureFlagMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.setOrganizationFeatureFlag) {
      return NextResponse.json(
        { error: 'Failed to set feature flag' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      flag: json.data.setOrganizationFeatureFlag,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}