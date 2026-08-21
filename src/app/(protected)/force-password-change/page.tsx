import SessionGuard from '@/components/SessionGuard';
import ForcePasswordChangeClient from './ForcePasswordChangeClient';

export default function ForcePasswordChangePage() {
  return (
    <SessionGuard mode="none">
      <ForcePasswordChangeClient />
    </SessionGuard>
  );
}