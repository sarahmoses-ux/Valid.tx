import { useMemo, useState } from 'react'
import { useActivity } from '../../context/ActivityContext'

const ringPath =
  'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'

const chainStyles: Record<string, { label: string; colorClass: string }> = {
  ETH: { label: 'ETH', colorClass: 'bg-primary' },
  POL: { label: 'POL', colorClass: 'bg-tertiary' },
  ARB: { label: 'ARB', colorClass: 'bg-secondary' },
}

const defaultChains = ['ETH', 'POL', 'ARB']

export default function ActivityDonut() {
  const { transactions } = useActivity()
  const [active, setActive] = useState('ETH')

  const chainData = useMemo(() => {
    const counts: Record<string, number> = {}

    transactions.forEach((transaction) => {
      if (transaction.status !== 'success') return

      const network = transaction.network?.toUpperCase()

      if (!network) return

      let chain = network

      // Normalize common network names
      if (
        network.includes('ETHEREUM') ||
        network.includes('SEPOLIA')
      ) {
        chain = 'ETH'
      } else if (
        network.includes('POLYGON') ||
        network === 'MATIC'
      ) {
        chain = 'POL'
      } else if (
        network.includes('ARBITRUM') ||
        network.includes('ARB')
      ) {
        chain = 'ARB'
      }

      counts[chain] = (counts[chain] || 0) + 1
    })

    const total = Object.values(counts).reduce(
      (sum, count) => sum + count,
      0
    )

    return defaultChains.map((chain) => ({
      ...chainStyles[chain],
      chain,
      count: counts[chain] || 0,
      percentage:
        total > 0
          ? Math.round(((counts[chain] || 0) / total) * 100)
          : 0,
    }))
  }, [transactions])

  const activeChain =
    chainData.find((chain) => chain.chain === active) ||
    chainData[0]

  const ethPercentage = chainData.find((c) => c.chain === 'ETH')?.percentage || 0
  const polPercentage = chainData.find((c) => c.chain === 'POL')?.percentage || 0
  const arbPercentage = chainData.find((c) => c.chain === 'ARB')?.percentage || 0

  return (
    <div className="glass-card rounded-xl p-4 sm:p-5 flex flex-col items-center relative min-w-0">
      <div className="w-full flex justify-between items-center mb-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Activity by Chain
        </h3>

        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface text-[20px]">
          more_horiz
        </span>
      </div>

      <div className="relative w-[180px] h-[180px] flex items-center justify-center my-auto">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 36 36"
        >
          {/* Background ring */}
          <path
            className="text-surface-container-highest"
            d={ringPath}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />

          {/* ETH */}
          {ethPercentage > 0 && (
            <path
              className="text-primary"
              d={ringPath}
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${ethPercentage}, 100`}
              strokeDashoffset="0"
              strokeLinecap="round"
              strokeWidth="3"
            />
          )}

          {/* POL */}
          {polPercentage > 0 && (
            <path
              className="text-tertiary"
              d={ringPath}
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${polPercentage}, 100`}
              strokeDashoffset={`${-ethPercentage}`}
              strokeLinecap="round"
              strokeWidth="3"
            />
          )}

          {/* ARB */}
          {arbPercentage > 0 && (
            <path
              className="text-secondary"
              d={ringPath}
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${arbPercentage}, 100`}
              strokeDashoffset={`${-(ethPercentage + polPercentage)}`}
              strokeLinecap="round"
              strokeWidth="3"
            />
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display-lg text-[28px] leading-tight text-on-surface">
            {activeChain?.percentage || 0}%
          </span>

          <span className="font-label-md text-label-md text-on-surface-variant uppercase">
            {activeChain?.chain || active}
          </span>
        </div>
      </div>

      <div className="w-full flex justify-center gap-4 mt-4 font-body-sm text-body-sm">
        {chainData.map((entry) => (
          <button
            type="button"
            key={entry.chain}
            onMouseEnter={() => setActive(entry.chain)}
            onFocus={() => setActive(entry.chain)}
            onClick={() => setActive(entry.chain)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
              active === entry.chain
                ? 'bg-surface-container-highest text-on-surface'
                : 'text-on-surface-variant'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${entry.colorClass}`}
            />

            {entry.label}
          </button>
        ))}
      </div>
    </div>
  )
}