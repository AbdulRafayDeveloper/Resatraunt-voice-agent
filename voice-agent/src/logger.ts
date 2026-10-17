/**
 * The minimal logging surface the service uses. Fastify's pino logger satisfies it,
 * and tests can pass `noopLogger` so nothing is printed.
 */
export interface LogFn {
  (obj: Record<string, unknown>, msg?: string): void;
  (msg: string): void;
}

export interface Logger {
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  child(bindings: Record<string, unknown>): Logger;
}

const noop: LogFn = () => undefined;

export const noopLogger: Logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
  child: () => noopLogger,
};

/** Extracts a loggable message from an unknown thrown value. */
export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
