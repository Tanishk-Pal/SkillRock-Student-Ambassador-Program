import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ShieldCheck, Search, Award, CheckCircle2, XCircle, ArrowLeft,
  Calendar, Building, User, Sparkles
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { fetchCertificateDetails } from '../lib/api'

interface CertData {
  certificateId: string
  ambassadorName: string
  college: string
  issueDate: string
  programDuration: string
  status: string
  tierAchieved?: string
}

export default function VerifyCertificatePage() {
  const { certId: paramCertId } = useParams<{ certId?: string }>()
  const [certId, setCertId] = useState(paramCertId || '')
  const [certificate, setCertificate] = useState<CertData | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (paramCertId) {
      handleLookup(paramCertId)
    }
  }, [paramCertId])

  const handleLookup = async (idToSearch: string) => {
    const trimmed = idToSearch.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const res = await fetchCertificateDetails(trimmed)
      if (res.success && res.data) {
        setCertificate(res.data)
      } else {
        setCertificate(null)
        setError('No valid certificate was found matching this identifier.')
      }
    } catch {
      setCertificate(null)
      setError('Certificate not found or pending 4-month verification review.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLookup(certId)
  }

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-wide uppercase mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Official Verification Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Verify Digital Ambassador Certificate
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
              Enter an Ambassador Certificate ID to authenticate completion of the 4-month SkillRock Student Ambassador Program.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. SSAP-2026-CERT-1001"
                  value={certId}
                  onChange={e => setCertId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-sm focus:outline-hidden focus:border-[#346BF1] focus:ring-2 focus:ring-blue-100 font-mono uppercase"
                  required
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-[#346BF1] hover:bg-blue-600 text-white font-bold text-sm transition-all shadow-xs disabled:opacity-50 shrink-0"
              >
                {loading ? 'Authenticating...' : 'Verify Credential'}
              </button>
            </form>
          </div>

          {/* Results Display */}
          {searched && (
            <div>
              {certificate ? (
                <div className="bg-gradient-to-b from-white to-blue-50/30 rounded-3xl border-2 border-emerald-400 p-8 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest px-6 py-1.5 rounded-bl-2xl shadow-xs">
                    ✓ Authenticated Record
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                        SkillRock Student Ambassador Program
                      </span>
                      <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                        {certificate.ambassadorName}
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 bg-white/80 rounded-2xl p-5 border border-slate-200">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Building className="w-3 h-3" /> Institution
                      </span>
                      <p className="font-semibold text-slate-800 text-sm">{certificate.college}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Issue Date
                      </span>
                      <p className="font-semibold text-slate-800 text-sm">{certificate.issueDate}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Award className="w-3 h-3" /> Program Duration
                      </span>
                      <p className="font-semibold text-slate-800 text-sm">4 Months (Full Cohort Term)</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Honors Tier Achieved
                      </span>
                      <p className="font-semibold text-indigo-700 text-sm">{certificate.tierAchieved || 'Active Leader'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-4">
                    <span className="font-mono text-[11px]">Certificate ID: {certificate.certificateId}</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Tamper-Proof Cryptographic Verification
                    </span>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-white rounded-3xl border border-red-200 p-6 text-center shadow-xs">
                  <XCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                  <h3 className="text-base font-bold text-slate-900">Certificate Verification Failed</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{error}</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
