import { useLocation, Link, Navigate } from 'react-router-dom'
import { CheckCircle, Copy, ExternalLink, ArrowRight } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import toast from 'react-hot-toast'

export default function ApplicationSuccessPage() {
  const location = useLocation()
  const state = location.state as {
    applicationId?: string
    statusToken?: string
    fullName?: string
    email?: string
  } | null

  if (!state?.applicationId) return <Navigate to="/" replace />

  const { applicationId, statusToken, fullName, email } = state

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success(`${label} copied!`))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-brand-bg flex items-center py-16 pt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
          {/* Success card */}
          <div className="card p-10 text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 mb-3">
              Application Submitted Successfully!
            </h1>
            <p className="text-slate-600 leading-relaxed mb-8">
              Thank you{fullName ? `, ${fullName.split(' ')[0]}` : ''}! Your SkillRock Ambassador application has been received. 
              Shortlisted candidates will be contacted at <strong>{email}</strong>.
            </p>

            {/* Application ID */}
            <div className="bg-violet-50 border-2 border-violet-200 rounded-2xl p-6 mb-6">
              <p className="text-sm text-slate-500 mb-2">Your Application ID</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-extrabold text-brand-violet tracking-wider">{applicationId}</span>
                <button
                  onClick={() => copyToClipboard(applicationId!, 'Application ID')}
                  className="p-1.5 hover:bg-violet-200 rounded-lg transition-colors"
                  title="Copy application ID"
                >
                  <Copy className="w-4 h-4 text-brand-violet" />
                </button>
              </div>
            </div>

            {/* Status token */}
            {statusToken && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status Check Token (Save this)</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-slate-700 font-mono bg-white border border-slate-200 px-3 py-2 rounded-lg flex-1 break-all">
                    {statusToken}
                  </code>
                  <button
                    onClick={() => copyToClipboard(statusToken, 'Token')}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors flex-shrink-0"
                    title="Copy token"
                  >
                    <Copy className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Use this token along with your email to check your application status.
                </p>
              </div>
            )}

            {/* Next steps */}
            <div className="text-left mb-8">
              <h3 className="font-bold text-slate-900 mb-4">What happens next?</h3>
              <ol className="space-y-3">
                {[
                  'Our team will review your application carefully.',
                  'Shortlisted candidates will be contacted via their registered email address.',
                  'Selected candidates will receive further onboarding instructions.',
                  'You can check your application status anytime using the status page.',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="w-6 h-6 bg-brand-violet text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/application-status"
                className="btn-primary flex-1 justify-center"
              >
                Check Application Status <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://skillrock.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1 justify-center"
              >
                Visit SkillRock <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
