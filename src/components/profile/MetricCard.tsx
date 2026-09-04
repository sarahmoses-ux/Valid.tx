import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  footer?: ReactNode;
};

export default function MetricCard({
  label,
  value,
  footer,
}: MetricCardProps) {
  return (
    <div className="col-span-1 md:col-span-4 lg:col-span-4 glass-panel rounded-lg p-md">
      <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-sm">
        {label}
      </h3>

      <div className="font-headline-lg text-headline-lg text-on-surface">
        {value}
      </div>

      {footer && footer}
    </div>
  );
}
