import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useWallet } from "../../context/WalletContext";

export default function RequireWallet({ children }: { children: ReactNode }) {
  const { address, isAuthenticating, authError, connect } = useWallet();

  if (isAuthenticating)
    return (
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-primary animate-spin">
            progress_activity
          </span>
          Restoring secure session…
        </div>
      </div>
    );
  if (address) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-on-surface px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative w-full max-w-[400px] glass-panel rounded-2xl p-6 sm:p-8 text-center">
        <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5">
          <span className="material-symbols-outlined text-primary text-[28px]">
            lock
          </span>
        </div>
        <p className="text-label-md uppercase tracking-widest text-primary mb-2">
          Secure wallet sign-in
        </p>
        <h1 className="text-headline-md font-bold text-on-surface mb-3">
          Prove wallet ownership
        </h1>
        <p className="text-body-md text-on-surface-variant mb-6">
          Sign a one-time message to access your ValidTx dashboard. This costs
          no gas and cannot move funds.
        </p>
        {authError && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-lg border border-error/30 bg-error/10 text-error text-body-sm text-left"
          >
            {authError}
          </div>
        )}
        <button
          type="button"
          onClick={() => void connect().catch(() => undefined)}
          className="w-full py-3 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary-fixed-dim transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">wallet</span>
          Connect and sign in
        </button>
        <div className="mt-5 pt-5 border-t border-outline-variant/30 grid grid-cols-3 gap-2 text-[11px] text-on-surface-variant">
          <span>Single-use nonce</span>
          <span>HTTP-only session</span>
          <span>No gas fee</span>
        </div>
        <Link
          to="/"
          className="inline-block mt-5 text-label-md text-primary hover:text-primary"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
