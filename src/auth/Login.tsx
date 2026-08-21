import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import apiClient from '../services/api';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHome, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const navigate = useNavigate();

  // Sanitasi Input untuk mencegah Injection Attacks & XSS
  const sanitizeInput = (str: string): string => {
    if (!str) return '';
    return str
      .replace(/['";\\`]/g, '')
      .replace(/--(.*)/g, '')
      .replace(/\/\*(.*?)\*\//g, '')
      .replace(/(union|select|insert|update|delete|drop|alter|truncate|exec|script)/gi, '')
      .trim();
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  async function storeToBrowser(emailVal: string, passwordVal: string) {
    if (!('credentials' in navigator)) return;
    try {
      const nav: any = navigator;
      if (nav.credentials && typeof nav.credentials.create === 'function') {
        const cred = await nav.credentials.create({ password: { id: emailVal, password: passwordVal } });
        if (cred && typeof nav.credentials.store === 'function') {
          await nav.credentials.store(cred);
        }
      }
    } catch (err) {
      console.warn('Credential store failed', err);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingSec = Math.ceil((lockoutTime - Date.now()) / 1000);
      setError(`Terlalu banyak percobaan gagal. Silakan tunggu ${remainingSec} detik lagi.`);
      return;
    }

    const cleanEmail = sanitizeInput(email).toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Email dan password wajib diisi');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Format email tidak valid');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.login(cleanEmail, cleanPassword);
      
      if (response.success && response.data) {
        setFailedAttempts(0);
        setLockoutTime(null);

        const userData = response.data.user;
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('token', response.data.token);
        apiClient.setToken(response.data.token);

        if (rememberMe) {
          localStorage.setItem('savedEmail', cleanEmail);
          try {
            await storeToBrowser(cleanEmail, cleanPassword);
          } catch (err) {
            console.warn('Storing credential failed', err);
          }
        } else {
          localStorage.removeItem('savedEmail');
        }

        navigate('/dashboard');
      }
    } catch (err: any) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        const lockoutUntil = Date.now() + 3 * 60 * 1000;
        setLockoutTime(lockoutUntil);
        setError('Akses dikunci sementara (3 menit) karena 5x percobaan gagal berturut-turut.');
      } else {
        setError(err.message || 'Email atau password salah. Silakan periksa kembali.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B132B] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      <Helmet>
        <title>Admin Login - NexCube Digital</title>
        <meta name="description" content="Login ke dashboard admin NexCube Digital" />
      </Helmet>

      {/* Subtle Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#126EFE]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-7 sm:p-9 shadow-2xl border border-white/15 relative">
          
          {/* Top-Right Home Icon Button */}
          <Link 
            to="/" 
            title="Kembali ke Beranda" 
            className="absolute top-6 right-6 w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            <FaHome className="w-4 h-4 text-blue-200" />
          </Link>

          {/* Header */}
          <div className="text-center mb-7 space-y-2">
            <div className="flex justify-center mb-3">
              <img 
                src="/images/NexCube-full.png" 
                alt="NexCube Digital" 
                className="h-11 sm:h-12 w-auto drop-shadow-md"
              />
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight">
              Admin Login
            </h1>
            <p className="text-blue-200/70 text-xs font-medium">Masuk untuk mengelola dashboard NexCube Digital</p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="mb-5 p-3.5 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-200 text-xs backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <FaExclamationTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <p className="font-medium text-rose-100">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
            
            {/* Email Input */}
            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="block text-white text-xs font-bold tracking-wide">
                Email Admin
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                  <FaEnvelope className="w-3.5 h-3.5" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-2xl text-white text-xs placeholder-white/40 focus:outline-none focus:border-[#126EFE] focus:ring-2 focus:ring-blue-400/30 transition-all"
                  placeholder="masukkan email"
                  disabled={isLoading || (lockoutTime !== null && Date.now() < lockoutTime)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="block text-white text-xs font-bold tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400">
                  <FaLock className="w-3.5 h-3.5" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/20 rounded-2xl text-white text-xs placeholder-white/40 focus:outline-none focus:border-[#126EFE] focus:ring-2 focus:ring-blue-400/30 transition-all"
                  placeholder="••••••••••••"
                  disabled={isLoading || (lockoutTime !== null && Date.now() < lockoutTime)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors cursor-pointer"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 bg-white/10 border border-white/30 rounded cursor-pointer accent-[#126EFE] transition-colors"
                  disabled={isLoading}
                />
                <span className="text-blue-100/80 text-xs font-medium group-hover:text-white transition-colors">
                  Ingat Saya
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (lockoutTime !== null && Date.now() < lockoutTime)}
              className="w-full bg-[#126EFE] hover:bg-blue-600 text-white font-extrabold py-3 px-6 rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-101 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-xs cursor-pointer pt-3"
            >
              {isLoading ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <span>Masuk Ke Dashboard</span>
                  <FaArrowRight className="w-3 h-3" />
                </>
              )}
            </button>

          </form>
        </div>

        {/* Minimal Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/40 text-[11px] font-medium">
            © 2026 NexCube Digital Solutions
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
