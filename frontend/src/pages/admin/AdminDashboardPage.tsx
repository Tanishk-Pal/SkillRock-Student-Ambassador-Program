import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Zap, LogOut, Search, Download, ChevronLeft, ChevronRight,
  Filter, Users, CheckCircle, Clock, XCircle, Star, BarChart2,
  Eye, RefreshCw, AlertCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'
import { STATUS_META } from '../../lib/constants'

type Application = {
  _id: string
  applicationId: string
  fullName: string
  email: string
  college: string
  degree: string
  year: string
  state: string
  status: string
  totalScore?: number
  submittedAt: string
  reviewedBy?: string
}

type Stats = {
  total: number
  byStatus: { _id: string; count: number }[]
  byCollege: { _id: string; count: number }[]
  byState: { _id: string; count: number }[]
}

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status]
  if (!meta) return <span className="badge bg-slate-100 text-slate-600">{status}</span>
  return <span className={`badge ${meta.bg} ${meta.color}`}>{meta.label}</span>
}

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  let adminUser: { email?: string; name?: string; role?: string } = {}
  try {
    adminUser = JSON.parse(localStorage.getItem('ssap_admin_user') || '{}')
  } catch {
    adminUser = {}
  }

  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [error, setError] = useState('')

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [limit, setLimit] = useState(25)

  const fetchApplications = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, any> = { page, limit, sortBy: 'submittedAt', sortOrder: 'desc' }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      if (stateFilter) params.state = stateFilter

      const response = await api.get('/applications', { params })
      setApplications(response.data.applications)
      setTotalPages(response.data.pagination.pages)
      setTotalCount(response.data.pagination.total)
    } catch {
      setError('Failed to load applications.')
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, statusFilter, stateFilter])

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const response = await api.get('/applications/stats')
      setStats(response.data)
    } catch {
      // stats are optional
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => { fetchApplications() }, [fetchApplications])
  useEffect(() => { fetchStats() }, [fetchStats])

  const handleLogout = () => {
    localStorage.removeItem('ssap_admin_token')
    localStorage.removeItem('ssap_admin_user')
    navigate('/admin/login')
    toast('Logged out.')
  }

  const handleExport = async () => {
    try {
      const response = await api.get('/applications/export/csv', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `ssap-applications-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('CSV exported successfully!')
    } catch {
      toast.error('Export failed.')
    }
  }

  const getStatusCount = (status: string) =>
    stats?.byStatus?.find(s => s._id === status)?.count ?? 0

  const statCards = [
    { label: 'Total Applications', value: stats?.total ?? 0, icon: Users, color: 'text-brand-violet', bg: 'bg-violet-50' },
    { label: 'Under Review', value: getStatusCount('under_review'), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Shortlisted', value: getStatusCount('shortlisted'), icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Selected', value: getStatusCount('selected'), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  ]

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-violet to-brand-purple rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-slate-900">SSAP Admin</span>
          <span className="badge bg-violet-100 text-brand-violet hidden sm:inline-flex">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-sm hidden sm:block">{adminUser.email}</span>
          <button onClick={handleLogout} className="btn-ghost text-sm py-2 px-3 text-red-600 hover:bg-red-50 hover:text-red-700">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {statCards.map(card => (
            <div key={card.label} className="card p-5">
              <div className={`w-10 h-10 ${card.bg} ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900">
                {statsLoading ? '...' : card.value}
              </div>
              <div className="text-slate-500 text-sm mt-0.5">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Top colleges */}
        {stats && stats.byCollege.length > 0 && (
          <div className="card p-6 mb-8">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-brand-violet" /> Applications by College (Top 10)
            </h3>
            <div className="space-y-3">
              {stats.byCollege.slice(0, 10).map(item => (
                <div key={item._id} className="flex items-center gap-3">
                  <span className="text-slate-700 text-sm flex-1 truncate">{item._id}</span>
                  <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-violet rounded-full"
                      style={{ width: `${Math.min(100, (item.count / (stats.total || 1)) * 100 * 5)}%` }}
                    />
                  </div>
                  <span className="text-slate-500 text-sm w-6 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters + table */}
        <div className="card">
          {/* Toolbar */}
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="input-field pl-9 py-2 text-sm"
                placeholder="Search by name, email, ID..."
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
                className="input-field py-2 text-sm w-auto"
              >
                <option value="">All Statuses</option>
                {Object.entries(STATUS_META).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>

              <button
                onClick={() => { setSearch(''); setStatusFilter(''); setStateFilter(''); setPage(1) }}
                className="btn-ghost text-sm py-2 px-3"
              >
                <Filter className="w-3.5 h-3.5" /> Reset
              </button>

              <button onClick={fetchApplications} className="btn-ghost text-sm py-2 px-3">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>

              <button onClick={handleExport} className="btn-secondary text-sm py-2 px-4">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>

          {/* Table */}
          {error ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-slate-600">{error}</p>
              <button onClick={fetchApplications} className="btn-primary mt-4 text-sm py-2 px-5">Retry</button>
            </div>
          ) : loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-brand-violet animate-spin mx-auto mb-3" />
              <p className="text-slate-500">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg font-medium">No applications found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {['App ID', 'Name', 'College', 'Year', 'State', 'Status', 'Score', 'Date', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{app.applicationId}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{app.fullName}</div>
                        <div className="text-slate-400 text-xs">{app.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">{app.college}</td>
                      <td className="px-4 py-3 text-slate-600">{app.year}</td>
                      <td className="px-4 py-3 text-slate-600">{app.state}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {app.totalScore !== undefined ? (
                          <span className="font-bold text-brand-violet">{app.totalScore}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(app.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/applications/${app.applicationId}`}
                          className="inline-flex items-center gap-1 text-brand-violet hover:text-violet-800 font-medium text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" /> Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination & Display Controls */}
          <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
            <div className="flex items-center gap-3">
              <span>
                Showing {applications.length} of {totalCount} total applicant(s)
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <span>Per page:</span>
                <select
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-brand-violet"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100 (Full Cohort)</option>
                  <option value={200}>200</option>
                </select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-ghost py-1 px-2.5 text-xs disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn-ghost py-1 px-2.5 text-xs disabled:opacity-40"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
