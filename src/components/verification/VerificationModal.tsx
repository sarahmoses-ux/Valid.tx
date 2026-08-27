import { useEffect, useRef, useState, type ReactNode } from 'react'
import { MOCK_ADDRESS, truncateAddress } from '../../lib/address'

type Phase = 'scanning' | 'indexing' | 'done'
type StepStatus = 'done' | 'active' | 'pending'

const SCANNING_MS = 2200
const INDEXING_MS = 1800
const COMPLETE_HOLD_MS = 600

const shortAddress = truncateAddress(MOCK_ADDRESS, 3, 4)

type LogLine =
  | { key: string; kind: 'found'; label: string; value: string }
  | { key: string; kind: 'pulse'; text: string }
  | { key: string; kind: 'complete'; text: string }

const logLinesByPhase: Record<Phase, LogLine[]> = {
  scanning: [
    { key: 'eth', kind: 'found', label: 'Found ETH:', value: shortAddress },
    { key: 'pol', kind: 'found', label: 'Found POL:', value: shortAddress },
    { key: 'arb-scan', kind: 'pulse', text: 'Scanning Arbitrum chain...' },
  ],
  indexing: [
    { key: 'pol2', kind: 'found', label: 'Found POL:', value: shortAddress },
    { key: 'arb', kind: 'found', label: 'Found ARB:', value: shortAddress },
    { key: 'indexing', kind: 'pulse', text: 'Indexing 1,248 transactions...' },
  ],
  done: [
    { key: 'arb2', kind: 'found', label: 'Found ARB:', value: shortAddress },
    { key: 'indexed', kind: 'found', label: 'Indexed:', value: '1,248 transactions' },
    { key: 'complete', kind: 'complete', text: 'Activity discovery complete' },
  ],
}

