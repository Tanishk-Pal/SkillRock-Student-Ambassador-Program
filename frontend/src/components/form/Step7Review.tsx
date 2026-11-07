import { useFormContext } from 'react-hook-form'
import { ApplicationFormData } from '../../pages/ApplyPage'
import { ClipboardCheck, Loader2, CheckCircle, AlertCircle, Video } from 'lucide-react'

const DECLARATION_ITEMS = [
  'The answers in this application reflect my own honest thinking.',
  'I understand that the SkillRock Student Ambassador Program is a 4-month campus leadership initiative.',
  'I understand that this program is voluntary, 100% free, and focused on peer learning and tech skills.',
  'I will respect my college campus guidelines and support fellow students with integrity.',
  'I understand that selected applicants will receive onboarding instructions by email/WhatsApp.',
]

type Step7ReviewProps = {
  onSubmit: () => void
  isSubmitting: boolean
  uploadPercent?: number | null
}

export default function Step7Review({ onSubmit, isSubmitting, uploadPercent }: Step7ReviewProps) {
  const { watch, register, formState: { errors } } = useFormContext<ApplicationFormData>()
  const data = watch()

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border border-slate-200 rounded-2xl overflow-hidden mb-5">
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
        <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
      </div>
      <div className="p-6 space-y-3">{children}</div>
    </div>
  )

  const Field = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex flex-col sm:flex-row sm:gap-4">
      <span className="text-slate-500 text-sm min-w-[180px]">{label}</span>
      <span className="text-slate-900 text-sm font-medium">{value || '—'}</span>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Review & Submit</h2>
            <p className="text-slate-500 text-sm">Please verify your details before submitting your application</p>
          </div>
        </div>
        <p className="text-slate-600 text-sm">
          Review your answers below. You can navigate back to previous steps to edit anything if needed.
        </p>
      </div>

      {/* Step 1 Review: Personal Info */}
      <Section title="1. Personal & Academic Details">
        <Field label="Full Name" value={data.fullName} />
        <Field label="Email Address" value={data.email} />
        <Field label="WhatsApp / Phone" value={data.phone} />
        <Field label="College / Institute" value={data.college} />
        <Field label="Degree & Branch" value={`${data.degree || ''} — ${data.branch || ''}`} />
        <Field label="Year of Study" value={data.year} />
        <Field label="City, State" value={`${data.city || ''}, ${data.state || ''}`} />
        {data.linkedinUrl && <Field label="LinkedIn" value={data.linkedinUrl} />}
        {data.instagramUrl && <Field label="Instagram" value={data.instagramUrl} />}
      </Section>

      {/* Step 2 Review: Leadership & Vision */}
      <Section title="2. Leadership & Campus Vision">
        <div>
          <p className="text-slate-500 text-xs mb-1 font-semibold">Why you want to be a SkillRock Ambassador</p>
          <p className="text-slate-800 text-sm leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
            {data.whyAmbassador || '—'}
          </p>
        </div>
        <div className="pt-2">
          <p className="text-slate-500 text-xs mb-1 font-semibold">Campus Workshop / Study Jam Idea</p>
          <p className="text-slate-800 text-sm leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
            {data.personalGoal || '—'}
          </p>
        </div>
      </Section>

      {/* Step 3 Review: Video Intro */}
      <Section title="3. Video Introduction">
        <div className="flex items-center gap-3">
          <Video className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-slate-900 text-sm font-medium">
              {data.videoType === 'link' ? 'Google Drive Link Submission' : 'Direct Video Upload Submission'}
            </p>
            <p className="text-slate-500 text-xs break-all mt-0.5 font-mono">
              {data.videoType === 'link' ? (data.videoUrl || 'Link not provided') : (data.videoFile ? data.videoFile.name : 'Video file attached')}
            </p>
          </div>
        </div>
      </Section>

      {/* Declaration */}
      <div className="card p-6 border-2 border-blue-200 bg-blue-50/30">
        <h3 className="font-bold text-slate-900 mb-4 text-base">Program Declaration & Code of Conduct</h3>
        <ul className="space-y-2.5 mb-5">
          {DECLARATION_ITEMS.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <label className="flex items-start gap-3 cursor-pointer group pt-2 border-t border-blue-100">
          <input
            {...register('declarationAccepted', { required: 'You must accept the declaration to submit' })}
            type="checkbox"
            className="mt-1 w-5 h-5 rounded accent-blue-600 flex-shrink-0 cursor-pointer"
          />
          <span className="text-slate-900 font-semibold text-sm leading-relaxed">
            I confirm that all the above statements are true and I understand and accept the conditions of this application.
          </span>
        </label>
        {errors.declarationAccepted && (
          <p className="error-msg mt-2"><span>⚠</span>{errors.declarationAccepted.message}</p>
        )}
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
        <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          By submitting, you agree to our{' '}
          <a href="/privacy" target="_blank" className="text-blue-600 underline">Privacy Policy</a>{' '}
          and{' '}
          <a href="/terms" target="_blank" className="text-blue-600 underline">Program Terms</a>.
          Your application data is kept confidential.
        </p>
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="btn-primary w-full py-4 text-base justify-center shadow-lg hover:shadow-xl transition-all bg-blue-600 hover:bg-blue-700"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {uploadPercent !== null && uploadPercent !== undefined && uploadPercent < 100
              ? `Uploading Video (${uploadPercent}%)...`
              : 'Submitting Application...'}
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            Submit Ambassador Application
          </>
        )}
      </button>

      {isSubmitting && (
        <p className="text-center text-xs text-slate-500 animate-pulse">
          Please keep this tab open while your application is securely transmitted...
        </p>
      )}
    </div>
  )
}
