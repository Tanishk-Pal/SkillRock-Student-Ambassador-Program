import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Zap, LogOut, Loader2, AlertCircle, Save, Star, CheckCircle,
  XCircle, User, MessageSquare, Brain, MapPin, Zap as ZapIcon, Video,
  ExternalLink, FileText, MessageCircle, Mail, Link2, Edit3,
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

function getGoogleDriveEmbedUrl(url?: string): string | null {
  if (!url) return null
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch && fileMatch[1]) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`
  }
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`
  }
  return null
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
  let adminUser: { email?: string; name?: string; role?: string } = {}
  try {
    adminUser = JSON.parse(localStorage.getItem('ssap_admin_user') || '{}')
  } catch {
    adminUser = {}
  }

  const [application, setApplication] = useState<ApplicationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Review state
  const [status, setStatus] = useState('')
  const [scores, setScores] = useState({ motivationScore: 0, situationalScore: 0, campusScore: 0, quickFireScore: 0, videoScore: 0 })
  const [reviewerNotes, setReviewerNotes] = useState('')
  const [internalNotes, setInternalNotes] = useState('')

  // Video state
  const [customVideoUrl, setCustomVideoUrl] = useState('')
  const [isEditingVideo, setIsEditingVideo] = useState(false)
  const [videoLoadError, setVideoLoadError] = useState(false)
  const [savingVideo, setSavingVideo] = useState(false)

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
        setCustomVideoUrl(app.videoUrl || '')
        setVideoLoadError(false)
      } catch {
        setError('Failed to load application.')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchApplication()
  }, [id])

  const totalScore = Object.values(scores).reduce((a, b) => a + Number(b), 0)

  const handleUpdateVideoUrl = async (newUrl: string) => {
    if (!newUrl.trim()) {
      toast.error('Please enter a video URL')
      return
    }
    setSavingVideo(true)
    try {
      await api.patch(`/applications/${id}`, {
        videoUrl: newUrl.trim(),
        videoType: 'link',
      })
      toast.success('Video URL updated successfully!')
      setApplication(prev => prev ? { ...prev, videoUrl: newUrl.trim(), videoType: 'link' } : prev)
      setIsEditingVideo(false)
      setVideoLoadError(false)
    } catch {
      toast.error('Failed to update video URL')
    } finally {
      setSavingVideo(false)
    }
  }

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

            {/* Section 2: Leadership & Campus Vision */}
            <Section title="Leadership & Campus Vision" icon={MessageSquare}>
              <Field label="Why do you want to become a SkillRock Ambassador?" value={application.whyAmbassador} />
              <Field label="Planned Workshop / Study Jam / Campus Initiative" value={application.personalGoal} />

              {/* Optional / Legacy Motivation Fields */}
              {(application.skillrockValue || application.priorExperience || application.timeContribution) && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  {application.skillrockValue && <Field label="What SkillRock can offer students" value={application.skillrockValue} />}
                  <div className="grid grid-cols-2 gap-4">
                    {application.timeContribution && <Field label="Time contribution" value={application.timeContribution} />}
                    {application.weeklyAvailability && <Field label="Weekly availability" value={application.weeklyAvailability} />}
                    {application.priorExperience && <Field label="Prior experience" value={application.priorExperience} />}
                  </div>
                  {application.priorExperienceDescription && (
                    <Field label="Experience description" value={application.priorExperienceDescription} />
                  )}
                </div>
              )}
            </Section>

            {/* Legacy Section 3: Situational Judgment */}
            {(application.scenario1Answer || application.scenario2Answer) && (
              <Section title="Situational Judgment (Legacy)" icon={Brain}>
                {application.scenario1Answer && <ScenarioAnswer label="Scenario 1 — Low Registration" answer={application.scenario1Answer} reasoning={application.scenario1Reasoning} />}
                {application.scenario2Answer && <ScenarioAnswer label="Scenario 2 — Campus Restrictions" answer={application.scenario2Answer} />}
                {application.scenario3Answer && <ScenarioAnswer label="Scenario 3 — Low Event Attendance" answer={application.scenario3Answer} />}
                {application.scenario4Answer && <ScenarioAnswer label="Scenario 4 — Students Don't Understand" answer={application.scenario4Answer} />}
                {application.scenario5Answer && <ScenarioAnswer label="Scenario 5 — Collaboration Without Budget" answer={application.scenario5Answer} />}
                {application.scenario6Answer && <ScenarioAnswer label="Scenario 6 — Public Criticism" answer={application.scenario6Answer} />}
              </Section>
            )}

            {/* Legacy Section 4: Campus Knowledge */}
            {(application.campusWaitingPlace || application.campusGatheringArea || application.campusReach500 || application.campusEvent || application.campusTradition) && (
              <Section title="Campus Knowledge (Legacy)" icon={MapPin}>
                {application.campusWaitingPlace && <Field label="Waiting spot" value={application.campusWaitingPlace} />}
                {application.campusGatheringArea && <Field label="Gathering area" value={application.campusGatheringArea} />}
                {application.campusReach500 && <Field label="Reaching 500 students in 24hrs" value={application.campusReach500} />}
                {application.campusEvent && <Field label="Campus event opportunity" value={application.campusEvent} />}
                {application.campusTradition && <Field label="Campus tradition / inside joke" value={application.campusTradition} />}
              </Section>
            )}

            {/* Legacy Section 5: Quick-Fire */}
            {(application.quickFire1 || application.quickFire2) && (
              <Section title="Quick-Fire (Legacy)" icon={ZapIcon}>
                {application.quickFire1 && <ScenarioAnswer label="Integrity question" answer={application.quickFire1} />}
                {application.quickFire2 && <ScenarioAnswer label="Deadline question" answer={application.quickFire2} />}
              </Section>
            )}

            {/* Section 6: Video Introduction */}
            <Section title="Video Introduction" icon={Video}>
              {/* WhatsApp & Email Quick Action Bar */}
              {(() => {
                const cleanPhone = (application.phone || '').replace(/[^0-9]/g, '')
                const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone
                const waText = encodeURIComponent(
                  `Hi ${application.fullName}! This is SkillRock SSAP Review Team regarding your Student Ambassador application (${application.applicationId}). We are reviewing your submission! If your 60-second video introduction link is set to private/restricted or unavailable, please share your Google Drive video link with "Anyone with the link can view" access. Thank you!`
                )
                const mailSubject = encodeURIComponent(
                  `SkillRock Student Ambassador Application: Video Introduction — ${application.applicationId}`
                )
                const mailBody = encodeURIComponent(
                  `Hi ${application.fullName},\n\nWe are currently reviewing your SkillRock Student Ambassador application (${application.applicationId})!\n\nTo complete your video evaluation, please ensure your 60-second video introduction is accessible. If your Google Drive link was private or your video was not accessible, please reply with your updated Google Drive link (make sure General Access is set to "Anyone with the link can view").\n\nBest regards,\nSkillRock SSAP Review Board`
                )

                return (
                  <div className="mb-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-slate-600">
                      <span className="font-bold text-slate-800">Candidate Contact: </span>
                      {application.phone} · {application.email}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`https://wa.me/${waPhone}?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Message on WhatsApp
                      </a>
                      <a
                        href={`mailto:${application.email}?subject=${mailSubject}&body=${mailBody}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Send Email
                      </a>
                    </div>
                  </div>
                )
              })()}

              {/* Case 1: Google Drive link provided */}
              {application.videoUrl && (
                <div className="mb-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-blue-600" />
                      Google Drive Video Link
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingVideo(!isEditingVideo)}
                      className="text-xs text-brand-violet hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Edit3 className="w-3 h-3" />
                      {isEditingVideo ? 'Cancel Edit' : 'Edit Link'}
                    </button>
                  </div>

                  {getGoogleDriveEmbedUrl(application.videoUrl) ? (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner">
                      <iframe
                        src={getGoogleDriveEmbedUrl(application.videoUrl)!}
                        className="w-full h-full border-0"
                        allow="autoplay; fullscreen; encrypted-media"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                        title="Applicant Video Introduction"
                      />
                    </div>
                  ) : null}

                  {/* Prominent Direct View & Access Helper */}
                  <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-blue-950">Direct Google Drive Access</p>
                        <p className="text-[11px] text-blue-700">
                          If preview displays "You need access", open directly to view or request permissions in 1 click:
                        </p>
                      </div>
                      <a
                        href={application.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 shadow-sm shrink-0"
                      >
                        Open in Google Drive <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <p className="text-[11px] text-slate-500 font-mono bg-white p-2 rounded border border-blue-100 break-all select-all">
                      {application.videoUrl}
                    </p>
                  </div>
                </div>
              )}

              {/* Case 2: Uploaded video file */}
              {application.videoFilePath && (
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-emerald-600" />
                      Uploaded Video File
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingVideo(!isEditingVideo)}
                      className="text-xs text-brand-violet hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Edit3 className="w-3 h-3" />
                      {isEditingVideo ? 'Cancel' : 'Replace with Drive Link'}
                    </button>
                  </div>

                  {videoLoadError ? (
                    <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-amber-900">
                            Uploaded Video File Unavailable on Server
                          </h4>
                          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                            On Render's cloud free tier, uploaded files on local container storage expire when the server goes to sleep.
                            Click above to ask the student on WhatsApp or Email for their Google Drive video link, then paste it here.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <video
                        controls
                        crossOrigin="anonymous"
                        src={getUploadUrl(application.videoFilePath)}
                        className="w-full max-h-[380px] rounded-xl bg-slate-900 border border-slate-200 shadow-sm"
                        preload="metadata"
                        onError={() => setVideoLoadError(true)}
                      >
                        Your browser does not support HTML5 video playback.
                      </video>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={getUploadUrl(application.videoFilePath)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary text-xs py-2 px-3 inline-flex items-center gap-1.5"
                        >
                          Open Video in New Tab <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={getUploadUrl(application.videoFilePath)}
                          download
                          className="btn-secondary text-xs py-2 px-3 inline-flex items-center gap-1.5"
                        >
                          Download Video File
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Case 3: No video URL or video file */}
              {!application.videoUrl && !application.videoFilePath && (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-slate-800 text-sm font-semibold">No video introduction attached yet.</p>
                      <p className="text-slate-500 text-xs">You can request the video link from the candidate or attach one below.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Inline Video Link Editor (Always available or toggled) */}
              {(isEditingVideo || (!application.videoUrl && (videoLoadError || !application.videoFilePath))) && (
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-fade-in space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Attach or Update Video URL
                    </label>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      value={customVideoUrl}
                      onChange={(e) => setCustomVideoUrl(e.target.value)}
                      placeholder="Paste Google Drive link (e.g. https://drive.google.com/file/d/...)"
                      className="input-field text-xs font-mono flex-1 py-2"
                    />
                    <button
                      type="button"
                      disabled={savingVideo || !customVideoUrl.trim()}
                      onClick={() => handleUpdateVideoUrl(customVideoUrl)}
                      className="btn-primary text-xs py-2 px-4 whitespace-nowrap inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {savingVideo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Save Video URL
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Supports Google Drive preview links, direct video URLs, and YouTube links.
                  </p>
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
