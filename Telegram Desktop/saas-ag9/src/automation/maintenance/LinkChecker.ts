import { logger } from '../core/Logger';

export class LinkChecker {
  async checkAll(): Promise<{ broken: string[] }> {
    const anchors = Array.from(document.querySelectorAll('a[href]')) as HTMLAnchorElement[];
    const broken: string[] = [];
    await Promise.all(anchors.map(async (a) => {
      const href = a.getAttribute('href') || '';
      // Only same-origin checks to avoid CORS issues
      if (href.startsWith('http') && !href.startsWith(window.location.origin)) return;
      try {
        const res = await fetch(href, { method: 'HEAD' });
        if (!res.ok) broken.push(href);
      } catch {
        broken.push(href);
      }
    }));
    if (broken.length) logger.warn('Broken links found', { broken }); else logger.info('No broken links');
    return { broken };
  }
}

export const linkChecker = new LinkChecker();