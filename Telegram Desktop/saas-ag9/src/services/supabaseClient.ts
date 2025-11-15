import { createClient, type AuthResponse, type Session } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

let supabase: ReturnType<typeof createClient> | {
  auth: {
    getSession: () => Promise<{ data: { session: Session | null } }>;
    signInWithPassword: (args: any) => Promise<AuthResponse>;
    signUp: (args: any) => Promise<AuthResponse>;
    signOut: () => Promise<{ error: any }>;
    resetPasswordForEmail: (email: string, opts: any) => Promise<{ data: any; error: any }>;
  };
};

if (supabaseConfigured) {
  supabase = createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
} else {
  console.warn('[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Auth features will be limited.');
  supabase = {
    auth: {
      async getSession() { return { data: { session: null } }; },
      async signInWithPassword() { return { data: null, error: new Error('Supabase is not configured') } as any; },
      async signUp() { return { data: null, error: new Error('Supabase is not configured') } as any; },
      async signOut() { return { error: null }; },
      async resetPasswordForEmail() { return { data: null, error: new Error('Supabase is not configured') }; },
    }
  } as any;
}

export { supabase };

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.access_token ?? null;
}

export async function signInWithEmailPassword(email: string, password: string): Promise<AuthResponse> {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut(): Promise<{ error: any }> {
  return supabase.auth.signOut();
}

export async function signUpWithEmailPassword(email: string, password: string): Promise<AuthResponse> {
  return supabase.auth.signUp({ email, password });
}

export async function resetPasswordForEmail(email: string, redirectTo?: string): Promise<{ data: any; error: any }> {
  // Redirect back to the app; Supabase will send an email with a link
  const url = redirectTo || (typeof window !== 'undefined' ? `${window.location.origin}/reset` : undefined);
  return supabase.auth.resetPasswordForEmail(email, { redirectTo: url });
}