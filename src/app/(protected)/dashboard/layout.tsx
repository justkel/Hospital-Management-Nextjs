import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: '2rem' }}>
      <header>
        <h2>Hospital Dashboard</h2>
      </header>
      <main>{children}</main>
    </div>
  );
}
