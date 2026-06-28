export type PwaEnvironment = {
  isStandalone: boolean;
  isIOS: boolean;
  isInAppBrowser: boolean;
};

export function detectPwaEnvironment(): PwaEnvironment {
  if (typeof window === "undefined") {
    return { isStandalone: false, isIOS: false, isInAppBrowser: false };
  }

  const userAgent = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(userAgent) &&
    !("MSStream" in window && (window as Window & { MSStream?: unknown }).MSStream);
  const isInAppBrowser = /Instagram|WhatsApp|FBAN|FBAV|Twitter|Line\//i.test(userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));

  return { isStandalone, isIOS, isInAppBrowser };
}
