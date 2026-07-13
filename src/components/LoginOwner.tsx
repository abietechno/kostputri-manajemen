import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Key, Mail, CheckCircle2 } from 'lucide-react';
import { ViewState } from '../types';

interface LoginOwnerProps {
  onBack: () => void;
  onLoginSuccess: (view: ViewState) => void;
  isDarkMode: boolean;
}

export default function LoginOwner({ onBack, onLoginSuccess, isDarkMode }: LoginOwnerProps) {
  const handleGoogleLogin = () => {
    // Simulate SSO Login
    onLoginSuccess('owner');
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess('owner');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-ios-bg flex flex-col items-center justify-center p-6 transition-colors duration-300`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button 
          onClick={onBack}
          className="flex items-center text-text-sec hover:text-text-main mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Kembali
        </button>

        <div className="bg-ios-card rounded-[32px] p-8 border border-border-subtle shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl text-text-main mb-2">Masuk Pemilik</h1>
            <p className="text-text-sec">Kelola properti KOST PUTRI KREMBANGAN Anda</p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-bg-subtle text-text-main py-4 rounded-[16px] font-semibold border border-border-subtle hover:bg-bg-hover transition-colors mb-6"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Masuk dengan Google
          </button>

          <div className="relative flex items-center justify-center my-6">
            <div className="border-t border-border-subtle w-full"></div>
            <span className="bg-ios-card px-4 text-xs text-text-sec absolute">Atau dengan Email</span>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-sec" />
                <input 
                  type="email" 
                  placeholder="email@example.com"
                  className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] pl-12 pr-4 py-4 text-text-main focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-2">Kata Sandi</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-sec" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-bg-subtle border border-border-subtle rounded-[16px] pl-12 pr-4 py-4 text-text-main focus:outline-none focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-[16px] font-bold mt-4 hover:opacity-90 transition-opacity"
            >
              Masuk
            </button>
          </form>

          <p className="text-center text-sm text-text-sec mt-8">
            Belum punya akun?{' '}
            <button onClick={() => onLoginSuccess('register')} className="text-primary font-bold hover:underline">
              Daftar Sekarang
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
