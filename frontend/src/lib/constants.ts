export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

export const STUDY_YEARS = [
  '1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year',
  'Postgraduate 1st Year', 'Postgraduate 2nd Year', 'PhD',
]

export const LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi',
  'Bengali', 'Gujarati', 'Punjabi', 'Odia', 'Assamese', 'Urdu',
]

export const AVAILABILITY_OPTIONS = [
  'Less than 1 hour',
  '1–2 hours',
  '3–5 hours',
  '5–8 hours',
  'More than 8 hours',
]

export const STATUS_META: Record<string, { label: string; color: string; bg: string; description: string }> = {
  submitted: {
    label: 'Application Submitted',
    color: 'text-slate-700',
    bg: 'bg-slate-100',
    description: 'Your application has been received successfully.',
  },
  under_review: {
    label: 'Under Review',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    description: 'Our team is currently reviewing your application.',
  },
  shortlisted: {
    label: 'Shortlisted',
    color: 'text-violet-700',
    bg: 'bg-violet-50',
    description: 'Congratulations! You have been shortlisted for the next stage.',
  },
  interview: {
    label: 'Interview Stage',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    description: 'You have been invited to the interview stage. Check your email for details.',
  },
  selected: {
    label: 'Selected',
    color: 'text-green-700',
    bg: 'bg-green-50',
    description: 'Congratulations! You have been selected as a SkillRock Student Ambassador.',
  },
  not_selected: {
    label: 'Not Selected',
    color: 'text-red-700',
    bg: 'bg-red-50',
    description: 'Thank you for applying. Unfortunately, your application was not selected for this cohort.',
  },
}

export const SCORE_CATEGORIES = [
  { key: 'motivationScore', label: 'Motivation & Commitment', max: 20 },
  { key: 'situationalScore', label: 'Situational Judgment', max: 30 },
  { key: 'campusScore', label: 'Campus Knowledge', max: 25 },
  { key: 'quickFireScore', label: 'Quick-Fire', max: 5 },
  { key: 'videoScore', label: 'Video Communication', max: 20 },
]
