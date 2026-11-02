import { useFormContext } from 'react-hook-form'
import { ApplicationFormData } from '../../pages/ApplyPage'
import { Heart } from 'lucide-react'
import { AVAILABILITY_OPTIONS } from '../../lib/constants'

export default function Step2Motivation() {
  const { register, watch, formState: { errors } } = useFormContext<ApplicationFormData>()
  const priorExp = watch('priorExperience')

  return (
    <div className="card p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-brand-violet" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Motivation & Commitment</h2>
            <p className="text-slate-500 text-sm">Tell us about your passion and what drives you</p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Q1 */}
        <div>
          <label className="label text-base">
            1. Why do you want to become a SkillRock Student Ambassador?{' '}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-slate-500 text-sm mb-2">Share your genuine motivation. Be specific.</p>
          <textarea
            {...register('whyAmbassador', {
              required: 'This answer is required',
              minLength: { value: 100, message: 'Please write at least 100 characters' },
              maxLength: { value: 3000, message: 'Maximum 3,000 characters' },
            })}
            className={`textarea-field ${errors.whyAmbassador ? 'input-error' : ''}`}
            placeholder="Explain what drew you to this program and why you believe you would be a good fit..."
            rows={5}
          />
          <div className="flex justify-between mt-1">
            {errors.whyAmbassador
              ? <p className="error-msg"><span>⚠</span>{errors.whyAmbassador.message}</p>
              : <span />}
            <span className="text-xs text-slate-400">{(watch('whyAmbassador') || '').length}/3000</span>
          </div>
        </div>

        {/* Q2 */}
        <div>
          <label className="label text-base">
            2. What do you think SkillRock can offer students that they may not currently be getting from their usual learning methods?{' '}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('skillrockValue', {
              required: 'This answer is required',
              minLength: { value: 80, message: 'Please write at least 80 characters' },
              maxLength: { value: 3000, message: 'Maximum 3,000 characters' },
            })}
            className={`textarea-field ${errors.skillrockValue ? 'input-error' : ''}`}
            placeholder="Think about the unique value proposition of skill-based learning and peer-to-peer skill exchange..."
            rows={4}
          />
          {errors.skillrockValue && <p className="error-msg mt-1"><span>⚠</span>{errors.skillrockValue.message}</p>}
        </div>

        {/* Q3 */}
        <div>
          <label className="label text-base">
            3. How much time can you realistically contribute each week?{' '}
            <span className="text-red-500">*</span>
          </label>
          <p className="text-slate-500 text-sm mb-3">Be honest. This answer does not automatically affect selection.</p>
          <div className="space-y-2">
            {AVAILABILITY_OPTIONS.map(option => (
              <label key={option} className="radio-option">
                <input
                  {...register('timeContribution', { required: 'Please select an option' })}
                  type="radio"
                  value={option}
                  className="mt-0.5 accent-brand-violet"
                />
                <span className="text-slate-700 font-medium">{option}</span>
              </label>
            ))}
          </div>
          {errors.timeContribution && <p className="error-msg mt-2"><span>⚠</span>{errors.timeContribution.message}</p>}
        </div>

        {/* Q4 */}
        <div>
          <label className="label text-base">
            4. Have you previously organised an event, managed a community, created content, or led a team?{' '}
            <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2 mb-4">
            {['Yes', 'No', 'I have participated but not led'].map(option => (
              <label key={option} className="radio-option">
                <input
                  {...register('priorExperience', { required: 'Please select an option' })}
                  type="radio"
                  value={option}
                  className="mt-0.5 accent-brand-violet"
                />
                <span className="text-slate-700 font-medium">{option}</span>
              </label>
            ))}
          </div>
          {errors.priorExperience && <p className="error-msg"><span>⚠</span>{errors.priorExperience.message}</p>}

          {priorExp && priorExp !== 'No' && (
            <div className="mt-4">
              <label className="label">If yes or partially, briefly describe your experience</label>
              <textarea
                {...register('priorExperienceDescription', { maxLength: { value: 2000, message: 'Max 2,000 characters' } })}
                className="textarea-field"
                placeholder="Briefly describe what you organised, led, or participated in..."
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Q5 */}
        <div>
          <label className="label text-base">
            5. What would you personally like to achieve by the end of the four-month program?{' '}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('personalGoal', {
              required: 'This answer is required',
              minLength: { value: 50, message: 'Please write at least 50 characters' },
              maxLength: { value: 2000, message: 'Maximum 2,000 characters' },
            })}
            className={`textarea-field ${errors.personalGoal ? 'input-error' : ''}`}
            placeholder="Think about what skills, experiences, or personal growth you hope to gain..."
            rows={4}
          />
          {errors.personalGoal && <p className="error-msg mt-1"><span>⚠</span>{errors.personalGoal.message}</p>}
        </div>
      </div>
    </div>
  )
}


