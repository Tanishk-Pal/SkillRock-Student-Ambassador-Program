import { useState } from 'react'
import { Search, Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import api from '../lib/api'
import { STATUS_META } from '../lib/constants'

type StatusResult = {
  applicationId: string
  status: string
  statusLabel: string
  fullName: string
  college: string
  submittedAt: string
  updatedAt: string
}

export default function ApplicationStatusPage() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StatusResult | null>(null)
  const [error, setError] = useState('')

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !token) {
      setError('Please enter both your email and status token.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await api.get('/applications/status', {
        params: { email: email.trim(), token: token.trim() },
      })
      setResult(response.data)
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('No application found with these credentials. Please check your email and token.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const meta = result ? STATUS_META[result.status] : null

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-brand-bg pt-24 pb-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center py-10">
            <h1 className="text-3xl font-extrabold text-slate-900">Application Status</h1>
            <p className="text-slate-500 mt-2 leading-relaxed">
              Enter your registered email and the status token you received after submission.
            </p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleCheck} className="space-y-5">
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@college.edu"
                  required
                />
              </div>
              <div>
                <label className="label">Status Token</label>
                <input
                  type="text"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  className="input-field font-mono text-sm"
                  placeholder="Paste your status token here"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  This token was displayed on your application success page. 
                  Check your saved notes or screenshots.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Checking...</>
                ) : (
                  <><Search className="w-4 h-4" /> Check Status</>
                )}
              </button>
            </form>
          </div>

          {/* Result */}
          {result && meta && (
            <div className="card mt-6 p-8 animate-slide-up">
              <div className="text-center mb-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 ${meta.bg} ${meta.color}`}>
                  {result.status === 'selected' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : result.status === 'not_selected' ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  {meta.label}
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">{result.fullName}</h2>
                <p className="text-slate-500 text-sm">{result.college}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 mb-5">
                <p className="text-slate-700 text-sm leading-relaxed">{meta.description}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Application ID</span>
                  <span className="font-bold text-slate-900 font-mono">{result.applicationId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Submitted</span>
                  <span className="text-slate-700">{new Date(result.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last Updated</span>
                  <span className="text-slate-700">{new Date(result.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {(result.status === 'submitted' || result.status === 'under_review') && (
                <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm">
                  <p>Your application is being processed. Shortlisted candidates will be contacted at their registered email address.</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-5 bg-white rounded-xl border border-slate-200 text-center">
            <p className="text-slate-600 text-sm mb-3">Haven't applied yet?</p>
            <a href="/apply" className="btn-primary py-2.5 px-6 text-sm">
              Apply for SSAP
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
