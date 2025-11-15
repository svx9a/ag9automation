import { WorkflowEngine } from '../core/WorkflowEngine';
import { logger } from '../core/Logger';
import { analytics } from '../analytics/Analytics';

export type TriggerPayload = Record<string, unknown>;

function exposeAPI() {
  const api = {
    triggerFlow: async (
      nameOrBuilder: string | ((engine: WorkflowEngine) => WorkflowEngine),
      params?: TriggerPayload,
    ) => {
      try {
        if (typeof nameOrBuilder === 'function') {
          const engine = nameOrBuilder(new WorkflowEngine());
          await engine.run({ document, window });
          analytics.track({ name: 'flow_triggered', value: true });
        } else {
          const name = nameOrBuilder;
          analytics.track({ name: 'flow_triggered', value: name });
          // Broadcast flow event to UI listeners
          try {
            window.dispatchEvent(
              new CustomEvent('automation:flow', { detail: { name, params } })
            );
          } catch (err) {
            logger.warn('Failed to dispatch automation:flow event', err);
          }
          // Optionally POST to backend if configured
          await postToBackend(name, params);
        }
      } catch (err) {
        logger.warn('triggerFlow failed', err);
      }
    },
    webhookEvent: (event: string, payload?: TriggerPayload) => {
      logger.info('Webhook received', { event, payload });
      analytics.track({ name: `webhook_${event}`, value: true });
      // Broadcast to app listeners so UI can react to backend events
      try {
        window.dispatchEvent(new CustomEvent('automation:webhook', { detail: { event, payload } }));
      } catch (err) {
        logger.warn('Failed to dispatch automation:webhook event', err);
      }
      // Optionally POST to backend if configured
      postToBackend(event, payload).catch((err) => {
        // Keep silent to avoid noisy console in preview
        logger.debug?.('webhook backend post failed', err);
      });
    },
    exportData: (format: 'json' | 'csv', data: unknown) => {
      const blob = new Blob([
        format === 'json' ? JSON.stringify(data, null, 2) : toCSV(data as any)
      ], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      analytics.track({ name: 'data_export', value: format });
    }
  };
  // @ts-ignore
  (window as any).AutomationAPI = api;
  logger.info('AutomationAPI exposed on window');
}

function toCSV(data: Array<Record<string, unknown>>): string {
  if (!Array.isArray(data) || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(','));
  return [headers.join(','), ...rows].join('\n');
}

export function initAutomationAPI() {
  exposeAPI();
}

async function postToBackend(event: string, payload?: TriggerPayload) {
  try {
    // @ts-ignore
    const cfg = (window as any).AutomationConfig || {};
    const url = cfg.backendEventsUrl as string | undefined;
    if (!url) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, metadata: payload || {}, time: new Date().toISOString() }),
      signal: controller.signal,
      keepalive: true,
    });
    clearTimeout(timeout);
  } catch (err) {
    // Intentionally silent in UI; backend not required for client flows
  }
}