const fs = require('fs');

const indexCss = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-heading: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --color-primary: #FF8C42;
  --color-primary-light: var(--color-primary-light);
  --color-ios-bg: var(--color-ios-bg);
  --color-ios-card: var(--color-ios-card);
  --color-text-main: var(--color-text-main);
  --color-text-sec: var(--color-text-sec);
  --color-border-subtle: var(--color-border-subtle);
  --color-bg-subtle: var(--color-bg-subtle);
  --color-bg-hover: var(--color-bg-hover);
}

:root {
  --color-primary-light: #FFF4E5;
  --color-ios-bg: #F8F9FB;
  --color-ios-card: #FFFFFF;
  --color-text-main: #1C1C1E;
  --color-text-sec: #8E8E93;
  --color-border-subtle: rgba(0, 0, 0, 0.05);
  --color-bg-subtle: rgba(0, 0, 0, 0.02);
  --color-bg-hover: rgba(0, 0, 0, 0.05);
}

.dark {
  --color-primary-light: rgba(255, 140, 66, 0.15);
  --color-ios-bg: #000000;
  --color-ios-card: #1C1C1E;
  --color-text-main: #FFFFFF;
  --color-text-sec: #98989D;
  --color-border-subtle: rgba(255, 255, 255, 0.15);
  --color-bg-subtle: rgba(255, 255, 255, 0.05);
  --color-bg-hover: rgba(255, 255, 255, 0.1);
}

body {
  background-color: var(--color-ios-bg);
  color: var(--color-text-main);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  display: none;
}
`;
fs.writeFileSync('src/index.css', indexCss);

const appTsx = `import { useState, useEffect } from 'react';
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
`;
fs.writeFileSync('src/App.tsx', appTsx);

const landingTsx = `import { motion } from 'motion/react';
import { Building2, User, KeySquare, Moon, Sun } from 'lucide-react';
import { ViewState } from '../types';

interface LandingProps {
  onSelectRole: (role: ViewState) => void;
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

export default function Landing({ onSelectRole, toggleDarkMode, isDarkMode }: LandingProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-ios-bg relative"
    >
      <button 
        onClick={toggleDarkMode} 
        className="absolute top-6 right-6 p-3 rounded-full bg-ios-card border border-border-subtle shadow-sm hover:scale-105 transition-transform"
      >
        {isDarkMode ? <Sun className="w-5 h-5 text-text-main" /> : <Moon className="w-5 h-5 text-text-main" />}
      </button>

      <div className="w-full max-w-lg text-center flex flex-col items-center">
        <div className="font-heading text-2xl font-extrabold text-primary flex items-center gap-2 mb-10">
          <Building2 className="w-7 h-7" />
          EstateFlow
        </div>
        
        <h1 className="font-heading text-[32px] font-bold text-text-main mb-2">
          Selamat Datang Kembali
        </h1>
        <p className="text-text-sec mb-10 text-base">
          Kelola properti Anda dengan mudah dalam satu genggaman
        </p>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={() => onSelectRole('owner')}
            className="flex flex-col items-center justify-center p-10 rounded-[28px] bg-ios-card border border-border-subtle shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(255,140,66,0.1)] hover:border-primary hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-20 h-20 rounded-[22px] bg-primary-light flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <KeySquare className="w-10 h-10 text-primary" />
            </div>
            <p className="font-heading font-bold text-xl text-text-main mb-2">Dashboard Pemilik</p>
            <p className="text-sm text-text-sec">Manajemen unit, pelacakan penyewa, & laporan</p>
          </button>

          <button
            onClick={() => onSelectRole('tenant')}
            className="flex flex-col items-center justify-center p-10 rounded-[28px] bg-ios-card border border-border-subtle shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,122,255,0.1)] hover:border-[#007AFF] hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-20 h-20 rounded-[22px] bg-[#007AFF]/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <User className="w-10 h-10 text-[#007AFF]" />
            </div>
            <p className="font-heading font-bold text-xl text-text-main mb-2">Aplikasi Penyewa</p>
            <p className="text-sm text-text-sec">Pembayaran sewa, cek tagihan, & layanan</p>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
`;
fs.writeFileSync('src/components/Landing.tsx', landingTsx);
