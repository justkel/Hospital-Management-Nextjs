import {
  GetVisitInvoiceDetailDocument,
  GetVisitInvoiceDetailQuery,
  GetVisitInvoiceDetailQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';
import InvoicePrintClient from './InvoicePrintClient';

interface Props {
  params: Promise<{ id: string; invoiceId: string }>;
}

export default async function InvoicePrintPage({ params }: Props) {
  const { invoiceId } = await params;

  const data = await graphqlFetch<
    GetVisitInvoiceDetailQuery,
    GetVisitInvoiceDetailQueryVariables
  >(GetVisitInvoiceDetailDocument, { invoiceId });

  if (!data?.visitInvoiceDetail) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <InvoicePrintClient detail={data.visitInvoiceDetail} />
    </SessionGuard>
  );
}