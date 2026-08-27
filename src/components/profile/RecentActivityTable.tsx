import { Link } from 'react-router-dom'
import { useActivity } from '../../context/ActivityContext'

export default function RecentActivityTable() {
  const { transactions } = useActivity()
  const verifiedRows = transactions.filter((tx) => tx.verification === 'verified').slice(0, 4)
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
              <th className="pb-xs font-label-md text-label-md text-on-surface-variant font-normal">Hash</th>
              <th className="pb-xs font-label-md text-label-md text-on-surface-variant font-normal">Type</th>
              <th className="pb-xs font-label-md text-label-md text-on-surface-variant font-normal text-right">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="font-mono-data text-mono-data">
            {verifiedRows.map((row, i) => (
              <tr
                key={row.hash}
                className={
                  i === verifiedRows.length - 1
                    ? 'hover:bg-surface-container-highest/30 transition-colors'
                    : 'border-b border-outline-variant/20 hover:bg-surface-container-highest/30 transition-colors'
                }
              >
                <td className="py-sm text-primary">{row.hash}</td>
                <td className="py-sm text-on-surface">{row.type}</td>
                <td className="py-sm text-right text-on-surface">
                  {row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
