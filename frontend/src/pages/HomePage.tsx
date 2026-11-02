import { Link } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import {
  ArrowRight, ChevronRight, CheckCircle, Clock, Users, BookOpen,
  Award, Star, TrendingUp, Shield, Zap, Target, MessageSquare,
  Instagram, Megaphone, BarChart2, Globe, ChevronDown, ExternalLink,
  Code2, Laptop, Rocket, Sparkles
} from 'lucide-react'

// ─── Hero Illustration SVG (Original Clean Style) ─────────────────
function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg mx-auto select-none">
      {/* Background glowing rings */}
      <circle cx="260" cy="210" r="180" fill="#5B45F5" fillOpacity="0.08"/>
      <circle cx="260" cy="210" r="130" fill="#5B45F5" fillOpacity="0.08"/>
      
      {/* Main Glass Card */}
      <rect x="110" y="80" width="300" height="200" rx="20" fill="white" stroke="#E2E8F0" strokeWidth="1.5"/>
      
      {/* Header Bar */}
      <rect x="110" y="80" width="300" height="50" rx="20" fill="#5B45F5"/>
      <rect x="110" y="105" width="300" height="25" fill="#5B45F5"/>
      <text x="140" y="112" fill="white" fontSize="13" fontWeight="700" fontFamily="system-ui">SkillRock Ambassador Chapter</text>
      <circle cx="385" cy="105" r="7" fill="#FF8A00"/>
      <circle cx="366" cy="105" r="7" fill="#8B5CF6" fillOpacity="0.8"/>
      
      {/* Student Leader Cards */}
      <rect x="130" y="148" width="80" height="55" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1"/>
      <circle cx="160" cy="164" r="11" fill="#5B45F5" fillOpacity="0.18"/>
      <circle cx="160" cy="164" r="5" fill="#5B45F5"/>
      <text x="136" y="192" fill="#64748B" fontSize="9" fontWeight="600" fontFamily="system-ui">Chapter Lead</text>

      <rect x="224" y="148" width="80" height="55" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1"/>
      <circle cx="254" cy="164" r="11" fill="#FF8A00" fillOpacity="0.18"/>
      <circle cx="254" cy="164" r="5" fill="#FF8A00"/>
      <text x="230" y="192" fill="#64748B" fontSize="9" fontWeight="600" fontFamily="system-ui">Study Jams</text>

      <rect x="318" y="148" width="80" height="55" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1"/>
      <circle cx="348" cy="164" r="11" fill="#10B981" fillOpacity="0.18"/>
      <circle cx="348" cy="164" r="5" fill="#10B981"/>
      <text x="323" y="192" fill="#64748B" fontSize="9" fontWeight="600" fontFamily="system-ui">Product Liaison</text>

      {/* Progress Bars */}
      <rect x="130" y="220" width="258" height="6" rx="3" fill="#F1F5F9"/>
      <rect x="130" y="220" width="195" height="6" rx="3" fill="#5B45F5"/>
      <text x="130" y="244" fill="#94A3B8" fontSize="10" fontFamily="system-ui">Cohort Milestones</text>
      <text x="352" y="244" fill="#5B45F5" fontSize="10" fontWeight="700" fontFamily="system-ui">75%</text>

      {/* Floating Badges */}
      <rect x="30" y="160" width="125" height="42" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))"/>
      <circle cx="52" cy="181" r="10" fill="#5B45F5" fillOpacity="0.15"/>
      <text x="68" y="185" fill="#0F172A" fontSize="11" fontWeight="700" fontFamily="system-ui">4-Month Program</text>

      <rect x="365" y="250" width="120" height="42" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))"/>
      <circle cx="388" cy="271" r="10" fill="#FF8A00" fillOpacity="0.15"/>
      <text x="404" y="275" fill="#0F172A" fontSize="11" fontWeight="700" fontFamily="system-ui">1,600 pts Max</text>

      <rect x="55" y="300" width="140" height="42" rx="12" fill="white" stroke="#E2E8F0" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))"/>
      <circle cx="78" cy="321" r="10" fill="#10B981" fillOpacity="0.15"/>
      <text x="94" y="325" fill="#0F172A" fontSize="11" fontWeight="700" fontFamily="system-ui">Verified Certificate</text>
      
      {/* Decorative Stars */}
      <text x="380" y="135" fill="#FF8A00" fontSize="18" fontFamily="system-ui">✦</text>
      <text x="85" y="130" fill="#5B45F5" fontSize="14" fontFamily="system-ui">✦</text>
      <text x="440" y="320" fill="#8B5CF6" fontSize="16" fontFamily="system-ui">✦</text>
    </svg>
  )
}

