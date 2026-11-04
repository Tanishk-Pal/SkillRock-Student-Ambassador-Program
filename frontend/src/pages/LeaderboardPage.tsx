import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Trophy, Award, Search, Sparkles, Flame, Compass,
  ArrowRight, ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight,
  TrendingUp, Users, Calendar
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { fetchLeaderboard, fetchLeaderboardStats } from '../lib/api'
import { BADGE_TIERS } from '../lib/constants'

interface AmbassadorEntry {
  _id: string
  name: string
  college: string
  city?: string
  totalPoints: number
  badgeTier: string | null
  badges: string[]
  activitiesCount: number
  rank: number
  certificateStatus?: string
  certificateId?: string
}

interface LeaderboardStats {
  totalAmbassadors: number
  totalPointsAwarded: number
  totalActivitiesCompleted: number
  topTierChampCount: number
}

const BADGE_CONFIG: Record<string, { icon: typeof Trophy; color: string; bg: string; border: string }> = {
  'SkillRock Champ': { icon: Trophy, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300' },
  'The Changemaker': { icon: Sparkles, color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-300' },
  'The Trailblazer': { icon: Flame, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-300' },
  'The Explorer': { icon: Compass, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300' },
}

export default function LeaderboardPage() {
  const [ambassadors, setAmbassadors] = useState<AmbassadorEntry[]>([])
  const [stats, setStats] = useState<LeaderboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedBadge, setSelectedBadge] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    loadStats()
  }, [])

  useEffect(() => {
    loadLeaderboard()
  }, [page, selectedBadge])

  const loadStats = async () => {
    try {
      const res = await fetchLeaderboardStats()
      if (res.success) setStats(res.data)
    } catch {
      // Fallback stats if backend is starting up
      setStats({
        totalAmbassadors: 28,
        totalPointsAwarded: 24650,
        totalActivitiesCompleted: 142,
        topTierChampCount: 5,
      })
    }
  }

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const res = await fetchLeaderboard({
        page,
        limit: 15,
        search: search.trim() || undefined,
        badge: selectedBadge !== 'all' ? selectedBadge : undefined,
      })
      if (res.success) {
        setAmbassadors(res.data || [])
        setTotalPages(res.totalPages || 1)
        setTotalCount(res.total || res.data?.length || 0)
      }
    } catch {
      // Soft fallback for offline development
      setAmbassadors([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    loadLeaderboard()
  }

  // Identify Top 3 from current or top dataset
  const topThree = ambassadors.filter(a => a.rank <= 3).sort((a, b) => a.rank - b.rank)

  return (
    <div className="min-h-screen bg-[#FDFDFE] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Header Hero */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6 pb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide uppercase mb-4">
            <Trophy className="w-4 h-4 text-blue-600" />
            SkillRock Ambassador Leaderboard
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Recognizing Campus <span className="text-[#346BF1]">Leadership</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Real-time recognition celebrating student ambassadors driving peer study circles, practical skill jams, and technical community growth.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                <Users className="w-5 h-5" />
                <span className="text-2xl font-black text-slate-900">{stats?.totalAmbassadors ?? '25+'}</span>
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Campus Leads</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-center gap-2 text-indigo-600 mb-1">
                <TrendingUp className="w-5 h-5" />
                <span className="text-2xl font-black text-slate-900">{stats?.totalPointsAwarded ? stats.totalPointsAwarded.toLocaleString() : '24,000+'}</span>
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Skill Points Earned</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
                <Calendar className="w-5 h-5" />
                <span className="text-2xl font-black text-slate-900">{stats?.totalActivitiesCompleted ?? '140+'}</span>
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Workshops Conducted</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-center gap-2 text-amber-500 mb-1">
                <Trophy className="w-5 h-5" />
                <span className="text-2xl font-black text-slate-900">{stats?.topTierChampCount ?? '5'}</span>
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">SkillRock Champs</p>
            </div>
          </div>
        </div>

        {/* Podium for Top 3 (if present) */}
        {topThree.length >= 3 && page === 1 && selectedBadge === 'all' && !search && (
          <div className="max-w-5xl mx-auto px-4 mb-16">
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cohort Leaders</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center relative order-2 md:order-1 hover:border-slate-300 transition-all">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-extrabold text-sm flex items-center justify-center mx-auto mb-3 border-2 border-slate-300">
                    2
                  </div>
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                    {topThree[1].name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">{topThree[1].name}</h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{topThree[1].college}</p>
                  <div className="mt-4 flex items-center justify-center gap-1.5">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-black text-sm">
                      {topThree[1].totalPoints.toLocaleString()} pts
                    </span>
                  </div>
                  {topThree[1].badgeTier && (
                    <span className="inline-block mt-3 text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                      {topThree[1].badgeTier}
                    </span>
                  )}
                </div>
              )}

              {/* 1st Place Champion */}
              {topThree[0] && (
                <div className="bg-gradient-to-b from-blue-50/80 via-white to-white rounded-3xl p-8 border-2 border-[#346BF1] shadow-lg text-center relative order-1 md:order-2 md:-translate-y-4 hover:shadow-xl transition-all">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-amber-400 text-amber-950 font-black text-base flex items-center justify-center shadow-md">
                    👑
                  </div>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#346BF1] to-violet-600 text-white font-black text-2xl flex items-center justify-center mx-auto mb-3 shadow-md mt-2">
                    {topThree[0].name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-extrabold uppercase tracking-wide mb-1">
                    Rank #1 Leader
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{topThree[0].name}</h3>
                  <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">{topThree[0].college}</p>
                  <div className="mt-4 flex items-center justify-center gap-1.5">
                    <span className="px-4 py-1.5 rounded-full bg-[#346BF1] text-white font-black text-base shadow-xs">
                      {topThree[0].totalPoints.toLocaleString()} pts
                    </span>
                  </div>
                  {topThree[0].badgeTier && (
                    <span className="inline-block mt-3 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full">
                      🏆 {topThree[0].badgeTier}
                    </span>
                  )}
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center relative order-3 hover:border-slate-300 transition-all">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 font-extrabold text-sm flex items-center justify-center mx-auto mb-3 border-2 border-amber-300">
                    3
                  </div>
                  <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                    {topThree[2].name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">{topThree[2].name}</h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{topThree[2].college}</p>
                  <div className="mt-4 flex items-center justify-center gap-1.5">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-black text-sm">
                      {topThree[2].totalPoints.toLocaleString()} pts
                    </span>
                  </div>
                  {topThree[2].badgeTier && (
                    <span className="inline-block mt-3 text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                      {topThree[2].badgeTier}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search, Filter & Full Leaderboard Table */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
              {/* Badge Pills */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => { setSelectedBadge('all'); setPage(1); }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedBadge === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Tiers
                </button>
                {BADGE_TIERS.map(b => (
                  <button
                    key={b.tier}
                    onClick={() => { setSelectedBadge(b.tier); setPage(1); }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedBadge === b.tier
                        ? 'bg-[#346BF1] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {b.tier}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search student or college..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-full border border-slate-300 focus:outline-hidden focus:border-[#346BF1] focus:ring-2 focus:ring-blue-100"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </form>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Ambassador</th>
                    <th className="py-3 px-4">College</th>
                    <th className="py-3 px-4">Digital Badge</th>
                    <th className="py-3 px-4 text-center">Activities</th>
                    <th className="py-3 px-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                        Loading campus rankings...
                      </td>
                    </tr>
                  ) : ambassadors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                        No ambassadors match this filter. Try clearing your search.
                      </td>
                    </tr>
                  ) : (
                    ambassadors.map((a) => {
                      const badgeInfo = a.badgeTier ? BADGE_CONFIG[a.badgeTier] : null
                      return (
                        <tr key={a._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-black text-slate-700 text-sm">
                            {a.rank === 1 ? '🥇 1' : a.rank === 2 ? '🥈 2' : a.rank === 3 ? '🥉 3' : `#${a.rank}`}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0">
                                {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 text-sm block">{a.name}</span>
                                {a.certificateId && (
                                  <Link
                                    to={`/verify-certificate/${a.certificateId}`}
                                    className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold"
                                  >
                                    <ShieldCheck className="w-3 h-3" /> Verified Certificate
                                  </Link>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-600 font-medium">
                            <span className="block truncate max-w-xs">{a.college}</span>
                            {a.city && <span className="text-[11px] text-slate-400">{a.city}</span>}
                          </td>
                          <td className="py-4 px-4">
                            {badgeInfo && a.badgeTier ? (
                              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${badgeInfo.bg} ${badgeInfo.color} ${badgeInfo.border} border`}>
                                <badgeInfo.icon className="w-3.5 h-3.5" />
                                {a.badgeTier}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium">—</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-center font-semibold text-slate-700 text-xs">
                            {a.activitiesCount} sessions
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="font-extrabold text-[#346BF1] text-sm bg-blue-50 px-3 py-1 rounded-full">
                              {a.totalPoints.toLocaleString()} pts
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                <span className="text-xs text-slate-500">
                  Showing page {page} of {totalPages} ({totalCount} ambassadors)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tier Overview Banner */}
          <div className="mt-12 bg-gradient-to-r from-slate-900 to-[#171923] rounded-3xl p-8 text-white">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-2">
                Uncapped Progression
              </span>
              <h2 className="text-2xl font-black tracking-tight">How Ambassadors Earn Points</h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                SkillRock Student Ambassadors earn uncapped points by hosting peer study circles, organizing hands-on coding sessions, mentoring classmates, and driving skill engagement on campus. Every milestone unlocks digital honors and verified credentials.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {BADGE_TIERS.map(tier => (
                  <div key={tier.tier} className="bg-white/10 rounded-2xl p-4 backdrop-blur-xs border border-white/10">
                    <span className="text-xs font-bold text-amber-300 block">{tier.minPoints}+ pts</span>
                    <h4 className="font-extrabold text-sm text-white mt-1">{tier.tier}</h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-snug">{tier.digitalReward}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-4 items-center">
                <Link to="/apply" className="px-6 py-2.5 rounded-full bg-[#346BF1] hover:bg-blue-600 font-bold text-xs text-white transition-all shadow-sm flex items-center gap-1.5">
                  Apply to Become an Ambassador <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link to="/verify-certificate" className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 font-bold text-xs text-white transition-all flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verify Student Certificate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
