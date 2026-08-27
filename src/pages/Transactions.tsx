import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import TransactionsTable from '../components/transactions/TransactionsTable'
import VerificationSuccessModal from '../components/verification/VerificationSuccessModal'
import { useActivity } from '../context/ActivityContext'

export default function Transactions() {
  const navigate = useNavigate()
  const { transactions, verifyTransactions } = useActivity()
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedHashes, setSelectedHashes] = useState<string[]>([])
  const eligibleHashes = transactions.filter((tx) => tx.selectable).map((tx) => tx.hash)

  return (
    <AppShell
      title="Transactions Log"
      activeNav="transactions"
      className="bg-background text-on-background font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container"
      mainClassName="md:ml-64 pt-20 min-h-screen px-4 sm:px-6 lg:px-8 flex flex-col gap-8 pb-24 md:pb-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Transaction Verification</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Review and verify on-chain activity to generate cryptographic proofs for compliance and auditing
            purposes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            disabled={selectedHashes.length === 0}
            onClick={() => setShowSuccess(true)}
            className="flex items-center gap-xs px-md py-sm bg-primary text-on-primary rounded-lg hover:bg-primary-fixed-dim transition-colors font-label-md text-label-md shadow-[0_0_20px_rgba(173,198,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:shadow-none"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Verify with Attestcoin{selectedHashes.length > 0 ? ` (${selectedHashes.length})` : ''}
          </button>
          <button
            type="button"
            disabled={eligibleHashes.length === 0}
            onClick={() => { setSelectedHashes(eligibleHashes); setShowSuccess(true) }}
            className="px-4 py-3 text-primary font-label-md text-label-md hover:bg-primary/10 rounded-lg transition-colors"
          >
            Verify all eligible
          </button>
        </div>
      </div>

      <TransactionsTable onSelectionChange={setSelectedHashes} />

      {showSuccess && (
        <VerificationSuccessModal
          onVerificationComplete={() => verifyTransactions(selectedHashes)}
          onClose={() => setShowSuccess(false)}
          onUpdateProfile={() => {
            setShowSuccess(false)
            navigate('/profile')
          }}
        />
      )}
    </AppShell>
  )
}
