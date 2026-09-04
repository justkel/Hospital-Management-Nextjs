import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  FinancialsDocument,
  FinancialsQuery,
  FinancialsQueryVariables,
  FinancialTransactionDirection,
  FinancialTransactionType,
  DashboardPeriod,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

function validateDirection(value: string | null): FinancialTransactionDirection | undefined {
  if (!value) return undefined;
  const validDirections = Object.values(FinancialTransactionDirection);
  return validDirections.includes(value as FinancialTransactionDirection) 
    ? value as FinancialTransactionDirection 
    : undefined;
}

function validateTypes(value: string | null): FinancialTransactionType[] | undefined {
  if (!value) return undefined;
  const validTypes = Object.values(FinancialTransactionType);
  const types = value.split(',').filter(Boolean);
  const validatedTypes = types.filter(t => validTypes.includes(t as FinancialTransactionType));
  return validatedTypes.length > 0 ? validatedTypes as FinancialTransactionType[] : undefined;
}

function validatePeriod(value: string | null): DashboardPeriod | undefined {
  if (!value) return undefined;
  const validPeriods = Object.values(DashboardPeriod);
  return validPeriods.includes(value as DashboardPeriod) 
    ? value as DashboardPeriod 
    : undefined;
}

export async function GET(req: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    
    const direction = validateDirection(searchParams.get('direction'));
    const from = searchParams.get('from');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined;
    const paymentMethod = searchParams.get('paymentMethod') || undefined;
    const period = validatePeriod(searchParams.get('period'));
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const to = searchParams.get('to') || undefined;
    const transactionId = searchParams.get('transactionId') || undefined;
    const types = validateTypes(searchParams.get('types'));

    const variables: FinancialsQueryVariables = {
      input: {
        ...(direction && { direction }),
        ...(from && { from }),
        ...(limit && { limit }),
        ...(page && { page }),
        ...(paymentMethod && { paymentMethod }),
        ...(period && { period }),
        ...(search && { search }),
        ...(status && { status }),
        ...(to && { to }),
        ...(transactionId && { transactionId }),
        ...(types && types.length > 0 && { types }),
      },
    };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(FinancialsDocument),
        variables,
      }),
      cache: 'no-store',
    });

    const json: {
      data?: FinancialsQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.financials) {
      return NextResponse.json(
        { error: 'Failed to fetch financials' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      financials: json.data.financials,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}