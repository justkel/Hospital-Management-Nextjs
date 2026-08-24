'use client';

import { useSyncExternalStore } from 'react';
import Lottie from 'lottie-react';
import animationData from '@/animations/404 Error.json';

const emptySubscribe = () => () => {};

export default function NotFound() {
  const ready = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!ready) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6 bg-white">
      <div className="flex flex-col items-center">
        <div className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[550px] lg:h-[550px]">
          <Lottie animationData={animationData} loop autoplay />
        </div>

        <a
          href="/dashboard"
          className="inline-block !bg-black !text-white px-5 py-2.5 rounded-lg transition hover:bg-gray-800"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}