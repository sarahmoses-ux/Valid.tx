import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useWallet } from "./WalletContext";
import axios from "axios";

export type VerificationState =
  | "verified"
  | "pending"
  | "unverified"
  | "unavailable";

export interface ProfileStats {
  transactionCount: number;
  verifiedTransactionCount: number;
  uniqueCounterparties: number;

  firstTransactionAt: string | null;
  lastTransactionAt: string | null;

  transactionsPerWeek: number;

  monthlyTransactionChange: number | null;

  networks: {
    network: string;
    chainId: string;
    transactionCount: number;
  }[];

  recentTransactions: Transaction[];
}

export interface Transaction {
  hash: string;
  network: string;
  type: string;
  from: string;
  to: string;
  amount: string;
  amountUsd?: number;
  asset?: string;
  date: string;
  status: "success" | "failed" | "pending";
  verification: VerificationState;
  selectable: boolean;

  address?: string;
  operation_type?: string;
  chain_id?: string;
  mined_at_block?: number;
  mined_at?: string;

  // Alchemy-specific data
  uniqueId?: string;
  category?: string;
}

function formatNetworkName(raw: string): string {
  if (!raw) return "Ethereum";
  const lower = raw.toLowerCase();
  if (lower === "1" || lower === "ethereum" || lower === "eth")
    return "Ethereum";
  if (lower === "11155111" || lower === "sepolia" || lower === "eth-sepolia")
    return "Sepolia";
  if (lower === "137" || lower === "polygon") return "Polygon";
  if (lower === "42161" || lower === "arbitrum") return "Arbitrum";
  if (lower === "binance-smart-chain") return "BSC Chain";
  if (lower === "8453" || lower === "base") return "Base";
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function formatOperationType(raw: string): string {
  if (!raw) return "Transfer";
  return raw
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function normalizeTransaction(item: any, chainId = "ethereum"): Transaction {
  const hash = item?.hash ?? "";

  const from = item?.from ?? "";
  const to = item?.to ?? "";

  const rawStatus = String(item?.status ?? "").toLowerCase();

  const status: "success" | "failed" =
    rawStatus === "success" ||
    rawStatus === "confirmed" ||
    rawStatus === "mined"
      ? "success"
      : rawStatus === "failed" || rawStatus === "reverted"
        ? "failed"
        : "success";

  const minedAt = item.mined_at || item.attributes?.mined_at || "";
  const date = minedAt
    ? new Date(minedAt).toLocaleDateString()
    : new Date().toLocaleDateString();
  const minedAtBlock =
    item.mined_at_block || item.attributes?.mined_at_block || 0;

  const category = item?.category ?? "external";

  return {
    hash,
    network: formatNetworkName(chainId),
    type: formatOperationType(category),
    from,
    to,
    amount:
      typeof item?.value === "number"
        ? `${item.value} ${item?.asset ?? ""}`.trim()
        : "0",

    amountUsd: typeof item?.amountUsd === "number" ? item.amountUsd : undefined,

    asset: item?.asset ?? undefined,

    date,

    status,

    verification: item?.verification ?? "unverified",

    selectable: status === "success",

    address: to || from,
    operation_type: category,
    chain_id: chainId,
    mined_at_block: minedAtBlock,
    mined_at: minedAt,

    uniqueId: item?.uniqueId,
    category,
  };
}

export type VerificationStepCallback = (
  stepIndex: number,
  stepName: string,
) => void;

export type SingleVerificationResult = {
  success: boolean;
  verified: boolean;
  blockNumber?: number;
  headerNumber?: number;
  chainKey?: number;
  txHash: string;
  proofData?: any;
};

export type BatchVerificationResult = {
  success: boolean;
  verified: boolean;
  txCount: number;
  chainKey?: number;
  headers?: number[];
  proofData?: any;
};

export type TxState = "verified" | "not_verified" | "pending" | "unavailable";

export interface TxStatePayload {
  txHash: string;
  state?: TxState;
  address?: string;
  network?: string;
  chainId?: string;
  metadata?: Record<string, any>;
}

type ActivityValue = {
  transactions: Transaction[];
  verifiedCount: number;
  verifiedVolume: number;
  verificationRate: number;
  profileStats: ProfileStats;
  isLoading: boolean;
  error: string | null;
  resetDemo: () => void;
  verifySingle: (
    txHash: string,
    onStep?: VerificationStepCallback,
  ) => Promise<SingleVerificationResult>;
  verifyAll: (
    hashes?: string[],
    onStep?: VerificationStepCallback,
  ) => Promise<BatchVerificationResult>;
  saveTxState: (payload: TxStatePayload) => Promise<any>;
  checkTxStatus: (txHash: string) => Promise<any>;
  checkAndUpdateTxVerification: (txHash: string) => Promise<TxState | null>;
  refetchTransactions: () => Promise<void>;
};

const ActivityContext = createContext<ActivityValue | null>(null);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const { address } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save or update transaction state in database
  const saveTxState = useCallback(async (payload: TxStatePayload) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/txState/save",
        payload,
      );
      return response.data;
    } catch (err) {
      console.error("Failed to save tx state to database:", err);
      return null;
    }
  }, []);

  // Check transaction status directly from database
  const checkTxStatus = useCallback(async (txHash: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/txState/${encodeURIComponent(txHash.trim().toLowerCase())}`,
      );
      return response.data?.data;
    } catch (err) {
      console.error(`Failed to check tx status for ${txHash}:`, err);
      return null;
    }
  }, []);

  // Check if txhash state is verified in DB and update the UI state accordingly
  const checkAndUpdateTxVerification = useCallback(
    async (txHash: string): Promise<TxState | null> => {
      try {
        const record = await checkTxStatus(txHash);
        if (!record || !record.state) return null;

        const dbState = record.state as TxState;
        const mappedVerification: VerificationState =
          dbState === "not_verified" ? "unverified" : dbState;

        setTransactions((prev) =>
          prev.map((t) =>
            t.hash.toLowerCase() === txHash.trim().toLowerCase()
              ? {
                  ...t,
                  verification: mappedVerification,
                  selectable:
                    mappedVerification === "unverified" &&
                    t.status === "success",
                }
              : t,
          ),
        );

        return dbState;
      } catch (err) {
        console.error(
          `Error checking and updating verification for ${txHash}:`,
          err,
        );
        return null;
      }
    },
    [checkTxStatus],
  );

  const getTransactionHistory = useCallback(async () => {
    if (!address) {
      setTransactions([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log(`Getting transaction history for: ${address}`);

      let response;
      try {
        response = await axios.get(
          `http://localhost:3000/api/analytics/${address}`,
        );
      } catch {
        response = await axios.get(
          `http://localhost:3000/api/analytics/${address}`,
        );
      }

      console.log("API Response:", response.data);

      const rawData = response.data?.data || response.data || [];
      const txArray = Array.isArray(rawData) ? rawData : [];
      const mappedTransactions = txArray.map((tx) =>
        normalizeTransaction(tx),
      );

      setTransactions(mappedTransactions);
    } catch (err: unknown) {
      console.error("Error getting transaction history:", err);
      setError("Unable to fetch transaction history at the moment.");
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  
  const getAllHashesFromDB = useCallback(async () => {
    if (!address) return null;

    try {
      const response = await axios.get(
        `http://localhost:3000/api/txState/${address.trim()}`,
      );

      const rawData = response.data?.data || response.data || null;
      if (!rawData) return null;

      const dbRecords = Array.isArray(rawData) ? rawData : [rawData];

      const stateByHash = new Map(
        dbRecords.map((record: any) => [
          record.txHash?.trim().toLowerCase(),
          record.state as TxState,
        ]),
      );

      setTransactions((prev) =>
        prev.map((transaction) => {
          const dbState = stateByHash.get(transaction.hash.toLowerCase());
          if (!dbState) return transaction;

          const verification =
            dbState === "not_verified" ? "unverified" : dbState;

          return {
            ...transaction,
            verification,
            selectable:
              verification === "unverified" && transaction.status === "success",
          };
        }),
      );

      return normalizeTransaction(dbRecords[0]);
    } catch (err: unknown) {
      console.error(`Error fetching transaction ${address}:`, err);
      return null;
    }
  }, [address]);

  const profileStats = useMemo<ProfileStats>(() => {
    const sorted = [...transactions]
      .filter((tx) => tx.mined_at)
      .sort(
        (a, b) =>
          new Date(a.mined_at!).getTime() - new Date(b.mined_at!).getTime(),
      );

    const verifiedTransactions = transactions.filter(
      (tx) => tx.verification === "verified",
    );

    const counterparties = new Set<string>();

    for (const tx of transactions) {
      const walletAddress = address?.toLowerCase();

      const counterparty =
        tx.from?.toLowerCase() === walletAddress ? tx.to : tx.from;

      if (counterparty) {
        counterparties.add(counterparty.toLowerCase());
      }
    }

    const networkMap = new Map<
      string,
      {
        network: string;
        chainId: string;
        transactionCount: number;
      }
    >();

    for (const tx of transactions) {
      const key = tx.chain_id ?? tx.network;

      const existing = networkMap.get(key);

      if (existing) {
        existing.transactionCount += 1;
      } else {
        networkMap.set(key, {
          network: tx.network,
          chainId: tx.chain_id ?? "",
          transactionCount: 1,
        });
      }
    }

    let transactionsPerWeek = 0;

    if (sorted.length >= 2) {
      const first = new Date(sorted[0].mined_at!).getTime();
      const last = new Date(sorted[sorted.length - 1].mined_at!).getTime();

      const weeks = Math.max((last - first) / (1000 * 60 * 60 * 24 * 7), 1);

      transactionsPerWeek = sorted.length / weeks;
    }

    const now = new Date();

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );

    const currentMonthCount = transactions.filter((tx) => {
      if (!tx.mined_at) return false;

      return new Date(tx.mined_at) >= currentMonthStart;
    }).length;

    const previousMonthCount = transactions.filter((tx) => {
      if (!tx.mined_at) return false;

      const date = new Date(tx.mined_at);

      return date >= previousMonthStart && date < currentMonthStart;
    }).length;

    let monthlyTransactionChange: number | null = null;

    if (previousMonthCount > 0) {
      monthlyTransactionChange =
        ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
    }

    return {
      transactionCount: transactions.length,

      verifiedTransactionCount: verifiedTransactions.length,

      uniqueCounterparties: counterparties.size,

      firstTransactionAt: sorted[0]?.mined_at ?? null,

      lastTransactionAt: sorted[sorted.length - 1]?.mined_at ?? null,

      transactionsPerWeek,

      monthlyTransactionChange,

      networks: Array.from(networkMap.values()),

      recentTransactions: [...transactions]
        .sort((a, b) => {
          const aTime = a.mined_at ? new Date(a.mined_at).getTime() : 0;

          const bTime = b.mined_at ? new Date(b.mined_at).getTime() : 0;

          return bTime - aTime;
        })
        .slice(0, 10),
    };
  }, [transactions, address]);

  useEffect(() => {
    if (!address) {
      setTransactions([]);
      return;
    }

    const loadActivity = async () => {
      await getTransactionHistory();
      await getAllHashesFromDB();
    };

    void loadActivity();
  }, [address, getTransactionHistory, getAllHashesFromDB]);

  const resetDemo = useCallback(() => {
    setTransactions((prev) =>
      prev.map((tx) => ({
        ...tx,
        verification: "unverified" as VerificationState,
        selectable: tx.status === "success",
      })),
    );
  }, []);

  const verifySingle = useCallback(
    async (
      txHash: string,
      onStep?: VerificationStepCallback,
    ): Promise<SingleVerificationResult> => {
      try {
        onStep?.(0, "Sending verification request to backend");

        if (!address) {
          console.log("Wallet address is not available for verification");
          throw new Error("Wallet address is not available for verification");
        }

        // Get current transaction details
        const currentTx = transactions.find(
          (t) => t.hash.toLowerCase() === txHash.toLowerCase(),
        );

        // Call backend verification endpoint
        onStep?.(1, "Verifying transaction on Creditcoin network");
        const response = await axios.post(
          "http://localhost:3000/api/verify/single",
          {
            txHash: txHash.toLowerCase(),
            address: address,
            network: currentTx?.network,
            chainId: currentTx?.chain_id,
          },
        );

        console.log("Verification response:", response.data);

        // The backend wraps verification details in a `data` envelope.
        const result = response.data.data ?? response.data;

        // Update UI if verification succeeded
        if (result.verified) {
          onStep?.(2, "Updating transaction status");
          setTransactions((prev) =>
            prev.map((t) =>
              t.hash.toLowerCase() === txHash.toLowerCase()
                ? {
                    ...t,
                    verification: "verified" as VerificationState,
                    selectable: false,
                  }
                : t,
            ),
          );
        } else {
          // Mark as not verified if proof failed
          await saveTxState({
            txHash: txHash.toLowerCase(),
            state: "not_verified",
            address: address || undefined,
            network: currentTx?.network,
            chainId: currentTx?.chain_id,
          });
        }

        onStep?.(3, "Verification complete");
        return {
          success: result.success,
          verified: result.verified,
          blockNumber: result.blockNumber,
          headerNumber: result.headerNumber,
          chainKey: result.chainKey,
          txHash,
          proofData: result.proofData,
        };
      } catch (err: unknown) {
        console.error("Error occurred during verifySingle:", err);

        // Try to save error state
        const currentTx = transactions.find(
          (t) => t.hash.toLowerCase() === txHash.toLowerCase(),
        );
        await saveTxState({
          txHash: txHash.toLowerCase(),
          state: "unavailable",
          address: address || undefined,
          network: currentTx?.network,
          chainId: currentTx?.chain_id,
          metadata: { error: String(err) },
        }).catch((dbErr) =>
          console.error("Failed to save error state:", dbErr),
        );

        throw err;
      }
    },
    [address, transactions, saveTxState],
  );

  const verifyAll = useCallback(
    async (
      targetHashes?: string[],
      onStep?: VerificationStepCallback,
    ): Promise<BatchVerificationResult> => {
      try {
        if (!address) {
          console.log("Wallet address is not available for verification");
          throw new Error("Wallet address is not available for verification");
        }

        const hashes =
          targetHashes && targetHashes.length > 0
            ? targetHashes
            : transactions.filter((tx) => tx.selectable).map((tx) => tx.hash);

        if (hashes.length === 0) {
          throw new Error("No selectable transactions to verify");
        }

        onStep?.(0, "Sending batch verification request to backend");

        // Call backend batch verification endpoint
        onStep?.(
          1,
          `Verifying ${hashes.length} transaction${hashes.length > 1 ? "s" : ""} on Creditcoin network`,
        );
        const response = await axios.post(
          "http://localhost:3000/api/verify/batch",
          {
            txHashes: hashes.map((h) => h.toLowerCase()),
            address: address,
            network: transactions[0]?.network,
            chainId: transactions[0]?.chain_id,
          },
        );

        // The backend wraps verification details in a `data` envelope.
        const result = response.data.data ?? response.data;

        // Update UI if batch verification succeeded
        if (result.verified) {
          onStep?.(2, "Updating transaction statuses");
          const hashSet = new Set(hashes.map((h) => h.toLowerCase()));
          setTransactions((prev) =>
            prev.map((t) =>
              hashSet.has(t.hash.toLowerCase())
                ? {
                    ...t,
                    verification: "verified" as VerificationState,
                    selectable: false,
                  }
                : t,
            ),
          );
        } else {
          // Mark as not verified if batch proof failed
          const hashSet = new Set(hashes.map((h) => h.toLowerCase()));
          const attemptedTxs = transactions.filter((t) =>
            hashSet.has(t.hash.toLowerCase()),
          );
          for (const tx of attemptedTxs) {
            await saveTxState({
              txHash: tx.hash.toLowerCase(),
              state: "not_verified",
              address: tx.address || address || undefined,
              network: tx.network,
              chainId: tx.chain_id,
            }).catch((err) =>
              console.error(`Failed to save state for ${tx.hash}:`, err),
            );
          }
        }

        onStep?.(3, "Verification complete");
        return {
          success: result.success,
          verified: result.verified,
          txCount: result.txCount,
          chainKey: result.chainKey,
          headers: result.headers,
          proofData: result.proofData,
        };
      } catch (err: unknown) {
        console.error("Error occurred during verifyAll:", err);
        throw err;
      }
    },
    [transactions, address, saveTxState],
  );

  const verifiedCount = useMemo(() => {
    return transactions.filter((tx) => tx.verification === "verified").length;
  }, [transactions]);

  const verifiedVolume = useMemo(() => {
    return transactions
      .filter((tx) => tx.verification === "verified")
      .reduce((acc, tx) => {
        const cleaned = tx.amount?.replace(/[^0-9.]/g, "");
        const val = cleaned ? parseFloat(cleaned) : 0;
        return acc + (isNaN(val) ? 0 : val);
      }, 0);
  }, [transactions]);

  const verificationRate = useMemo(() => {
    if (transactions.length === 0) return 0;
    return Math.round((verifiedCount / transactions.length) * 100);
  }, [transactions.length, verifiedCount]);

  const value = useMemo<ActivityValue>(
    () => ({
      transactions,
      verifiedCount,
      verifiedVolume,
      verificationRate,
      profileStats,
      isLoading,
      error,
      resetDemo,
      verifySingle,
      verifyAll,
      saveTxState,
      checkTxStatus,
      checkAndUpdateTxVerification,
      refetchTransactions: getTransactionHistory,
    }),
    [
      transactions,
      verifiedCount,
      verifiedVolume,
      verificationRate,
      profileStats,
      isLoading,
      error,
      resetDemo,
      verifySingle,
      verifyAll,
      saveTxState,
      checkTxStatus,
      checkAndUpdateTxVerification,
      getTransactionHistory,
    ],
  );

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context)
    throw new Error("useActivity must be used inside ActivityProvider");
  return context;
}
