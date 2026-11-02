import { useFormContext } from 'react-hook-form'
import { ApplicationFormData } from '../../pages/ApplyPage'
import { MapPin, AlertCircle } from 'lucide-react'

type CampusQuestionProps = {
  number: number
  label: string
  hint?: string
  example?: string
  fieldName: keyof ApplicationFormData
  rows?: number
}

function CampusQuestion({ number, label, hint, example, fieldName, rows = 4 }: CampusQuestionProps) {
  const { register, watch, formState: { errors } } = useFormContext<ApplicationFormData>()
  const val = watch(fieldName) as string

  return (
    <div className="border border-slate-200 rounded-2xl p-6">
      <label className="label text-base mb-2">
        {number}. {label} <span className="text-red-500">*</span>
      </label>
      {hint && <p className="text-slate-500 text-sm mb-3">{hint}</p>}
      {example && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-blue-700 text-sm"><strong>Example:</strong> {example}</p>
        </div>
      )}
      <textarea
        {...register(fieldName, {
          required: 'This answer is required',
          minLength: { value: 30, message: 'Please provide a more detailed answer (at least 30 characters)' },
          maxLength: { value: 2000, message: 'Maximum 2,000 characters' },
        })}
        className={`textarea-field ${errors[fieldName] ? 'input-error' : ''}`}
        rows={rows}
        placeholder="Be specific about your actual campus..."
      />
      <div className="flex justify-between mt-1">
        {errors[fieldName]
          ? <p className="error-msg text-xs"><span>⚠</span>{(errors[fieldName] as any)?.message}</p>
          : <span />}
        <span className="text-xs text-slate-400">{(val || '').length}/2000</span>
      </div>
    </div>
  )
}

export default function Step4Campus() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-brand-violet" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Campus, Your Turf</h2>
            <p className="text-slate-500 text-sm">Tell us about your actual college campus</p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 mt-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>These questions are about your actual campus.</strong> Be specific. Generic answers 
            may receive lower scores. We are interested in your real observations, not perfect answers.
            <br />
            <em className="font-medium">This section is worth 25 points in the assessment.</em>
          </p>
        </div>
      </div>

      <CampusQuestion
        number={1}
        label="Describe one place on your campus where students regularly wait or queue for five or more minutes. What are they waiting for?"
        example="Students wait outside the canteen during lunch for around 10 minutes. Most are using their phones or talking to friends."
        fieldName="campusWaitingPlace"
        rows={4}
      />

      <CampusQuestion
        number={2}
        label="Name a common area where you could organise an informal gathering of approximately 20–30 students. Why would this location work?"
        hint="Suggest a location that is accessible and permitted for such gatherings. Do not suggest restricted areas."
        fieldName="campusGatheringArea"
        rows={4}
      />

      <CampusQuestion
        number={3}
        label="What is the fastest realistic way to reach 500 students from your campus within 24 hours?"
        hint="Name a specific channel, community, student leader, or communication method. You do not need to share private group links."
        fieldName="campusReach500"
        rows={4}
      />

      <CampusQuestion
        number={4}
        label="Name one upcoming college event, fest, or student tradition during the next three months where SkillRock could naturally introduce a learning activity. Describe what the activity could look like."
        fieldName="campusEvent"
        rows={5}
      />

      <div className="border border-slate-200 rounded-2xl p-6">
        <label className="label text-base mb-2">
          5. What is one inside joke, slang term, or campus tradition that most outsiders would not understand? Explain it briefly.{' '}
          <span className="text-red-500">*</span>
        </label>
        <p className="text-slate-500 text-sm mb-4">
          This helps us understand how well you know your campus culture. 
          There are no wrong answers — we just want something authentic.
        </p>
        <CampusTextArea />
      </div>
    </div>
  )
}

function CampusTextArea() {
  const { register, watch, formState: { errors } } = useFormContext<ApplicationFormData>()
  const val = watch('campusTradition') as string

  return (
    <>
      <textarea
        {...register('campusTradition', {
          required: 'This answer is required',
          minLength: { value: 20, message: 'Please provide at least 20 characters' },
          maxLength: { value: 1000, message: 'Maximum 1,000 characters' },
        })}
        className={`textarea-field ${errors.campusTradition ? 'input-error' : ''}`}
        rows={3}
        placeholder="e.g. 'The Canteen Rush' — every day at 12:45pm, hundreds of students sprint to the canteen the moment the bell rings..."
      />
      <div className="flex justify-between mt-1">
        {errors.campusTradition
          ? <p className="error-msg text-xs"><span>⚠</span>{errors.campusTradition.message}</p>
          : <span />}
        <span className="text-xs text-slate-400">{(val || '').length}/1000</span>
      </div>
    </>
  )
}
