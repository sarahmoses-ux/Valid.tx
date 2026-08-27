import { useEffect, useRef, useState } from 'react'
import { useActivity } from '../../context/ActivityContext'

type TxStatus = 'success' | 'failed'
type VerificationState = 'verified' | 'pending' | 'unverified' | 'unavailable'


const checkboxClass =
  'w-4 h-4 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer'

function StatusBadge({ status }: { status: TxStatus }) {
  if (status === 'success') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary-container/10 border border-secondary/20 text-secondary text-[11px] font-semibold tracking-wide uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Success
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-error-container/10 border border-error/20 text-error text-[11px] font-semibold tracking-wide uppercase">
      <span className="w-1.5 h-1.5 rounded-full bg-error" /> Failed
    </span>
  )
}

function VerificationBadge({ verification }: { verification: VerificationState }) {
  switch (verification) {
    case 'verified':
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-secondary/30 shadow-[0_0_10px_rgba(0,165,114,0.1)]">
          <span
            className="material-symbols-outlined text-secondary text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          <span className="font-label-md text-label-md text-secondary">Attestcoin Verified</span>
        </div>
      )
    case 'pending':
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-tertiary/30 bg-tertiary-container/10">
          <span className="material-symbols-outlined text-tertiary text-[18px]">hourglass_empty</span>
          <span className="font-label-md text-label-md text-tertiary">Verification Pending</span>
        </div>
      )
    case 'unverified':
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">radio_button_unchecked</span>
          <span className="font-label-md text-label-md">Not Verified</span>
        </div>
      )
    case 'unavailable':
      return <span className="text-on-surface-variant font-label-md text-label-md italic">Unavailable</span>
  }
}

