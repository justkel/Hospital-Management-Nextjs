import SessionGuard from '@/components/SessionGuard';

import {
  GetTheatreByIdDocument,
  GetTheatreByIdQuery,
  GetTheatreByIdQueryVariables,
  ActiveBlocksForTheatreDocument,
  ActiveBlocksForTheatreQuery,
  ActiveBlocksForTheatreQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import TheatreBlockWorkspace from '../../components/TheatreBlockWorkspace';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TheatreBlockPage({ params }: Props) {
  const { id } = await params;

  const [theatreData, blocksData] = await Promise.all([
    graphqlFetch<GetTheatreByIdQuery, GetTheatreByIdQueryVariables>(
      GetTheatreByIdDocument,
      { id }
    ),
    graphqlFetch<
      ActiveBlocksForTheatreQuery,
      ActiveBlocksForTheatreQueryVariables
    >(ActiveBlocksForTheatreDocument, {
      theatreId: id,
    }),
  ]);

  if (
    theatreData.authOutcome === 'logout' ||
    blocksData.authOutcome === 'logout'
  ) {
    const reason = theatreData.message || blocksData.message;

    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (
    theatreData.authOutcome === 'refresh' ||
    blocksData.authOutcome === 'refresh' ||
    !theatreData.data?.theatreById ||
    !blocksData.data?.activeBlocksForTheatre
  ) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/40 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <TheatreBlockWorkspace
            theatre={theatreData.data.theatreById}
            initialBlocks={blocksData.data.activeBlocksForTheatre}
          />
        </div>
      </div>
    </SessionGuard>
  );
}