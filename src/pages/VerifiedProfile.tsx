import AppShell from "../components/layout/AppShell";
import ProfileHeader from "../components/profile/ProfileHeader";
import ActivityLevelCard from "../components/profile/ActivityLevelCard";
import MetricCard from "../components/profile/MetricCard";
import RecentActivityTable from "../components/profile/RecentActivityTable";
import { useActivity } from "../context/ActivityContext";
import { useAccount } from "wagmi";

export default function VerifiedProfile() {
  const { profileStats, isLoading, error } = useActivity();

  const { address } = useAccount();

  if (isLoading) {
    return (
      <AppShell
        title="Verified Profile"
        activeNav="profile"
        className="bg-background text-on-background antialiased"
        mainClassName="md:ml-64 pt-16 min-h-screen flex flex-col pb-20 md:pb-0"
      >
        <div className="p-6 flex items-center justify-center">
          Loading verified activity...
        </div>
      </AppShell>
    );
  }

  if (error || !profileStats) {
    return (
      <AppShell
        title="Verified Profile"
        activeNav="profile"
        className="bg-background text-on-background antialiased"
        mainClassName="md:ml-64 pt-16 min-h-screen flex flex-col pb-20 md:pb-0"
      >
        <div className="p-6 text-error flex items-center justify-center">
          Unable to load verified activity.
        </div>
      </AppShell>
    );
  }

  const {
    verifiedTransactionCount,
    uniqueCounterparties,
    firstTransactionAt,
    transactionsPerWeek,
    monthlyTransactionChange,
  } = profileStats;

  const activePeriod = firstTransactionAt
    ? formatActivePeriod(firstTransactionAt)
    : "—";

  return (
    <AppShell
      title="Verified Profile"
      activeNav="profile"
      className="bg-background text-on-background antialiased selection:bg-primary selection:text-on-primary"
      mainClassName="md:ml-64 pt-16 min-h-screen flex flex-col pb-20 md:pb-0"
    >
      <div className="p-4 sm:p-6 lg:p-8 flex-grow max-w-[1440px] mx-auto w-full">
        <ProfileHeader />

        {/* Verification explanation */}
        <div className="mb-5 flex items-start gap-3 p-4 rounded-xl border border-secondary/20 bg-secondary/5">
          <span className="material-symbols-outlined text-secondary text-[20px]">
            verified
          </span>

          <div>
            <p className="text-body-sm font-semibold text-on-surface">
              Proven facts, not a credit score
            </p>

            <p className="text-body-sm text-on-surface-variant mt-1">
              Green-marked activity is cryptographically verified through
              Attestcoin. Activity level is calculated from verified on-chain
              activity.
            </p>
          </div>
        </div>

        {/* Profile metrics */}
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-gutter my-8">
          {/* Verified Transactions */}
          <MetricCard
            label="Verified Transactions"
            value={verifiedTransactionCount.toLocaleString()}
            footer={
              monthlyTransactionChange !== null ? (
                <div
                  className={`flex items-center gap-xs mt-sm font-label-md ${
                    monthlyTransactionChange >= 0
                      ? "text-secondary"
                      : "text-error"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {monthlyTransactionChange >= 0
                      ? "trending_up"
                      : "trending_down"}
                  </span>
                  {monthlyTransactionChange >= 0 ? "+" : ""}
                  {monthlyTransactionChange.toFixed(1)}% this month
                </div>
              ) : (
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">
                  Insufficient history for monthly comparison
                </p>
              )
            }
          />

          {/* Activity Level */}
          <ActivityLevelCard />

          {/* Unique Counterparties */}
          <MetricCard
            label="Unique Counterparties"
            value={uniqueCounterparties.toLocaleString()}
            footer={
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">
                Across verified transactions only
              </p>
            }
          />

          {/* Active Period */}
          <MetricCard
            label="Active Period"
            value={activePeriod}
            footer={
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">
                {firstTransactionAt
                  ? `First verified tx: ${formatDate(firstTransactionAt)}`
                  : "No verified transactions"}
              </p>
            }
          />

          {/* Transaction Frequency */}
          <MetricCard
            label="Tx Frequency"
            value={
              <>
                {transactionsPerWeek.toFixed(1)}
                <span className="font-headline-sm text-on-surface-variant">
                  {" "}
                  /wk
                </span>
              </>
            }
            footer={
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-sm">
                Calculated from verified transaction history
              </p>
            }
          />

          {/* Recent Activity */}
        </div>
        <RecentActivityTable />

        <div className="md:hidden mt-auto pt-sm border-t border-outline-variant/50 flex flex-col gap-sm">
          {address && (
            <w3m-button />
          )}
        </div>
      </div>
    </AppShell>
  );
}

function formatDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatActivePeriod(firstTransactionAt: string): string {
  const first = new Date(firstTransactionAt);
  const now = new Date();

  if (Number.isNaN(first.getTime())) {
    return "—";
  }

  let months =
    (now.getFullYear() - first.getFullYear()) * 12 +
    (now.getMonth() - first.getMonth());

  if (months < 0) {
    months = 0;
  }

  const years = Math.floor(months / 12);
  months %= 12;

  if (years === 0 && months === 0) {
    return "<1M";
  }

  if (years === 0) {
    return `${months}M`;
  }

  if (months === 0) {
    return `${years}Y`;
  }

  return `${years}Y ${months}M`;
}
