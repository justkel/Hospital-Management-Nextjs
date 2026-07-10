import SessionGuard from '@/components/SessionGuard';

import {
  TheatreScheduleForDayDocument,
  TheatreScheduleForDayQuery,
  TheatreScheduleForDayQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import TheatreDayScheduleWorkspace from '../../components/TheatreDayScheduleWorkspace';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default async function TheatreDayScheduleWorkspacePage({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { date } = await searchParams;

  const dayString = date ?? todayLocal();

  const scheduleData = await graphqlFetch<
    TheatreScheduleForDayQuery,
    TheatreScheduleForDayQueryVariables
  >(TheatreScheduleForDayDocument, {
    theatreId: id,
    date: `${dayString}T00:00:00`,
  });

  if (!scheduleData?.theatreScheduleForDay) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <TheatreDayScheduleWorkspace
            theatreId={id}
            initialDate={dayString}
            initialSchedule={scheduleData.theatreScheduleForDay}
          />
        </div>
      </div>
    </SessionGuard>
  );
}