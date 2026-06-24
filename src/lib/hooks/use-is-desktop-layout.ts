const DESKTOP_MIN_WIDTH = 1024;

export function useIsDesktopLayout() {
  if (typeof window === "undefined") {
    return true;
  }

  return window.innerWidth >= DESKTOP_MIN_WIDTH;
}
