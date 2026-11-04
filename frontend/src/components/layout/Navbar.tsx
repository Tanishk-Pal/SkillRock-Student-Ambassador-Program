import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, ExternalLink, Shield } from 'lucide-react'

const navLinks = [
  { href: '/#about', label: 'About' },
  { href: '/#who-we-look-for', label: 'Who We Look For' },
  { href: '/#rewards', label: 'Tiers & Badges' },
  { href: '/leaderboard', label: 'Leaderboard', isRoute: true },
  { href: '/#faq', label: 'FAQ' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200' 
        : 'bg-white border-b border-slate-200'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo matching SkillRock Screenshot */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.jpg"
                alt="SkillRock"
                className="w-9 h-9 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Skill<span className="text-[#FF8A00] font-black">Rock</span>
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              SSAP Leadership
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map(link => (
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-semibold text-slate-600 hover:text-[#346BF1] transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-slate-600 hover:text-[#346BF1] transition-colors"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/verify-certificate"
              className="text-xs font-semibold text-slate-600 hover:text-[#346BF1] px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Verify Credential
            </Link>

            <Link
              to="/application-status"
              className="text-xs font-semibold text-slate-700 hover:text-[#346BF1] px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Check Status
            </Link>

            <Link
              to="/apply"
              className="px-5 py-2 rounded-full bg-[#346BF1] hover:bg-blue-600 text-white font-bold text-xs tracking-wide transition-all shadow-xs hover:shadow-sm"
            >
              Apply Now &gt;
            </Link>

            <Link
              to="/admin/login"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Admin Console"
            >
              <Shield className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white py-4 px-2 space-y-2 animate-fade-in">
            {navLinks.map(link => (
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-slate-700 font-semibold hover:bg-blue-50 hover:text-[#346BF1] transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-slate-700 font-semibold hover:bg-blue-50 hover:text-[#346BF1] transition-colors text-sm"
                >
                  {link.label}
                </a>
              )
            ))}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link to="/leaderboard" onClick={() => setMenuOpen(false)} className="btn-ghost w-full justify-center text-xs font-bold text-[#346BF1]">
                🏆 View Leaderboard
              </Link>
              <Link to="/verify-certificate" onClick={() => setMenuOpen(false)} className="btn-ghost w-full justify-center text-xs">
                Verify Certificate
              </Link>
              <Link to="/application-status" onClick={() => setMenuOpen(false)} className="btn-ghost w-full justify-center text-xs">
                Check Application Status
              </Link>
              <Link to="/apply" onClick={() => setMenuOpen(false)} className="w-full text-center py-2.5 rounded-full bg-[#346BF1] text-white font-bold text-xs block">
                Apply for SSAP 2026 &gt;
              </Link>
              <Link to="/admin/login" className="btn-ghost w-full justify-center text-xs text-slate-500">
                <Shield className="w-3.5 h-3.5 mr-1" /> Admin Portal
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
