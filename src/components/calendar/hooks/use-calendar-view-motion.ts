import { useLayoutEffect, useRef, type RefObject } from "react";

import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import type { CalendarViewMode } from "@/stores/calendar-store";

export type CalendarMotionIntent = "previous" | "next" | "fade" | null;

export function useCalendarViewMotion(
  ref: RefObject<HTMLDivElement | null>,
  weekAnchor: Date,
  viewMode: CalendarViewMode,
  intentRef: RefObject<CalendarMotionIntent>,
) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const previousRef = useRef({ date: weekAnchor.getTime(), viewMode });
  const initialChangeRef = useRef(true);

  useLayoutEffect(() => {
    const current = { date: weekAnchor.getTime(), viewMode };
    const previous = previousRef.current;
    if (current.date === previous.date && current.viewMode === previous.viewMode) {
      return;
    }

    previousRef.current = current;
    const intent = intentRef.current;
    intentRef.current = null;
    if (initialChangeRef.current && intent === null) {
      initialChangeRef.current = false;
      return;
    }
    initialChangeRef.current = false;

    const node = ref.current;
    if (!node || prefersReducedMotion) {
      return;
    }

    const direction =
      current.viewMode !== previous.viewMode || intent === "fade"
        ? 0
        : intent === "previous"
          ? -8
          : intent === "next"
            ? 8
            : current.date < previous.date
              ? -8
              : 8;
    const animation = node.animate(
      [
        { opacity: 0.84, transform: `translateX(${direction}px)` },
        { opacity: 1, transform: "translateX(0)" },
      ],
      {
        duration:
          Number.parseFloat(
            getComputedStyle(node).getPropertyValue("--duration-fast"),
          ) || 250,
        easing:
          getComputedStyle(node)
            .getPropertyValue("--ease-smooth-out")
            .trim() || "ease-out",
      },
    );

    return () => animation.cancel();
  }, [intentRef, prefersReducedMotion, ref, viewMode, weekAnchor]);
}
