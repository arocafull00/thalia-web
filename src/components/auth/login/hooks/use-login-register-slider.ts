"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type AuthMode = "login" | "register";

export function useLoginRegisterSlider() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [height, setHeight] = useState(0);
  const loginPanelRef = useRef<HTMLDivElement>(null);
  const registerPanelRef = useRef<HTMLDivElement>(null);
  const loginTabId = useId();
  const registerTabId = useId();

  useEffect(() => {
    const activePanel =
      mode === "login" ? loginPanelRef.current : registerPanelRef.current;

    if (!activePanel) {
      return;
    }

    const updateHeight = () => setHeight(activePanel.scrollHeight);
    const observer = new ResizeObserver(updateHeight);

    updateHeight();
    observer.observe(activePanel);

    return () => observer.disconnect();
  }, [mode]);

  const selectMode = (nextMode: AuthMode, focusTab = false) => {
    setMode(nextMode);

    if (!focusTab) {
      return;
    }

    requestAnimationFrame(() => {
      const tabId = nextMode === "login" ? loginTabId : registerTabId;
      document.getElementById(tabId)?.focus();
    });
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const nextMode =
      event.key === "ArrowLeft" || event.key === "Home" ? "login" : "register";
    selectMode(nextMode, true);
  };

  return {
    handleTabKeyDown,
    height,
    loginPanelRef,
    loginTabId,
    mode,
    registerPanelRef,
    registerTabId,
    selectMode,
  };
}
