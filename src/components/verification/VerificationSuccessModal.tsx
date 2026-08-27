import { useEffect, useRef, useState } from 'react'
import { MOCK_ADDRESS, truncateAddress } from '../../lib/address'

const proofSteps = ['Transaction detected', 'Waiting for block attestation', 'Generating proof', 'Verifying on Creditcoin']
const details = [
  ['Source blockchain', 'Ethereum'], ['Transaction hash', '0x8f4...e92c'], ['Block number', '18,420,102'],
  ['Wallet', truncateAddress(MOCK_ADDRESS, 5, 5)], ['Verified at', '27 Oct 2026 · 14:32 UTC'], ['Creditcoin reference', '0x3a9...b41f'],
]

export default function VerificationSuccessModal({ onClose, onUpdateProfile, onVerificationComplete }: { onClose: () => void; onUpdateProfile: () => void; onVerificationComplete: () => void }) {
  const [activeStep, setActiveStep] = useState(0)
  const completionReported = useRef(false)
  const complete = activeStep >= proofSteps.length

  useEffect(() => {
    if (complete) return
    const timer = window.setTimeout(() => setActiveStep((step) => step + 1), 850)
    return () => window.clearTimeout(timer)
  }, [activeStep, complete])

  useEffect(() => {
    if (complete && !completionReported.current) {
      completionReported.current = true
      onVerificationComplete()
    }
  }, [complete, onVerificationComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-4" onClick={complete ? onClose : undefined}>
      <div className="w-full max-w-[560px] max-h-[92vh] overflow-y-auto bg-surface-container-high/95 border border-outline-variant/40 rounded-2xl shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className={`h-1 ${complete ? 'bg-secondary' : 'bg-primary'}`} />
        <div className="p-6 sm:p-8">
          {!complete ? <>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center"><span className="material-symbols-outlined text-primary animate-spin">progress_activity</span></div>
              <div><p className="text-label-md uppercase tracking-widest text-primary mb-1">Attestcoin verification</p><h2 className="text-headline-md font-semibold text-on-surface">Verifying transaction</h2></div>
            </div>
            <div className="space-y-2">
              {proofSteps.map((step, index) => {
                const done = index < activeStep
                const active = index === activeStep
                return <div key={step} className={`flex items-center gap-3 p-4 rounded-xl border ${done ? 'border-secondary/20 bg-secondary/5' : active ? 'border-primary/30 bg-primary/5' : 'border-outline-variant/20 opacity-45'}`}>
                  <span className={`material-symbols-outlined text-[20px] ${done ? 'text-secondary' : active ? 'text-primary animate-pulse' : 'text-outline'}`}>{done ? 'check_circle' : active ? 'progress_activity' : 'radio_button_unchecked'}</span>
                  <span className="text-body-sm text-on-surface">{step}{done ? ' ✓' : active ? '…' : ''}</span>
                </div>
              })}
            </div>
            <p className="mt-6 text-body-sm text-on-surface-variant">Attestcoin is proving this source-chain event and anchoring its verification reference on Creditcoin.</p>
          </> : <>
            <div className="text-center mb-7">
              <div className="w-16 h-16 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center mx-auto mb-4 animate-verified-pulse"><span className="material-symbols-outlined text-secondary text-[36px]">verified</span></div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-label-md uppercase tracking-widest mb-3">Attestcoin Verified ✓</div>
              <h2 className="text-headline-lg font-bold text-on-surface mb-2">Transaction Verified</h2>
              <p className="text-body-md text-on-surface-variant">Cryptographic proof successfully verified through Attestcoin.</p>
            </div>
            <div className="rounded-xl border border-outline-variant/30 overflow-hidden bg-surface-container-lowest/40">
              {details.map(([label, value], index) => <div key={label} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-4 py-3 ${index < details.length - 1 ? 'border-b border-outline-variant/20' : ''}`}><span className="text-label-md uppercase tracking-wider text-on-surface-variant">{label}</span><span className={`font-mono-data text-mono-data ${label === 'Creditcoin reference' ? 'text-primary' : 'text-on-surface'}`}>{value}</span></div>)}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button type="button" onClick={onClose} className="flex-1 py-3 px-4 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container text-label-md">Back to transactions</button>
              <button type="button" onClick={onUpdateProfile} className="flex-1 py-3 px-4 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-fixed-dim text-label-md">View verified profile</button>
            </div>
          </>}
        </div>
      </div>
    </div>
  )
}
