import SessionGuard from '@/components/SessionGuard';
import SettingsClient from './SettingsClient';

export default function SettingsPage() {
  return (
    <SessionGuard mode="none">
      <SettingsClient />
    </SessionGuard>
  );
}