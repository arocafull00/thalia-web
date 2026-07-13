import * as Sentry from "@sentry/nextjs";

const isDev = process.env.NODE_ENV === "development";

type SentryLogArgs =
  | [message: string, attributes?: Record<string, unknown>]
  | [
      messageTemplate: string,
      messageParams: readonly unknown[],
      attributes?: Record<string, unknown>,
    ];

type SentryLogMethod = (...args: SentryLogArgs) => void;

function forwardSentryLog(
  method: typeof Sentry.logger.info,
  args: SentryLogArgs,
) {
  (method as SentryLogMethod)(...args);
}

export const logger = {
  fmt: Sentry.logger.fmt,

  info(...args: SentryLogArgs) {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.info(...args);
      return;
    }

    forwardSentryLog(Sentry.logger.info, args);
  },

  warn(...args: SentryLogArgs) {
    if (isDev) {
      console.warn(...args);
      return;
    }

    forwardSentryLog(Sentry.logger.warn, args);
  },

  error(...args: SentryLogArgs) {
    if (isDev) {
      console.error(...args);
      return;
    }

    forwardSentryLog(Sentry.logger.error, args);
  },

  captureException(
    error: unknown,
    context?: {
      action?: string;
      clinicId?: string | null;
      userId?: string;
      store?: string;
      [key: string]: unknown;
    },
  ) {
    if (isDev) {
      console.error(error, context);
      return;
    }

    Sentry.withScope((scope) => {
      if (!context) {
        Sentry.captureException(error);
        return;
      }

      const { action, clinicId, userId, store, ...rest } = context;

      if (action) scope.setTag("action", action);
      if (store) scope.setTag("store", store);
      if (clinicId) scope.setTag("clinic_id", clinicId);
      if (userId) scope.setUser({ id: userId });

      if (Object.keys(rest).length > 0) {
        scope.setExtras(rest);
      }

      Sentry.captureException(error);
    });
  },

  captureMessage(message: string) {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.info(message);
      return;
    }

    Sentry.captureMessage(message);
  },
};
