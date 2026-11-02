import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Zap, LogOut, Loader2, AlertCircle, Save, Star, CheckCircle,
  XCircle, User, MessageSquare, Brain, MapPin, Zap as ZapIcon, Video,
  ExternalLink, FileText,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api, { getUploadUrl } from '../../lib/api'
import { STATUS_META, SCORE_CATEGORIES } from '../../lib/constants'

type ApplicationDetail = {
  applicationId: string
  fullName: string
  email: string
  phone: string
  college: string
  university: string
  degree: string
  year: string
  branch: string
  city: string
  state: string
  linkedinUrl?: string
  instagramUrl?: string
  preferredLanguage: string
  weeklyAvailability: string
  whyAmbassador: string
  skillrockValue: string
  timeContribution: string
  priorExperience: string
  priorExperienceDescription?: string
  personalGoal: string
  scenario1Answer: string
  scenario1Reasoning?: string
  scenario2Answer: string
  scenario3Answer: string
  scenario4Answer: string
  scenario5Answer: string
  scenario6Answer: string
  campusWaitingPlace: string
  campusGatheringArea: string
  campusReach500: string
  campusEvent: string
  campusTradition: string
  quickFire1: string
  quickFire2: string
  videoType: 'upload' | 'link'
  videoUrl?: string
  videoFilePath?: string
  status: string
  totalScore?: number
  motivationScore?: number
  situationalScore?: number
  campusScore?: number
  quickFireScore?: number
  videoScore?: number
  reviewerNotes?: string
  internalNotes?: string
  reviewedBy?: string
  submittedAt: string
  updatedAt: string
}

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="card mb-6">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
        <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-brand-violet" />
        </div>
        <h2 className="font-bold text-slate-900">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-slate-800 leading-relaxed">{value || '—'}</p>
    </div>
  )
}

function ScenarioAnswer({ label, answer, reasoning }: { label: string; answer: string; reasoning?: string }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 mb-3">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
      <span className="inline-flex items-center gap-1 bg-brand-violet text-white text-sm font-bold px-3 py-1 rounded-full">
        Option {answer}
      </span>
      {reasoning && (
        <p className="text-slate-600 text-sm mt-2 italic">"{reasoning}"</p>
      )}
    </div>
  )
}

