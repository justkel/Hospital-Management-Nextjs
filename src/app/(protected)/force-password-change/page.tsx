import SessionGuard from '@/components/SessionGuard';
import ForcePasswordChangeClient from './ForcePasswordChangeClient';

export default function ForcePasswordChangePage() {
  return (
    <SessionGuard needsRefresh={false}>
      <ForcePasswordChangeClient />
    </SessionGuard>
  );
}
