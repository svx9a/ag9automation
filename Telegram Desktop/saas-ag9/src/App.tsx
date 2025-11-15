import React, { useState } from 'react';
import LandingPage from './views/LandingPage';
import { VisualEditor } from './components/VisualEditor';
import { AutomationProvider } from './components/AutomationProvider';
import Header from './components/layout/Header';
import AuthModal from './components/common/AuthModal';
import type { AuthMode } from './types';
import { signOut as authSignOut } from './services/authClient';
import ChatWidget from './components/common/ChatWidget';

function App() {
  const [view, setView] = useState<'landing' | 'editor'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('signup');

  const openLogin = () => { setAuthMode('login'); setAuthOpen(true); };
  const openSignup = () => { setAuthMode('signup'); setAuthOpen(true); };
  const closeAuth = () => setAuthOpen(false);
  const handleAuthSuccess = () => { setIsAuthenticated(true); setAuthOpen(false); };
  const handleLogout = async () => { try { await authSignOut(); } finally { setIsAuthenticated(false); } };

  return (
    <AutomationProvider>
      <div className="App">
        <Header
          onLoginClick={openLogin}
          onSignupClick={openSignup}
          onLogoutClick={handleLogout}
          onDashboardClick={() => setView('editor')}
          isAuthenticated={isAuthenticated}
        />
        <div style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', gap: 8 }}>
          <button onClick={() => setView('landing')} style={{ padding: '6px 10px' }}>
            🏠 Landing
          </button>
          <button onClick={() => setView('editor')} style={{ padding: '6px 10px' }}>
            🎨 Editor
          </button>
        </div>
        {view === 'landing' ? (
          <LandingPage onSignupClick={openSignup} />
        ) : (
          <VisualEditor />
        )}
        {authOpen && (
          <AuthModal
            mode={authMode}
            onClose={closeAuth}
            onSwitchMode={(m) => setAuthMode(m)}
            onAuthSuccess={() => handleAuthSuccess()}
          />
        )}
        <ChatWidget />
      </div>
    </AutomationProvider>
  );
}

export default App;
