const ringPath = 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'

const legend = [
  { label: 'ETH', colorClass: 'bg-primary' },
  { label: 'POL', colorClass: 'bg-tertiary' },
  { label: 'ARB', colorClass: 'bg-secondary' },
]

export default function ActivityDonut() {
  const [active, setActive] = useState('ETH')
  const shares: Record<string, string> = { ETH: '40%', POL: '35%', ARB: '25%' }
  return (
    <div className="glass-card rounded-xl p-4 sm:p-5 flex flex-col items-center relative min-w-0">
      <div className="w-full flex justify-between items-center mb-md">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Activity by Chain</h3>
        <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface text-[20px]">
          more_horiz
        </span>
      </div>

      <div className="relative w-[180px] h-[180px] flex items-center justify-center my-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path className="text-surface-container-highest" d={ringPath} fill="none" stroke="currentColor" strokeWidth="3" />
          <path
            className="text-secondary"
            d={ringPath}
            fill="none"
            stroke="currentColor"
            strokeDasharray="25, 100"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            className="text-tertiary"
            d={ringPath}
            fill="none"
            stroke="currentColor"
            strokeDasharray="35, 100"
            strokeDashoffset="-25"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            className="text-primary"
            d={ringPath}
            fill="none"
            stroke="currentColor"
            strokeDasharray="40, 100"
            strokeDashoffset="-60"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display-lg text-[28px] leading-tight text-on-surface">{shares[active]}</span>
          <span className="font-label-md text-label-md text-on-surface-variant uppercase">{active}</span>
        </div>
      </div>

      <div className="w-full flex justify-center gap-4 mt-4 font-body-sm text-body-sm">
        {legend.map((entry) => (
          <button type="button" onMouseEnter={() => setActive(entry.label)} onFocus={() => setActive(entry.label)} onClick={() => setActive(entry.label)} key={entry.label} className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${active === entry.label ? 'bg-surface-container-highest text-on-surface' : 'text-on-surface-variant'}`}>
            <span className={`w-2 h-2 rounded-full ${entry.colorClass}`} /> {entry.label}
          </button>
        ))}
      </div>
    </div>
  )
}
import { useState } from 'react'
