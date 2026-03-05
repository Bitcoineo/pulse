"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

type DataPoint = { date: string; revenue: number | string; count: number };

type Props = {
  title: string;
  data: DataPoint[];
  color?: string;
};

export default function BarChartCard({ title, data, color = "#10B981" }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    revenue: Number(d.revenue) / 100,
  }));

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">{title}</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formatted} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              tickFormatter={(v) => format(new Date(v), "MMM d")}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
              labelFormatter={(v) => format(new Date(v as string), "MMM d, yyyy")}
              formatter={(value) => [`$${(value as number).toFixed(2)}`, "Revenue"]}
            />
            <Bar dataKey="revenue" fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
