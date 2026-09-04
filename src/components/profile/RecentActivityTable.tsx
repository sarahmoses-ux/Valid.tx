import { Link } from 'react-router-dom'
import { useActivity, type VerificationState } from '../../context/ActivityContext'

export default function RecentActivityTable() {
  const { transactions } = useActivity()
  const verifiedRows = transactions.filter((tx) => tx.verification === 'verified').slice(0, 4)


  function VerificationBadge({
    verification,
  }: {
    verification: VerificationState;
  }) {
    switch (verification) {
      case "verified":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary shadow-[0_0_10px_rgba(22,128,92,0.12)]">
            <span
              className="material-symbols-outlined text-secondary text-[13px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span className="text-[11px] font-semibold tracking-tight">
              Verified
            </span>
          </div>
        );
      case "pending":
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-tertiary/30 bg-tertiary/10 text-tertiary">
            <span className="material-symbols-outlined text-[12px] animate-spin">
              progress_activity
            </span>
            <span className="text-[11px] font-medium tracking-tight">
              Pending
            </span>
          </div>
        );
      case "unverified":
        return (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-outline-variant/30 text-on-surface-variant/70">
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/40" />
            <span className="text-[11px] font-normal">Not Verified</span>
          </div>
        );
      case "unavailable":
        return (
          <span className="text-on-surface-variant/40 text-[11px] italic">
            Unavailable
          </span>
        );
    }
  }

  return (
    <div className="col-span-1 lg:col-span-6 glass-panel rounded-xl p-md flex flex-col">
      <div className="flex items-center justify-between mb-md">
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase">Recent Proven Activity</h3>
        <Link className="font-label-md text-label-md text-primary hover:underline" to="/transactions">
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/50">
              <th className="pb-xs px-sm font-label-md text-label-md text-on-surface-variant font-normal">Hash</th>
              <th className="pb-xs px-sm font-label-md text-label-md text-on-surface-variant font-normal">Type</th>
              <th className="pb-xs px-sm font-label-md text-label-md text-on-surface-variant font-normal text-right">Verification</th>
              <th className="pb-xs px-sm font-label-md text-label-md text-on-surface-variant font-normal text-right">Network</th>
            </tr>
          </thead>
          <tbody className="font-mono-data text-mono-data">
            {verifiedRows.map((row, i) => (
              <tr
                key={row.hash}
                className={
                  i === verifiedRows.length - 1
                    ? 'hover:bg-surface-container-highest/30 transition-colors rounded-md'
                    : 'border-b border-outline-variant/20 hover:bg-surface-container-highest/30 transition-colors rounded-md'
                }
              >
                <td className="px-sm py-sm text-primary">{row.hash.substring(0, 10)}...{row.hash.substring(row.hash.length - 10)}</td>
                <td className="px-sm py-sm text-on-surface">{row.type}</td>
                <td className="px-sm py-sm text-right text-on-surface"><VerificationBadge verification={row.verification} /></td>
                <td className="px-sm py-sm text-right text-on-surface">{row.network}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
