import { useMemo, useState } from "react";

import { useActivity } from "../../context/ActivityContext";
import ActivityDonut from "./ActivityDonut";

const WEEKS = 12;

export default function ActivityInsights() {
  const { transactions } = useActivity();
  const [activeBar, setActiveBar] = useState(WEEKS - 1);

  const frequency = useMemo(() => {
    const now = new Date();

    const currentWeekStart = new Date(now);
    const day = currentWeekStart.getDay();
    const daysFromMonday = day === 0 ? 6 : day - 1;

    currentWeekStart.setDate(
      currentWeekStart.getDate() - daysFromMonday
    );
    currentWeekStart.setHours(0, 0, 0, 0);

    const weeks = Array.from({ length: WEEKS }, (_, index) => {
      const start = new Date(currentWeekStart);

      start.setDate(
        start.getDate() - (WEEKS - 1 - index) * 7
      );

      const end = new Date(start);
      end.setDate(end.getDate() + 7);

      return {
        start,
        end,
        count: 0,
      };
    });

    for (const transaction of transactions ?? []) {
      const timestamp = transaction.mined_at;

      if (!timestamp) continue;

      const transactionDate = new Date(timestamp);

      if (Number.isNaN(transactionDate.getTime())) {
        continue;
      }

      const week = weeks.find(
        (week) =>
          transactionDate >= week.start &&
          transactionDate < week.end
      );

      if (week) {
        week.count += 1;
      }
    }

    return weeks;
  }, [transactions]);

  const maxFrequency = Math.max(
    ...frequency.map((week) => week.count),
    1
  );

  const activeWeek = frequency[activeBar];

  const previousWeek =
    activeBar > 0
      ? frequency[activeBar - 1].count
      : 0;

  const percentageChange =
    previousWeek === 0
      ? activeWeek.count > 0
        ? 100
        : 0
      : ((activeWeek.count - previousWeek) / previousWeek) * 100;

  const formattedChange =
    percentageChange > 0
      ? `+${percentageChange.toFixed(1)}%`
      : `${percentageChange.toFixed(1)}%`;

  const trendIcon =
    percentageChange > 0
      ? "trending_up"
      : percentageChange < 0
        ? "trending_down"
        : "trending_flat";

  const formatWeekDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-20">
      <section className="glass-card rounded-xl p-5">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Transaction Frequency
            </h3>

            <p className="text-body-sm text-on-surface-variant mt-1">
              Week {activeBar + 1} · {activeWeek.count}{" "}
              {activeWeek.count === 1
                ? "transaction"
                : "transactions"}
            </p>
          </div>

          <span
            className={`text-body-sm flex items-center gap-1 ${
              percentageChange < 0
                ? "text-error"
                : "text-secondary"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {trendIcon}
            </span>

            {formattedChange}
          </span>
        </div>

        {/* Chart */}
        <div
          className="h-32 flex items-end gap-2"
          aria-label="Transaction frequency bar chart"
        >
          {frequency.map((week, index) => {
            const isActive = activeBar === index;

            const height =
              week.count === 0
                ? 3
                : Math.max(
                    (week.count / maxFrequency) * 100,
                    6
                  );

            return (
              <div
                key={week.start.toISOString()}
                className="relative w-full h-full group flex items-end"
                onMouseEnter={() => setActiveBar(index)}
                onFocus={() => setActiveBar(index)}
                onClick={() => setActiveBar(index)}
              >
                {/* Tooltip */}
                <div
                  className={`
                    pointer-events-none
                    absolute
                    bottom-full
                    mb-3
                    z-30
                    w-52
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    p-4
                    text-slate-900
                    shadow-xl
                    opacity-0
                    scale-95
                    transition-all
                    duration-200
                    group-hover:translate-y-[-4px]
                    group-hover:opacity-100
                    group-hover:scale-100
                    ${
                      index === 0
                        ? "left-0"
                        : index === WEEKS - 1
                          ? "right-0"
                          : "left-1/2 -translate-x-1/2"
                    }
                  `}
                >
                  <div className="mb-3 border-b border-slate-100 pb-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Transaction Activity
                    </p>

                    <p className="mt-1 text-[12px] font-bold text-slate-900">
                      {formatWeekDate(week.start)}
                      {" — "}
                      {formatWeekDate(
                        new Date(
                          week.end.getTime() - 1
                        )
                      )}
                    </p>
                  </div>

                  <div className="text-[11px]">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-500">
                        Transactions
                      </span>

                      <span className="font-bold text-slate-900">
                        {week.count}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-1">
                      <span className="text-slate-500">
                        Relative Activity
                      </span>

                      <span className="font-bold text-slate-900">
                        {Math.round(height)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actual bar */}
                <div
                  style={{
                    height: `${height}%`,
                  }}
                  className={`
                    relative
                    w-full
                    rounded-t-sm
                    transition-all
                    duration-300
                    overflow-hidden
                    ${
                      isActive
                        ? "bg-secondary/20 border-secondary"
                        : "bg-primary/25 border-primary/40"
                    }
                  `}
                >
                  {/* Hover gradient */}
                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-secondary/40
                      to-transparent
                      opacity-0
                      transition-opacity
                      duration-200
                      group-hover:opacity-100
                    "
                  />

                  {/* Active/selected background */}
                  <div
                    className={`
                      absolute
                      inset-0
                      bg-secondary/20
                      transition-opacity
                      duration-200
                      ${
                        isActive
                          ? "opacity-100"
                          : "opacity-0"
                      }
                    `}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-3 text-[10px] text-on-surface-variant font-mono-data">
          <span>Week 1</span>
          <span>Week 6</span>
          <span>Week 12</span>
        </div>
      </section>

      <ActivityDonut />
    </div>
  );
}