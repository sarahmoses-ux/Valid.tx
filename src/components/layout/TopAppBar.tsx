import { Link } from "react-router-dom";

export default function TopAppBar({ title }: { title: string }) {
  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-20 bg-surface/30 backdrop-blur-md flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="md:hidden flex items-center gap-2 text-on-surface font-semibold"
      >
        <span className="material-symbols-outlined text-primary text-[22px]">
          verified
        </span>
        ValidTx
      </Link>
      <div className="font-headline-sm text-headline-sm font-bold text-on-surface hidden md:block">
        {title}
      </div>

      <div className="flex items-center gap-md ml-auto">
        <div className="hidden lg:flex items-center gap-xs px-sm py-xs rounded-full border border-outline-variant bg-surface-container">
          <span className="status-dot bg-secondary" />
          <span className="font-mono-data text-mono-data text-on-surface">
            Mainnet
          </span>
        </div>

        <w3m-account-button />
      </div>
    </header>
  );
}
