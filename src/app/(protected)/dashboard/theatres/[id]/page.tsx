import SessionGuard from '@/components/SessionGuard';
import {
  GetTheatreByIdDocument,
  GetTheatreByIdQuery,
  GetTheatreByIdQueryVariables,
  GetTheatreIncidentsByTheatreDocument,
  GetTheatreIncidentsByTheatreQuery,
  GetTheatreIncidentsByTheatreQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import CollapsibleSection from '../../visits/components/CollapsibleSection';
import TheatreInfoSection from '../components/TheatreInfoSection';
import TheatreIncidentsSection from '../components/TheatreIncidentsSection';
import TheatreQuickLinks from '../components/TheatreQuickLinks';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TheatreDetailPage({ params }: Props) {
  const { id } = await params;

  const [data, incidentsData] = await Promise.all([
    graphqlFetch<GetTheatreByIdQuery, GetTheatreByIdQueryVariables>(
      GetTheatreByIdDocument,
      { id }
    ),
    graphqlFetch<
      GetTheatreIncidentsByTheatreQuery,
      GetTheatreIncidentsByTheatreQueryVariables
    >(GetTheatreIncidentsByTheatreDocument, {
      theatreId: id,
      pagination: { page: 1, limit: 20 },
    }),
  ]);

  if (data.authOutcome === 'logout' || incidentsData.authOutcome === 'logout') {
    const reason = data.message || incidentsData.message;
    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (data.authOutcome === 'refresh' || incidentsData.authOutcome === 'refresh') {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
          <CollapsibleSection title="Theatre Information">
            <TheatreInfoSection theatre={data.data!.theatreById} />
          </CollapsibleSection>

          <CollapsibleSection title="Scheduling & Operations">
            <TheatreQuickLinks theatreId={id} />
          </CollapsibleSection>

          {incidentsData.data!.theatreIncidentsByTheatre && (
            <TheatreIncidentsSection
              theatreId={id}
              paginated={incidentsData.data!.theatreIncidentsByTheatre}
            />
          )}
        </div>
      </div>
    </SessionGuard>
  );
}