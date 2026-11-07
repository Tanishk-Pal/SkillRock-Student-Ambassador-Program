import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ChevronLeft, ChevronRight, Check, Loader2, AlertCircle } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Step1Personal from '../components/form/Step1Personal'
import Step2Motivation from '../components/form/Step2Motivation'
import Step6Video from '../components/form/Step6Video'
import Step7Review from '../components/form/Step7Review'
import api from '../lib/api'

const STEPS = [
  { id: 1, title: 'Personal & College', short: 'Personal' },
  { id: 2, title: 'Leadership & Vision', short: 'Vision' },
  { id: 3, title: 'Video Intro', short: 'Video' },
  { id: 4, title: 'Review & Submit', short: 'Review' },
]

const DRAFT_KEY = 'ssap_draft_application'

export type ApplicationFormData = {
  fullName: string
  email: string
  phone: string
  college: string
  university?: string
  degree: string
  year: string
  branch: string
  city: string
  state: string
  linkedinUrl?: string
  instagramUrl?: string
  preferredLanguage?: string
  weeklyAvailability?: string

  whyAmbassador: string
  personalGoal: string
  skillrockValue?: string
  timeContribution?: string
  priorExperience?: string
  priorExperienceDescription?: string

  scenario1Answer?: string
  scenario1Reasoning?: string
  scenario2Answer?: string
  scenario3Answer?: string
  scenario4Answer?: string
  scenario5Answer?: string
  scenario6Answer?: string

  campusWaitingPlace?: string
  campusGatheringArea?: string
  campusReach500?: string
  campusEvent?: string
  campusTradition?: string

  quickFire1?: string
  quickFire2?: string

  videoType: 'upload' | 'link'
  videoUrl?: string
  videoFile?: File | null

  declarationAccepted: boolean
}

