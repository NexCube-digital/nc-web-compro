import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import apiClient, { AuthResponse } from '../services/api'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@nexcube.digital')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  // Load saved email on component mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  // Store credentials to browser password manager (Credential Management API)
  async function storeToBrowser(email: string, password: string) {
    if (!('credentials' in navigator)) return
    try {
      // Use the modern create/store pattern if available
      const nav: any = navigator
      if (nav.credentials && typeof nav.credentials.create === 'function') {
        const cred = await nav.credentials.create({ password: { id: email, password } })
        if (cred && typeof nav.credentials.store === 'function') {
          await nav.credentials.store(cred)
        }
        return
      }

      // Fallback for older implementations
      const PasswordCredential: any = (window as any).PasswordCredential
      if (PasswordCredential) {
        try {
          const pc = new PasswordCredential({ id: email, password })
          const navAny: any = navigator
          if (navAny.credentials && typeof navAny.credentials.store === 'function') {
            await navAny.credentials.store(pc)
          }
        } catch (err) {
          console.warn('PasswordCredential store failed', err)
        }
      }
    } catch (err) {
      console.warn('Credential store failed', err)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!email || !password) {
        setError('Email dan password harus diisi')
        setIsLoading(false)
        return
      }

      const response = await apiClient.login(email, password)
      
      if (response.success && response.data) {
        console.log('Login response:', response.data)
        
        // Save user data
        const userData = response.data.user
        localStorage.setItem('user', JSON.stringify(userData))
        console.log('Saved user to localStorage:', userData)
        
        // Save token with both keys for compatibility
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('token', response.data.token)
        console.log('Saved tokens')
        
        // Also set token in apiClient
        apiClient.setToken(response.data.token)
        
        // Save email and (optionally) store password to browser password manager
        if (rememberMe) {
          localStorage.setItem('savedEmail', email)
          try {
            await storeToBrowser(email, password)
          } catch (err) {
            console.warn('Storing credential failed', err)
          }
        } else {
          // Clear saved email if "Remember Me" is unchecked
          localStorage.removeItem('savedEmail')
        }
        
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login')
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <Helmet>
        <title>Admin Login - NexCube Digital</title>
        <meta name="description" content="Login ke dashboard admin NexCube Digital untuk mengelola bisnis Anda" />
      </Helmet>

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Card Container */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl p-8 shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-500">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img 
                src="/images/NexCube-full.png" 
                alt="NexCube Digital" 
                className="h-14 w-auto drop-shadow-2xl"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-blue-200 text-sm font-medium">Kelola bisnis Anda dengan mudah</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/15 border border-red-500/40 rounded-lg text-red-200 text-sm backdrop-blur-sm animate-pulse">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold">Login Gagal</p>
                  <p className="text-red-100 mt-0.5">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="group">
              <label className="block text-white text-sm font-semibold mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-blue-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 focus:bg-white/10 transition-all duration-300"
                  placeholder="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-white text-sm font-semibold mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-blue-300 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 focus:bg-white/10 transition-all duration-300"
                  placeholder="••••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M15.171 13.576l1.472 1.473a1 1 0 001.414-1.414l-14-14a1 1 0 00-1.414 1.414l1.473 1.473A10.014 10.014 0 00.458 10C1.732 14.057 5.522 17 10 17a9.958 9.958 0 004.512-1.074l1.472 1.472a1 1 0 001.414-1.414z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Options */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 bg-white/10 border border-white/30 rounded cursor-pointer accent-blue-500 group-hover:border-white/50 transition-colors"
                  disabled={isLoading}
                />
                <span className="text-white/80 text-sm font-medium group-hover:text-white/100 transition-colors">
                  Ingat saya
                </span>
              </label>
              <Link to="/" className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors">
                Kembali Home
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-95 mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Masuk...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Masuk ke Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2025 NexCube Digital. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
