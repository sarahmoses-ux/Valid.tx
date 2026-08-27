export default function VolumeHeroCard({ volume }: { volume: number }) {
  return (
    <div className="col-span-1 md:col-span-8 lg:col-span-8 glass-panel rounded-xl p-md flex flex-col justify-between relative overflow-hidden group">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-sm">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase">Total Verified Volume</h3>
          <span className="material-symbols-outlined text-primary text-[20px]">monitoring</span>
        </div>
        <div className="font-display-lg text-[28px] leading-9 sm:text-[36px] sm:leading-[44px] text-on-surface mb-base break-words">${volume.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Cumulative across 4 verified networks</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 chart-gradient z-0 opacity-50 group-hover:opacity-80 transition-opacity duration-500">
        <div className="w-full h-full relative overflow-hidden">
          <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path
              className="text-primary/50"
              d="M0,100 L0,50 C20,60 40,30 60,70 C80,10 90,40 100,20 L100,100 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
