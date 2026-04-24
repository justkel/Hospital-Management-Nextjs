import SessionGuard from '@/components/SessionGuard';
import LabRequestClient from './LabRequestManagementClient';

export default function PatientSearchPage() {
  return (
    <SessionGuard needsRefresh={false}>
        <LabRequestClient />
    </SessionGuard>
  );
}