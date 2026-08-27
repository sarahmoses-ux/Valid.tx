import { useState } from 'react'
import { useWallet } from '../../context/WalletContext'
import { truncateAddress } from '../../lib/address'
import { useActivity } from '../../context/ActivityContext'

export default function ProfileHeader() {
  const { address } = useWallet()
  const { verifiedCount, verifiedVolume, verificationRate } = useActivity()
  const [copied, setCopied] = useState(false)

  async function copyAddress() {
    if (!address) return
    await navigator.clipboard.writeText(address)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  function exportReport() {
    const report = { wallet: address, generatedAt: new Date().toISOString(), verifiedTransactions: verifiedCount, verifiedVolumeUsd: verifiedVolume, activeNetworks: 3, verificationRate: verificationRate / 100, note: 'Demo report — connect an Attestcoin backend for live proofs.' }
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'validtx-verified-activity.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-base">Verified Profile</h2>
        <div className="flex items-center gap-sm">
          <span className="font-mono-data text-mono-data text-on-surface-variant tracking-wider">
            {address ? truncateAddress(address, 9, 6) : '—'}
          </span>
          <div className="flex items-center gap-xs px-xs py-[2px] bg-secondary/10 border border-secondary rounded font-label-md text-label-md text-secondary uppercase">
            <div className="w-1 h-1 rounded-full bg-secondary" />
            Proven Identity
          </div>
        </div>
      </div>
      <div className="flex gap-sm">
        <button
          type="button"
          onClick={() => void copyAddress()}
          className="px-sm py-xs border border-outline-variant text-on-surface rounded font-label-md text-label-md hover:bg-surface-container transition-colors"
        >
          {copied ? 'Address copied' : 'Copy wallet address'}
        </button>
        <button
          type="button"
          onClick={exportReport}
          className="px-sm py-xs bg-primary text-on-primary rounded font-label-md text-label-md hover:opacity-90 transition-opacity"
        >
          Export Report
        </button>
      </div>
    </div>
  )
}
