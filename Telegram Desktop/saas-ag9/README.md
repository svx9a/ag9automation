<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1KMin6vOtoOJcCuBk6ZXzoOcPN8GOFaTo

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
## Automation Framework

This project includes an automation framework for the landing page to enable autonomous operation.

### Components
- Automated User Flow System: `src/automation/core/WorkflowEngine.ts` orchestrates actions and conditionals. Actions live under `src/automation/actions/` (click, form submit, navigate).
- Self-Optimization: `src/automation/selfOptimization/ABTestManager.ts` picks variants and controls CTA copy. `src/components/AutomationProvider.tsx` provides the context.
- Monitoring & Analytics: `src/automation/monitoring/PerformanceMonitor.ts` and `src/automation/analytics/Analytics.ts` capture timings and interactions.
- Maintenance Automation: `src/automation/maintenance/LinkChecker.ts`, `ContentUpdater.ts`, and `ErrorRecovery.ts` handle checks, content refresh, and retries.
- Integration: `src/automation/integration/AutomationAPI.ts` exposes `window.AutomationAPI` for external triggers, webhook events, and data export.

### Usage
- The `AutomationProvider` wraps the landing page in `src/App.tsx` and provides A/B variant data and conversion tracking to sections like `FinalCta`.
- External systems can call:
  - `window.AutomationAPI.triggerFlow(buildFn)` where `buildFn` receives a `WorkflowEngine` to construct a flow.
  - `window.AutomationAPI.webhookEvent(eventName, payload)` to simulate webhook processing.
  - `window.AutomationAPI.exportData('json'|'csv', data)` to download reports.

### Maintenance & Extension
- Add new actions under `src/automation/actions/` that implement the `Action` interface.
- Extend analytics by wiring the `Analytics` class to your provider (GA/Segment/etc.).
- Schedule checks in `AutomationProvider` effects (intervals are clearly set and easy to adjust).
- All modules include basic error handling and logging via `Logger`.

### Failsafes
- `ErrorRecovery.withRetry` wraps operations to retry on failure.
- Analytics and logging persist minimal state to `localStorage` for traceability.

### Automation Bridge (FastAPI)

To feed live metrics (wallet balance, ETH price, EKS status) into the app:

- Backend setup
  - Install Python 3.10+ and create a venv
  - `pip install -r server/requirements.txt`
  - Run: `uvicorn server.main:app --reload --port 8000`

- Endpoints
  - `GET http://localhost:8000/status` returns backend status snapshot
  - `POST http://localhost:8000/events` accepts JSON payload to update status

- Frontend integration
  - The app polls `http://localhost:8000/status` every 10s via `src/services/statusClient.ts`
  - Received data is broadcast as `automation:webhook` with event `backend_status`
  - `AutomationProvider` updates context so `useAutomation().backendStatus` reflects live data

- Manual testing
  - In DevTools, update status: `fetch('http://localhost:8000/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({wallet_balance_eth:0.2345,eks_ready:true})})`
  - Or trigger in-app: `window.AutomationAPI.webhookEvent('backend_status', { wallet_balance_eth: 0.2345, eth_price_usd: 3650.12, eks_ready: true, last_updated: new Date().toISOString() })`
