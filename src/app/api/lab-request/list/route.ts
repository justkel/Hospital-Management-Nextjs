import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  FindAllLabRequestsDocument,
  FindAllLabRequestsQuery,
  FindAllLabRequestsQueryVariables,
  LabPriority,
  LabRequestStatus,
} from '@/shared/graphql/generated/graphql';
import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');

  const statusParam = searchParams.get('status');
  const priorityParam = searchParams.get('priority');

  const status =
    statusParam &&
    Object.values(LabRequestStatus).includes(
      statusParam as LabRequestStatus
    )
      ? (statusParam as LabRequestStatus)
      : undefined;

  const priority =
    priorityParam &&
    Object.values(LabPriority).includes(
      priorityParam as LabPriority
    )
      ? (priorityParam as LabPriority)
      : undefined;

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(FindAllLabRequestsDocument),
        variables: {
          pagination: {
            page,
            limit,
            ...(status && { status }),
            ...(priority && { priority }),
          },
        } as FindAllLabRequestsQueryVariables,
      }),
    });

    const json: {
      data?: FindAllLabRequestsQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.labRequests) {
      return NextResponse.json(
        { error: 'Failed to fetch lab requests' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      labRequests: json.data.labRequests,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}