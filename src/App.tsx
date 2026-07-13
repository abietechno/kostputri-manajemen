import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Landing from './components/Landing';
import OwnerDashboard from './components/OwnerDashboard';
import TenantApp from './components/TenantApp';
import LoginOwner from './components/LoginOwner';
import RegisterOwner from './components/RegisterOwner';
import { ViewState } from './types';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Intercept 'owner' selection from Landing to redirect to login
  const handleSelectRole = (role: ViewState) => {
    if (role === 'owner') {
      setView('login');
    } else {
      setView(role);
    }
  };

  return (
    <div className="font-sans antialiased bg-ios-bg min-h-screen text-text-main selection:bg-primary/20 overflow-hidden transition-colors duration-300">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div key="landing" className="h-full">
            <Landing onSelectRole={handleSelectRole} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
          </motion.div>
        )}
        {view === 'login' && (
          <motion.div key="login" className="h-full">
            <LoginOwner onBack={() => setView('landing')} onLoginSuccess={(v) => setView(v)} isDarkMode={isDarkMode} />
          </motion.div>
        )}
        {view === 'register' && (
          <motion.div key="register" className="h-full">
            <RegisterOwner onBack={() => setView('landing')} onRegisterSuccess={(v) => setView(v)} isDarkMode={isDarkMode} />
          </motion.div>
        )}
        {view === 'owner' && (
          <motion.div key="owner" className="h-full">
            <OwnerDashboard onLogout={() => setView('landing')} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
          </motion.div>
        )}
        {view === 'tenant' && (
          <motion.div key="tenant" className="h-full">
            <TenantApp onLogout={() => setView('landing')} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
