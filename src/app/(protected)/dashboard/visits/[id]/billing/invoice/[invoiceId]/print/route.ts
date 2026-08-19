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

const data = await graphqlFetch<
  GetVisitInvoiceDetailQuery,
  GetVisitInvoiceDetailQueryVariables
>(GetVisitInvoiceDetailDocument, { invoiceId });
  if (!data?.visitInvoiceDetail) {
    // Access token expired. Bounce back to wherever this was opened from
    // (the billing page), which already handles refresh on its own fetches.
    const referer = req.headers.get('referer');
    const fallback = new URL(`/dashboard/visits/${id}/billing`, req.url);
    return NextResponse.redirect(referer ?? fallback);
  }

  const html = generateInvoicePrintHTML(data.visitInvoiceDetail);

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}