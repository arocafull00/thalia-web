import { useLayoutEffect, useRef } from "react";

export function useSlidingTabsIndicator(enabled: boolean) {
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }

    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) {
      return;
    }

    let ready = false;
    let frame = 0;
    const sync = (animate: boolean) => {
      const active = list.querySelector<HTMLElement>(
        '[data-slot="tabs-trigger"][data-state="active"], [data-slot="tabs-trigger"][data-active]',
      );
      if (!active) {
        indicator.style.opacity = "0";
        return;
      }

      if (!ready || !animate) {
        indicator.style.transition = "none";
      }

      indicator.style.width = `${active.offsetWidth}px`;
      indicator.style.transform = `translateX(${active.offsetLeft}px)`;
      indicator.style.opacity = "1";

      if (!ready || !animate) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          indicator.style.removeProperty("transition");
        });
      }
      ready = true;
    };

    sync(false);

    const mutations = new MutationObserver(() => sync(true));
    mutations.observe(list, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-state", "data-active"],
    });

    const resize = new ResizeObserver(() => sync(false));
    resize.observe(list);
    list.querySelectorAll('[data-slot="tabs-trigger"]').forEach((trigger) => {
      resize.observe(trigger);
    });

    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      resize.disconnect();
    };
  }, [enabled]);

  return { listRef, indicatorRef };
}
