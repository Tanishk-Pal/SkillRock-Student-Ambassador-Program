import { useFormContext } from 'react-hook-form'
import { ApplicationFormData } from '../../pages/ApplyPage'
import { ClipboardCheck, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const DECLARATION_ITEMS = [
  'The answers in this application reflect my own honest thinking.',
  'I understand that the SkillRock Student Ambassador Program lasts four months.',
  'I understand that this program is voluntary and free to participate in.',
  'I understand that rewards and referral commissions are subject to official program rules.',
  'I will not make false claims or promise rewards on behalf of SkillRock.',
  'I will respect my campus rules and the privacy of other students.',
  'I understand that submitting this application does not guarantee selection.',
  'I understand that selected applicants will receive further instructions by email.',
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
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5 text-brand-violet" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Review & Submit</h2>
            <p className="text-slate-500 text-sm">Check everything before submitting</p>
          </div>
        </div>
        <p className="text-slate-600 text-sm">
          Review your answers below. You can go back to any step to make changes before submitting.
        </p>
      </div>

      {/* Personal info */}
      <Section title="Section 1 — Personal Information">
        <Field label="Full Name" value={data.fullName} />
        <Field label="Email" value={data.email} />
        <Field label="Phone" value={data.phone} />
        <Field label="College" value={data.college} />
        <Field label="University" value={data.university} />
        <Field label="Degree / Branch" value={`${data.degree} — ${data.branch}`} />
        <Field label="Year of Study" value={data.year} />
        <Field label="City, State" value={`${data.city}, ${data.state}`} />
        <Field label="Availability" value={data.weeklyAvailability} />
        {data.linkedinUrl && <Field label="LinkedIn" value={data.linkedinUrl} />}
        {data.instagramUrl && <Field label="Instagram" value={data.instagramUrl} />}
      </Section>

      {/* Motivation */}
      <Section title="Section 2 — Motivation & Commitment">
        <div>
          <p className="text-slate-500 text-xs mb-1">Why you want to be an ambassador</p>
          <p className="text-slate-800 text-sm leading-relaxed">{data.whyAmbassador || '—'}</p>
        </div>
        <div className="border-t border-slate-100 pt-3">
          <p className="text-slate-500 text-xs mb-1">Personal goal</p>
          <p className="text-slate-800 text-sm leading-relaxed">{data.personalGoal || '—'}</p>
        </div>
        <Field label="Time contribution" value={data.timeContribution} />
        <Field label="Prior experience" value={data.priorExperience} />
      </Section>

      {/* Situational */}
      <Section title="Section 3 — Situational Judgment">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {([
            { label: 'Scenario 1', value: data.scenario1Answer },
            { label: 'Scenario 2', value: data.scenario2Answer },
            { label: 'Scenario 3', value: data.scenario3Answer },
            { label: 'Scenario 4', value: data.scenario4Answer },
            { label: 'Scenario 5', value: data.scenario5Answer },
            { label: 'Scenario 6', value: data.scenario6Answer },
          ]).map(s => (
            <div key={s.label} className="bg-slate-50 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="font-bold text-brand-violet text-lg">{s.value || '—'}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Campus */}
      <Section title="Section 4 — Campus Knowledge">
        <div className="space-y-3">
          {[
            { label: 'Waiting spot', value: data.campusWaitingPlace },
            { label: 'Gathering area', value: data.campusGatheringArea },
            { label: 'Reach 500', value: data.campusReach500 },
            { label: 'Event opportunity', value: data.campusEvent },
            { label: 'Campus tradition', value: data.campusTradition },
          ].map(f => (
            <div key={f.label} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <p className="text-xs text-slate-500 mb-1">{f.label}</p>
              <p className="text-slate-800 text-sm">{f.value || '—'}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Quick-fire */}
      <Section title="Section 5 — Quick-Fire">
        <Field label="Integrity scenario" value={data.quickFire1} />
        <Field label="Deadline scenario" value={data.quickFire2} />
      </Section>

      {/* Video */}
      <Section title="Section 6 — Video Introduction">
        <Field label="Submission type" value={data.videoType === 'upload' ? 'Simple Video File (≤ 30 MB)' : 'Google Drive Video Link'} />
        {data.videoType === 'link' && <Field label="Google Drive Link" value={data.videoUrl} />}
        {data.videoType === 'upload' && (
          <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Video file attached (within 30 MB limit)
          </div>
        )}
      </Section>

      {/* Declaration */}
      <div className="card p-6 border-2 border-brand-violet/20">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-brand-violet" />
          Commitment Declaration
        </h3>
        <ul className="space-y-3 mb-6">
          {DECLARATION_ITEMS.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
              <CheckCircle className="w-4 h-4 text-brand-violet flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>

        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            {...register('declarationAccepted', { required: 'You must accept the declaration to submit' })}
            type="checkbox"
            className="mt-1 w-5 h-5 rounded accent-brand-violet flex-shrink-0 cursor-pointer"
          />
          <span className="text-slate-800 font-semibold text-sm leading-relaxed">
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
          <a href="/privacy" target="_blank" className="text-brand-violet underline">Privacy Policy</a>{' '}
          and{' '}
          <a href="/terms" target="_blank" className="text-brand-violet underline">Program Terms</a>.
          Your information is kept confidential.
        </p>
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="btn-primary w-full py-4 text-base justify-center shadow-lg hover:shadow-xl transition-all"
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
            Submit Application
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
