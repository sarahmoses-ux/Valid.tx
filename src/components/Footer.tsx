import { Link } from 'react-router-dom'

type FooterLink = { label: string; to?: string; href?: string }
type FooterGroup = { title: string; links: FooterLink[] }

const columns: FooterGroup[][] = [
  [
    {
      title: 'Product',
      links: [
        { label: 'Overview', to: '/dashboard' },
        { label: 'Transactions', to: '/transactions' },
        { label: 'Verified profile', to: '/profile' },
      ],
    },
    {
      title: 'Get started',
      links: [
        { label: 'Connect wallet', to: '/dashboard' },
        { label: 'Discover activity', href: '#how-it-works' },
        { label: 'Verify transactions', to: '/transactions' },
      ],
    },
  ],
  [
    {
      title: 'Verification',
      links: [
        { label: 'Attestcoin verification', to: '/transactions' },
        { label: 'Creditcoin references', to: '/profile' },
        { label: 'Transaction proofs', to: '/transactions' },
        { label: 'Activity profiles', to: '/profile' },
      ],
    },
  ],
  [
    {
      title: 'Networks',
      links: [
        { label: 'Ethereum', to: '/dashboard' },
        { label: 'Polygon', to: '/dashboard' },
        { label: 'Arbitrum', to: '/dashboard' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'How it works', href: '#how-it-works' },
        { label: 'Wallet authentication', to: '/dashboard' },
        { label: 'Supported activity', to: '/dashboard' },
      ],
    },
  ],
  [
    {
      title: 'About ValidTx',
      links: [
        { label: 'On-chain verification', href: '#how-it-works' },
        { label: 'Security', to: '/dashboard' },
        { label: 'Data transparency', to: '/profile' },
        { label: 'Contact us', href: 'mailto:hello@validtx.io' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of service' },
        { label: 'Privacy policy' },
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
    <footer className="relative z-10 bg-[#010f27] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-12 sm:pt-14 pb-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-9">
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
            <span className="material-symbols-outlined text-white text-[22px]">verified</span>
            <span className="font-semibold">ValidTx</span>
          </Link>
          <p className="text-[12px] text-white/75">© {new Date().getFullYear()} ValidTx. Powered by Creditcoin and Attestcoin.</p>
        </div>
      </div>
    </footer>
  )
}
