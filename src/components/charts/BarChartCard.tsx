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

export default function BarChartCard({ title, data, color = "#F97316" }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    revenue: Number(d.revenue) / 100,
  }));

  return (
    <div className="rounded-xl border border-stone-100 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-stone-700">{title}</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formatted} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#a8a29e" }}
              tickFormatter={(v) => format(new Date(v), "MMM d")}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#a8a29e" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e7e5e4",
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
