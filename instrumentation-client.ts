// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

import {
  isSentryEnabled,
  sentryBeforeSend,
  sentryBeforeSendTransaction,
} from "@/lib/sentry-init";

Sentry.init({
  dsn: "https://5a40397255621fac0b460b69a844b96d@o4511728906272768.ingest.de.sentry.io/4511728914792528",
  enabled: isSentryEnabled,
  beforeSend: sentryBeforeSend,
  beforeSendTransaction: sentryBeforeSendTransaction,

  tracesSampleRate: 1,
  enableLogs: true,

  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
