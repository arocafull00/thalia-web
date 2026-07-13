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
      clinicId?: string;
      userId?: string;
      extra?: Record<string, unknown>;
    },
  ) {
    if (isDev) {
      console.error(error, context);
      return;
    }

    Sentry.withScope((scope) => {
      if (context?.action) scope.setTag("action", context.action);
      if (context?.clinicId) scope.setTag("clinic_id", context.clinicId);
      if (context?.userId) scope.setUser({ id: context.userId });

      if (context?.extra) {
        scope.setExtras(context.extra);
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
