import { useState } from 'react'

const frequency = [34, 52, 41, 68, 58, 82, 72, 94, 76, 88, 64, 79]

export default function ActivityInsights() {
  const [activeBar, setActiveBar] = useState(frequency.length - 1)
  const [direction, setDirection] = useState<'incoming' | 'outgoing'>('incoming')
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
      <section className="glass-card rounded-xl p-5">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Transaction Frequency</h3>
            <p className="text-body-sm text-on-surface-variant mt-1">Week {activeBar + 1} · {Math.round(frequency[activeBar] / 6)} transactions</p>
          </div>
          <span className="text-secondary text-body-sm flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">trending_up</span>8.2%</span>
        </div>
        <div className="h-32 flex items-end gap-2" aria-label="Transaction frequency bar chart">
          {frequency.map((height, index) => (
            <button type="button" aria-label={`Week ${index + 1}: ${Math.round(height / 6)} transactions`} onMouseEnter={() => setActiveBar(index)} onFocus={() => setActiveBar(index)} onClick={() => setActiveBar(index)} key={index} className={`flex-1 rounded-t-sm transition-colors ${activeBar === index ? 'bg-secondary' : 'bg-primary/25 hover:bg-primary/60'}`} style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="flex justify-between mt-3 text-[10px] text-on-surface-variant font-mono-data"><span>Week 1</span><span>Week 6</span><span>Week 12</span></div>
      </section>

      <section className="glass-card rounded-xl p-5">
        <div className="mb-6">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Incoming vs Outgoing</h3>
          <p className="text-body-sm text-on-surface-variant mt-1">Verified transaction direction</p>
        </div>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-body-sm mb-2"><span className="text-on-surface">Incoming</span><span className="font-mono-data text-secondary">58% · $16,484</span></div>
            <button type="button" onClick={() => setDirection('incoming')} aria-pressed={direction === 'incoming'} className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden block"><span className={`block h-full w-[58%] rounded-full transition-colors ${direction === 'incoming' ? 'bg-secondary' : 'bg-secondary/40'}`} /></button>
          </div>
          <div>
            <div className="flex justify-between text-body-sm mb-2"><span className="text-on-surface">Outgoing</span><span className="font-mono-data text-primary">42% · $11,936</span></div>
            <button type="button" onClick={() => setDirection('outgoing')} aria-pressed={direction === 'outgoing'} className="w-full h-3 rounded-full bg-surface-container-highest overflow-hidden block"><span className={`block h-full w-[42%] rounded-full transition-colors ${direction === 'outgoing' ? 'bg-primary' : 'bg-primary/40'}`} /></button>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-outline-variant/20 text-body-sm text-on-surface-variant">{direction === 'incoming' ? '83 incoming transactions · $16,484 verified' : '60 outgoing transactions · $11,936 verified'}</div>
      </section>
    </div>
  )
}
