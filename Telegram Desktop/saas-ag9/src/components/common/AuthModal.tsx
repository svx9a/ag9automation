import React, { useState } from 'react';
import { XMarkIcon, LineIcon, FacebookIcon, SpinnerIcon } from '../icons';
import { signInWithGoogle, signInWithFacebook, signInWithLineOIDC, signInWithEmailPassword, signUpWithEmailPassword, fetchCurrentUserFromBackend, verifyWithBackend } from '../../services/authClient';
import type { AuthMode, AuthView } from '../../types';

const AuthModal = ({
  mode,
  onClose,
  onSwitchMode,
  onAuthSuccess,
}: {
  mode: AuthMode;
  onClose: () => void;
  onSwitchMode: (newMode: AuthMode) => void;
  onAuthSuccess: (details: { mode: AuthMode; view: AuthView }) => void;
}) => {
  const [authView, setAuthView] = useState<AuthView>('social');
  const [isLoading, setIsLoading] = useState(false);
  const [emailVal, setEmailVal] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [infoText, setInfoText] = useState<string | null>(null);

  const handleProviderAuth = async (provider: 'google' | 'facebook' | 'line') => {
    setIsLoading(true);
    setErrorText(null);
    setInfoText(null);
    try {
      let result;
      if (provider === 'google') result = await signInWithGoogle();
      else if (provider === 'facebook') result = await signInWithFacebook();
      else result = await signInWithLineOIDC();
      await verifyWithBackend(result.idToken, provider);
      onAuthSuccess({ mode, view: 'social' });
    } catch (err: any) {
      console.error(err);
      setErrorText(err?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorText(null);
    setInfoText(null);
    try {
      // Basic validation
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
      if (!emailOk) {
        throw new Error('Please enter a valid email address');
      }
      if ((passwordVal || '').length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      if (mode === 'signup') {
        const signupRes = await signUpWithEmailPassword(emailVal, passwordVal);
        // If email confirmation is required, session will be null
        if (!signupRes?.session) {
          setInfoText('Sign-up successful. Please check your email to confirm your account.');
          return; // wait for confirmation before proceeding
        } else {
          setInfoText('Account created. You are now signed in.');
        }
      } else {
        await signInWithEmailPassword(emailVal, passwordVal);
      }

      // Verify with backend protected endpoint using Supabase JWT
      await fetchCurrentUserFromBackend();
      onAuthSuccess({ mode, view: 'email' });
    } catch (err: any) {
      console.error(err);
      setErrorText(err?.message || 'Email authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const title = mode === 'login' ? 'Log In' : 'Sign Up';
  const loadingText = mode === 'login' ? 'Logging in...' : 'Creating account...';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" 
      aria-modal="true" 
      role="dialog" 
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-8 relative font-sans" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Close modal">
          <XMarkIcon className="w-6 h-6" />
        </button>
        
        <div className="text-center">
             <img src="https://cdn.shopify.com/s/files/1/0767/5537/0199/files/GX-09.png?v=1763106361" alt="AG9 logo" className="h-10 w-auto mx-auto mb-2" decoding="async" />
             <h2 id="auth-modal-title" className="text-2xl font-bold text-gray-800 mb-2 font-serif">{title} to Automatic Thai</h2>
             <p id="auth-modal-description" className="text-gray-500 text-sm mb-6">Start automating your business today.</p>
        </div>

        {authView === 'social' ? (
          <div className="space-y-3">
            {/* Hide providers not configured in production; keep Google + Email */}
            <button onClick={() => handleProviderAuth('google')} disabled={isLoading} className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-gray-800 hover:bg-gray-50 disabled:bg-gray-200">
              <img src="https://storage.googleapis.com/async-await-all/G.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                </div>
            </div>
            <button onClick={() => setAuthView('email')} disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Continue with Email
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailAuth} className="space-y-4">
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" id="email" required disabled={isLoading} value={emailVal} onChange={e => setEmailVal(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" required disabled={isLoading} value={passwordVal} onChange={e => setPasswordVal(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-br from-primary-500 to-primary-600 hover:shadow-lg shadow-primary-500/40 transition-shadow transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 disabled:scale-100 disabled:shadow-none">
              {isLoading ? (
                  <>
                    <SpinnerIcon className="w-5 h-5 mr-2" />
                    {loadingText}
                  </>
              ) : (
                mode === 'login' ? 'Log In' : 'Create Account'
              )}
            </button>
            <div className="flex justify-between">
              <button type="button" onClick={() => setAuthView('social')} disabled={isLoading} className="text-sm text-primary-600 hover:underline disabled:opacity-50">
                  &larr; Back to other login options
              </button>
              <button type="button" onClick={async () => {
                setIsLoading(true);
                setErrorText(null);
                setInfoText(null);
                try {
                  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
                  if (!emailOk) throw new Error('Enter a valid email to reset password');
                  const { sendPasswordResetEmail } = await import('../../services/authClient');
                  await sendPasswordResetEmail(emailVal);
                  setInfoText('Password reset email sent. Check your inbox.');
                } catch (err: any) {
                  console.error(err);
                  setErrorText(err?.message || 'Failed to send reset email');
                } finally {
                  setIsLoading(false);
                }
              }} disabled={isLoading} className="text-sm text-gray-600 hover:underline disabled:opacity-50">
                Forgot password?
              </button>
            </div>
            {errorText && (
              <p className="text-sm text-red-600 text-center" role="alert">{errorText}</p>
            )}
            {infoText && (
              <p className="text-sm text-green-600 text-center" role="status">{infoText}</p>
            )}
          </form>
        )}
        
        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setAuthView('social'); onSwitchMode(mode === 'login' ? 'signup' : 'login'); }} disabled={isLoading} className="font-medium text-primary-600 hover:text-primary-500 disabled:opacity-50">
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;