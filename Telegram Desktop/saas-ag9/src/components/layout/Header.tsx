import React, { useState } from 'react';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '../icons';

const LangSwitcher = () => {
  const params = new URLSearchParams(window.location.search);
  const lang = (params.get('lang') || 'th').toLowerCase();
  const isEn = lang === 'en';
  const setLang = (newLang: 'th' | 'en') => {
    const p = new URLSearchParams(window.location.search);
    p.set('lang', newLang);
    const url = `${window.location.pathname}?${p.toString()}${window.location.hash}`;
    window.location.assign(url);
  };
  return (
    <div className="flex items-center gap-1 text-sm" aria-label="Language switcher">
      <button onClick={() => setLang('th')} className={`px-2 py-1 rounded ${!isEn ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'}`} aria-label="Switch to Thai">TH</button>
      <span className="text-gray-400">/</span>
      <button onClick={() => setLang('en')} className={`px-2 py-1 rounded ${isEn ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white'}`} aria-label="Switch to English">EN</button>
    </div>
  );
};

const Header = ({
  onLoginClick,
  onSignupClick,
  onLogoutClick,
  onDashboardClick,
  isAuthenticated,
}: {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogoutClick: () => void;
  onDashboardClick: () => void;
  isAuthenticated: boolean;
}) => (
  <header className="bg-black/30 backdrop-blur-lg sticky top-0 z-40 border-b border-white/10">
    <div className="container mx-auto px-4 py-3">
      <div className="flex justify-between items-center">
        <a href="/" className="flex items-center gap-2" aria-label="Home">
          <img
            src="https://cdn.shopify.com/s/files/1/0767/5537/0199/files/GX-09.png?v=1763106361"
            alt="AG9 logo"
            className="h-8 w-auto"
            decoding="async"
          />
        </a>
        <nav className="hidden md:flex items-center gap-6 text-gray-300 font-medium">
          <a href="#how-it-works" className="hover:text-primary-400">How it Works</a>
          <a href="#pricing" className="hover:text-primary-400">Pricing</a>
          <a href="#faq" className="hover:text-primary-400">FAQ</a>
          <a href="#contact" className="hover:text-primary-400">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitcher />
          <IgniteSwitch />
          {isAuthenticated ? (
            <>
               <button onClick={onDashboardClick} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 rounded-full hover:bg-white/10">
                 <UserCircleIcon className="w-5 h-5"/>
                 Dashboard
               </button>
               <button onClick={onLogoutClick} className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-600 transition-colors">
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                 Log Out
              </button>
            </>
          ) : (
            <>
              <button onClick={onLoginClick} className="hidden sm:block px-4 py-2 text-sm font-medium text-primary-400 rounded-full hover:bg-white/10">Log In</button>
              <button onClick={onSignupClick} className="bg-gradient-to-br from-gold-500 to-gold-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg shadow-gold-500/40 transition-all transform hover:scale-105">
                ทดลองใช้ฟรี 7 วัน
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  </header>
);

const IgniteSwitch = () => {
  const [on, setOn] = useState(() => document.body.classList.contains('ignite-mode'));
  const toggle = () => {
    const v = !on;
    setOn(v);
    document.body.classList.toggle('ignite-mode', v);
  };
  return (
    <button onClick={toggle} className={`px-2 py-1 text-xs rounded-full ${on ? 'bg-primary-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`} aria-label="Ignite Mode">
      Ignite Carbon
    </button>
  );
};

export default Header;