function LogLineRow({ line }: { line: LogLine }) {
  if (line.kind === 'found') {
    return (
      <div className="flex items-center gap-xs text-secondary">
        <span className="material-symbols-outlined text-[14px]">done_all</span>
        <span className="text-on-surface-variant">{line.label}</span>
        <span>{line.value}</span>
      </div>
    )
  }
  if (line.kind === 'pulse') {
    return (
      <div className="flex items-center gap-xs text-primary/80 animate-pulse">
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span>{line.text}</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-xs text-secondary">
      <span className="material-symbols-outlined text-[14px]">check_circle</span>
      <span>{line.text}</span>
    </div>
  )
}

function StepRow({
  status,
  title,
  statusNode,
  showConnector,
}: {
  status: StepStatus
  title: string
  statusNode: ReactNode
  showConnector: boolean
}) {
  const icon = status === 'done' ? 'check' : status === 'active' ? 'refresh' : 'hourglass_empty'
  const iconWrapClass =
    status === 'done'
      ? 'bg-secondary-container/10 border border-secondary shadow-[0_0_12px_rgba(78,222,163,0.15)]'
      : status === 'active'
        ? 'bg-primary-container/20 border border-primary shadow-[0_0_16px_rgba(77,142,255,0.25)]'
        : 'bg-surface-container-high border border-outline-variant'
  const iconColorClass = status === 'done' ? 'text-secondary' : status === 'active' ? 'text-primary' : 'text-outline'
  const titleColorClass = status === 'active' ? 'text-primary' : 'text-on-surface'
  const connectorClass = status === 'done' ? 'bg-secondary/50' : 'bg-outline-variant/40'

  return (
    <div className={`flex items-start gap-sm relative group ${status === 'pending' ? 'opacity-50' : ''}`}>
      {showConnector && <div className={`absolute left-4 top-10 w-px h-6 ${connectorClass}`} />}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10 ${iconWrapClass}`}
      >
        <span
          className={`material-symbols-outlined text-[18px] ${iconColorClass} ${status === 'active' ? 'animate-spin' : ''}`}
        >
          {icon}
        </span>
      </div>
      <div className="pt-[2px]">
        <h4 className={`font-label-md text-label-md uppercase tracking-wider mb-[2px] ${titleColorClass}`}>
          {title}
        </h4>
        {statusNode}
      </div>
    </div>
  )
}

export type DiscoveryResult = { mode: 'lookup' | 'connect'; address: string }

export default function VerificationModal({ onComplete }: { onComplete: (result: DiscoveryResult) => void | Promise<void> }) {
  const [phase, setPhase] = useState<Phase>('scanning')
  const [started, setStarted] = useState(false)
  const [walletInput, setWalletInput] = useState('')
  const [mode, setMode] = useState<'lookup' | 'connect'>('lookup')
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!started) return
    const toIndexing = setTimeout(() => setPhase('indexing'), SCANNING_MS)
    const toDone = setTimeout(() => setPhase('done'), SCANNING_MS + INDEXING_MS)
    const finish = setTimeout(
      () => onCompleteRef.current({ mode, address: walletInput || MOCK_ADDRESS }),
      SCANNING_MS + INDEXING_MS + COMPLETE_HOLD_MS,
    )
    return () => {
      clearTimeout(toIndexing)
      clearTimeout(toDone)
      clearTimeout(finish)
    }
  }, [started, mode, walletInput])

  const indexingStatus: StepStatus = phase === 'indexing' ? 'active' : phase === 'done' ? 'done' : 'pending'

  if (!started) {
    const validAddress = /^0x[a-fA-F0-9]{40}$/.test(walletInput.trim())
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
        <div className="w-full max-w-[480px] bg-surface border border-outline-variant/60 rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-5"><span className="material-symbols-outlined text-primary">account_balance_wallet</span></div>
          <p className="text-label-md uppercase tracking-widest text-primary mb-2">Start with a wallet</p>
          <h2 className="text-headline-md font-bold text-on-surface mb-2">Discover on-chain activity</h2>
          <p className="text-body-sm text-on-surface-variant mb-6">Connect a wallet or enter any public address. Discovery is read-only and does not mark transactions as verified.</p>
          <label className="block text-label-md uppercase tracking-wider text-on-surface-variant mb-2" htmlFor="wallet-address">Wallet address</label>
          <input id="wallet-address" value={walletInput} onChange={(event) => setWalletInput(event.target.value)} placeholder="0x71F...92A8" className="w-full rounded-lg bg-surface-container-low border border-outline-variant px-4 py-3 text-on-surface font-mono-data text-mono-data placeholder:text-outline focus:border-primary focus:ring-primary" />
          {walletInput && !validAddress && <p className="mt-2 text-body-sm text-tertiary">Enter a valid 42-character EVM wallet address.</p>}
          <button type="button" disabled={!validAddress} onClick={() => { setMode('lookup'); setStarted(true) }} className="w-full mt-4 py-3 rounded-lg bg-primary text-on-primary font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-fixed-dim transition-colors">Discover this address</button>
          <div className="flex items-center gap-3 my-5"><div className="h-px flex-1 bg-outline-variant/40" /><span className="text-label-md text-outline uppercase">or</span><div className="h-px flex-1 bg-outline-variant/40" /></div>
          <button type="button" onClick={() => { setMode('connect'); setWalletInput(MOCK_ADDRESS); setStarted(true) }} className="w-full py-3 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 font-semibold"><span className="material-symbols-outlined text-[20px]">wallet</span>Connect wallet</button>
          <p className="text-[11px] text-outline text-center mt-4">No transaction signature or wallet permission is requested for discovery.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-background/70 backdrop-blur-md">
      <div className="w-full max-w-[480px] bg-surface/80 backdrop-blur-xl border border-outline-variant rounded-xl shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="px-md py-sm border-b border-outline-variant/50 text-center relative">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-base">Discover Wallet Activity</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Finding transactions across supported source networks. Nothing is marked verified yet.
          </p>
          <button
            type="button"
            aria-label="Close"
            disabled
            className="absolute top-sm right-sm text-outline hover:text-on-surface transition-colors opacity-50 cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="relative h-40 bg-surface-container-lowest border-b border-outline-variant/50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative w-16 h-16 rounded-full bg-surface-container-highest border border-primary/30 flex items-center justify-center z-10 animate-pulse-ring shadow-[0_0_24px_rgba(77,142,255,0.2)]">
            <span className="material-symbols-outlined text-primary text-[32px] drop-shadow-[0_0_8px_rgba(77,142,255,0.8)]">
              sensors
            </span>
          </div>

          <div className="absolute top-8 left-12 w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.8)]" />
          <div className="absolute bottom-10 right-16 w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.8)]" />
          <div className="absolute top-12 right-20 w-2 h-2 rounded-full bg-outline-variant" />

          <div className="absolute inset-0 h-[200%] w-full pointer-events-none">
            <div className="w-full h-1/2 bg-gradient-to-b from-transparent to-primary/20 border-b border-primary/50 animate-scanline mix-blend-screen shadow-[0_4px_12px_rgba(77,142,255,0.3)]" />
          </div>
        </div>

        <div className="px-md py-md bg-surface flex flex-col gap-sm">
          <StepRow
            status="done"
            title="Connecting Wallet"
            showConnector
            statusNode={<p className="font-body-sm text-body-sm text-secondary">Done</p>}
          />
          <StepRow
            status={phase === 'scanning' ? 'active' : 'done'}
            title="Scanning Networks"
            showConnector
            statusNode={
              phase === 'scanning' ? (
                <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
                  Discovering Activity
                  <span className="flex gap-[2px]">
                    <span
                      className="w-1 h-1 rounded-full bg-on-surface-variant animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-1 h-1 rounded-full bg-on-surface-variant animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-1 h-1 rounded-full bg-on-surface-variant animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </span>
                </p>
              ) : (
                <p className="font-body-sm text-body-sm text-secondary">Done</p>
              )
            }
          />
          <StepRow
            status={indexingStatus}
            title="Indexing Transactions"
            showConnector={false}
            statusNode={
              indexingStatus === 'pending' ? (
                <p className="font-body-sm text-body-sm text-outline">Pending</p>
              ) : indexingStatus === 'active' ? (
                <p className="font-body-sm text-body-sm text-on-surface-variant">Indexing 1,248 transactions...</p>
              ) : (
                <p className="font-body-sm text-body-sm text-secondary">Done</p>
              )
            }
          />
        </div>

        <div className="px-md pb-md bg-surface">
          <div className="h-24 bg-[#0A0A0B] rounded-lg border border-outline-variant/40 p-3 flex flex-col gap-2 overflow-hidden relative font-mono-data text-mono-data shadow-inner">
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#0A0A0B] to-transparent z-10" />
            {logLinesByPhase[phase].map((line) => (
              <div key={`${phase}-${line.key}`} className="animate-[fadeIn_0.3s_ease-out]">
                <LogLineRow line={line} />
              </div>
            ))}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#0A0A0B] to-transparent z-10" />
          </div>
        </div>
      </div>
    </div>
  )
}
