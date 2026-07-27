import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetPatientWalletTransactionsPaginatedDocument,
  GetPatientWalletTransactionsPaginatedQuery,
  GetPatientWalletTransactionsPaginatedQueryVariables,
  WalletTransactionType,
  WalletTransactionStatus,
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

  const patientId = searchParams.get('patientId');

  if (!patientId) {
    return NextResponse.json(
      { error: 'Missing patientId' },
      { status: 400 }
    );
  }

  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');

  const typeParam = searchParams.get('type');
  const statusParam = searchParams.get('status');

  const type =
    typeParam &&
    Object.values(WalletTransactionType).includes(
      typeParam as WalletTransactionType
    )
      ? (typeParam as WalletTransactionType)
      : undefined;

  const status =
    statusParam &&
    Object.values(WalletTransactionStatus).includes(
      statusParam as WalletTransactionStatus
    )
      ? (statusParam as WalletTransactionStatus)
      : undefined;

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(GetPatientWalletTransactionsPaginatedDocument),
        variables: {
          patientId,
          pagination: {
            page,
            limit,
            ...(type && { type }),
            ...(status && { status }),
          },
        } as GetPatientWalletTransactionsPaginatedQueryVariables,
      }),
    });

    const json: {
      data?: GetPatientWalletTransactionsPaginatedQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);

    if (errorResponse) return errorResponse;

    if (!json.data?.patientWalletTransactionsPaginated) {
      return NextResponse.json(
        { error: 'Failed to fetch wallet transactions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      transactions: json.data.patientWalletTransactionsPaginated,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}