import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ABTestManager, Variant } from '../automation/selfOptimization/ABTestManager';
import { perfMonitor } from '../automation/monitoring/PerformanceMonitor';
import { analytics } from '../automation/analytics/Analytics';
import { linkChecker } from '../automation/maintenance/LinkChecker';
import { contentUpdater } from '../automation/maintenance/ContentUpdater';
import { initAutomationAPI } from '../automation/integration/AutomationAPI';
import { startPolling } from '../services/statusClient';

type BackendStatus = {
  wallet_balance_eth?: number;
  eth_price_usd?: number;
  eks_ready?: boolean;
  last_updated?: string;
};

type AutomationContextType = {
  variant: Variant;
  ctaText: string;
  trackConversion: (label: string) => void;
  backendStatus: BackendStatus | null;
};

const AutomationContext = createContext<AutomationContextType | null>(null);

export const useAutomation = () => {
  const ctx = useContext(AutomationContext);
  if (!ctx) throw new Error('useAutomation must be used within AutomationProvider');
  return ctx;
};

export const AutomationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ab = useMemo(() => new ABTestManager(), []);
  const [variant] = useState<Variant>(() => ab.chooseVariant());
  const ctaText = useMemo(() => ab.ctaTextFor(variant), [ab, variant]);
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);

  useEffect(() => {
    perfMonitor.mark('page_load');
    const t = setTimeout(() => perfMonitor.measure('page_load'), 0);
    initAutomationAPI();

    // Listen for backend webhook events broadcasted by AutomationAPI
    const handler = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce.detail?.event === 'backend_status') {
        setBackendStatus(ce.detail.payload ?? null);
      }
    };
    window.addEventListener('automation:webhook', handler as EventListener);

    // Start polling local FastAPI service for status, if available
    const stopPolling = startPolling();

    const linkInterval = setInterval(() => { linkChecker.checkAll(); }, 60_000);
    const contentInterval = setInterval(() => {
      // Example content update: timestamp footer
      contentUpdater.apply([{ targetSelector: 'footer small', text: new Date().toLocaleString() }]);
    }, 300_000);

    return () => {
      clearInterval(linkInterval);
      clearInterval(contentInterval);
      clearTimeout(t);
      stopPolling();
      window.removeEventListener('automation:webhook', handler as EventListener);
    };
  }, []);

  const trackConversion = (label: string) => {
    analytics.track({ name: 'conversion', value: label, tags: { variant } });
  };

  return (
    <AutomationContext.Provider value={{ variant, ctaText, trackConversion, backendStatus }}>
      {children}
    </AutomationContext.Provider>
  );
};