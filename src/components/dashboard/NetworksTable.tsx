type NetworkRow = {
  name: string
  icon: string
  iconColorClass: string
  discovered: number
  verified: number
}

const networks: NetworkRow[] = [
  { name: 'Ethereum', icon: 'tab_duplicate', iconColorClass: 'text-primary', discovered: 742, verified: 82 },
  { name: 'Polygon', icon: 'polyline', iconColorClass: 'text-tertiary', discovered: 311, verified: 45 },
  { name: 'Arbitrum', icon: 'token', iconColorClass: 'text-primary-fixed-dim', discovered: 195, verified: 16 },
]

export default function NetworksTable() {
  const { transactions } = useActivity()
  const networkRows = networks.map((network) => ({ ...network, verified: network.verified + transactions.filter((tx) => tx.network === network.name && tx.verification === 'verified').length - (network.name === 'Ethereum' ? 1 : 0) }))
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-md border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-high/50">
        <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Supported Networks</h3>
        <Link
          to="/transactions"
          className="font-label-md text-label-md text-primary hover:text-primary-fixed transition-colors flex items-center gap-1"
        >
          View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container/30">
              <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold whitespace-nowrap">
                Network
              </th>
              <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold whitespace-nowrap">
                Status
              </th>
              <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold text-right whitespace-nowrap">
                Discovered
              </th>
              <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold text-right whitespace-nowrap">
                Attestcoin Verified
              </th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md text-on-surface">
            {networkRows.map((network, i) => (
              <tr
                key={network.name}
                className={
                i === networkRows.length - 1
                    ? 'hover:bg-surface-container-high/30 transition-colors'
                    : 'border-b border-outline-variant/10 hover:bg-surface-container-high/30 transition-colors'
                }
              >
                <td className="py-sm px-md flex items-center gap-sm">
                  <div className="w-8 h-8 rounded-full bg-surface-bright flex items-center justify-center border border-outline-variant/50">
                    <span className={`material-symbols-outlined text-[18px] ${network.iconColorClass}`}>
                      {network.icon}
                    </span>
                  </div>
                  <span className="font-medium">{network.name}</span>
                </td>
                <td className="py-sm px-md">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-label-md text-[11px] uppercase tracking-wider">
                    <span className="status-dot bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.6)]" /> Verified Node
                  </div>
                </td>
                <td className="py-sm px-md text-right font-mono-data text-on-surface-variant">{network.discovered}</td>
                <td className="py-sm px-md text-right font-mono-data text-secondary"><span className="material-symbols-outlined text-[14px] align-[-2px] mr-1">verified</span>{network.verified}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
import { Link } from 'react-router-dom'
import { useActivity } from '../../context/ActivityContext'
