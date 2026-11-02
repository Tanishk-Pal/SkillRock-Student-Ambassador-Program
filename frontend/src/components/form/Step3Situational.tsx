import { useFormContext } from 'react-hook-form'
import { ApplicationFormData } from '../../pages/ApplyPage'
import { Brain } from 'lucide-react'

type ScenarioProps = {
  number: number
  title: string
  description: string
  options: { value: string; label: string }[]
  fieldName: keyof ApplicationFormData
  reasoningField?: keyof ApplicationFormData
  reasoningPrompt?: string
}

function ScenarioQuestion({ number, title, description, options, fieldName, reasoningField, reasoningPrompt }: ScenarioProps) {
  const { register, watch, formState: { errors } } = useFormContext<ApplicationFormData>()

  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <span className="text-xs font-bold text-brand-violet uppercase tracking-wider">Scenario {number}</span>
        <h3 className="font-bold text-slate-900 mt-1">{title}</h3>
      </div>
      <div className="p-6">
        <p className="text-slate-600 leading-relaxed mb-5 bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm italic">
          "{description}"
        </p>
        <p className="font-semibold text-slate-800 mb-3">What would you <em>most likely</em> do?</p>
        <div className="space-y-2">
          {options.map(opt => (
            <label key={opt.value} className={`radio-option ${watch(fieldName) === opt.value ? 'selected' : ''}`}>
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

        {reasoningField && (
          <div className="mt-4">
            <label className="label text-slate-600 text-sm">{reasoningPrompt || 'Optional: Why did you choose this approach?'}</label>
            <textarea
              {...register(reasoningField, { maxLength: { value: 1000, message: 'Max 1,000 characters' } })}
              className="textarea-field min-h-[80px] text-sm"
              placeholder="Share your reasoning (optional but appreciated)..."
              rows={2}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function Step3Situational() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-brand-violet" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">How You'd Handle It</h2>
            <p className="text-slate-500 text-sm">Situational judgment questions — there are no trick answers</p>
          </div>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          These scenarios are based on realistic campus challenges. We're evaluating your judgment, 
          initiative, and integrity — not looking for a "perfect" answer. Choose what you would 
          most genuinely do.
        </p>
      </div>

      <ScenarioQuestion
        number={1}
        title="Low Registration"
        description="You have been asked to get 30 students from your college to explore SkillRock. After three days, only 4 students have registered."
        fieldName="scenario1Answer"
        reasoningField="scenario1Reasoning"
        reasoningPrompt="Why did you choose this approach?"
        options={[
          { value: 'A', label: 'Share the registration link in every college WhatsApp group.' },
          { value: 'B', label: 'Personally approach students, understand their interests, and explain how SkillRock could help them.' },
          { value: 'C', label: 'Create an Instagram Reel demonstrating SkillRock\'s courses and learning features.' },
          { value: 'D', label: 'Approach class representatives and student communities to help spread awareness.' },
        ]}
      />

      <ScenarioQuestion
        number={2}
        title="Campus Restrictions"
        description="Your college administration does not allow external promotional posters or branding on campus. You still want students to discover SkillRock."
        fieldName="scenario2Answer"
        options={[
          { value: 'A', label: 'Respect the rules and focus on permitted digital promotion.' },
          { value: 'B', label: 'Ask the administration for permission by presenting SkillRock as an educational student initiative.' },
          { value: 'C', label: 'Collaborate with existing student clubs that are permitted to conduct educational activities.' },
          { value: 'D', label: 'Explore another approved campus activity that introduces students to learning and skill development.' },
        ]}
      />

      <ScenarioQuestion
        number={3}
        title="Low Event Attendance"
        description="You organise a SkillRock workshop. 40 students register, but only 10 attend."
        fieldName="scenario3Answer"
        options={[
          { value: 'A', label: 'Conduct the workshop properly for the 10 students who attended.' },
          { value: 'B', label: 'Contact absent students and ask what prevented them from attending.' },
          { value: 'C', label: 'Change the format into a more interactive session to engage the students present.' },
          { value: 'D', label: 'Use the feedback to improve promotion and attendance for the next workshop.' },
        ]}
      />

      <ScenarioQuestion
        number={4}
        title="Students Don't Understand SkillRock"
        description="You are explaining SkillRock to first-year students, but most of them do not understand what a skill exchange platform is."
        fieldName="scenario4Answer"
        options={[
          { value: 'A', label: 'Explain all the platform features in detail.' },
          { value: 'B', label: 'Demonstrate a simple example: one student teaches Python while another teaches graphic design.' },
          { value: 'C', label: 'Share the website link and let students explore independently.' },
          { value: 'D', label: 'Organise a small interactive demonstration where students identify skills they can teach and learn.' },
        ]}
      />

      <ScenarioQuestion
        number={5}
        title="Collaboration Without Budget"
        description="You want to collaborate with a popular student creator who has 8,000 Instagram followers. SkillRock has no budget to pay them."
        fieldName="scenario5Answer"
        options={[
          { value: 'A', label: 'Promise them a guaranteed cash reward in the future.' },
          { value: 'B', label: 'Explain how SkillRock could provide useful content for their audience and brainstorm a genuine collaboration.' },
          { value: 'C', label: 'Ask them to promote SkillRock because it is a student initiative.' },
          { value: 'D', label: 'Offer to collaborate on content that benefits both their audience and SkillRock.' },
        ]}
      />

      <ScenarioQuestion
        number={6}
        title="Public Criticism"
        description="Someone writes in a college WhatsApp group: 'SkillRock is just another website. What\'s so special about it?'"
        fieldName="scenario6Answer"
        options={[
          { value: 'A', label: 'Ignore the message.' },
          { value: 'B', label: 'Respond professionally, explain a real SkillRock feature, and invite them to try it.' },
          { value: 'C', label: 'Argue that SkillRock is better than other learning platforms.' },
          { value: 'D', label: 'Ask what features they would find useful and use their feedback to improve the platform.' },
        ]}
      />
    </div>
  )
}