export default function TransactionsTable({
  onSelectionChange,
}: {
  onSelectionChange?: (hashes: string[]) => void
}) {
  const { transactions: activityRows } = useActivity()
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [query, setQuery] = useState('')
  const [verificationFilter, setVerificationFilter] = useState<'all' | VerificationState>('all')
  const [copiedHash, setCopiedHash] = useState<string | null>(null)
  const headerCheckboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    onSelectionChange?.([...selected])
  }, [selected, onSelectionChange])

  const filteredRows = activityRows.filter((row) => {
    if (verificationFilter !== 'all' && row.verification !== verificationFilter) return false
    if (!query.trim()) return true
    const q = query.trim().toLowerCase()
    return (
      row.hash.toLowerCase().includes(q) ||
      row.from.toLowerCase().includes(q) ||
      row.to.toLowerCase().includes(q) ||
      row.network.toLowerCase().includes(q)
    )
  })

  async function copyHash(hash: string) {
    await navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    window.setTimeout(() => setCopiedHash(null), 1200)
  }

  const selectableVisible = filteredRows.filter((row) => row.selectable)
  const allVisibleSelected = selectableVisible.length > 0 && selectableVisible.every((row) => selected.has(row.hash))
  const someVisibleSelected = selectableVisible.some((row) => selected.has(row.hash))

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = !allVisibleSelected && someVisibleSelected
    }
  }, [allVisibleSelected, someVisibleSelected])

  function toggleRow(hash: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(hash)) next.delete(hash)
      else next.add(hash)
      return next
    })
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allVisibleSelected) {
        selectableVisible.forEach((row) => next.delete(row.hash))
      } else {
        selectableVisible.forEach((row) => next.add(row.hash))
      }
      return next
    })
  }

  return (
    <div className="bg-surface-container-high/80 backdrop-blur-xl border border-outline-variant/50 rounded-xl flex flex-col overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-outline-variant/50 flex flex-col sm:flex-row gap-3 justify-between sm:items-center bg-surface-container-highest/30">
        <div className="flex items-center gap-sm">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            {selected.size} Selected
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <select value={verificationFilter} onChange={(event) => setVerificationFilter(event.target.value as typeof verificationFilter)} aria-label="Filter by verification status" className="bg-surface-container border border-outline-variant rounded-md py-2 px-3 text-on-surface font-body-sm text-body-sm focus:border-primary focus:ring-primary">
            <option value="all">All verification states</option><option value="verified">Verified</option><option value="unverified">Not verified</option><option value="pending">Pending</option><option value="unavailable">Unavailable</option>
          </select>
          <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hash, address..."
            className="w-full bg-surface-container border border-outline-variant rounded-md py-xs pl-xl pr-sm text-on-surface font-body-sm text-body-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none placeholder:text-on-surface-variant/50"
          />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/50 bg-surface-container-lowest/50">
              <th className="px-md py-sm w-12">
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAll}
                  disabled={selectableVisible.length === 0}
                  className={checkboxClass}
                />
              </th>
              <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                Tx Hash
              </th>
              <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Network
              </th>
              <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Type
              </th>
              <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                From / To
              </th>
              <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">
                Amount
              </th>
              <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Date
              </th>
              <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Tx Status
              </th>
              <th className="px-md py-sm font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Verification
              </th>
            </tr>
          </thead>
          <tbody className="font-body-sm text-body-sm divide-y divide-outline-variant/30">
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-md py-lg text-center text-on-surface-variant font-body-sm text-body-sm">
                  No transactions match your search.
                </td>
              </tr>
            )}
            {filteredRows.map((row) => {
              const isFailed = row.status === 'failed'
              return (
                <tr
                  key={row.hash}
                  className={`hover:bg-surface-container-high/50 transition-colors group ${isFailed ? 'opacity-75' : ''}`}
                >
                  <td className="px-md py-md">
                    <input
                      type="checkbox"
                      checked={selected.has(row.hash)}
                      onChange={() => toggleRow(row.hash)}
                      disabled={!row.selectable}
                      className={row.selectable ? checkboxClass : 'w-4 h-4 rounded border-outline-variant/30 bg-surface-container/50 cursor-not-allowed'}
                    />
                  </td>
                  <td className="px-md py-md">
                    <div className="flex items-center gap-xs">
                      <span
                        className={`font-mono-data text-mono-data text-on-surface ${isFailed ? 'line-through decoration-error/50' : ''}`}
                      >
                        {row.hash}
                      </span>
                      <button
                        type="button"
                        onClick={() => void copyHash(row.hash)}
                        aria-label={`Copy transaction hash ${row.hash}`}
                        className="opacity-60 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-primary"
                      >
                        <span className="material-symbols-outlined text-[16px]">{copiedHash === row.hash ? 'check' : 'content_copy'}</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-md py-md text-on-surface-variant">{row.network}</td>
                  <td className="px-md py-md text-on-surface-variant">{row.type}</td>
                  <td className="px-md py-md">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono-data text-mono-data text-on-surface-variant text-[12px]">
                        {row.from}
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-outline">arrow_downward</span>
                      <span
                        className={`font-mono-data text-mono-data text-[12px] ${isFailed ? 'text-on-surface-variant' : 'text-on-surface'}`}
                      >
                        {row.to}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`px-md py-md text-right font-mono-data text-mono-data ${isFailed ? 'text-on-surface-variant' : 'text-on-surface'}`}
                  >
                    {row.amount}
                  </td>
                  <td className="px-md py-md text-on-surface-variant whitespace-nowrap">{row.date}</td>
                  <td className="px-md py-md">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-md py-md">
                    <VerificationBadge verification={row.verification} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="px-md py-sm border-t border-outline-variant/50 flex justify-between items-center bg-surface-container-lowest/30">
        <span className="font-body-sm text-body-sm text-on-surface-variant">Showing {filteredRows.length} of {activityRows.length} discovered transactions</span>
        <span className="font-label-md text-label-md text-on-surface-variant">Live pagination appears when an indexer is connected</span>
      </div>
    </div>
  )
}
