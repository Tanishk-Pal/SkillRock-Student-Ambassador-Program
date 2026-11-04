import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import {
  Trophy, Sparkles, Award, ArrowRight, ShieldCheck, CheckCircle2,
  Users, Calendar, Compass, Flame, ChevronDown, ExternalLink,
  Code2, Laptop, Rocket, MessageSquare, HeartHandshake, Star
} from 'lucide-react'
import { fetchLeaderboard, fetchLeaderboardStats } from '../lib/api'
import { BADGE_TIERS } from '../lib/constants'

// ─── Floating 3D / Glassmorphic Stickers (Google-Style) ────────────
function GlassSmileSticker() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg select-none">
      <circle cx="50" cy="50" r="44" fill="url(#smileGrad)" stroke="#FFFFFF" strokeWidth="3"/>
      {/* Eyes */}
      <circle cx="36" cy="42" r="5" fill="#1E3A8A"/>
      <circle cx="64" cy="42" r="5" fill="#1E3A8A"/>
      {/* Curved Smile */}
      <path d="M34 58 C 42 70, 58 70, 66 58" stroke="#1E3A8A" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      {/* Gloss Highlight */}
      <path d="M26 30 C 35 18, 65 18, 74 30" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
      <defs>
        <radialGradient id="smileGrad" cx="30%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#93C5FD"/>
          <stop offset="50%" stopColor="#60A5FA"/>
          <stop offset="100%" stopColor="#3B82F6"/>
        </radialGradient>
      </defs>
    </svg>
  )
}

function GlassSparkleSticker() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg select-none">
      <path
        d="M50 8 C 50 32, 68 50, 92 50 C 68 50, 50 68, 50 92 C 50 68, 32 50, 8 50 C 32 50, 50 32, 50 8 Z"
        fill="url(#sparkleGrad)"
        stroke="#FFFFFF"
        strokeWidth="3.5"
      />
      {/* Highlight core */}
      <circle cx="50" cy="50" r="10" fill="#FFFFFF" opacity="0.7"/>
      <defs>
        <radialGradient id="sparkleGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#BAE6FD"/>
          <stop offset="50%" stopColor="#67E8F9"/>
          <stop offset="100%" stopColor="#38BDF8"/>
        </radialGradient>
      </defs>
    </svg>
  )
}

