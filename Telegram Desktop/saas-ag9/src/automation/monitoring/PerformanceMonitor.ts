import { logger } from '../core/Logger';

export class PerformanceMonitor {
  private marks: Record<string, number> = {};

  mark(name: string) {
    this.marks[name] = performance.now();
    logger.debug('Performance mark', { name, t: this.marks[name] });
  }

  measure(name: string) {
    const start = this.marks[name];
    if (start !== undefined) {
      const duration = performance.now() - start;
      logger.info('Performance measure', { name, duration });
      return duration;
    }
    return undefined;
  }

  reportInteraction(name: string, success: boolean) {
    logger.info('Interaction', { name, success });
  }
}

export const perfMonitor = new PerformanceMonitor();