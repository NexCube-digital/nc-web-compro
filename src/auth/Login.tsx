import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import apiClient, { AuthResponse } from '../services/api'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

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
        localStorage.setItem('user', JSON.stringify(response.data.user))
        localStorage.setItem('token', response.data.token)
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setEmail('admin@nexcube.digital')
    setPassword('admin123456')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <Helmet>
        <title>Login - NexCube Digital Admin</title>
        <meta name="description" content="Login ke dashboard admin NexCube Digital" />
      </Helmet>

      {/* Background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-300">
          <div className="text-center mb-8">
            <img 
              src="/images/NexCube-full.png" 
              alt="NexCube Digital" 
              className="h-16 w-auto mx-auto mb-4 drop-shadow-lg"
            />
            <h1 className="text-3xl font-bold text-white mb-2">NexCube Admin</h1>
            <p className="text-blue-100 text-sm">Dashboard Manajemen</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm animate-shake">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
                placeholder="admin@nexcube.digital"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Masuk
                </>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl backdrop-blur-sm">
            <p className="text-blue-100 text-xs font-black mb-3 uppercase tracking-wider">📝 Demo Credentials:</p>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-300 font-mono text-xs bg-white/10 px-2 py-1 rounded">admin@nexcube.digital</span>
                <button
                  type="button"
                  onClick={() => setEmail('admin@nexcube.digital')}
                  className="text-blue-200 hover:text-blue-100 text-xs font-semibold transition-colors"
                  title="Copy email"
                >
                  📋
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 font-mono text-xs bg-white/10 px-2 py-1 rounded">change_this_password</span>
                <button
                  type="button"
                  onClick={() => setPassword('change_this_password')}
                  className="text-blue-200 hover:text-blue-100 text-xs font-semibold transition-colors"
                  title="Copy password"
                >
                  📋
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full text-xs font-bold text-blue-100 bg-blue-600/50 hover:bg-blue-600/70 px-3 py-2 rounded-lg transition-all duration-200"
            >
              ⚡ Auto-fill Demo
            </button>
          </div>

          <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-amber-100 text-xs leading-relaxed">
              💡 <span className="font-semibold">Ini adalah mode DEMO</span>. Gunakan kredensial demo di atas untuk login ke dashboard.
            </p>
          </div>
        </div>

        <p className="text-center text-white/60 mt-8 text-sm">
          Kembali ke <Link to="/" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Website</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
