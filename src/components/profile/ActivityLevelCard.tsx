import { useActivity } from "../../context/ActivityContext";

const tiers = ["Emerging", "Active", "Established", "High"];

type ActivityTier = (typeof tiers)[number];

export default function ActivityLevelCard() {
  const { profileStats } = useActivity();

  const verifiedTransactions =
    profileStats?.verifiedTransactionCount ?? 0;

  const transactionsPerWeek =
    profileStats?.transactionsPerWeek ?? 0;

  const firstTransactionAt =
    profileStats?.firstTransactionAt ?? null;

  const activityTier = calculateActivityTier(
    verifiedTransactions,
    transactionsPerWeek,
    firstTransactionAt
  );

  const tierIndex = tiers.indexOf(activityTier);

  const activityDescription = getActivityDescription(
    activityTier,
    verifiedTransactions,
    transactionsPerWeek,
    firstTransactionAt
  );

  return (
    <div className="col-span-1 md:col-span-4 lg:col-span-4 glass-panel rounded-xl p-md flex flex-col justify-between">
      <div>
        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-sm">
          Activity Level
        </h3>

        <div className="font-headline-md text-headline-md text-secondary mb-xs">
          {activityTier} Activity
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {activityDescription}
        </p>
      </div>

      <div className="mt-lg">
        {/* Tier labels */}
        <div className="flex justify-between font-label-md text-label-md mb-base text-on-surface-variant opacity-60 text-[10px]">
          {tiers.map((tier, i) => (
            <span
              key={tier}
              className={
                i === tierIndex
                  ? "text-secondary opacity-100"
                  : undefined
              }
            >
              {tier}
            </span>
          ))}
        </div>

        {/* Activity progress */}
        <div className="h-2 w-full bg-surface-container-highest rounded-full flex overflow-hidden">
          {tiers.map((_, index) => (
            <div
              key={index}
              className={`h-full w-1/4 relative ${
                index <= tierIndex
                  ? "bg-secondary"
                  : "bg-outline-variant"
              } ${
                index < tiers.length - 1
                  ? "border-r border-surface-container-lowest"
                  : ""
              }`}
            >
              {index === tierIndex && (
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Determines the user's activity tier from real verified
 * transaction history.
 *
 * The thresholds are intentionally based on observable
 * activity rather than financial value.
 */
function calculateActivityTier(
  verifiedTransactions: number,
  transactionsPerWeek: number,
  firstTransactionAt: string | null
): ActivityTier {
  if (verifiedTransactions === 0) {
    return "Emerging";
  }

  const activeMonths = firstTransactionAt
    ? getActiveMonths(firstTransactionAt)
    : 0;

  /*
   * High:
   * - 100+ verified transactions
   * - OR sustained activity of 5+ tx/week over time
   */
  if (
    verifiedTransactions >= 100 ||
    (transactionsPerWeek >= 5 && activeMonths >= 6)
  ) {
    return "High";
  }

  /*
   * Established:
   * - 50+ verified transactions
   * - OR 2+ tx/week with at least 3 months of history
   */
  if (
    verifiedTransactions >= 50 ||
    (transactionsPerWeek >= 2 && activeMonths >= 3)
  ) {
    return "Established";
  }

  /*
   * Active:
   * - 10+ verified transactions
   * - OR at least 1 tx/week
   */
  if (
    verifiedTransactions >= 10 ||
    transactionsPerWeek >= 1
  ) {
    return "Active";
  }

  return "Emerging";
}

/**
 * Generates a description using only real profile data.
 */
function getActivityDescription(
  tier: ActivityTier,
  verifiedTransactions: number,
  transactionsPerWeek: number,
  firstTransactionAt: string | null
): string {
  if (verifiedTransactions === 0) {
    return "No cryptographically verified transactions yet.";
  }

  const transactionText =
    `${verifiedTransactions.toLocaleString()} verified ` +
    `${verifiedTransactions === 1 ? "transaction" : "transactions"}`;

  const frequencyText =
    transactionsPerWeek > 0
      ? `${transactionsPerWeek.toFixed(1)} transactions per week`
      : "limited transaction history";

  const durationText = firstTransactionAt
    ? `${formatActiveDuration(firstTransactionAt)} of activity`
    : "limited activity history";

  return `Based on ${transactionText}, ${frequencyText}, and ${durationText}.`;
}

/**
 * Calculates how many months the wallet has been active.
 */
function getActiveMonths(firstTransactionAt: string): number {
  const first = new Date(firstTransactionAt);
  const now = new Date();

  if (Number.isNaN(first.getTime())) {
    return 0;
  }

  const months =
    (now.getFullYear() - first.getFullYear()) * 12 +
    (now.getMonth() - first.getMonth());

  return Math.max(0, months);
}

/**
 * Human-readable active duration.
 */
function formatActiveDuration(firstTransactionAt: string): string {
  const months = getActiveMonths(firstTransactionAt);

  if (months === 0) {
    return "less than 1 month";
  }

  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"}`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths === 0) {
    return `${years} year${years === 1 ? "" : "s"}`;
  }

  return `${years}y ${remainingMonths}m`;
}