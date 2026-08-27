import type { ReactNode } from 'react'
import { useActivity } from '../../context/ActivityContext'

function StatCardShell({ label, icon, verified = false, children }: { label: string; icon: string; verified?: boolean; children: ReactNode }) {
  return (
    <div className="glass-card rounded-xl p-5 flex flex-col justify-between min-h-[128px]">
      <div className="flex items-start justify-between gap-2 text-on-surface-variant">
        <span className="font-label-md text-[12px] uppercase tracking-wider">{label}</span>
      </div>
      {children}
    </div>
  )
}

export default function StatsGrid() {
  const { verifiedCount, verifiedVolume, verificationRate } = useActivity()
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      <StatCardShell label="Verified Transactions" icon="verified" verified>
        <div>
          <div className="font-display-lg text-[20px] leading-10 text-on-surface">{verifiedCount.toLocaleString()}</div>
          <div className="font-body-sm text-body-sm text-secondary mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">trending_up</span> +12% this week
          </div>
        </div>
      </StatCardShell>

      <StatCardShell label="Verified Volume" icon="verified" verified>
        <div>
          <div className="font-display-lg text-[20px] leading-10 text-on-surface">${verifiedVolume.toLocaleString()}</div>
          <div className="font-body-sm text-body-sm text-secondary mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">trending_up</span> +5.2% this week
          </div>
        </div>
      </StatCardShell>

      <StatCardShell label="Verification Rate" icon="shield_locked" verified>
        <div>
          <div className="font-display-lg text-[20px] leading-10 text-primary">{verificationRate}%</div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${verificationRate}%` }} />
          </div>
        </div>
      </StatCardShell>

      <StatCardShell label="Active Networks" icon="hub">
        <div>
          <div className="font-display-lg text-[20px] leading-10 text-on-surface">3</div>
          <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Cross-chain presence</div>
        </div>
      </StatCardShell>
    </div>
  )
}
