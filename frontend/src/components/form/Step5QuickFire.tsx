import { useFormContext } from 'react-hook-form'
import { ApplicationFormData } from '../../pages/ApplyPage'
import { Zap } from 'lucide-react'

type QFQuestionProps = {
  number: number
  question: string
  fieldName: keyof ApplicationFormData
  options: { value: string; label: string }[]
}

function QuickFireQ({ number, question, fieldName, options }: QFQuestionProps) {
  const { register, watch, formState: { errors } } = useFormContext<ApplicationFormData>()

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-6 py-4 border-b border-slate-200">
        <span className="text-xs font-bold text-brand-violet uppercase tracking-wider">Quick Question {number}</span>
        <p className="font-bold text-slate-900 mt-1 text-lg">{question}</p>
      </div>
      <div className="p-6">
        <div className="space-y-2">
          {options.map(opt => (
            <label
              key={opt.value}
              className={`radio-option ${watch(fieldName) === opt.value ? 'selected' : ''}`}
            >
              <input
                {...register(fieldName, { required: 'Please select an option' })}
                type="radio"
                value={opt.value}
                className="mt-0.5 accent-brand-violet flex-shrink-0"
              />
              <div>
                <span className="font-semibold text-brand-violet mr-2">{opt.value}.</span>
                <span className="text-slate-700">{opt.label}</span>
              </div>
            </label>
          ))}
        </div>
        {errors[fieldName] && (
          <p className="error-msg mt-2"><span>⚠</span>Please select an option</p>
        )}
      </div>
    </div>
  )
}

export default function Step5QuickFire() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Quick-Fire Questions</h2>
            <p className="text-slate-500 text-sm">Fast questions. Don't overthink them.</p>
          </div>
        </div>
        <p className="text-slate-600 text-sm">
          These two questions test your instinctive judgment on common real-world situations. 
          Answer honestly — there is no benefit to choosing what seems "safe" over what you would actually do.
        </p>
      </div>

      <QuickFireQ
        number={1}
        question="A company approaches you to promote a product on your social media account. You have never used it. What would you most likely do?"
        fieldName="quickFire1"
        options={[
          { value: 'A', label: 'Accept immediately because it is an opportunity.' },
          { value: 'B', label: 'Try the product first and only promote it if you can honestly recommend it.' },
          { value: 'C', label: 'Negotiate compensation before deciding.' },
          { value: 'D', label: 'Decline because you only promote products you already use.' },
        ]}
      />

      <QuickFireQ
        number={2}
        question="You are running behind on an important ambassador task. The deadline is tomorrow. What would you most likely do?"
        fieldName="quickFire2"
        options={[
          { value: 'A', label: 'Work through the night and submit whatever is completed.' },
          { value: 'B', label: 'Inform the program manager early, explain the situation, and propose a realistic completion plan.' },
          { value: 'C', label: 'Submit incomplete work without explaining the situation.' },
          { value: 'D', label: 'Ask someone else to complete the task for you.' },
        ]}
      />
    </div>
  )
}
