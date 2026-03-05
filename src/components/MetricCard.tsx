type Props = {
  label: string;
  value: string;
  change?: number;
  invertChange?: boolean;
};

export default function MetricCard({ label, value, change, invertChange }: Props) {
  const isPositive = invertChange ? (change ?? 0) < 0 : (change ?? 0) > 0;
  const isNeutral = change === undefined || change === 0;

  return (
    <div className="rounded-xl border-l-4 border-l-orange-500 border border-stone-100 bg-white p-4 sm:p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <p className="text-xs sm:text-sm font-medium text-stone-500">{label}</p>
      <p className="mt-1 text-xl sm:text-3xl font-bold text-stone-900 font-mono">{value}</p>
      {!isNeutral && (
        <p className={`mt-1 text-sm font-medium ${isPositive ? "text-orange-600" : "text-red-500"}`}>
          {isPositive ? "+" : ""}
          {change}%
        </p>
      )}
      {isNeutral && change !== undefined && (
        <p className="mt-1 text-sm text-stone-400">0%</p>
      )}
    </div>
  );
}
