import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../services/api'
import Toast from '../Toast'

interface Props {
  onCloseMenu?: () => void
}

export const LoginButton: React.FC<Props> = ({ onCloseMenu }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const navigate = useNavigate()

  const open = () => {
    if (onCloseMenu) onCloseMenu()
    navigate('/login')
  }

  useEffect(() => {
    try {
      const r = localStorage.getItem('rememberMe')
      const remembered = r === 'true'
      setRemember(remembered)
      const savedEmail = localStorage.getItem('rememberEmail') || ''
      if (remembered && savedEmail) setEmail(savedEmail)
    } catch (e) {
      // ignore
    }
  }, [])

  const close = () => setIsOpen(false)

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
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
        setToast({ msg: 'Login berhasil — mengarahkan ke dashboard', type: 'success' })
        // apiClient.setToken already called inside login
        localStorage.setItem('user', JSON.stringify(response.data.user))
        // remember preference: only store email and the flag — do NOT store raw password
        if (remember) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('rememberEmail', email)
        } else {
          localStorage.removeItem('rememberMe')
          localStorage.removeItem('rememberEmail')
        }
        setTimeout(() => {
          navigate('/dashboard')
        }, 700)
      }
    } catch (err: any) {
      setError(err.message || 'Gagal login')
      setToast({ msg: err.message || 'Gagal login', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Premium CTA Button */}
      <button
        onClick={open}
        className="group relative inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-sm overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-white/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-100 group-hover:opacity-110 transition-all duration-300"></div>
        <div className="relative z-10 text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm">Masuk</span>
        </div>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close}></div>
          <div className="relative max-w-md w-full mx-4 bg-white/5 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 shadow-2xl z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Masuk ke NexCube</h3>
              <button onClick={close} className="text-white/60 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-3 p-3 bg-red-500/10 border border-red-400/20 rounded-md text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/6 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder="you@domain.com"
                  type="email"
                />
              </div>

              <div>
                <label className="text-white/80 text-sm font-medium mb-2 block">Password</label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/6 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="w-4 h-4 accent-blue-500"
                    />
                    Ingat saya
                </label>
                <a className="text-sm text-blue-300 hover:text-blue-200" href="#">Lupa password?</a>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300"
                >
                  {isLoading ? 'Memproses...' : 'Masuk'}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="px-4 py-2 rounded-lg bg-white/6 border border-white/10 text-white/90"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type === 'success' ? 'success' : 'error'}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

export default LoginButton
