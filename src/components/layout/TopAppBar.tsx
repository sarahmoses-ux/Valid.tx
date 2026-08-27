import { Link } from 'react-router-dom'
import { useWallet } from '../../context/WalletContext'
import { truncateAddress } from '../../lib/address'

export default function TopAppBar({ title }: { title: string }) {
  const { address, isReadOnly } = useWallet()

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
      <Link to="/dashboard" className="md:hidden flex items-center gap-2 text-on-surface font-semibold">
        <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
        ValidTx
      </Link>
      <div className="font-headline-sm text-headline-sm font-bold text-on-surface hidden md:block">{title}</div>

      <div className="flex items-center gap-md ml-auto">
        <div className="hidden lg:flex items-center gap-xs px-sm py-xs rounded-full border border-outline-variant bg-surface-container">
          <span className="status-dot bg-secondary" />
          <span className="font-mono-data text-mono-data text-on-surface">Mainnet</span>
        </div>

        <div className="flex items-center gap-xs px-sm py-xs rounded-xl bg-surface-container-high hover:bg-surface-container-highest cursor-pointer transition-colors border border-outline-variant/50">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shrink-0 overflow-hidden">
            <div
              className="w-full h-full opacity-50 mix-blend-overlay"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 2px, #fff 2px, #fff 4px)',
              }}
            />
          </div>
          <span className="font-mono-data text-mono-data text-primary">
            {address ? truncateAddress(address, 3, 4) : '—'}{isReadOnly ? ' · Read only' : ''}
          </span>
        </div>
      </div>
    </header>
  )
}
