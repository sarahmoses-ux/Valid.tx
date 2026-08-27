type NetworkUsage = {
  code: string
  name: string
  share: string
}

const networks: NetworkUsage[] = [
  { code: 'E', name: 'Ethereum Mainnet', share: '65%' },
  { code: 'A', name: 'Arbitrum One', share: '25%' },
  { code: 'O', name: 'Optimism', share: '10%' },
]

export default function NetworksUsedCard() {
  return (
    <div className="col-span-1 lg:col-span-6 glass-panel rounded-xl p-md">
      <div className="flex items-center justify-between mb-md">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase">Networks Used</h3>
        <span className="material-symbols-outlined text-on-surface-variant text-[20px]">lan</span>
      </div>
      <ul className="flex flex-col gap-sm">
        {networks.map((network) => (
          <li
            key={network.code}
            className="flex items-center justify-between p-sm rounded bg-surface-container-highest/50 border border-outline-variant/30"
          >
            <div className="flex items-center gap-sm">
              <div className="w-6 h-6 rounded-full bg-surface-bright flex items-center justify-center font-label-md text-label-md">
                {network.code}
              </div>
              <span className="font-body-md text-body-md text-on-surface">{network.name}</span>
            </div>
            <span className="font-mono-data text-mono-data text-on-surface-variant">{network.share}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
