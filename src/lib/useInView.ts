'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reports true once the observed element has entered the viewport
 * (or come within `rootMargin` of it). Stays true forever after that
 * first trigger — this is meant for "start fetching once it's about
 * to be visible," not for tracking ongoing visibility.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = '200px'
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView || !ref.current) return;

    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}