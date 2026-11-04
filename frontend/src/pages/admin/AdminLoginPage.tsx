import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff, Loader2, AlertCircle, Shield, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [slowLoadWarning, setSlowLoadWarning] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // If already logged in, redirect
  useEffect(() => {
    if (localStorage.getItem('ssap_admin_token')) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [navigate])

  useEffect(() => {
    let timer: any
    if (loading) {
      timer = setTimeout(() => {
        setSlowLoadWarning(true)
      }, 3000)
    } else {
      setSlowLoadWarning(false)
    }
    return () => clearTimeout(timer)
  }, [loading])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const cleanEmail = email.trim().toLowerCase()
    const cleanPassword = password.trim()

    try {
      const response = await api.post('/admin/login', { email: cleanEmail, password: cleanPassword })
      localStorage.setItem('ssap_admin_token', response.data.token)
      localStorage.setItem('ssap_admin_user', JSON.stringify(response.data.admin))
      toast.success(`Welcome back, ${response.data.admin.name || 'Admin'}!`)
      navigate('/admin/dashboard', { replace: true })
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.response?.status === 401) {
        setError('Invalid admin email or password. Please verify credentials.')
      } else if (err.response?.status === 429) {
        setError('Too many login attempts. Please wait 1 minute and try again.')
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Server wake-up timed out. Render backend is waking up, please click Sign In again.')
      } else {
        setError(err.response?.data?.error || 'Unable to connect to server. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 via-slate-50 to-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle modern Google-style ambient glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Back Link */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to SkillRock SSAP
          </a>
        </div>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <span className="text-slate-900 font-extrabold text-base tracking-tight">SkillRock SSAP</span>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-100">
              Admin
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">SSAP Admin Portal</h1>
          <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            Authorized coordinators & reviewers portal
          </div>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl p-7 shadow-xl border border-slate-200">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label text-xs">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field text-sm py-2.5"
                placeholder="palt51419@gmail.com"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label text-xs mb-0">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field text-sm py-2.5 pr-11"
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs leading-relaxed">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {slowLoadWarning && loading && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-xs flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600 flex-shrink-0" />
                <span>Waking up secure server... (Render free web service takes 15-25s on first wake-up)</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 bg-blue-600 hover:bg-blue-700 font-bold text-sm shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-slate-400 text-xs mt-6">
          SkillRock Student Ambassador Program &bull; Campus Leadership 2026
        </div>
      </div>
    </div>
  )
}
