'use client';

import { useEffect, useRef, useState } from 'react';

function parseMarginPx(rootMargin: string): number {
  const match = rootMargin.match(/(-?\d+)\s*px/);
  return match ? Number(match[1]) : 0;
}

/**
 * Reports true once the observed element has entered the viewport
 * (or come within `rootMargin` of it). Stays true forever after that
 * first trigger — this is meant for "start fetching once it's about
 * to be visible," not for tracking ongoing visibility.
 *
 * Uses IntersectionObserver as the primary (cheap, native) mechanism,
 * but backs it up with a manual getBoundingClientRect() check on
 * scroll/resize. This matters because IntersectionObserver only
 * re-evaluates at rendering checkpoints — a fast/instant scroll (End
 * key, scrollTo with no animation, an anchor jump) can move an
 * element from "far below the viewport" to "far above it" without
 * ever rendering a frame where it was actually within range, so the
 * observer never fires. The manual check catches that on the next
 * scroll event, since it inspects live geometry rather than waiting
 * for the browser to report a transition it may have skipped.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = '200px'
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const inViewRef = useRef(inView);
  inViewRef.current = inView;

  useEffect(() => {
    if (inView || !ref.current) return;

    const el = ref.current;
    const marginPx = parseMarginPx(rootMargin);

    const manualCheck = () => {
      if (inViewRef.current) return;
      const rect = el.getBoundingClientRect();
      const withinRange =
        rect.top <= window.innerHeight + marginPx &&
        rect.bottom >= -marginPx;
      if (withinRange) {
        setInView(true);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { rootMargin }
    );
    observer.observe(el);

    // Backup path: catches jumps the observer's async scheduling missed.
    // rAF-throttled so a fast scroll doesn't spam layout reads.
    let ticking = false;
    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        manualCheck();
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScrollOrResize, {
      passive: true,
      capture: true,
    });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Also check once on mount — covers the element already being on
    // screen (or already past it) before a scroll/resize event fires.
    manualCheck();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [inView, rootMargin]);

  return { ref, inView };
}