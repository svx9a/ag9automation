import { logger } from '../core/Logger';

export type ContentUpdate = {
  targetSelector: string;
  text?: string;
  html?: string;
};

export class ContentUpdater {
  async apply(updates: ContentUpdate[]) {
    updates.forEach((u) => {
      const el = document.querySelector(u.targetSelector);
      if (!el) return logger.warn('Content update target not found', { target: u.targetSelector });
      if (u.text !== undefined) el.textContent = u.text;
      if (u.html !== undefined) el.innerHTML = u.html;
    });
    logger.info('Content updates applied', { count: updates.length });
  }
}

export const contentUpdater = new ContentUpdater();