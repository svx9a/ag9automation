export default {
  async fetch(req: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    const cache = (caches as any).default;
    const isStatic = req.method === 'GET' && (
      url.pathname.startsWith('/assets/') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.jpeg') ||
      url.pathname.endsWith('.webp') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.gif') ||
      url.pathname.endsWith('.woff2')
    );

    if (isStatic) {
      let resp = await cache.match(req);
      if (!resp) {
        resp = await fetch(req, { cf: { cacheEverything: true, cacheTtl: 86400 } } as any);
        const headers = new Headers(resp.headers);
        headers.set('Cache-Control', 'public, max-age=86400, immutable');
        resp = new Response(resp.body, { headers, status: resp.status, statusText: resp.statusText });
        ctx.waitUntil(cache.put(req, resp.clone()));
      }
      return resp;
    }

    if (req.method === 'GET' && url.pathname.startsWith('/images/')) {
      const qualityParam = url.searchParams.get('q');
      const widthParam = url.searchParams.get('w');
      const quality = qualityParam ? Number(qualityParam) : Number(env.IMAGE_DEFAULT_QUALITY || 85);
      const width = widthParam ? Number(widthParam) : 0;
      const image: Record<string, number | string> = { quality, fit: 'scale-down' };
      if (width > 0) image.width = width;
      const resp = await fetch(req, { cf: { image } } as any);
      return resp;
    }

    return fetch(req);
  }
};