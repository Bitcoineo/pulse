type Row = { country: string; count: number; percentage: number };

type Props = {
  title: string;
  data: Row[];
};

export default function CountryTable({ title, data }: Props) {
  const maxCount = data.length > 0 ? Math.max(...data.map((r) => r.count)) : 1;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">{title}</h3>
      <div className="mb-2 flex text-xs font-medium text-gray-400 uppercase">
        <span className="flex-1">Country</span>
        <span className="w-16 text-right">Visitors</span>
        <span className="w-12 text-right">%</span>
      </div>
      <div className="space-y-1">
        {data.map((row, i) => (
          <div key={i} className="relative flex items-center rounded-md px-2 py-1.5">
            <div
              className="absolute inset-y-0 left-0 rounded-md bg-emerald-50"
              style={{ width: `${(row.count / maxCount) * 100}%` }}
            />
            <span className="relative z-10 flex-1 text-sm text-gray-700">
              {row.country}
            </span>
            <span className="relative z-10 w-16 text-right text-sm font-medium text-gray-900 tabular-nums">
              {row.count.toLocaleString()}
            </span>
            <span className="relative z-10 w-12 text-right text-sm text-gray-500 tabular-nums">
              {row.percentage}%
            </span>
          </div>
        ))}
        {data.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-400">No data</p>
        )}
      </div>
    </div>
  );
}
