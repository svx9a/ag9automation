# Deployment Log

Date: ${DATE}

## Summary
- Switched authentication from Firebase to Google Identity Services (GIS) with backend verification via `google-auth`.
- Removed Firebase client and server dependencies; pruned `src/services/firebase.ts` and `firebase-admin` from backend.
- Restricted CORS to Azure domain and local dev; configurable via `ALLOWED_ORIGINS` env.
- Server now serves the built SPA (`dist/index.html`) at `/` and assets at `/assets`; health at `/health`.
- Updated `.env.local`: `VITE_API_BASE=https://sv9-app.azurewebsites.net` and set `VITE_GOOGLE_CLIENT_ID`.

## Changes
- Frontend
  - `src/services/authClient.ts`: Implemented GIS sign-in; routes token to `/auth/google`.
  - Removed Firebase client: `src/services/firebase.ts` deleted.
  - `package.json`: Removed `firebase` from dependencies.
  - Rebuilt with `vite build` → outputs in `dist/`.
- Backend
  - `server/main.py`: Added `/auth/google`; removed `/auth/firebase` and Firebase Admin init; mounted SPA assets; added `ALLOWED_ORIGINS` support.
  - `server/requirements.txt`: Removed `firebase-admin`; kept `google-auth`.

## Environment
- Azure App Service (Linux) with Python 3.11.
- App settings:
  - `WEBSITES_PORT=8000`
  - `GOOGLE_OAUTH_CLIENT_ID=568818306565-qv725l3kib9qfnhuv14cri9n65j1afj4.apps.googleusercontent.com`
  - `ALLOWED_ORIGINS=https://sv9-app.azurewebsites.net`
- Startup command:
  - `gunicorn -w 4 -k uvicorn.workers.UvicornWorker server.main:app --bind=0.0.0.0:8000`

## Testing
- Local build completed successfully (`vite v6.4.1`).
- Post-deploy checks:
  - `/health` returns JSON status.
  - Root `/` serves SPA.
  - Google login verifies `id_token` via `/auth/google`.

## Rollback Plan
- Keep `backup-predeploy.zip` of current state.
- Re-deploy previous zip via Azure Zip Deploy if issues arise.

## Notes
- Never expose `client_secret` in client-side code. Only `client_id` is used for GIS.
- If you need additional providers (LINE/Facebook), consider Auth0 connections.