import { NextRequest, NextResponse } from 'next/server';

import {
  GetVisitInvoiceDetailDocument,
  GetVisitInvoiceDetailQuery,
  GetVisitInvoiceDetailQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import { generateInvoicePrintHTML } from '@/utils/generateInvoicePrintHTML';

interface RouteParams {
  params: Promise<{ id: string; invoiceId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id, invoiceId } = await params;

  const { data, authOutcome } = await graphqlFetch<
    GetVisitInvoiceDetailQuery,
    GetVisitInvoiceDetailQueryVariables
  >(GetVisitInvoiceDetailDocument, { invoiceId });

  const referer = req.headers.get('referer');
  const fallback = new URL(`/dashboard/visits/${id}/billing`, req.url);

  if (authOutcome === 'refresh' || authOutcome === 'logout') {
    return NextResponse.redirect(referer ?? fallback);
  }

  const invoice = data?.visitInvoiceDetail;

  if (!invoice) {
    return NextResponse.redirect(referer ?? fallback);
  }

  const html = generateInvoicePrintHTML(invoice);

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}