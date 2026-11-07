import { useFormContext } from 'react-hook-form'
import { ApplicationFormData } from '../../pages/ApplyPage'
import { Sparkles } from 'lucide-react'

export default function Step2Motivation() {
  const { register, watch, formState: { errors } } = useFormContext<ApplicationFormData>()
  const whyText = watch('whyAmbassador') || ''
  const goalText = watch('personalGoal') || ''

  return (
    <div className="card p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Leadership & Campus Vision</h2>
            <p className="text-slate-500 text-sm">Two core questions on how you want to build and lead your campus peer community</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Question 1: Leadership Motivation */}
        <div>
          <label className="label text-base font-bold text-slate-900">
            1. Why do you want to become a SkillRock Student Ambassador?{' '}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-slate-500 text-sm mb-3">
            What motivates you to lead, help fellow students learn practical skills, and bring a curious peer group together on your campus?
          </p>
          <textarea
            {...register('whyAmbassador', {
              required: 'Please share your motivation for becoming an ambassador',
              minLength: { value: 30, message: 'Please write at least 30 characters' },
              maxLength: { value: 2000, message: 'Maximum 2,000 characters' },
            })}
            className={`textarea-field ${errors.whyAmbassador ? 'input-error' : ''}`}
            placeholder="Share what excites you about this role, your passion for technology/skills, and why you want to represent SkillRock..."
            rows={4}
          />
          <div className="flex justify-between mt-1.5 text-xs">
            {errors.whyAmbassador ? (
              <p className="error-msg"><span>⚠</span>{errors.whyAmbassador.message}</p>
            ) : (
              <span className="text-slate-400">Keep it clear, authentic, and concise</span>
            )}
            <span className={whyText.length < 30 ? 'text-amber-600 font-medium' : 'text-slate-400'}>
              {whyText.length}/2000
            </span>
          </div>
        </div>

        {/* Question 2: Practical Workshop / Initiative Plan */}
        <div>
          <label className="label text-base font-bold text-slate-900">
            2. What technical workshop, study jam, or peer activity would you organize on campus?{' '}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-slate-500 text-sm mb-3">
            Describe one practical event or study circle idea you want to lead for students in your college (e.g. AI tools workshop, coding jam, open source sprint, or career prep circle).
          </p>
          <textarea
            {...register('personalGoal', {
              required: 'Please share an event or workshop idea',
              minLength: { value: 30, message: 'Please write at least 30 characters' },
              maxLength: { value: 2000, message: 'Maximum 2,000 characters' },
            })}
            className={`textarea-field ${errors.personalGoal ? 'input-error' : ''}`}
            placeholder="e.g. I want to host a hands-on 2-hour study jam on building AI apps with Gemini API, followed by a campus mini-hackathon..."
            rows={4}
          />
          <div className="flex justify-between mt-1.5 text-xs">
            {errors.personalGoal ? (
              <p className="error-msg"><span>⚠</span>{errors.personalGoal.message}</p>
            ) : (
              <span className="text-slate-400">Describe what topic, audience, and format you have in mind</span>
            )}
            <span className={goalText.length < 30 ? 'text-amber-600 font-medium' : 'text-slate-400'}>
              {goalText.length}/2000
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
