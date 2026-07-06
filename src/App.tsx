import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Landing from './components/Landing';
import OwnerDashboard from './components/OwnerDashboard';
import TenantApp from './components/TenantApp';
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

  return (
    <div className="font-sans antialiased bg-ios-bg min-h-screen text-text-main selection:bg-primary/20 overflow-hidden transition-colors duration-300">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div key="landing" className="h-full">
            <Landing onSelectRole={(role) => setView(role)} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
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
