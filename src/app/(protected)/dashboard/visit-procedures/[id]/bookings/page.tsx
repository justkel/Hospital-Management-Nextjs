import SessionGuard from '@/components/SessionGuard';

import {
  GetVisitProcedureByIdDocument,
  GetVisitProcedureByIdQuery,
  GetVisitProcedureByIdQueryVariables,
  GetProcedureTheatreBookingsDocument,
  GetProcedureTheatreBookingsQuery,
  GetProcedureTheatreBookingsQueryVariables,
  GetTheatresDocument,
  GetTheatresQuery,
  GetTheatresQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import TheatreBookingWorkspace from '../../components/TheatreBookingWorkspace';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProcedureBookingsPage({ params }: Props) {
  const { id } = await params;

  const [procedureData, bookingsData, theatresData] = await Promise.all([
    graphqlFetch<GetVisitProcedureByIdQuery, GetVisitProcedureByIdQueryVariables>(
      GetVisitProcedureByIdDocument,
      { id }
    ),

    graphqlFetch<
      GetProcedureTheatreBookingsQuery,
      GetProcedureTheatreBookingsQueryVariables
    >(GetProcedureTheatreBookingsDocument, {
      procedureId: id,
    }),

    graphqlFetch<GetTheatresQuery, GetTheatresQueryVariables>(
      GetTheatresDocument,
      {
        pagination: {
          page: 1,
          limit: 50,
        },
      }
    ),
  ]);

  if (
    procedureData.authOutcome === 'logout' ||
    bookingsData.authOutcome === 'logout' ||
    theatresData.authOutcome === 'logout'
  ) {
    const reason =
      procedureData.message ||
      bookingsData.message ||
      theatresData.message;

    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (
    procedureData.authOutcome === 'refresh' ||
    bookingsData.authOutcome === 'refresh' ||
    theatresData.authOutcome === 'refresh'
  ) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <div className="min-h-screen bg-[#0a0e1a] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          <TheatreBookingWorkspace
            procedure={procedureData.data!.visitProcedureById}
            initialBookings={bookingsData.data!.getProcedureTheatreBookings ?? []}
            theatres={theatresData.data!.theatres?.items ?? []}
          />
        </div>
      </div>
    </SessionGuard>
  );
}