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
    <div className="rounded-xl border border-gray-100 bg-white p-6 hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      {!isNeutral && (
        <p className={`mt-1 text-sm font-medium ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
          {isPositive ? "+" : ""}
          {change}%
          <span className="ml-1 text-gray-400 font-normal">vs prev period</span>
        </p>
      )}
      {isNeutral && change !== undefined && (
        <p className="mt-1 text-sm text-gray-400">No change</p>
      )}
    </div>
  );
}
