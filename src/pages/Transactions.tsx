import AppShell from "../components/layout/AppShell";
import TransactionsTable from "../components/transactions/TransactionsTable";

export default function Transactions({
  onVerifyWallet,
}: {
  onVerifyWallet?: () => void;
}) {
  return (
    <AppShell
      title="Transactions Log"
      activeNav="transactions"
      className="bg-background text-on-background font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container"
      mainClassName="md:ml-64 pt-20 min-h-screen px-4 sm:px-6 lg:px-8 flex flex-col gap-8 pb-24 md:pb-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Transaction Verification
          </h2>
          <p className="font-body-md text-body-sm text-on-surface-variant max-w-2xl">
            Review and verify on-chain activity to generate cryptographic proofs
            for compliance and auditing purposes.
          </p>
        </div>
        <button
          type="button"
          onClick={onVerifyWallet}
          className="btn-primary px-6 py-3 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2"
        >
          Verify a Transaction
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </button>
      </div>

      <TransactionsTable />
    </AppShell>
  );
}
