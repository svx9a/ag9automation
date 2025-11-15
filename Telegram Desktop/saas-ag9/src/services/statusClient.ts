export type BackendStatus = {
  wallet_balance_eth?: number;
  eth_price_usd?: number;
  eks_ready?: boolean;
  last_updated?: string;
};

// Derive backend base URL: prefer Vite env, fall back to local in dev or Azure in prod
function deriveBaseUrl(): string {
  const envBase = (import.meta as any).env?.VITE_API_BASE as string | undefined;
  if (envBase && envBase.trim().length > 0) return envBase.trim();
  const isBrowser = typeof window !== 'undefined';
  const host = isBrowser ? (window.location?.hostname || '') : '';
  const isLocal = /^localhost$|^127\.0\.0\.1$|^192\.168\./.test(host);
  if (isLocal) return 'http://127.0.0.1:8001';
  return isBrowser ? (window.location.origin || 'https://v9-api.azurewebsites.net') : 'http://127.0.0.1:8001';
}
const DEFAULT_BASE_URL = deriveBaseUrl();

export function startPolling(baseUrl: string = DEFAULT_BASE_URL, intervalMs: number = 10_000) {
  let stopped = false;

  async function tick() {
    if (stopped) return;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${baseUrl}/status`, {
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data: BackendStatus = await res.json();
        // @ts-ignore
        const api = (window as any).AutomationAPI;
        if (api && typeof api.webhookEvent === 'function') {
          api.webhookEvent('backend_status', data as any);
        }
      }
    } catch (err) {
      // Silently ignore polling errors to avoid console noise in preview
    } finally {
      if (!stopped) setTimeout(tick, intervalMs);
    }
  }

  tick();
  return () => { stopped = true; };
}