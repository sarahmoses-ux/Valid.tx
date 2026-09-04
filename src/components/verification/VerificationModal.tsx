import { useState } from "react";
import { Link } from "react-router-dom";

import VerificationSuccessModal from "./VerificationSuccessModal";
import { useActivity } from "../../context/ActivityContext";

export type DiscoveryResult = {
  mode: "lookup" | "connect";
  hash: string;
};

export default function VerificationModal({
  onComplete,
  onClose,
}: {
  onComplete: (
    result: DiscoveryResult
  ) => void | Promise<void>;
  onClose?: () => void;
}) {
  const [started, setStarted] = useState(false);
  const [hashInput, setHashInput] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const { verifySingle } = useActivity();

  // EVM transaction hash:
  // 0x + 64 hexadecimal characters = 66 characters total
  const validHash = /^0x[a-fA-F0-9]{64}$/.test(
    hashInput.trim()
  );

  const handleDiscover = () => {
    const hash = hashInput.trim();

    if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
      return;
    }

    setStarted(true);
    setShowSuccess(true);
  };

  const handleVerificationComplete = async () => {
    const hash = hashInput.trim();

    if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) {
      return;
    }

    try {
      await verifySingle(hash);

      await onComplete({
        mode: "lookup",
        hash,
      });
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-md">
      <div className="w-full max-w-[480px] bg-surface border border-outline-variant/30 rounded-2xl shadow-2xl p-6 sm:p-8 relative">
        {/* Close */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 text-primary hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            cancel
          </span>
        </button>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-primary">
            receipt_long
          </span>
        </div>

        {/* Heading */}
        <p className="text-label-md uppercase tracking-widest text-primary mb-2">
          Verify a transaction
        </p>

        <h2 className="text-headline-md font-bold text-on-surface mb-2">
          Verify on-chain activity
        </h2>

        <p className="text-body-sm text-on-surface-variant mb-6">
          Enter an EVM transaction hash to verify its
          on-chain activity. Verification is read-only and
          does not require wallet permissions.
        </p>

        {/* Transaction Hash */}
        <label
          className="block text-label-md uppercase tracking-wider text-on-surface-variant mb-2"
          htmlFor="transaction-hash"
        >
          Transaction Hash
        </label>

        <input
          id="transaction-hash"
          type="text"
          value={hashInput}
          onChange={(event) =>
            setHashInput(event.target.value)
          }
          placeholder="0x71F...92A8"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-lg border border-outline-variant px-4 py-3 text-on-surface font-mono-data text-mono-data placeholder:text-outline focus:border-primary focus:ring-primary focus:outline-none"
        />

        {/* Validation */}
        {hashInput.length > 0 && !validHash && (
          <p className="mt-2 text-body-sm text-tertiary">
            Enter a valid 66-character EVM transaction hash.
          </p>
        )}

        {/* Verify */}
        <button
          type="button"
          disabled={!validHash || started}
          onClick={handleDiscover}
          className="w-full mt-4 py-3 rounded-lg bg-primary text-on-primary font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-fixed-dim transition-colors"
        >
          {started
            ? "Verifying..."
            : "Verify this Transaction"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-outline-variant/40" />

          <span className="text-label-md text-outline uppercase">
            or
          </span>

          <div className="h-px flex-1 bg-outline-variant/40" />
        </div>

        {/* Connect wallet */}
        <Link
          to="/dashboard"
          className="w-full py-3 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 font-semibold"
        >
          <span className="material-symbols-outlined text-[20px]">
            wallet
          </span>

          Connect wallet
        </Link>

        {/* Footer */}
        <p className="text-[11px] text-outline text-center mt-4">
          No transaction signature or wallet permission
          is requested for verification.
        </p>
      </div>

      {/* Verification Success */}
      {showSuccess && (
        <VerificationSuccessModal
          hashes={[hashInput.trim()]}
          onVerificationComplete={
            handleVerificationComplete
          }
          onClose={() => {
            setShowSuccess(false);
            setStarted(false);
          }}
          onUpdateProfile={() => {
            setShowSuccess(false);
            setStarted(false);
          }}
        />
      )}
    </div>
  );
}