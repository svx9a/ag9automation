// Firebase removed. Implement Google Identity Services (GIS) for direct Google auth.
// Other providers will be marked as not configured until wired.

// Config via Vite envs (do not use process.env in Vite)
function deriveApiBase(): string {
  const envBase = (import.meta as any).env?.VITE_API_BASE as string | undefined;
  if (envBase && envBase.trim().length > 0) return envBase.trim();
  const isBrowser = typeof window !== 'undefined';
  const host = isBrowser ? (window.location?.hostname || '') : '';
  const isLocal = /^localhost$|^127\.0\.0\.1$|^192\.168\./.test(host);
  if (isLocal) return 'http://127.0.0.1:8001';
  return isBrowser ? (window.location.origin || 'https://v9-api.azurewebsites.net') : 'http://127.0.0.1:8001';
}

const CONFIG = {
  apiBase: deriveApiBase(),
  googleClientId:
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '568818306565-qv725l3kib9qfnhuv14cri9n65j1afj4.apps.googleusercontent.com',
  facebookAppId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
  skipGoogleAuth: String(import.meta.env.VITE_SKIP_GOOGLE_AUTH || '').toLowerCase() === 'true',
};

// Load Google Identity Services script dynamically
let gsiLoaded: Promise<void> | null = null;
function loadGsi(): Promise<void> {
  if (gsiLoaded) return gsiLoaded;
  gsiLoaded = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
  return gsiLoaded;
}

// Google
export async function signInWithGoogle() {
  if (CONFIG.skipGoogleAuth) {
    return { idToken: 'dev-skip-token', user: null, provider: 'google' };
  }
  await loadGsi();
  return new Promise<{ idToken: string; user: null; provider: string }>((resolve, reject) => {
    const google = (window as any).google;
    if (!google?.accounts?.id) {
      reject(new Error('Google Identity Services not available'));
      return;
    }
    try {
      google.accounts.id.initialize({
        client_id: CONFIG.googleClientId,
        callback: (response: any) => {
          const idToken = response?.credential;
          if (!idToken) {
            reject(new Error('No credential returned from Google'));
          } else {
            resolve({ idToken, user: null, provider: 'google' });
          }
        },
        ux_mode: 'popup',
      });
      google.accounts.id.prompt();
    } catch (e) {
      reject(e);
    }
  });
}

// Facebook
export async function signInWithFacebook() {
  throw new Error('Facebook auth is not configured. Please use Auth0 or add FB SDK.');
}

// LINE (OIDC) — ensure provider ID `oidc.line` is configured in Firebase console
export async function signInWithLineOIDC() {
  throw new Error('LINE login is not configured. Recommend using Auth0 LINE connection.');
}

// Email + Password via Supabase
import { signInWithEmailPassword as supabaseEmailPassword, signUpWithEmailPassword as supabaseSignUp, getAccessToken, signOut as supabaseSignOut, supabaseConfigured, resetPasswordForEmail } from './supabaseClient';

export async function signInWithEmailPassword(email: string, password: string) {
  if (!supabaseConfigured) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  const res = await supabaseEmailPassword(email, password);
  if (res.error) throw res.error;
  return res.data;
}

export async function signUpWithEmailPassword(email: string, password: string) {
  if (!supabaseConfigured) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  const res = await supabaseSignUp(email, password);
  if (res.error) throw res.error;
  return res.data;
}

// Verify with backend
export async function verifyWithBackend(idToken: string, provider: string) {
  if (provider === 'google' && CONFIG.skipGoogleAuth) {
    return {
      ok: true,
      user: {
        uid: 'dev-user',
        email: 'dev@local.test',
        name: 'Developer Preview',
        picture: '',
        provider: 'google',
      },
    };
  }
  const path = provider === 'google' ? '/auth/google' : '/auth/firebase';
  const res = await fetch(`${CONFIG.apiBase}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken, provider }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Backend verification failed: ${res.status} ${errText}`);
  }
  return res.json();
}

// Fetch current user claims from backend using Supabase JWT
export async function fetchCurrentUserFromBackend() {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${CONFIG.apiBase}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Auth me failed: ${res.status} ${err}`);
  }
  return res.json();
}

export async function signOut() {
  await supabaseSignOut();
}

export async function sendPasswordResetEmail(email: string) {
  if (!supabaseConfigured) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  const { error } = await resetPasswordForEmail(email);
  if (error) throw error;
  return { ok: true };
}