export default function AdminApplicationPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const adminUser = JSON.parse(localStorage.getItem('ssap_admin_user') || '{}')

  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Review state
  const [status, setStatus] = useState('')
  const [scores, setScores] = useState({ motivationScore: 0, situationalScore: 0, campusScore: 0, quickFireScore: 0, videoScore: 0 })
  const [reviewerNotes, setReviewerNotes] = useState('')
  const [internalNotes, setInternalNotes] = useState('')

  useEffect(() => {
    const fetchApplication = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/applications/${id}`)
        const app = response.data
        setApplication(app)
        setStatus(app.status)
        setScores({
          motivationScore: app.motivationScore ?? 0,
          situationalScore: app.situationalScore ?? 0,
          campusScore: app.campusScore ?? 0,
          quickFireScore: app.quickFireScore ?? 0,
          videoScore: app.videoScore ?? 0,
        })
        setReviewerNotes(app.reviewerNotes ?? '')
        setInternalNotes(app.internalNotes ?? '')
      } catch {
        setError('Failed to load application.')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchApplication()
  }, [id])

  const totalScore = Object.values(scores).reduce((a, b) => a + Number(b), 0)

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.patch(`/applications/${id}`, {
        status,
        ...scores,
        totalScore,
        reviewerNotes,
        internalNotes,
      })
      toast.success('Review saved successfully!')
      setApplication(prev => prev ? { ...prev, status, ...scores, totalScore, reviewerNotes, internalNotes } : prev)
    } catch {
      toast.error('Failed to save review.')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string, label: string) => {
    if (!window.confirm(`Are you sure you want to mark this application as "${label}"?`)) return
    setStatus(newStatus)
    setSaving(true)
    try {
      await api.patch(`/applications/${id}`, { status: newStatus })
      toast.success(`Status updated to "${label}"`)
    } catch {
      toast.error('Failed to update status.')
      setStatus(application?.status ?? newStatus)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('ssap_admin_token')
    localStorage.removeItem('ssap_admin_user')
    navigate('/admin/login')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <Loader2 className="w-8 h-8 text-brand-violet animate-spin" />
    </div>
  )

  if (error || !application) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-slate-700 font-medium">{error || 'Application not found'}</p>
        <Link to="/admin/dashboard" className="btn-primary mt-4 inline-flex">Back to Dashboard</Link>
      </div>
    </div>
  )

  const meta = STATUS_META[status]

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Admin Nav */}
      <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard" className="btn-ghost text-sm py-2 px-3">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <div className="w-8 h-8 bg-gradient-to-br from-brand-violet to-brand-purple rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 hidden sm:block">{application.applicationId}</span>
        </div>
        <button onClick={handleLogout} className="btn-ghost text-sm py-2 px-3 text-red-600 hover:bg-red-50">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Application Details */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="card p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">{application.fullName}</h1>
                  <p className="text-slate-500">{application.email} · {application.phone}</p>
                  <p className="text-slate-600 mt-1">{application.college} · {application.degree} ({application.year})</p>
                  <p className="text-slate-500 text-sm">{application.city}, {application.state}</p>
                </div>
                <div className="flex flex-col items-start sm:items-end gap-2">
                  <span className={`badge text-sm px-4 py-1.5 ${meta?.bg} ${meta?.color}`}>{meta?.label ?? status}</span>
                  <span className="text-xs text-slate-400">Submitted {new Date(application.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  {application.reviewedBy && <span className="text-xs text-slate-400">Reviewed by {application.reviewedBy}</span>}
                </div>
              </div>
              <div className="flex gap-3 mt-4 flex-wrap">
                {application.linkedinUrl && (
                  <a href={application.linkedinUrl} target="_blank" rel="noopener noreferrer"
                    className="btn-ghost text-xs py-1.5 px-3">
                    LinkedIn <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {application.instagramUrl && (
                  <a href={application.instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="btn-ghost text-xs py-1.5 px-3">
                    Instagram <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Section 2 */}
            <Section title="Motivation & Commitment" icon={MessageSquare}>
              <Field label="Why do you want to be an ambassador?" value={application.whyAmbassador} />
              <Field label="What SkillRock can offer students" value={application.skillrockValue} />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Time contribution" value={application.timeContribution} />
                <Field label="Weekly availability" value={application.weeklyAvailability} />
                <Field label="Prior experience" value={application.priorExperience} />
              </div>
              {application.priorExperienceDescription && (
                <Field label="Experience description" value={application.priorExperienceDescription} />
              )}
              <Field label="Personal goal" value={application.personalGoal} />
            </Section>

            {/* Section 3 */}
            <Section title="Situational Judgment" icon={Brain}>
              <ScenarioAnswer label="Scenario 1 — Low Registration" answer={application.scenario1Answer} reasoning={application.scenario1Reasoning} />
              <ScenarioAnswer label="Scenario 2 — Campus Restrictions" answer={application.scenario2Answer} />
              <ScenarioAnswer label="Scenario 3 — Low Event Attendance" answer={application.scenario3Answer} />
              <ScenarioAnswer label="Scenario 4 — Students Don't Understand" answer={application.scenario4Answer} />
              <ScenarioAnswer label="Scenario 5 — Collaboration Without Budget" answer={application.scenario5Answer} />
              <ScenarioAnswer label="Scenario 6 — Public Criticism" answer={application.scenario6Answer} />
            </Section>

            {/* Section 4 */}
            <Section title="Campus Knowledge" icon={MapPin}>
              <Field label="Waiting spot" value={application.campusWaitingPlace} />
              <Field label="Gathering area" value={application.campusGatheringArea} />
              <Field label="Reaching 500 students in 24hrs" value={application.campusReach500} />
              <Field label="Campus event opportunity" value={application.campusEvent} />
              <Field label="Campus tradition / inside joke" value={application.campusTradition} />
            </Section>

            {/* Section 5 */}
            <Section title="Quick-Fire" icon={ZapIcon}>
              <ScenarioAnswer label="Integrity question" answer={application.quickFire1} />
              <ScenarioAnswer label="Deadline question" answer={application.quickFire2} />
            </Section>

            {/* Section 6 */}
            <Section title="Video Introduction" icon={Video}>
              {application.videoType === 'link' ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Google Drive Video URL:</span>
                    <span className="text-xs font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded">Google Drive</span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 break-all mb-3">
                    {application.videoUrl}
                  </p>
                  <a
                    href={application.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
                  >
                    Open Google Drive Video <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Video Upload (≤ 30 MB)</span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">30 MB Video</span>
                  </div>
                  {application.videoFilePath ? (
                    <div className="space-y-3">
                      <video
                        controls
                        src={getUploadUrl(application.videoFilePath)}
                        className="w-full max-h-[380px] rounded-xl bg-slate-900 border border-slate-200 shadow-sm"
                        preload="metadata"
                      >
                        Your browser does not support HTML5 video streaming.
                      </video>
                      <a
                        href={getUploadUrl(application.videoFilePath)}
                        download
                        className="btn-secondary text-xs py-2 px-3 inline-flex items-center gap-1.5"
                      >
                        Download Video File
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                      <FileText className="w-5 h-5 text-slate-500" />
                      <p className="text-slate-700 text-sm">Video file recorded by applicant.</p>
                    </div>
                  )}
                </div>
              )}
            </Section>
          </div>

          {/* Right: Review Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              {/* Status */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 mb-4">Update Status</h3>
                <div className="space-y-2">
                  {Object.entries(STATUS_META).map(([key, meta]) => (
                    <button
                      key={key}
                      onClick={() => handleStatusChange(key, meta.label)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        status === key
                          ? `border-brand-violet ${meta.bg} ${meta.color}`
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {meta.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scoring */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-brand-orange" /> Scoring
                </h3>
                <div className="space-y-4">
                  {SCORE_CATEGORIES.map(cat => (
                    <div key={cat.key}>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm text-slate-600">{cat.label}</label>
                        <span className="text-xs text-slate-400">/ {cat.max}</span>
                      </div>
                      <input
                        type="number"
                        min={0}
                        max={cat.max}
                        value={(scores as any)[cat.key]}
                        onChange={e => setScores(prev => ({ ...prev, [cat.key]: Number(e.target.value) }))}
                        className="input-field py-2 text-sm"
                      />
                    </div>
                  ))}
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Total Score</span>
                      <span className={`text-xl font-extrabold ${totalScore >= 70 ? 'text-green-600' : totalScore >= 50 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {totalScore} / 100
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full mt-2">
                      <div
                        className={`h-full rounded-full transition-all ${totalScore >= 70 ? 'bg-green-500' : totalScore >= 50 ? 'bg-amber-500' : 'bg-slate-400'}`}
                        style={{ width: `${totalScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="card p-6">
                <h3 className="font-bold text-slate-900 mb-4">Reviewer Notes</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label text-sm">Review Notes <span className="text-slate-400 font-normal">(shared with admin team)</span></label>
                    <textarea
                      value={reviewerNotes}
                      onChange={e => setReviewerNotes(e.target.value)}
                      className="textarea-field text-sm min-h-[100px]"
                      placeholder="Overall assessment, strengths, concerns..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="label text-sm">Internal Notes <span className="text-slate-400 font-normal">(not shared with applicant)</span></label>
                    <textarea
                      value={internalNotes}
                      onChange={e => setInternalNotes(e.target.value)}
                      className="textarea-field text-sm min-h-[80px]"
                      placeholder="Internal observations..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary w-full justify-center py-3"
              >
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Review</>}
              </button>

              {/* Quick actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange('shortlisted', 'Shortlisted')}
                  className="flex-1 btn-secondary text-sm py-2.5 text-brand-violet border-brand-violet"
                >
                  <Star className="w-4 h-4" /> Shortlist
                </button>
                <button
                  onClick={() => handleStatusChange('not_selected', 'Not Selected')}
                  className="flex-1 btn-ghost text-sm py-2.5 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
              <button
                onClick={() => handleStatusChange('selected', 'Selected')}
                className="btn-orange w-full justify-center py-2.5 text-sm"
              >
                <CheckCircle className="w-4 h-4" /> Mark as Selected
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