export default function HomePage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const [topAmbassadors, setTopAmbassadors] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    // Load preview leaderboard for homepage
    fetchLeaderboard({ limit: 5 })
      .then(res => { if (res.success && res.data) setTopAmbassadors(res.data) })
      .catch(() => {})

    fetchLeaderboardStats()
      .then(res => { if (res.success && res.data) setStats(res.data) })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col font-sans text-slate-800">
      <Navbar />

      <main className="flex-1">
        {/* ─── Hero Section (Google Student Ambassador Style) ──────── */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-white">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-200/30 via-indigo-100/30 to-violet-200/20 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Stickers */}
          <div className="absolute top-28 left-8 sm:left-24 animate-bounce duration-1000 hidden md:block">
            <GlassSmileSticker />
          </div>
          <div className="absolute top-24 right-8 sm:right-24 animate-pulse duration-700 hidden md:block">
            <GlassSparkleSticker />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.08]">
              SkillRock Student<br />
              <span className="text-[#346BF1]">Ambassador 2026</span>
            </h1>

            {/* Subtitle direct from Google Student Ambassador inspiration */}
            <p className="mt-6 text-xl sm:text-2xl font-bold text-slate-800 max-w-2xl mx-auto tracking-tight">
              Your campus is ready for what's next. It just needs someone to lead it.
            </p>

            <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
              Bring practical skills to life. Turn curiosity into real projects. Build the future of tech together with SkillRock.
            </p>

            {/* Status Pill Badge */}
            <div className="mt-7 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Semester 2 Registrations Open
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/apply"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#346BF1] hover:bg-blue-600 text-white font-bold text-base transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/leaderboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base transition-all flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4 text-amber-500" /> View Leaderboard
              </Link>
            </div>

            {/* Program Highlights */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free Leadership Program
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 4-Month Verified Digital Certificate
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tiered Milestone Recognition
              </span>
            </div>
          </div>
        </section>

        {/* ─── Section 2: "Are You The One We're Looking For?" ───────── */}
        <section id="who-we-look-for" className="py-20 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Are You The One<br />
                <span className="bg-gradient-to-r from-[#FF8A00] via-[#EA4335] via-[#34A853] to-[#346BF1] bg-clip-text text-transparent">
                  We're Looking For?
                </span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
                Every campus has someone who leads change. Is that you?
              </p>
            </div>

            {/* 4 Clean Persona Cards (Direct from Screenshot 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Persona 1: The Tech & AI Enthusiast */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#346BF1] flex items-center justify-center mb-5 font-black text-xl">
                  🚀
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">
                  The Tech &amp; Skill Enthusiast
                </h3>
                <ul className="space-y-3 text-slate-600 text-sm font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#346BF1] font-bold">•</span>
                    <span>You're deeply curious about how technology and software work.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#346BF1] font-bold">•</span>
                    <span>You explore new tools, AI, and frameworks before everyone else does.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#346BF1] font-bold">•</span>
                    <span>Building practical projects isn't intimidating to you — it's exciting.</span>
                  </li>
                </ul>
              </div>

              {/* Persona 2: The Creative Thinker */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 font-black text-xl">
                  💡
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">
                  The Creative Thinker
                </h3>
                <ul className="space-y-3 text-slate-600 text-sm font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>You see possibilities where others see limits.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>You come up with event ideas and workshops people didn't know they needed.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>You don't follow trends. You start them on your campus.</span>
                  </li>
                </ul>
              </div>

              {/* Persona 3: The Communicator */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 font-black text-xl">
                  📣
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">
                  The Communicator
                </h3>
                <ul className="space-y-3 text-slate-600 text-sm font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>You enjoy bringing students and classmates together.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>You share what you learn with clarity, confidence, and passion.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>You make complex technical concepts feel accessible and simple.</span>
                  </li>
                </ul>
              </div>

              {/* Persona 4: The Impact Maker */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 font-black text-xl">
                  🌟
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">
                  The Impact Maker
                </h3>
                <ul className="space-y-3 text-slate-600 text-sm font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>You don't just participate — you lead, organize, and build.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>You mentor peers and guide them toward production-ready skill sets.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>You care about leaving your campus better and more empowered than you found it.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Section 3: Tiered Milestone Structure (from Screenshot 3) */}
        <section id="rewards" className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Deep Blue Container Card */}
            <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
              {/* Decorative Trophy & Confetti */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xs flex items-center justify-center mx-auto mb-3 border border-white/20">
                  <Trophy className="w-8 h-8 text-amber-300" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  Ambassador Tiered Milestone Structure
                </h2>
                <p className="mt-2 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
                  Progression tiers based on total points accumulated throughout the 4-month program duration.
                </p>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-slate-800">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Tier Category</th>
                      <th className="py-3.5 px-4 sm:px-6">Points</th>
                      <th className="py-3.5 px-4 sm:px-6">Digital Recognition</th>
                      <th className="py-3.5 px-4 sm:px-6 hidden sm:table-cell">Leadership Growth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {BADGE_TIERS.map(tier => (
                      <tr key={tier.tier} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 px-4 sm:px-6 font-extrabold text-slate-900">
                          {tier.tier}
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span className="font-black text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-full">
                            {tier.minPoints}+ pts
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6 font-semibold text-slate-700">
                          {tier.digitalReward}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-slate-500 hidden sm:table-cell">
                          {tier.perks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 4-Month Certificate Callout */}
              <div className="mt-8 bg-white/10 backdrop-blur-xs rounded-2xl p-6 border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-12 h-12 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-base">
                      Verified 4-Month Program Completion Certificate
                    </h4>
                    <p className="text-xs text-blue-100 mt-0.5">
                      Awarded to ambassadors completing their semester chapter sprint with active workshops and peer mentoring.
                    </p>
                  </div>
                </div>
                <Link
                  to="/verify-certificate"
                  className="px-5 py-2.5 rounded-full bg-white text-[#2563EB] hover:bg-blue-50 font-bold text-xs transition-all shrink-0"
                >
                  Verify Any Certificate &gt;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Section 4: Live Leaderboard Preview ──────────────────── */}
        <section className="py-20 bg-[#FDFDFE] border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
                  Competitive Leaderboard
                </span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                  Campus Leaders in Action
                </h2>
              </div>
              <Link
                to="/leaderboard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#346BF1] hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-full transition-colors"
              >
                View Full Leaderboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quick Preview Cards */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {topAmbassadors.length > 0 ? (
                topAmbassadors.slice(0, 4).map((a) => (
                  <div key={a._id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <span className="font-black text-slate-500 text-sm w-7 text-center">
                        {a.rank === 1 ? '🥇' : a.rank === 2 ? '🥈' : a.rank === 3 ? '🥉' : `#${a.rank}`}
                      </span>
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-[#346BF1] font-bold text-xs flex items-center justify-center border border-blue-100">
                        {a.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{a.name}</h4>
                        <p className="text-xs text-slate-500 truncate max-w-xs">{a.college}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {a.badgeTier && (
                        <span className="hidden sm:inline-block text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                          {a.badgeTier}
                        </span>
                      )}
                      <span className="font-black text-sm text-[#346BF1] bg-blue-50 px-3 py-1 rounded-full">
                        {a.totalPoints.toLocaleString()} pts
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  Loading top campus ambassadors...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── Section 5: Eligibility & What Sets You Apart (Screenshot 4) */}
        <section id="about" className="py-20 bg-[#F8FAFC]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Are You the Next<br />
                <span className="text-[#346BF1]">SkillRock Campus Ambassador?</span>
              </h2>
            </div>

            <div className="space-y-6">
              {/* Eligibility Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#346BF1]" /> Eligibility Criteria
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#346BF1] font-bold">•</span>
                    <span>An Indian citizen aged 18–25 actively enrolled in college.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#346BF1] font-bold">•</span>
                    <span>Must be an active student at an Indian university/college, from any major, branch, or semester.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#346BF1] font-bold">•</span>
                    <span>Curious about technology, building practical software, and eager to learn.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#346BF1] font-bold">•</span>
                    <span>Eager to explore and apply skills in meaningful, practical ways.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#346BF1] font-bold">•</span>
                    <span>Must have an active LinkedIn profile or Instagram presence to share educational content.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-[#346BF1] font-bold">•</span>
                    <span>Willing to dedicate 2–4 hours per week to ambassador leadership and community activities.</span>
                  </li>
                </ul>
              </div>

              {/* What Sets You Apart Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> What Sets You Apart
                </h3>
                <ul className="space-y-3 text-sm text-slate-600 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>You simplify complex technical ideas with clarity, enthusiasm, and confidence.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>You're comfortable leading study sessions and guiding peers in hands-on building.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>You think originally, take initiative, and bring fresh perspectives to your campus.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Section 6: Program Timeline ─────────────────────────── */}
        <section id="timeline" className="py-20 bg-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">
              Cohort Structure
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              4-Month Leadership Sprint
            </h2>
            <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
              A structured roadmap designed to build your leadership skills without disrupting your academic schedule.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-12 text-left">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <span className="text-xs font-black text-[#346BF1] uppercase tracking-wider block mb-1">Phase 1</span>
                <h4 className="font-extrabold text-slate-900 text-base">Application &amp; Video</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Submit your student details, leadership motivation, and a 60–90 second intro video via Google Drive.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <span className="text-xs font-black text-indigo-600 uppercase tracking-wider block mb-1">Phase 2</span>
                <h4 className="font-extrabold text-slate-900 text-base">Onboarding &amp; Charter</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Join the national ambassador cohort orientation, access campus toolkits, and plan your chapter meetups.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <span className="text-xs font-black text-purple-600 uppercase tracking-wider block mb-1">Phase 3</span>
                <h4 className="font-extrabold text-slate-900 text-base">Campus Study Jams</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Host peer coding sessions, mentor classmates, and climb the real-time leaderboard as you log activities.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <span className="text-xs font-black text-emerald-600 uppercase tracking-wider block mb-1">Phase 4</span>
                <h4 className="font-extrabold text-slate-900 text-base">Digital Certification</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Graduate with an authenticated 4-month completion certificate and verified milestone honors for your resume.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Section 7: FAQ ──────────────────────────────────────── */}
        <section id="faq" className="py-20 bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">FAQ</span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'What is the SkillRock Student Ambassador Program (SSAP)?',
                  a: 'SSAP is a 4-month collegiate leadership initiative where passionate student builders represent SkillRock at their university. Ambassadors organize study circles, introduce classmates to hands-on tech courses, and foster a culture of practical software building.'
                },
                {
                  q: 'Is this program free of cost?',
                  a: 'Yes, 100% free. There is no application fee, registration cost, or hidden charge. We believe student leadership and peer learning should be universally accessible.'
                },
                {
                  q: 'What rewards do ambassadors receive upon completion?',
                  a: 'Ambassadors who fulfill their 4-month milestones receive an authenticated, cryptographically verifiable Digital Completion Certificate, tiered digital honors badges (The Explorer, The Trailblazer, The Changemaker, SkillRock Champ), priority recognition on the campus leaderboard, and recommendations for their portfolio.'
                },
                {
                  q: 'How much time commitment is expected per week?',
                  a: 'Around 2 to 4 hours per week. Activities are flexible and designed around your collegiate exam schedules and coursework.'
                },
                {
                  q: 'How does the scoring and leaderboard competition work?',
                  a: 'Points are uncapped and awarded based on verified campus activities: hosting a study jam, onboarding peers to learning modules, and submitting community feedback. Scores update in real time on the public leaderboard.'
                },
                {
                  q: 'How does the video introduction work in the application?',
                  a: 'In Step 6 of the application, provide a 60–90 second video recording explaining your passion for technology and community building. You can either paste a shareable Google Drive link (with view access) or upload a video file up to 30 MB directly.'
                }
              ].map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-extrabold text-slate-900 text-sm hover:bg-slate-50/50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${faqOpen === i ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>
                  {faqOpen === i && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Section 8: Final Bottom CTA ──────────────────────────── */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50/50 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Ready to Lead Your Campus?
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-lg mx-auto">
              Join curious peers from universities across India. Build your leadership, guide your classmates, and earn verified credentials.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/apply"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#346BF1] hover:bg-blue-600 text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2"
              >
                Apply for SSAP 2026 &gt;
              </Link>
              <Link
                to="/leaderboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base transition-all"
              >
                Explore Leaderboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
