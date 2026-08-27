const tiers = ['Emerging', 'Active', 'Established', 'High']

export default function ActivityLevelCard() {
  return (
    <div className="col-span-1 md:col-span-4 lg:col-span-4 glass-panel rounded-xl p-md flex flex-col justify-between">
      <div>
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-sm">Activity Level</h3>
        <div className="font-headline-md text-headline-md text-secondary mb-xs">High Activity</div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Based only on 143 verified transactions, $28.4k volume, and 3+ years of consistent activity.</p>
      </div>

      <div className="mt-lg">
        <div className="flex justify-between font-label-md text-label-md mb-base text-on-surface-variant opacity-60 text-[10px]">
          {tiers.map((tier, i) => (
            <span key={tier} className={i === tiers.length - 1 ? 'text-secondary opacity-100' : undefined}>
              {tier}
            </span>
          ))}
        </div>
        <div className="h-2 w-full bg-surface-container-highest rounded-full flex overflow-hidden">
          <div className="h-full bg-outline-variant w-1/4 border-r border-surface-container-lowest" />
          <div className="h-full bg-outline-variant w-1/4 border-r border-surface-container-lowest" />
          <div className="h-full bg-outline-variant w-1/4 border-r border-surface-container-lowest" />
          <div className="h-full bg-secondary w-1/4 relative">
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
