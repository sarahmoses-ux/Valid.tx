import { useEffect, useMemo, useRef, useState } from "react";
import {
  useActivity,
  type Transaction,
  type VerificationState,
} from "../../context/ActivityContext";
import VerificationSuccessModal from "../verification/VerificationSuccessModal";
import { useNavigate } from "react-router-dom";


const checkboxClass =
  "w-3.5 h-3.5 rounded border-outline-variant/40 text-primary focus:ring-primary-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer transition-all";

function formatAddress(addr?: string) {
  if (!addr) return "—";
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatTxHash(hash?: string) {
  if (!hash) return "—";
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 7)}...${hash.slice(-5)}`;
}

function StatusBadge({ status }: { status: Transaction["status"] }) {
  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/25 text-secondary text-[10px] font-semibold tracking-wider uppercase">
        <span className="w-1 h-1 rounded-full bg-secondary" /> Success
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error/10 border border-error/25 text-error text-[10px] font-semibold tracking-wider uppercase">
      <span className="w-1 h-1 rounded-full bg-error" /> Failed
    </span>
  );
}

function VerificationBadge({
  verification,
}: {
  verification: VerificationState;
}) {
  switch (verification) {
    case "verified":
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary shadow-[0_0_10px_rgba(22,128,92,0.12)]">
          <span
            className="material-symbols-outlined text-secondary text-[13px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          <span className="text-[11px] font-semibold tracking-tight">
            Verified
          </span>
        </div>
      );
    case "pending":
      return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-tertiary/30 bg-tertiary/10 text-tertiary">
          <span className="material-symbols-outlined text-[12px] animate-spin">
            progress_activity
          </span>
          <span className="text-[11px] font-medium tracking-tight">
            Pending
          </span>
        </div>
      );
    case "unverified":
      return (
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-outline-variant/30 text-on-surface-variant/70">
          <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/40" />
          <span className="text-[11px] font-normal">Not Verified</span>
        </div>
      );
    case "unavailable":
      return (
        <span className="text-on-surface-variant/40 text-[11px] italic">
          Unavailable
        </span>
      );
  }
}

export default function TransactionsTable({
  onSelectionChange,
}: {
  onSelectionChange?: (hashes: string[]) => void;
}) {
  const { transactions, verifySingle, verifyAll } = useActivity();
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState("");
  const [verificationFilter, setVerificationFilter] = useState<
    "all" | VerificationState
  >("all");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [hashesToVerify, setHashesToVerify] = useState<string[]>([]);

  const selectedHashes = useMemo(() => Array.from(selected), [selected]);

  useEffect(() => {
    onSelectionChange?.(selectedHashes);
  }, [selectedHashes, onSelectionChange]);

  const filteredRows = transactions.filter((row) => {
    if (verificationFilter !== "all" && row.verification !== verificationFilter)
      return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      row.hash?.toLowerCase().includes(q) ||
      row.from?.toLowerCase().includes(q) ||
      row.to?.toLowerCase().includes(q) ||
      row.network?.toLowerCase().includes(q) ||
      row.type?.toLowerCase().includes(q)
    );
  });

  async function copyHash(hash: string) {
    await navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    window.setTimeout(() => setCopiedHash(null), 1200);
  }

  const selectableVisible = filteredRows.filter((row) => row.selectable);
  const allVisibleSelected =
    selectableVisible.length > 0 &&
    selectableVisible.every((row) => selected.has(row.hash));
  const someVisibleSelected = selectableVisible.some((row) =>
    selected.has(row.hash),
  );

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate =
        !allVisibleSelected && someVisibleSelected;
    }
  }, [allVisibleSelected, someVisibleSelected]);

  function toggleRow(hash: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(hash)) next.delete(hash);
      else next.add(hash);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        selectableVisible.forEach((row) => next.delete(row.hash));
      } else {
        selectableVisible.forEach((row) => next.add(row.hash));
      }
      return next;
    });
  }

  const handleVerifySelected = () => {
    if (selected.size === 0) return;
    setHashesToVerify(Array.from(selected));
    setShowSuccess(true);
  };

  // const handleVerifyAllEligible = () => {
  //   if (eligibleHashes.length === 0) return
  //   setHashesToVerify(eligibleHashes)
  //   setShowSuccess(true)
  // }

  const handleVerificationComplete = () => {
    if (hashesToVerify.length > 1) {
      verifyAll(hashesToVerify);
    } else {
      verifySingle(hashesToVerify[0]);
    }
    setSelected((prev) => {
      const next = new Set(prev);
      hashesToVerify.forEach((h) => next.delete(h));
      return next;
    });
  };

  return (
    <>
      <div className="bg-surface/85 backdrop-blur-xl border border-outline-variant/25 rounded-xl flex flex-col shadow-sm">
        {/* Table Controls Header */}
        <div className="sticky top-16 z-20 px-4 py-3 border-b border-outline-variant/20 flex flex-col sm:flex-row gap-2.5 justify-between sm:items-center bg-surface-container-high/95 backdrop-blur-md rounded-t-xl shadow-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={selected.size === 0}
              onClick={handleVerifySelected}
              className="flex items-center gap-xs px-sm py-[10px] bg-primary text-on-primary rounded-lg cursor-pointer hover:bg-primary-fixed-dim transition-colors font-label-md text-[12px] shadow-[0_0_20px_rgba(173,198,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:shadow-none"
            >
              <span className="material-symbols-outlined text-[18px]">
                verified
              </span>
              Verify with Attestcoin
              {selected.size > 0 ? ` (${selected.size})` : ""}
            </button>
            {selected.size > 0 && (
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-[11px] text-primary hover:underline font-medium"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center">
            <select
              value={verificationFilter}
              onChange={(event) =>
                setVerificationFilter(
                  event.target.value as typeof verificationFilter,
                )
              }
              aria-label="Filter by verification status"
              className="h-8 w-26 bg-surface-container/70 border border-outline-variant/30 rounded-lg py-0 px-2.5 text-on-surface text-[12px] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
            >
              <option value="all">All states</option>
              <option value="verified">Verified</option>
              <option value="unverified">Not verified</option>
              <option value="pending">Pending</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <div className="relative w-full max-w-48 sm:w-60">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[15px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search hash, address, network..."
                className="w-full h-8 bg-surface-container/70 border border-outline-variant/30 rounded-lg pl-8 pr-2.5 text-on-surface text-[12px] focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none placeholder:text-on-surface-variant/40"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-lowest/60 text-on-surface-variant/80 select-none">
                <th className="px-3.5 py-2.5 w-10 text-center">
                  <input
                    ref={headerCheckboxRef}
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleAll}
                    disabled={selectableVisible.length === 0}
                    className={checkboxClass}
                  />
                </th>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">
                  Tx Hash
                </th>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">
                  Verification
                </th>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">
                  Network
                </th>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">
                  Type
                </th>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-[12px]">
              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-on-surface-variant/60 text-[13px]"
                  >
                    No transactions match your filter criteria.
                  </td>
                </tr>
              )}
              {filteredRows.map((row) => {
                const isFailed = row.status === "failed";
                const isSelected = selected.has(row.hash);
                return (
                  <tr
                    key={row.hash}
                    onClick={() => row.selectable && toggleRow(row.hash)}
                    className={`transition-colors duration-100 group cursor-pointer ${
                      isSelected
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "hover:bg-surface-container/50"
                    } ${isFailed ? "opacity-65" : ""}`}
                  >
                    <td
                      className="px-3.5 py-2.5 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(row.hash)}
                        disabled={!row.selectable}
                        className={
                          row.selectable
                            ? checkboxClass
                            : "w-3.5 h-3.5 rounded border-outline-variant/20 bg-surface-container/30 cursor-not-allowed opacity-30"
                        }
                      />
                    </td>

                    {/* Hash */}
                    <td className="px-3 py-2.5">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={`font-mono-data text-[12px] text-on-surface font-medium group-hover:text-primary transition-colors ${
                            isFailed ? "line-through decoration-error/50" : ""
                          }`}
                          title={row.hash}
                        >
                          {formatTxHash(row.hash)}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void copyHash(row.hash);
                          }}
                          aria-label={`Copy transaction hash ${row.hash}`}
                          className="p-0.5 rounded text-on-surface-variant/40 hover:text-primary hover:bg-surface-container-highest/60 transition-all opacity-40 group-hover:opacity-100"
                          title="Copy hash"
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {copiedHash === row.hash ? "check" : "content_copy"}
                          </span>
                        </button>
                      </div>
                    </td>

                    {/* Verification */}
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <VerificationBadge verification={row.verification} />
                    </td>

                    {/* Network */}
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-on-surface">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                        {row.network}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium tracking-wide">
                        {row.type}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-3 py-2.5 text-on-surface-variant/80 text-[11px] whitespace-nowrap">
                      {row.date}
                    </td>

                    {/* Tx Status */}
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-2.5 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-2 bg-surface-container-lowest/40 text-[11px] text-on-surface-variant rounded-b-xl">
          <span>
            Showing{" "}
            <span className="font-semibold text-on-surface">
              {filteredRows.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-on-surface">
              {transactions.length}
            </span>{" "}
            transactions
          </span>
          <div className="flex items-center gap-1.5 text-on-surface-variant/70">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span>Real-time indexing enabled</span>
          </div>
        </div>
      </div>
      {showSuccess && (
        <VerificationSuccessModal
          hashes={hashesToVerify}
          onVerificationComplete={handleVerificationComplete}
          onClose={() => setShowSuccess(false)}
          onUpdateProfile={() => {
            setShowSuccess(false);
            navigate("/profile");
          }}
        />
      )}
    </>
  );
}