const defaultValues: ApplicationFormData = {
  fullName: '', email: '', phone: '', college: '', university: '',
  degree: '', year: '', branch: '', city: '', state: '',
  linkedinUrl: '', instagramUrl: '', preferredLanguage: 'English', weeklyAvailability: '3–5 hours',
  whyAmbassador: '', personalGoal: '',
  videoType: 'link', videoUrl: '', videoFile: null,
  declarationAccepted: false,
}

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadPercent, setUploadPercent] = useState<number | null>(null)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const navigate = useNavigate()
  const topRef = useRef<HTMLDivElement>(null)

  const methods = useForm<ApplicationFormData>({
    defaultValues,
    mode: 'onChange',
  })

  // Load draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        const { videoFile, ...rest } = parsed
        methods.reset({ ...defaultValues, ...rest })
        toast('Draft restored. Continue where you left off.', { icon: '📝' })
      }
    } catch {}
  }, [])

  // Auto-save draft (exclude file objects)
  useEffect(() => {
    const subscription = methods.watch((values) => {
      try {
        const { videoFile, ...rest } = values as ApplicationFormData
        localStorage.setItem(DRAFT_KEY, JSON.stringify(rest))
      } catch {}
    })
    return () => subscription.unsubscribe()
  }, [methods])

  const scrollTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const goNext = async () => {
    let fieldsToValidate: (keyof ApplicationFormData)[] = []

    if (currentStep === 1) {
      fieldsToValidate = ['fullName', 'email', 'phone', 'college', 'degree', 'year', 'branch', 'city', 'state']
    } else if (currentStep === 2) {
      fieldsToValidate = ['whyAmbassador', 'personalGoal']
    } else if (currentStep === 3) {
      const vType = methods.getValues('videoType')
      if (vType === 'link') {
        const url = methods.getValues('videoUrl') || ''
        if (!url.trim()) {
          toast.error('Please provide a Google Drive video link.')
          return
        }
        if (/youtube\.com|youtu\.be/i.test(url)) {
          toast.error('YouTube links are not accepted. Please provide a Google Drive link or upload directly.')
          return
        }
        if (!/drive\.google\.com|docs\.google\.com/i.test(url)) {
          toast.error('Please provide a valid Google Drive link (e.g. https://drive.google.com/file/d/...)')
          return
        }
      } else if (vType === 'upload') {
        const file = methods.getValues('videoFile')
        if (!file) {
          toast.error('Please select a video file (strictly up to 30 MB).')
          return
        }
      }
      fieldsToValidate = ['videoType']
    }

    const isValid = await methods.trigger(fieldsToValidate)
    if (!isValid) {
      toast.error('Please complete all required fields before continuing.')
      return
    }

    setDirection('forward')
    setCurrentStep(s => Math.min(s + 1, STEPS.length))
    scrollTop()
  }

  const goPrev = () => {
    setDirection('back')
    setCurrentStep(s => Math.max(s - 1, 1))
    scrollTop()
  }

  const onSubmit = async (data: ApplicationFormData) => {
    if (!data.declarationAccepted) {
      toast.error('Please accept the declaration to submit your application.')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()

      // Append all text fields
      const textFields: (keyof ApplicationFormData)[] = [
        'fullName', 'email', 'phone', 'college', 'university', 'degree', 'year', 'branch',
        'city', 'state', 'linkedinUrl', 'instagramUrl', 'preferredLanguage', 'weeklyAvailability',
        'whyAmbassador', 'personalGoal', 'videoType', 'videoUrl',
      ]

      textFields.forEach(field => {
        const val = data[field]
        if (val !== undefined && val !== null && val !== '') {
          formData.append(field, String(val))
        }
      })

      formData.append('declarationAccepted', String(data.declarationAccepted))

      if (data.videoType === 'upload' && data.videoFile) {
        formData.append('videoFile', data.videoFile)
      }

      setUploadPercent(0)

      const response = await api.post('/applications', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadPercent(percent)
          }
        },
        timeout: 180000,
      })

      // Clear draft on success
      localStorage.removeItem(DRAFT_KEY)
      toast.success(response.data.message || 'Application submitted successfully!')

      navigate('/application-success', {
        state: {
          applicationId: response.data.applicationId,
          statusToken: response.data.statusToken,
          fullName: data.fullName,
          email: data.email,
        },
      })
    } catch (err: any) {
      console.error('Submission error:', err)
      if (err.response?.status === 409) {
        toast.error(err.response.data.error || 'An application with this email already exists.')
        toast('You can check your application status on the status page.', { icon: 'ℹ️' })
        navigate('/application-status')
      } else if (err.response?.data?.errors) {
        const msgs = err.response.data.errors.map((e: any) => e.msg).join(', ')
        toast.error(`Validation error: ${msgs}`)
      } else if (err.response?.data?.error) {
        toast.error(err.response.data.error)
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        toast.error('Submission timed out. Tip: For large videos, use a Google Drive link for instant submission.')
      } else {
        toast.error('Submission failed. Please check your connection and try again.')
      }
    } finally {
      setIsSubmitting(false)
      setUploadPercent(null)
    }
  }

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div ref={topRef} />

      <main className="flex-1 bg-brand-bg pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center py-10">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-brand-violet text-sm font-medium px-4 py-2 rounded-full mb-4">
              Step {currentStep} of {STEPS.length}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">SkillRock Ambassador Application</h1>
            <p className="text-slate-500 mt-2">Complete all sections thoughtfully. Your answers help us understand you better.</p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-3">
              {STEPS.map(step => (
                <button
                  key={step.id}
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  className={`flex flex-col items-center gap-1.5 flex-1 group ${step.id < currentStep ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step.id < currentStep
                      ? 'bg-brand-violet text-white'
                      : step.id === currentStep
                      ? 'bg-brand-violet text-white ring-4 ring-violet-200'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block transition-colors ${
                    step.id === currentStep ? 'text-brand-violet' : step.id < currentStep ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {step.short}
                  </span>
                </button>
              ))}
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-violet to-brand-purple rounded-full progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Form */}
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="animate-slide-up">
                {currentStep === 1 && <Step1Personal />}
                {currentStep === 2 && <Step2Motivation />}
                {currentStep === 3 && <Step6Video />}
                {currentStep === 4 && (
                  <Step7Review
                    onSubmit={methods.handleSubmit(onSubmit, (errs) => {
                      const first = Object.values(errs)[0]?.message || 'Please complete all required fields.'
                      toast.error(String(first))
                    })}
                    isSubmitting={isSubmitting}
                    uploadPercent={uploadPercent}
                  />
                )}
              </div>

              {/* Navigation */}
              {currentStep < 4 && (
                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={currentStep === 1}
                    className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>

                  <div className="text-sm text-slate-400">
                    {currentStep < STEPS.length - 1 && 'Progress auto-saved'}
                  </div>

                  <button
                    type="button"
                    onClick={goNext}
                    className="btn-primary"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </form>
          </FormProvider>

          {/* Privacy note */}
          <div className="mt-8 flex items-start gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              Your information is kept confidential and is only accessible to authorized SSAP reviewers. 
              We do not sell or share applicant data. Read our{' '}
              <a href="/privacy" className="text-brand-violet underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
