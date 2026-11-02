import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, ExternalLink, Shield } from 'lucide-react'

const navLinks = [
  { href: '/#overview', label: 'About' },
  { href: '/#responsibilities', label: 'Responsibilities' },
  { href: '/#benefits', label: 'Benefits' },
  { href: '/#timeline', label: 'Timeline' },
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
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-brand-violet transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Link to main SkillRock platform */}
            <a
              href="https://skillrock.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              SkillRock Web <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <Link
              to="/application-status"
              className="text-xs font-semibold text-slate-700 hover:text-brand-violet px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Check Status
            </Link>

            <Link
              to="/apply"
              className="btn-primary text-xs py-2 px-4 shadow-sm"
            >
              Apply for SSAP
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
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-violet-50 hover:text-brand-violet transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <a
                href="https://skillrock.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-slate-600"
              >
                <span>Visit SkillRock Platform</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <Link to="/application-status" className="btn-ghost w-full justify-center text-xs">
                Check Application Status
              </Link>
              <Link to="/apply" className="btn-primary w-full justify-center text-xs">
                Apply for SSAP 2026
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
