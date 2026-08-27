import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type VerificationState = 'verified' | 'pending' | 'unverified' | 'unavailable'
export type Transaction = { hash: string; network: string; type: string; from: string; to: string; amount: string; usdValue: number; date: string; status: 'success' | 'failed'; verification: VerificationState; selectable: boolean }

const initialTransactions: Transaction[] = [
  { hash: '0x8f4...e92c', network: 'Ethereum', type: 'Smart Contract', from: '0x71F...92A8', to: '0xDef...4b21', amount: '0.08 ETH', usdValue: 200, date: '2026-08-25 14:32', status: 'success', verification: 'verified', selectable: false },
  { hash: '0x3a1...f77b', network: 'Polygon', type: 'Transfer', from: '0x71F...92A8', to: '0xAbc...8890', amount: '500 USDC', usdValue: 500, date: '2026-08-25 10:15', status: 'success', verification: 'pending', selectable: false },
  { hash: '0x9c2...d41a', network: 'Arbitrum', type: 'Swap', from: '0x71F...92A8', to: '0xUni...77bb', amount: '0.50 ETH', usdValue: 1250, date: '2026-08-24 18:45', status: 'success', verification: 'unverified', selectable: true },
  { hash: '0x5e8...c21d', network: 'Ethereum', type: 'Transfer', from: '0x9Ba...10c2', to: '0x71F...92A8', amount: '1,200 USDC', usdValue: 1200, date: '2026-08-23 16:08', status: 'success', verification: 'unverified', selectable: true },
  { hash: '0x6d3...8af2', network: 'Polygon', type: 'Contract Exec', from: '0x71F...92A8', to: '0xAav...93c1', amount: '350 USDC', usdValue: 350, date: '2026-08-22 11:20', status: 'success', verification: 'unverified', selectable: true },
  { hash: '0x1b7...a39f', network: 'Ethereum', type: 'Contract Exec', from: '0x71F...92A8', to: '0xBad...1122', amount: '0.05 ETH', usdValue: 125, date: '2026-08-21 09:12', status: 'failed', verification: 'unavailable', selectable: false },
]

type ActivityValue = { transactions: Transaction[]; verifiedCount: number; verifiedVolume: number; verificationRate: number; verifyTransactions: (hashes: string[]) => void; resetDemo: () => void }
const ActivityContext = createContext<ActivityValue | null>(null)
const STORAGE_KEY = 'validtx.demo.verification-state'

function loadTransactions() {
  try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, VerificationState>; return initialTransactions.map((tx) => saved[tx.hash] === 'verified' ? { ...tx, verification: 'verified' as const, selectable: false } : tx) } catch { return initialTransactions }
}

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState(loadTransactions)
  const verifyTransactions = (hashes: string[]) => setTransactions((current) => {
    const next = current.map((tx) => hashes.includes(tx.hash) && tx.selectable ? { ...tx, verification: 'verified' as const, selectable: false } : tx)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(next.map((tx) => [tx.hash, tx.verification])))); return next
  })
  const resetDemo = () => { localStorage.removeItem(STORAGE_KEY); setTransactions(initialTransactions) }
  const verified = transactions.filter((tx) => tx.verification === 'verified')
  const verifiedCount = 142 + verified.length
  const verifiedVolume = 28220 + verified.reduce((sum, tx) => sum + tx.usdValue, 0)
  const verificationRate = Math.min(100, 95 + verified.length)
  const value = useMemo(() => ({ transactions, verifiedCount, verifiedVolume, verificationRate, verifyTransactions, resetDemo }), [transactions, verifiedCount, verifiedVolume, verificationRate])
  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>
}

export function useActivity() { const context = useContext(ActivityContext); if (!context) throw new Error('useActivity must be used inside ActivityProvider'); return context }
