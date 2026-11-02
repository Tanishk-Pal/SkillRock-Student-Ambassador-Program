import { useFormContext } from 'react-hook-form'
import { ApplicationFormData } from '../../pages/ApplyPage'
import { INDIAN_STATES, STUDY_YEARS, LANGUAGES, AVAILABILITY_OPTIONS } from '../../lib/constants'
import { User, Mail, Phone, GraduationCap, MapPin, Link2 } from 'lucide-react'

export default function Step1Personal() {
  const { register, formState: { errors } } = useFormContext<ApplicationFormData>()

  return (
    <div className="card p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-brand-violet" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
            <p className="text-slate-500 text-sm">Tell us about yourself</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="label">Full Name <span className="text-red-500">*</span></label>
          <input
            {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })}
            className={`input-field ${errors.fullName ? 'input-error' : ''}`}
            placeholder="e.g. Priya Sharma"
          />
          {errors.fullName && <p className="error-msg"><span>⚠</span>{errors.fullName.message}</p>}
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Email Address <span className="text-red-500">*</span></label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
              })}
              type="email"
              className={`input-field ${errors.email ? 'input-error' : ''}`}
              placeholder="you@college.edu"
            />
            {errors.email && <p className="error-msg"><span>⚠</span>{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Phone Number <span className="text-red-500">*</span></label>
            <input
              {...register('phone', {
                required: 'Phone is required',
                pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
              })}
              type="tel"
              className={`input-field ${errors.phone ? 'input-error' : ''}`}
              placeholder="9876543210"
              maxLength={10}
            />
            {errors.phone && <p className="error-msg"><span>⚠</span>{errors.phone.message}</p>}
          </div>
        </div>

        {/* College + University */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">College Name <span className="text-red-500">*</span></label>
            <input
              {...register('college', { required: 'College name is required' })}
              className={`input-field ${errors.college ? 'input-error' : ''}`}
              placeholder="e.g. St. Xavier's College"
            />
            {errors.college && <p className="error-msg"><span>⚠</span>{errors.college.message}</p>}
          </div>
          <div>
            <label className="label">University / Affiliation <span className="text-red-500">*</span></label>
            <input
              {...register('university', { required: 'University is required' })}
              className={`input-field ${errors.university ? 'input-error' : ''}`}
              placeholder="e.g. University of Mumbai"
            />
            {errors.university && <p className="error-msg"><span>⚠</span>{errors.university.message}</p>}
          </div>
        </div>

        {/* Degree + Branch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Degree / Course <span className="text-red-500">*</span></label>
            <input
              {...register('degree', { required: 'Degree is required' })}
              className={`input-field ${errors.degree ? 'input-error' : ''}`}
              placeholder="e.g. B.Tech, BCA, MBA"
            />
            {errors.degree && <p className="error-msg"><span>⚠</span>{errors.degree.message}</p>}
          </div>
          <div>
            <label className="label">Branch / Department <span className="text-red-500">*</span></label>
            <input
              {...register('branch', { required: 'Branch is required' })}
              className={`input-field ${errors.branch ? 'input-error' : ''}`}
              placeholder="e.g. Computer Science, Marketing"
            />
            {errors.branch && <p className="error-msg"><span>⚠</span>{errors.branch.message}</p>}
          </div>
        </div>

        {/* Year of Study */}
        <div>
          <label className="label">Current Year of Study <span className="text-red-500">*</span></label>
          <select {...register('year', { required: 'Year is required' })} className={`input-field ${errors.year ? 'input-error' : ''}`}>
            <option value="">Select year</option>
            {STUDY_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {errors.year && <p className="error-msg"><span>⚠</span>{errors.year.message}</p>}
        </div>

        {/* City + State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">City <span className="text-red-500">*</span></label>
            <input
              {...register('city', { required: 'City is required' })}
              className={`input-field ${errors.city ? 'input-error' : ''}`}
              placeholder="e.g. Mumbai"
            />
            {errors.city && <p className="error-msg"><span>⚠</span>{errors.city.message}</p>}
          </div>
          <div>
            <label className="label">State <span className="text-red-500">*</span></label>
            <select {...register('state', { required: 'State is required' })} className={`input-field ${errors.state ? 'input-error' : ''}`}>
              <option value="">Select state</option>
              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p className="error-msg"><span>⚠</span>{errors.state.message}</p>}
          </div>
        </div>

        {/* Social links (optional) */}
        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Link2 className="w-4 h-4" /> Social Profiles <span className="text-slate-400 font-normal text-sm">(Optional)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label text-slate-600">LinkedIn URL</label>
              <input
                {...register('linkedinUrl', {
                  pattern: { value: /^https?:\/\/(www\.)?linkedin\.com\/.+/, message: 'Enter a valid LinkedIn URL' },
                })}
                className={`input-field ${errors.linkedinUrl ? 'input-error' : ''}`}
                placeholder="https://linkedin.com/in/yourname"
              />
              {errors.linkedinUrl && <p className="error-msg"><span>⚠</span>{errors.linkedinUrl.message}</p>}
            </div>
            <div>
              <label className="label text-slate-600">Instagram URL</label>
              <input
                {...register('instagramUrl', {
                  pattern: { value: /^https?:\/\/(www\.)?instagram\.com\/.+/, message: 'Enter a valid Instagram URL' },
                })}
                className={`input-field ${errors.instagramUrl ? 'input-error' : ''}`}
                placeholder="https://instagram.com/yourhandle"
              />
              {errors.instagramUrl && <p className="error-msg"><span>⚠</span>{errors.instagramUrl.message}</p>}
            </div>
          </div>
        </div>

        {/* Language + Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">Preferred Communication Language <span className="text-red-500">*</span></label>
            <select {...register('preferredLanguage', { required: 'Language is required' })} className="input-field">
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Weekly Availability <span className="text-red-500">*</span></label>
            <select {...register('weeklyAvailability', { required: 'Availability is required' })} className={`input-field ${errors.weeklyAvailability ? 'input-error' : ''}`}>
              <option value="">Select hours</option>
              {AVAILABILITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {errors.weeklyAvailability && <p className="error-msg"><span>⚠</span>{errors.weeklyAvailability.message}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
