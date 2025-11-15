import React, { useEffect, useMemo, useState } from 'react';
import { useAutomation } from '../AutomationProvider';

type LogItem = {
  timestamp: string;
  type: string;
  payload?: unknown;
};

const flows = [
  { key: 'sample_flow', label: 'Trigger Sample Flow' },
  { key: 'cta_conversion', label: 'Track CTA Conversion' },
  { key: 'wallet_update', label: 'Simulate Wallet Update' },
  { key: 'eks_ready', label: 'Simulate EKS Ready' },
  { key: 'export_sample', label: 'Export Sample Data' },
];

const AutomationWidget: React.FC = () => {
  const { backendStatus, trackConversion } = useAutomation();
  const [selected, setSelected] = useState<string>('sample_flow');
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [busy, setBusy] = useState(false);

  const api = useMemo(() => (window as any).AutomationAPI, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const ev = e as CustomEvent;
      const detail: any = ev.detail || {};
      setLogs((prev) => [
        { timestamp: new Date().toISOString(), type: detail.type || 'webhook', payload: detail.payload },
        ...prev,
      ].slice(0, 100));
    };
    document.addEventListener('automation:webhook', handler as EventListener);
    return () => document.removeEventListener('automation:webhook', handler as EventListener);
  }, []);

  const runSelected = async () => {
    setBusy(true);
    try {
      switch (selected) {
        case 'sample_flow':
          await api?.triggerFlow?.('sample_flow', { source: 'widget' });
          break;
        case 'cta_conversion':
          trackConversion('cta_click', 'automation_widget');
          break;
        case 'wallet_update':
          api?.webhookEvent?.('wallet_update', { balance: 12500.75, currency: 'THB', timestamp: new Date().toISOString(), interval: 'manual' });
          break;
        case 'eks_ready':
          api?.webhookEvent?.('eks_ready', { ready: true, cluster: 'prod-eks', timestamp: new Date().toISOString() });
          break;
        case 'export_sample':
          await api?.exportData?.('sample');
          break;
        default:
          break;
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">Automation Flow</h3>
        <p className="text-xs text-gray-500">Trigger flows and watch events in real time</p>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <label htmlFor="flow" className="text-sm text-gray-600">Select flow</label>
          <select id="flow" className="flex-1 px-3 py-2 text-sm border rounded-md" value={selected} onChange={(e) => setSelected(e.target.value)}>
            {flows.map((f) => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
          <button onClick={runSelected} disabled={busy} className="px-3 py-2 text-sm font-semibold rounded-md bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-50">
            {busy ? 'Running…' : 'Run'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <div className="text-xs font-semibold text-gray-700 mb-2">Backend Status</div>
            <dl className="text-xs text-gray-700 space-y-1">
              <div className="flex justify-between"><dt>Wallet</dt><dd>{backendStatus?.wallet?.balance ?? '—'} {backendStatus?.wallet?.currency ?? ''}</dd></div>
              <div className="flex justify-between"><dt>ETH Price</dt><dd>{backendStatus?.market?.ethPrice ?? '—'}</dd></div>
              <div className="flex justify-between"><dt>EKS Ready</dt><dd>{backendStatus?.eks?.ready ? 'Yes' : 'No'}</dd></div>
              <div className="flex justify-between"><dt>Last Update</dt><dd>{backendStatus?.timestamp ? new Date(backendStatus.timestamp).toLocaleString() : '—'}</dd></div>
            </dl>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs font-semibold text-gray-700 mb-2">Quick Actions</div>
            <div className="flex flex-wrap gap-2">
              <button className="px-2 py-1 text-xs rounded bg-gray-800 text-white" onClick={() => api?.triggerFlow?.('click_cta', { source: 'widget' })}>Click CTA flow</button>
              <button className="px-2 py-1 text-xs rounded bg-gray-800 text-white" onClick={() => api?.webhookEvent?.('wallet_update', { balance: Math.round(Math.random()*10000)/100, currency: 'THB', timestamp: new Date().toISOString(), interval: 'manual' })}>Random wallet</button>
              <button className="px-2 py-1 text-xs rounded bg-gray-800 text-white" onClick={() => api?.webhookEvent?.('eks_ready', { ready: true, timestamp: new Date().toISOString() })}>Mark EKS ready</button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border">
          <div className="px-3 py-2 border-b text-xs font-semibold text-gray-700">Event Stream</div>
          <ul className="max-h-40 overflow-auto p-2 text-xs text-gray-700 space-y-1">
            {logs.length === 0 ? (
              <li className="text-gray-400">No events yet. Run a flow above.</li>
            ) : (
              logs.map((l, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-gray-500">{new Date(l.timestamp).toLocaleTimeString()}</span>
                  <span className="font-semibold">{l.type}</span>
                  <span className="text-gray-600 truncate">{typeof l.payload === 'object' ? JSON.stringify(l.payload) : String(l.payload ?? '')}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AutomationWidget;