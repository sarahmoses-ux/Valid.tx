import { useMemo, useState } from 'react'

const ranges = ['7D', '30D', '3M', '1Y', 'All'] as const
const series: Record<(typeof ranges)[number], number[]> = {
  '7D': [2.8, 4.2, 3.6, 6.9, 5.4, 7.7, 8.9],
  '30D': [12, 18, 15, 25, 22, 31, 28, 36, 33, 42],
  '3M': [31, 28, 42, 39, 56, 51, 68, 63, 79, 88],
  '1Y': [92, 110, 104, 138, 155, 148, 181, 205, 198, 236, 259, 284],
  All: [28, 41, 58, 54, 83, 105, 132, 127, 169, 204, 238, 284],
}

export default function VolumeChart() {
  const [range, setRange] = useState<(typeof ranges)[number]>('7D')
  const [hovered, setHovered] = useState<number | null>(null)
  const values = series[range]
  const max = Math.max(...values)
  const points = useMemo(() => values.map((value, index) => ({ x: (index / (values.length - 1)) * 100, y: 38 - (value / max) * 32, value })), [values, max])
  const polyline = points.map(({ x, y }) => `${x},${y}`).join(' ')
  const active = hovered === null ? points.length - 1 : hovered

  return (
    <section className="glass-card rounded-xl p-4 sm:p-5 lg:col-span-2 flex flex-col min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div><h3 className="font-headline-sm text-headline-sm text-on-surface">Transaction Volume</h3><p className="text-body-sm text-on-surface-variant mt-1">${points[active].value.toFixed(1)}k · selected period</p></div>
        <div className="flex gap-1 flex-wrap">
          {ranges.map((option) => <button key={option} type="button" onClick={() => { setRange(option); setHovered(null) }} aria-pressed={range === option} className={`px-3 py-1.5 rounded-md font-label-md text-label-md transition-colors ${range === option ? 'bg-primary/15 text-primary border border-primary/25' : 'text-on-surface-variant hover:text-on-surface border border-transparent'}`}>{option}</button>)}
        </div>
      </div>
      <div className="relative h-[220px] sm:h-[240px] border-l border-b border-outline-variant/30 min-w-0" onMouseLeave={() => setHovered(null)}>
        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40" role="img" aria-label={`${range} verified transaction volume chart`}>
          {[10, 20, 30].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(140,144,159,.12)" strokeWidth=".2" />)}
          <polygon points={`0,40 ${polyline} 100,40`} fill="url(#volume-fill)" />
          <defs><linearGradient id="volume-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#adc6ff" stopOpacity=".3" /><stop offset="1" stopColor="#adc6ff" stopOpacity="0" /></linearGradient></defs>
          <polyline points={polyline} fill="none" stroke="#adc6ff" strokeWidth=".8" vectorEffect="non-scaling-stroke" />
          {points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r={active === index ? 1.4 : .8} fill={active === index ? '#4edea3' : '#131314'} stroke="#adc6ff" strokeWidth=".45" />)}
        </svg>
        <div className="absolute inset-0 flex justify-between">
          {points.map((point, index) => <button key={index} type="button" aria-label={`Data point ${index + 1}: $${point.value} thousand`} onMouseEnter={() => setHovered(index)} onFocus={() => setHovered(index)} className="h-full flex-1 cursor-crosshair focus:outline-none" />)}
        </div>
      </div>
      <div className="flex justify-between mt-3 text-[10px] text-on-surface-variant font-mono-data"><span>Start</span><span>{range}</span><span>Latest</span></div>
    </section>
  )
}
