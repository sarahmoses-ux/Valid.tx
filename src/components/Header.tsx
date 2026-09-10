import { Link } from 'react-router-dom'
import Logo from '../assets/logo.png'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 glass-panel border-x-0 border-t-0 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-xs">
        <span><img className="w-10 h-10 rounded-xl" src={Logo} alt="Logo" /></span>
        <span className="font-headline-sm text-headline-sm font-bold text-on-surface">ValidChain</span>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <a
          className="hidden sm:block font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
          href="#how-it-works"
        >
          How it Works
        </a>
        <Link to="/dashboard" className="btn-primary px-sm py-xs rounded-lg font-label-md text-label-md">
          Launch App
        </Link>
      </div>
    </header>
  )
}
