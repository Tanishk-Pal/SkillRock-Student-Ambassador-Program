import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff, Loader2, AlertCircle, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // If already logged in, redirect
  if (localStorage.getItem('ssap_admin_token')) {
    navigate('/admin/dashboard', { replace: true })
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/admin/login', { email, password })
      localStorage.setItem('ssap_admin_token', response.data.token)
      localStorage.setItem('ssap_admin_user', JSON.stringify(response.data.admin))
      toast.success(`Welcome back, ${response.data.admin.name}!`)
      navigate('/admin/dashboard', { replace: true })
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid email or password.')
      } else if (err.response?.status === 429) {
        setError('Too many login attempts. Please try again later.')
      } else {
        setError('Login failed. Please check your connection.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-violet/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-purple/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-violet to-brand-purple rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-extrabold text-xl">SkillRock SSAP</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
          <div className="flex items-center justify-center gap-1.5 text-slate-400 text-sm">
            <Shield className="w-4 h-4" />
            Secure access — authorized personnel only
          </div>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                placeholder="admin@skillrock.in"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Not an admin?{' '}
          <a href="/" className="text-brand-violet hover:text-violet-400 underline">
            Return to program homepage
          </a>
        </p>
      </div>
    </div>
  )
}
