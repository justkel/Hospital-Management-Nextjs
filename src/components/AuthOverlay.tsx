'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type LogoutEvent = CustomEvent<{ message?: string }>;

export default function AuthOverlay() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handler = (e: Event) => {
      const event = e as LogoutEvent;

      setMessage(event.detail?.message || 'Session expired');
      setVisible(true);

      setTimeout(async () => {
        try {
          await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
          });
        } catch {
          // ignore
        }

        window.location.href = '/login';
      }, 10000);
    };

    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);

  if (!mounted || !visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center">
        <div className="animate-spin mb-3 h-6 w-6 border-2 border-gray-400 border-t-transparent rounded-full mx-auto" />
        <p className="text-sm">{message}</p>
        <p className="text-xs text-gray-500 mt-1">
          Redirecting to login...
        </p>
      </div>
    </div>,
    document.body
  );
}