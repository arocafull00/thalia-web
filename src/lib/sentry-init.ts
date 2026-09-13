export const isDev = process.env.NODE_ENV === "development";

export const isSentryEnabled = !isDev;

const LOCALHOST_RE = /localhost|127\.0\.0\.1/i;

function isLocalhostRequest(event: { request?: { url?: string } }): boolean {
  const url = event.request?.url;
  if (!url) return false;
  return LOCALHOST_RE.test(url);
}

function isLocalhostBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

function shouldDropSentryEvent(event: { request?: { url?: string } }): boolean {
  if (isDev) return true;
  if (isLocalhostRequest(event)) return true;
  if (isLocalhostBrowser()) return true;
  return false;
}

export function sentryBeforeSend<T extends { request?: { url?: string } }>(
  event: T,
): T | null {
  if (shouldDropSentryEvent(event)) return null;
  return event;
}

export function sentryBeforeSendTransaction<
  T extends { request?: { url?: string } },
>(event: T): T | null {
  if (shouldDropSentryEvent(event)) return null;
  return event;
}
