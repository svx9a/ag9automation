import { logger } from '../core/Logger';

export async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 300): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      logger.warn('Retryable error', { attempt: i + 1, error: String(e) });
      if (i < retries) await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  logger.error('Operation failed after retries', { error: String(lastErr) });
  throw lastErr as Error;
}