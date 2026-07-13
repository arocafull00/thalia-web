import * as Sentry from "@sentry/nextjs";

const isDev = process.env.NODE_ENV === "development";

type InfoArgs = Parameters<typeof Sentry.logger.info>;
type WarnArgs = Parameters<typeof Sentry.logger.warn>;
type ErrorArgs = Parameters<typeof Sentry.logger.error>;

export const logger = {
  fmt: Sentry.logger.fmt,

  info(...args: InfoArgs) {
    if (isDev) {
      console.info(...args);
      return;
    }

    Sentry.logger.info(...args);
  },

  warn(...args: WarnArgs) {
    if (isDev) {
      console.warn(...args);
      return;
    }

    Sentry.logger.warn(...args);
  },

  error(...args: ErrorArgs) {
    if (isDev) {
      console.error(...args);
      return;
    }

    Sentry.logger.error(...args);
  },

  captureException(error: unknown, context?: Record<string, unknown>) {
    if (isDev) {
      console.error(error, context);
      return;
    }

    Sentry.captureException(error, {
      extra: context,
    });
  },

  captureMessage(message: string) {
    if (isDev) {
      console.info(message);
      return;
    }

    Sentry.captureMessage(message);
  },
};
