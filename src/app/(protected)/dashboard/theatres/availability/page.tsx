import SessionGuard from '@/components/SessionGuard';
import TheatreAvailabilityClient from '../components/TheatreAvailabilityClient';

export default async function TheatreAvailabilityPage() {
  return (
    <SessionGuard mode="none">
      <TheatreAvailabilityClient />
    </SessionGuard>
  );
}