import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useActivity } from '../../context/ActivityContext'
import { useWallet } from '../../context/WalletContext'
import { truncateAddress } from '../../lib/address'

export type VerificationSuccessModalProps = {
  hashes: string[]
  onClose: () => void
  onUpdateProfile: () => void
  onVerificationComplete?: (hashes: string[]) => void
}

const singleProofSteps = [
  'Validating chain and RPC support',
  'Locating block on source chain',
  'Waiting for Creditcoin block attestation',
  'Generating cryptographic proof',
  'Verifying on Creditcoin precompile',
]

const batchProofSteps = [
  'Connecting to Creditcoin proof service',
  'Generating batch cryptographic proofs',
  'Extracting Merkle proofs and headers',
  'Verifying batch on Creditcoin precompile',
]

export default function VerificationSuccessModal({
  hashes,
  onClose,
  onUpdateProfile,
  onVerificationComplete,
}: VerificationSuccessModalProps) {
  const { verifySingle, verifyAll, transactions } = useActivity()
  const { address } = useWallet()

  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying')
  const [activeStep, setActiveStep] = useState(0)
  const [stepDetail, setStepDetail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const hasExecutedRef = useRef(false)

  const isBatch = hashes.length > 1
  const steps = isBatch ? batchProofSteps : singleProofSteps

  const targetTx = useMemo(() => {
    if (hashes.length === 0) return undefined
    return transactions.find((t) => t.hash.toLowerCase() === hashes[0].toLowerCase())
  }, [hashes, transactions])

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 1500)
    } catch {
      // ignore
    }
  }

  const runVerification = useCallback(async () => {
    if (hashes.length === 0) {
      setStatus('failed')
      setErrorMessage('No transactions provided for verification.')
      return
    }

    setStatus('verifying')
    setActiveStep(0)
    setErrorMessage(null)
    setStepDetail('Initiating verification sequence...')

    try {
      if (hashes.length === 1) {
        const singleResult = await verifySingle(hashes[0], (stepIdx, msg) => {
          setActiveStep(stepIdx)
          setStepDetail(msg)
        })

        if (singleResult.verified) {
          setActiveStep(steps.length)
          setVerificationResult(singleResult)
          setStatus('success')
          onVerificationComplete?.(hashes)
        } else {
          setStatus('failed')
          setErrorMessage('On-chain verification returned FAILED for this transaction.')
        }
      } else {
        const batchResult = await verifyAll(hashes, (stepIdx, msg) => {
          setActiveStep(stepIdx)
          setStepDetail(msg)
        })

        if (batchResult.verified) {
          setActiveStep(steps.length)
          setVerificationResult(batchResult)
          setStatus('success')
          onVerificationComplete?.(hashes)
        } else {
          setStatus('failed')
          setErrorMessage('On-chain batch verification returned FAILED.')
        }
      }
    } catch (err: any) {
      console.error('Verification execution error:', err)
      setStatus('failed')
      setErrorMessage(
        err?.message ||
          'Failed to complete verification. Please check RPC endpoints and network connectivity.',
      )
    }
  }, [hashes, verifySingle, verifyAll, steps.length, onVerificationComplete])

  useEffect(() => {
    if (!hasExecutedRef.current) {
      hasExecutedRef.current = true
      void runVerification()
    }
  }, [runVerification])

  const verifiedDate = useMemo(() => {
    const d = new Date()
    return `${d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })} · ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })} UTC`
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 h-screen w-screen backdrop-blur-md p-3 sm:p-4 md:p-6 overflow-y-auto"
      onClick={status !== 'verifying' ? onClose : undefined}
    >
      <div
        className="w-full max-w-[560px] my-auto bg-surface-container-high/95 backdrop-blur-xl border border-outline-variant/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] z-30"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Top Progress bar indicator */}
        <div
          className={`h-1.5 transition-all duration-500 ${
            status === 'success'
              ? 'bg-secondary'
              : status === 'failed'
                ? 'bg-error'
                : 'bg-primary animate-pulse'
          }`}
        />

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto overscroll-contain">
          {/* VERIFYING STATE */}
          {status === 'verifying' && (
            <div>
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[24px] animate-spin">
                    progress_activity
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-0.5">
                    Attestcoin Proof Engine
                  </p>
                  <h2 className="text-title-lg sm:text-headline-sm font-bold text-on-surface">
                    {isBatch ? `Verifying ${hashes.length} Transactions` : 'Verifying Transaction'}
                  </h2>
                </div>
              </div>

              {/* Progress Steps List */}
              <div className="space-y-2.5 mb-5">
                {steps.map((step, index) => {
                  const isDone = index < activeStep
                  const isActive = index === activeStep
                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border transition-all duration-300 ${
                        isDone
                          ? 'border-secondary/30 bg-secondary/5 text-on-surface'
                          : isActive
                            ? 'border-primary/40 bg-primary/10 text-on-surface shadow-[0_0_15px_rgba(77,142,255,0.15)]'
                            : 'border-outline-variant/15 opacity-40 text-on-surface-variant'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] sm:text-[20px] shrink-0 ${
                          isDone
                            ? 'text-secondary'
                            : isActive
                              ? 'text-primary animate-pulse'
                              : 'text-outline'
                        }`}
                      >
                        {isDone ? 'check_circle' : isActive ? 'sync' : 'radio_button_unchecked'}
                      </span>
                      <span className="text-body-sm font-medium flex-1">
                        {step}
                        {isDone ? ' ✓' : isActive ? '…' : ''}
                      </span>
                    </div>
                  )
                })}
              </div>

              {stepDetail && (
                <div className="p-3 rounded-lg bg-surface-container-lowest/60 border border-outline-variant/25 text-[12px] font-mono-data text-on-surface-variant flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping shrink-0" />
                  <span className="truncate">{stepDetail}</span>
                </div>
              )}

              <p className="mt-4 text-[12px] text-on-surface-variant/80">
                Validating cryptographic Merkle continuity against Creditcoin CC3 precompile.
              </p>
            </div>
          )}

          {/* SUCCESS STATE */}
          {status === 'success' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_24px_rgba(78,222,163,0.25)]">
                  <span
                    className="material-symbols-outlined text-secondary text-[32px] sm:text-[36px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-[11px] font-semibold uppercase tracking-wider mb-2">
                  Attestcoin Verified ✓
                </div>
                <h2 className="text-headline-sm sm:text-headline-md font-bold text-on-surface mb-1">
                  {isBatch ? `${hashes.length} Transactions Verified` : 'Transaction Verified'}
                </h2>
                <p className="text-body-sm text-on-surface-variant mx-auto">
                  Cryptographic Merkle proof anchored and verified on Creditcoin CC3.
                </p>
              </div>

              {/* Verification Details Table */}
              <div className="rounded-xl border border-outline-variant/30 overflow-hidden bg-surface-container-lowest/50 text-[12px] divide-y divide-outline-variant/20 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 sm:px-4">
                  <span className="text-on-surface-variant font-medium">Source Blockchain</span>
                  <span className="font-semibold text-on-surface">
                    {targetTx?.network || 'Ethereum (Sepolia)'}
                  </span>
                </div>

                {!isBatch && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 sm:px-4">
                    <span className="text-on-surface-variant font-medium">Transaction Hash</span>
                    <div className="inline-flex items-center gap-1.5 font-mono-data text-primary">
                      <span className="truncate max-w-[200px] sm:max-w-[260px]" title={hashes[0]}>
                        {hashes[0]}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(hashes[0], 'hash')}
                        aria-label="Copy hash"
                        className="p-1 rounded text-on-surface-variant/60 hover:text-primary hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {copiedKey === 'hash' ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {isBatch && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 sm:px-4">
                    <span className="text-on-surface-variant font-medium">Batch Verified Hashes</span>
                    <span className="font-mono-data text-on-surface font-medium">
                      {hashes.length} Transactions
                    </span>
                  </div>
                )}

                {verificationResult?.blockNumber && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 sm:px-4">
                    <span className="text-on-surface-variant font-medium">Source Block Number</span>
                    <span className="font-mono-data text-on-surface">
                      #{verificationResult.blockNumber.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 sm:px-4">
                  <span className="text-on-surface-variant font-medium">Wallet</span>
                  <span className="font-mono-data text-on-surface">
                    {truncateAddress(targetTx?.from || address || '0x0000000000000000000000000000000000000000', 6, 6)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 sm:px-4">
                  <span className="text-on-surface-variant font-medium">Verified At</span>
                  <span className="font-mono-data text-on-surface">{verifiedDate}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-3 sm:px-4">
                  <span className="text-on-surface-variant font-medium">Creditcoin Reference</span>
                  <div className="inline-flex items-center gap-1.5 font-mono-data text-secondary">
                    <span className="truncate max-w-[200px] sm:max-w-[260px]">
                      {verificationResult?.chainKey || '0x6574682d7365706f6c6961'}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          verificationResult?.chainKey || '0x6574682d7365706f6c6961',
                          'chainKey',
                        )
                      }
                      aria-label="Copy reference"
                      className="p-1 rounded text-on-surface-variant/60 hover:text-secondary hover:bg-surface-container transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {copiedKey === 'chainKey' ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 sm:py-3 px-4 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container text-[13px] font-medium transition-colors"
                >
                  Back to transactions
                </button>
                <button
                  type="button"
                  onClick={onUpdateProfile}
                  className="flex-1 py-2.5 sm:py-3 px-4 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-fixed-dim text-[13px] shadow-[0_0_20px_rgba(173,198,255,0.25)] transition-all"
                >
                  View verified profile
                </button>
              </div>
            </div>
          )}

          {/* FAILED STATE */}
          {status === 'failed' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-error/10 border border-error/30 flex items-center justify-center mx-auto mb-3 shadow-[0_0_24px_rgba(255,84,73,0.2)]">
                  <span className="material-symbols-outlined text-error text-[32px] sm:text-[36px]">
                    error
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-error/10 border border-error/30 text-error text-[11px] font-semibold uppercase tracking-wider mb-2">
                  Verification Failed
                </div>
                <h2 className="text-headline-sm sm:text-headline-md font-bold text-on-surface mb-1">
                  Unable to Verify
                </h2>
                <p className="text-body-sm text-on-surface-variant mx-auto">
                  {errorMessage || 'Verification could not be completed.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-error/5 border border-error/20 text-[12px] text-error mb-6">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">info</span>
                  <span>
                    The source block may not to verify or may be pending attestation on Creditcoin. Also try verify proof one at a time.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 sm:py-3 px-4 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container text-[13px] font-medium transition-colors"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => void runVerification()}
                  className="flex-1 py-2.5 sm:py-3 px-4 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-fixed-dim text-[13px] shadow-[0_0_20px_rgba(173,198,255,0.25)] transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
