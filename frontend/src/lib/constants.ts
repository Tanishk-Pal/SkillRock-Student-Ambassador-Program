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

export const BADGE_TIERS = [
  {
    tier: 'The Explorer',
    minPoints: 200,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badgeColor: 'from-amber-400 to-amber-600',
    digitalReward: 'Verified Digital Badge',
    perks: 'SkillRock Community Leader Sessions & Study Circles',
    description: 'Awarded for active onboarding, organizing first study sessions, and peer engagement.',
  },
  {
    tier: 'The Trailblazer',
    minPoints: 600,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badgeColor: 'from-blue-500 to-indigo-600',
    digitalReward: 'Verified Digital Badge',
    perks: 'Priority Spotlight on Leaderboard & Community Lead Recognition',
    description: 'Awarded for consistent workshop delivery and sustained student peer mentoring.',
  },
  {
    tier: 'The Changemaker',
    minPoints: 1200,
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    badgeColor: 'from-purple-500 to-violet-600',
    digitalReward: 'Verified Digital Badge',
    perks: 'Senior Peer Mentor Role & Official Letter of Appreciation',
    description: 'Awarded for driving inter-college tech collaboration and high-impact campus events.',
  },
  {
    tier: 'SkillRock Champ',
    minPoints: 2000,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badgeColor: 'from-emerald-400 to-teal-600',
    digitalReward: 'Elite Hall of Fame Badge',
    perks: 'SkillRock Hall of Fame Induction & Direct Founder Commendation',
    description: 'The premier student honor for top-ranked community builders across India.',
  },
]
