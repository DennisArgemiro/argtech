import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, AlertCircle, Clock } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import ArgtechLogo from '../components/ArgtechLogo';

interface AdminLoginProps {
  onLogin: () => void;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

const getStoredAttempts = (): { count: number; lockoutUntil: number } => {
  try {
    const stored = localStorage.getItem('admin_login_attempts');
    return stored ? JSON.parse(stored) : { count: 0, lockoutUntil: 0 };
  } catch {
    return { count: 0, lockoutUntil: 0 };
  }
};

const setStoredAttempts = (attempts: { count: number; lockoutUntil: number }) => {
  try {
    localStorage.setItem('admin_login_attempts', JSON.stringify(attempts));
  } catch {
    // Ignore localStorage errors (e.g., private browsing)
  }
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState({ count: 0, lockoutUntil: 0 });
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const stored = getStoredAttempts();
    setAttempts(stored);

    if (stored.lockoutUntil > Date.now()) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((stored.lockoutUntil - Date.now()) / 1000));
        setLockoutTimeLeft(remaining);
        if (remaining === 0) {
          clearInterval(interval);
          setAttempts({ count: 0, lockoutUntil: 0 });
          setStoredAttempts({ count: 0, lockoutUntil: 0 });
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, []);

  const isLockedOut = attempts.lockoutUntil > Date.now();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLockedOut) {return;}

    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = password;

    if (!sanitizedEmail || !sanitizedPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
      setError('E-mail inválido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, sanitizedEmail, sanitizedPassword);

      setStoredAttempts({ count: 0, lockoutUntil: 0 });
      setAttempts({ count: 0, lockoutUntil: 0 });
      onLogin();
    } catch {
      const newCount = attempts.count + 1;

      if (newCount >= MAX_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCKOUT_DURATION;
        setStoredAttempts({ count: newCount, lockoutUntil });
        setAttempts({ count: newCount, lockoutUntil });
        setError(`Muitas tentativas. Tente novamente em ${LOCKOUT_DURATION / 60000} minutos.`);
        setLockoutTimeLeft(LOCKOUT_DURATION / 1000);
      } else {
        const remaining = MAX_ATTEMPTS - newCount;
        setStoredAttempts({ count: newCount, lockoutUntil: 0 });
        setAttempts({ count: newCount, lockoutUntil: 0 });
        setError(`Credenciais inválidas. Tentativas restantes: ${remaining}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <ArgtechLogo size={60} className="mx-auto mb-4" />
          <h1 className="font-sans text-2xl font-bold text-white">Painel Administrativo</h1>
          <p className="font-sans text-sm text-[#A8A8A8] mt-2">Acesse para gerenciar seu site</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#0A0A0A] border border-white/10 rounded-lg p-8">
          {isLockedOut && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-md flex items-center gap-3 text-amber-400">
              <Clock size={20} className="shrink-0" />
              <div>
                <p className="font-sans text-xs font-bold">Acesso temporariamente bloqueado</p>
                <p className="font-sans text-xs font-mono mt-1">
                  Tentar novamente em <span className="font-bold">{formatTime(lockoutTimeLeft)}</span>
                </p>
              </div>
            </div>
          )}

          {error && !isLockedOut && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-md flex items-center gap-2 text-red-400 text-xs" role="alert">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A8A8]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || isLockedOut}
                className="w-full bg-[#111] border border-white/10 rounded-md py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="seu@email.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A8A8]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || isLockedOut}
                className="w-full bg-[#111] border border-white/10 rounded-md py-3 pl-10 pr-12 text-white text-sm focus:outline-none focus:border-[#3533CD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || isLockedOut}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A8A8] hover:text-white transition-colors disabled:opacity-50"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {!isLockedOut && attempts.count > 0 && (
            <p className="mb-4 text-center text-xs text-[#A8A8A8]">
              Tentativas restantes: <span className="font-bold text-white">{MAX_ATTEMPTS - attempts.count}</span>
            </p>
          )}

          <button
            type="submit"
            disabled={loading || isLockedOut}
            className="w-full bg-[#3533CD] hover:bg-[#3533CD]/90 text-white font-sans text-xs font-bold py-4 rounded-md transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Entrando...' : 'Entrar'}
            <ArrowRight size={16} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}