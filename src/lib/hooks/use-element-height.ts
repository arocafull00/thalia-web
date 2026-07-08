"use client";

import { useEffect, useRef, useState } from "react";

export function useElementHeight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setHeight(Math.round(entry.contentRect.height / 20) * 20);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, height };
}
