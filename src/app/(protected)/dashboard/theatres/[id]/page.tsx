import SessionGuard from '@/components/SessionGuard';

import {
  GetTheatreByIdDocument,
  GetTheatreByIdQuery,
  GetTheatreByIdQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import CollapsibleSection from '../../visits/components/CollapsibleSection';

import TheatreInfoSection from '../components/TheatreInfoSection';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TheatreDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const data = await graphqlFetch<
    GetTheatreByIdQuery,
    GetTheatreByIdQueryVariables
  >(GetTheatreByIdDocument, {
    id,
  });

  if (!data?.theatreById) {
    return <SessionGuard needsRefresh />;
  }

  const theatre = data.theatreById;

  return (
    <SessionGuard needsRefresh={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">

          <CollapsibleSection title="Theatre Information">
            <TheatreInfoSection theatre={theatre} />
          </CollapsibleSection>

        </div>
      </div>
    </SessionGuard>
  );
}