import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

const sentryDsn = import.meta.env.VITE_SENTRY_DSN

// Initialize Sentry only when DSN is provided to avoid issues in local dev
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      new BrowserTracing({
        tracePropagationTargets: ['localhost', /^https:\/\/.+/],
      }),
    ],
    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    replaysSessionSampleRate: Number(import.meta.env.VITE_SENTRY_SESSION_SAMPLE_RATE ?? 0),
    replaysOnErrorSampleRate: Number(import.meta.env.VITE_SENTRY_ERROR_SAMPLE_RATE ?? 1),
    environment: import.meta.env.MODE,
  })
}

export const withSentry = Sentry.withProfiler
export const SentryErrorBoundary = Sentry.ErrorBoundary
