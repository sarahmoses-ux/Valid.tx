import { Link } from 'react-router-dom'
import Logo from '../assets/logo.png'

type FooterLink = { label: string; to?: string; href?: string }
type FooterGroup = { title: string; links: FooterLink[] }

const columns: FooterGroup[][] = [
  [
    {
      title: 'Get started',
      links: [
        { label: 'Connect wallet', to: '/dashboard' },
        { label: 'Discover activity', href: '#how-it-works' },
        { label: 'Verify transactions', to: '/transactions' },
      ],
    },
    {
      title: 'Verification',
      links: [
        { label: 'Overview', to: '/dashboard' },
        { label: 'Transactions', to: '/transactions' },
        { label: 'Verified profile', to: '/profile' },
      ],
    },
  ],
]

function FooterItem({ link }: { link: FooterLink }) {
  const className = 'text-[15px] leading-6 text-white/75 hover:text-white transition-colors'
  if (link.to) return <Link to={link.to} className={className}>{link.label}</Link>
  if (link.href) return <a href={link.href} className={className}>{link.label}</a>
  return <span className="text-[15px] leading-6 text-white/75">{link.label}</span>
}

export default function Footer() {
  return (
    <footer className="relative z-10 bg-[#4b4b4be5] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-12 sm:pt-14 pb-7">
        <div className="flex flex-wrap">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-wrap gap-9">
              {column.map((group) => (
                <nav key={group.title} aria-label={`${group.title} footer links`}>
                  <h2 className="text-[17px] leading-6 font-medium text-white mb-3">{group.title}</h2>
                  <ul className="space-y-1.5">
                    {group.links.map((link) => <li key={link.label}><FooterItem link={link} /></li>)}
                  </ul>
                </nav>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white">
            <span><img className="w-12 h-12 rounded-xl" src={Logo} alt="Logo" /></span>
            <span className="font-semibold">ValidChain</span>
          </Link>
          <p className="text-[12px] text-white/75">© {new Date().getFullYear()} ValidChain. Powered by Creditcoin and Attestcoin.</p>
        </div>
      </div>
    </footer>
  )
}
