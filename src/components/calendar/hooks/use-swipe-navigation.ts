"use client";

import { useEffect, useRef } from "react";

const SWIPE_THRESHOLD_PX = 60;
const MAX_VERTICAL_RATIO = 0.5;

type UseSwipeNavigationOptions = {
  enabled: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
};

export function useSwipeNavigation(
  ref: React.RefObject<HTMLElement | null>,
  options: UseSwipeNavigationOptions,
) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  });

  useEffect(() => {
    const node = ref.current;
    if (!node || !options.enabled) {
      return;
    }

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      start.current = { x: touch.clientX, y: touch.clientY };
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!start.current) {
        return;
      }

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - start.current.x;
      const deltaY = touch.clientY - start.current.y;
      start.current = null;

      if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) {
        return;
      }
      if (Math.abs(deltaY) > Math.abs(deltaX) * MAX_VERTICAL_RATIO) {
        return;
      }

      if (deltaX < 0) {
        optionsRef.current.onSwipeLeft();
      } else {
        optionsRef.current.onSwipeRight();
      }
    };

    node.addEventListener("touchstart", onTouchStart, { passive: true });
    node.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchend", onTouchEnd);
    };
  }, [ref, options.enabled]);
}