// ─── Corporate Pillars (GSA Inspired) ─────────────────────────────
const overviewItems = [
  {
    icon: Users,
    title: 'Campus Chapter Leadership',
    desc: 'Establish and lead your college\'s official SkillRock Chapter. Organize student onboarding, orientations, and build a lasting technical community.',
    color: 'text-brand-violet',
    bg: 'bg-violet-50'
  },
  {
    icon: Code2,
    title: 'Study Jams & Evangelism',
    desc: 'Lead hands-on peer study jams around SkillRock Learn & Build courses (DSA, Full-Stack, AI). Guide peers in live project deployment.',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    icon: Target,
    title: 'Product Feedback Liaison',
    desc: 'Serve as direct bridge to SkillRock engineering and product teams. Beta-test platform tools (SkillBot AI) and deliver campus UX reports.',
    color: 'text-brand-orange',
    bg: 'bg-orange-50'
  },
  {
    icon: Rocket,
    title: 'Hackathons & Skill Swaps',
    desc: 'Host collegiate build sprints, mini-hackathons, and peer-to-peer skill exchange sessions to help students build verifiable portfolios.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
]

// ─── What Ambassadors Do ──────────────────────────────────────────
const responsibilities = [
  { icon: Users, text: 'Establish and lead an active SkillRock student chapter at your campus' },
  { icon: Code2, text: 'Host bi-weekly "Learn & Build" study jams on DSA, Web Dev, and AI' },
  { icon: Laptop, text: 'Guide students to build practical production projects and deploy them live' },
  { icon: Target, text: 'Beta-test new SkillRock features and deliver student UX feedback to core team' },
  { icon: Rocket, text: 'Organize campus mini-hackathons and peer-to-peer skill swap circles' },
  { icon: Megaphone, text: 'Help campus students discover verified learning certificates and skill tracks' },
]

// ─── Ambassador Benefits (Realistic & Corporate) ───────────────────
const benefits = [
  {
    icon: Award,
    title: 'Verified Digital Leadership Certificate',
    desc: 'Official authenticated credential from SkillRock certifying your 4-month role as Campus Ambassador & Chapter Lead.',
    highlight: true
  },
  {
    icon: Shield,
    title: 'Ambassador ID & Digital Badge',
    desc: 'Verifiable digital ambassador identity and badge for your resume, GitHub, and professional profiles.',
    highlight: false
  },
  {
    icon: Laptop,
    title: 'Direct Product Team Mentorship',
    desc: 'Monthly roundtables with SkillRock senior engineers and product managers for technical and leadership guidance.',
    highlight: false
  },
  {
    icon: Star,
    title: 'Ambassador Dashboard & Scoring',
    desc: 'Live personal dashboard to track monthly sprint tasks, KPI submissions, and your cumulative point score.',
    highlight: false
  },
  {
    icon: TrendingUp,
    title: 'Performance Referral Stipend',
    desc: 'Earn transparent referral commissions on eligible platform offerings through your dedicated campus link.',
    highlight: false
  },
  {
    icon: Zap,
    title: 'Ambassador Swag & Goodies Box',
    desc: 'Exclusive SkillRock branded ambassador merchandise and goodies for high-performing ambassadors.',
    highlight: false
  },
]

// ─── 4-Month Sprint Timeline ──────────────────────────────────────
const timeline = [
  {
    month: 'Month 1',
    title: 'Awareness & Launch',
    subtitle: 'Chapter Charter & Campus Onboarding',
    tasks: [
      'Receive official Welcome Kit & Ambassador Charter',
      'Establish campus study group & communication channel',
      'Host inaugural SkillRock Demo & Orientation Meetup',
      'Onboard initial cohort of 25+ campus students'
    ],
    kpi: '25+ students onboarded',
    color: 'border-brand-violet bg-violet-50/70',
    dot: 'bg-brand-violet',
  },
  {
    month: 'Month 2',
    title: 'Community Building',
    subtitle: 'Technical Study Jams & Skill Sprints',
    tasks: [
      'Host 2 study jams on DSA, Web Dev, or Data Science',
      'Guide 15+ students to build and deploy practical projects',
      'Facilitate peer code reviews & GitHub submissions',
      'Collect initial student feedback on learning tracks'
    ],
    kpi: '15+ live project deployments verified',
    color: 'border-blue-500 bg-blue-50/70',
    dot: 'bg-blue-500',
  },
  {
    month: 'Month 3',
    title: 'Learning & Engagement',
    subtitle: 'Campus Build-a-Thon & Product Feedback',
    tasks: [
      'Host a 1-day campus mini-hackathon or skill-swap sprint',
      'Beta-test new SkillRock features (SkillBot AI, Code Reviewers)',
      'Compile formal Student UX & Feature Request Dossier',
      'Present feedback directly to SkillRock product managers'
    ],
    kpi: 'Official Student Feedback Dossier delivered',
    color: 'border-emerald-500 bg-emerald-50/70',
    dot: 'bg-emerald-500',
  },
  {
    month: 'Month 4',
    title: 'Growth & Leadership',
    subtitle: 'Capstone Impact & Leadership Transition',
    tasks: [
      'Host Cohort Graduation & project showcase ceremony',
      'Compile Chapter Annual Impact Report',
      'Nominate and mentor successor junior ambassadors',
      'Receive Verified Ambassador Certificate of Completion'
    ],
    kpi: 'Comprehensive campus impact report published',
    color: 'border-brand-orange bg-orange-50/70',
    dot: 'bg-brand-orange',
  },
]

// ─── FAQs ─────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'How does SSAP compare to programs like Google Student Ambassador (GSA)?',
    a: 'Like GSA and GDSC programs, SSAP is a structured corporate campus leadership initiative. Rather than trivial promotional posting, ambassadors act as technical liaisons: leading study jams around SkillRock\'s "Learn & Build" courses, assisting peers with project deployments, and providing direct feedback to SkillRock\'s engineering team.'
  },
  {
    q: 'What is the video submission requirement?',
    a: 'Applicants must submit a 45–60 second video introduction in English. You have two options: (A) A public or accessible Google Drive video link (ensure sharing permissions are set to "Anyone with the link can view"), or (B) A direct video file upload strictly up to 30 MB (MP4, WebM, MOV). YouTube links are strictly not accepted.'
  },
  {
    q: 'Is the program free?',
    a: 'Yes, 100% free. Participation is voluntary, and there is no application fee, registration cost, or hidden charge at any stage.'
  },
  {
    q: 'How much time should I realistically contribute each week?',
    a: 'Most ambassadors spend approximately 3–5 hours per week organizing study sessions, engaging with campus peers, and attending program syncs. The schedule is flexible and designed to easily accommodate exams and academic coursework.'
  },
  {
    q: 'Do I need previous ambassador experience to be selected?',
    a: 'No. We welcome first-time applicants. We value genuine enthusiasm, authentic campus familiarity, communication skills, and initiative over prior titles.'
  },
  {
    q: 'What are the tangible outcomes upon program completion?',
    a: 'Ambassadors who fulfill their monthly milestones receive an official Verified Digital Ambassador Certificate, a tamper-proof Ambassador ID, direct mentorship from the SkillRock product team, and eligibility for ambassador swag and performance-based referral rewards.'
  },
  {
    q: 'Are rewards and certificates guaranteed?',
    a: 'The digital leadership certificate is awarded to ambassadors who successfully complete program milestone requirements. Referral commissions apply to eligible platform purchases under program rules. Additional rewards or goodies are distributed based on milestone achievement.'
  },
  {
    q: 'What happens after I submit my application?',
    a: 'Your application and video introduction are reviewed by the SSAP review board. Shortlisted candidates are notified via their registered email address. You can also track your live application status anytime using our status checker.'
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-all shadow-sm">
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ml-4 ${open ? 'rotate-180 text-brand-violet' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
          {a}
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* ─── 1. HERO SECTION (Dark Navy with SkillRock Branding) ─── */}
      <section className="relative bg-[#171923] overflow-hidden pt-28 pb-20">
        {/* Subtle Violet & Orange Ambient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-violet/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-purple/20 rounded-full blur-3xl translate-y-1/3 pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-48 h-48 bg-brand-orange/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Headline & CTA */}
            <div className="text-center lg:text-left animate-slide-up">
              {/* Badge Pill */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse-soft" />
                <span>Applications Open — SSAP Cohort 2026-27</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                Become the Student Who{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C4B5FD]">
                  Builds a Learning
                </span>{' '}
                Community.
              </h1>

              {/* Subheadline */}
              <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Join the SkillRock Student Ambassador Program (SSAP). Inspired by premier global corporate initiatives like the Google Student Ambassador program, lead campus study jams, evangelize practical skill development, and build lasting collegiate opportunities.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/apply" className="btn-orange text-base px-8 py-3.5 shadow-orange">
                  Apply Now <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#overview"
                  className="btn-secondary bg-transparent border-white/30 text-white hover:bg-white/10 text-base px-8 py-3.5"
                >
                  Explore the Program
                </a>
              </div>

              <p className="mt-4 text-slate-400 text-xs sm:text-sm">
                100% Free · Voluntary Participation · 4-Month Chapter Sprints
              </p>
            </div>

            {/* Right: Clean Hero Illustration */}
            <div className="hidden lg:block animate-fade-in">
              <HeroIllustration />
            </div>
          </div>

          {/* Key Metric Tiles */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: '4 Months', label: 'Program Duration' },
              { value: '1,600 pts', label: 'Max Points Available' },
              { value: '100% Free', label: 'Merit-Based Selection' },
              { value: '4 Pillars', label: 'GSA-Inspired Model' },
            ].map(stat => (
              <div key={stat.label} className="glass-card p-5 text-center">
                <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                <div className="text-slate-400 text-xs sm:text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 2. PROGRAM OVERVIEW (Clean 4 Cards) ────────────────── */}
      <section id="overview" className="py-20 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-violet font-bold text-xs sm:text-sm uppercase tracking-wider">
              About the Program
            </span>
            <h2 className="section-title mt-2">What is the SkillRock Ambassador Program?</h2>
            <p className="section-sub max-w-2xl mx-auto text-sm sm:text-base">
              SSAP is a structured four-month collegiate leadership track that empowers proactive students to bridge the gap between academic theory and practical technology development on campus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewItems.map(item => (
              <div key={item.title} className="card p-6 group hover:-translate-y-1 transition-all duration-200">
                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{item.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. WHAT AMBASSADORS DO & SCORING ───────────────────── */}
      <section id="responsibilities" className="py-20 sm:py-24 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Responsibilities list */}
            <div>
              <span className="text-brand-violet font-bold text-xs sm:text-sm uppercase tracking-wider">
                Corporate Responsibilities
              </span>
              <h2 className="section-title mt-2 mb-4">What Ambassadors Do</h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8">
                As a SkillRock Ambassador and Chapter Lead, you are the official face of SkillRock at your institution. Your mission is to build an active peer learning environment and guide students in practical skill mastery.
              </p>
              <div className="space-y-4">
                {responsibilities.map(item => (
                  <div key={item.text} className="flex items-start gap-3.5">
                    <div className="w-9 h-9 bg-violet-100 text-brand-violet rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Scoring Matrix Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card">
              <h3 className="font-bold text-slate-900 mb-6 text-lg flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-brand-violet" />
                Task Scoring & Evaluation System
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Tasks per month', value: '4 tasks' },
                  { label: 'Points per task', value: '100 points' },
                  { label: 'Maximum monthly score', value: '400 points' },
                  { label: 'Total program maximum score', value: '1,600 points' },
                  { label: 'Program duration', value: '4 months' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <span className="text-slate-600 text-sm font-medium">{item.label}</span>
                    <span className="font-bold text-brand-violet text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-violet-50/70 border border-violet-100 rounded-xl">
                <p className="text-violet-900 text-xs sm:text-sm leading-relaxed">
                  <strong>Evaluation standard:</strong> Ambassadors submit evidence of study jams, student feedback reports, and community activities through their dashboard. Points determine honors, swag, and credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. AMBASSADOR BENEFITS & HONORS ───────────────────── */}
      <section id="benefits" className="py-20 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-violet font-bold text-xs sm:text-sm uppercase tracking-wider">
              Benefits & Recognition
            </span>
            <h2 className="section-title mt-2">What You Gain</h2>
            <p className="section-sub max-w-xl mx-auto text-sm sm:text-base">
              Transparent, realistic, and verifiable rewards for completing the 4-month program. We respect our ambassadors and make no misleading promises.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map(benefit => (
              <div
                key={benefit.title}
                className={`card p-6 relative ${benefit.highlight ? 'border-brand-violet ring-1 ring-brand-violet/20' : ''}`}
              >
                {benefit.highlight && (
                  <span className="absolute -top-3 left-6 bg-brand-violet text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    On Completion
                  </span>
                )}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                  benefit.highlight ? 'bg-violet-100 text-brand-violet' : 'bg-slate-100 text-slate-700'
                }`}>
                  <benefit.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-base">{benefit.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* Ethics & Transparency Card */}
          <div className="mt-10 p-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4">
            <Shield className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              <strong>Corporate Transparency Pledge:</strong> SkillRock does not promise guaranteed employment, internships, recommendation letters, or cash handouts. Participation is 100% voluntary and free. All digital credentials and referral stipends are governed strictly by program guidelines.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 5. PROGRAM SPRINT TIMELINE ────────────────────────── */}
      <section id="timeline" className="py-20 sm:py-24 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-brand-violet font-bold text-xs sm:text-sm uppercase tracking-wider">
              Sprint Roadmap
            </span>
            <h2 className="section-title mt-2">Four Months. Four Milestones.</h2>
            <p className="section-sub max-w-xl mx-auto text-sm sm:text-base">
              Each month operates as a focused sprint covering community kickoff, study jams, product feedback, and leadership transition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((month) => (
              <div key={month.month} className={`rounded-2xl border-2 p-6 bg-white shadow-sm flex flex-col justify-between ${month.color}`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-brand-violet uppercase tracking-wider bg-violet-50 px-2.5 py-0.5 rounded-full">
                      {month.month}
                    </span>
                    <span className="font-bold text-slate-600 text-xs">Max 400 pts</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1">{month.title}</h3>
                  <p className="text-xs text-slate-500 mb-4 font-medium">{month.subtitle}</p>

                  <ul className="space-y-2 mb-4">
                    {month.tasks.map(task => (
                      <li key={task} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-slate-400" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Primary KPI</div>
                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {month.kpi}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. FAQ SECTION ────────────────────────────────────── */}
      <section id="faq" className="py-20 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-violet font-bold text-xs sm:text-sm uppercase tracking-wider">FAQ</span>
            <h2 className="section-title mt-2">Frequently Asked Questions</h2>
            <p className="section-sub text-sm sm:text-base">Everything you need to know about eligibility, video requirements, and selection.</p>
          </div>

          <div className="space-y-3">
            {faqs.map(faq => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. CTA BANNER ─────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#171923] via-[#1F1938] to-[#171923] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-brand-violet rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-brand-orange rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>Applications Open for 2026-27</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Lead at Your Campus?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed max-w-xl mx-auto">
            Take the initiative. Submit your application and 45–60 second video introduction. Join the cohort of collegiate technical ambassadors.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/apply" className="btn-orange text-base px-8 py-3.5 shadow-orange">
              Start Application <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/application-status"
              className="btn-secondary bg-transparent border-white/30 text-white hover:bg-white/10 text-base px-8 py-3.5"
            >
              Check Application Status
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
