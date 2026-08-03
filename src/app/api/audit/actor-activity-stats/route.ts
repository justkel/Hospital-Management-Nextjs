import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  GetActorActivityStatsDocument,
  GetActorActivityStatsQuery,
  GetActorActivityStatsQueryVariables,
  ActorActivityPeriod,
} from '@/shared/graphql/generated/graphql';
import { GraphQLErrorShape, handleGraphQLError } from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const periodParam = searchParams.get('period');

  if (
    !periodParam ||
    !Object.values(ActorActivityPeriod).includes(periodParam as ActorActivityPeriod)
  ) {
    return NextResponse.json({ error: 'Invalid or missing period' }, { status: 400 });
  }

  const period = periodParam as ActorActivityPeriod;

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(GetActorActivityStatsDocument),
        variables: {
          period,
        } as GetActorActivityStatsQueryVariables,
      }),
    });

    const json: {
      data?: GetActorActivityStatsQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.getActorActivityStats) {
      return NextResponse.json(
        { error: 'Failed to fetch actor activity stats' },
        { status: 500 }
      );
    }

    return NextResponse.json({ stats: json.data.getActorActivityStats });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}