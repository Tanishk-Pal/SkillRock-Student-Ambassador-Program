import { Link } from 'react-router-dom'
import { Zap, ExternalLink, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/logo.jpg"
                alt="SkillRock"
                className="w-9 h-9 rounded-lg object-cover shadow-sm"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
              <span className="font-extrabold text-xl tracking-tight text-white">
                Skill<span className="text-[#FF8A00] font-black">Rock</span>
              </span>
              <span className="text-[10px] font-bold text-violet-300 bg-violet-900/60 border border-violet-700/50 px-2 py-0.5 rounded uppercase tracking-wider">
                SSAP Leadership
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm text-sm">
              The SkillRock Student Ambassador Program (SSAP) is a corporate-calibre collegiate leadership initiative inspired by the Google Student Ambassador program. Empowering students to build technical learning communities, lead study jams, and deploy production projects.
            </p>
            <div className="mt-4">
              <a
                href="https://skillrock.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-orange hover:text-orange-400 font-semibold text-sm transition-colors"
              >
                Visit SkillRock Main Platform <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Program */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider text-slate-300">Program</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/#overview', label: 'About SSAP' },
                { href: '/#responsibilities', label: 'Responsibilities' },
                { href: '/#benefits', label: 'Ambassador Benefits' },
                { href: '/#timeline', label: 'Sprint Timeline' },
                { href: '/#faq', label: 'FAQ' },
              ].map(item => (
                <li key={item.href}>
                  <a href={item.href} className="text-slate-400 hover:text-white transition-colors text-xs font-medium">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {[
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms & Expectations' },
                { to: '/apply', label: 'Apply Now' },
                { to: '/application-status', label: 'Check Status' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} SkillRock. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-400" /> for students, by students.
          </p>
        </div>
      </div>
    </footer>
  )
}
