import { logger } from '../core/Logger';

export type Metric = {
  name: string;
  value: number | string | boolean;
  tags?: Record<string, string>;
};

export class Analytics {
  track(metric: Metric) {
    try {
      // Placeholder: integrate with GA/Segment/etc.
      logger.info('Analytics', metric);
      const log = JSON.parse(localStorage.getItem('automation_metrics') || '[]');
      log.push({ ts: Date.now(), ...metric });
      localStorage.setItem('automation_metrics', JSON.stringify(log));
    } catch (e) {
      logger.error('Analytics error', { error: String(e) });
    }
  }
}

export const analytics = new Analytics();