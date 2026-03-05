"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

type DataPoint = { date: string; count: number };

type Props = {
  title: string;
  data: DataPoint[];
  color?: string;
};

export default function AreaChartCard({ title, data, color = "#F97316" }: Props) {
  return (
    <div className="rounded-xl border border-stone-100 bg-white p-4 sm:p-6">
      <h3 className="mb-4 text-sm font-semibold text-stone-700">{title}</h3>
      <div className="h-[200px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
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
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e7e5e4",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                fontSize: "13px",
              }}
              labelFormatter={(v) => format(new Date(v as string), "MMM d, yyyy")}
              formatter={(value) => [(value as number).toLocaleString(), "Pageviews"]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${color})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
